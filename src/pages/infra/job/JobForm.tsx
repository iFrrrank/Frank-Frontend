import React from 'react'
import { Button, message, Modal, Select } from 'antd'
import { ModalForm, ProFormDigit, ProFormInstance, ProFormText } from '@ant-design/pro-components'
import { createJob, getJob, updateJob } from '@/api/infra/job'
import { textConst } from '@/locales/zh-CN'
import CronExpressionGenerator from '@/components/Crontab'

interface JobFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const JobForm: React.FC<JobFormProps> = ({ visible, setVisible, onSuccess, id }) => {
  const isUpdate = id !== undefined
  const formRef = React.useRef<ProFormInstance>(undefined)
  const [cronModalVisible, setCronModalVisible] = React.useState(false)
  const [tempCronValue, setTempCronValue] = React.useState('0 0 * * * ?')

  return (
    <>
      <ModalForm
        title={isUpdate ? textConst.action.update : textConst.action.create}
        open={visible}
        onOpenChange={setVisible}
        formRef={formRef}
        modalProps={{ destroyOnHidden: true }}
        layout="horizontal"
        width={500}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        colon={false}
        submitter={{
          render: (props) => {
            return [
              <Button
                key="ok"
                type="primary"
                onClick={() => {
                  props.submit()
                }}
              >
                {textConst.common.ok}
              </Button>,
              <Button
                key="cancel"
                onClick={() => {
                  props.reset()
                  setVisible(false)
                }}
              >
                {textConst.common.cancel}
              </Button>
            ]
          }
        }}
        request={async () => {
          if (id !== undefined) {
            const resp = await getJob(id)
            return resp.data as Record<string, any>
          }
          return {}
        }}
        onFinish={async (values) => {
          try {
            if (isUpdate) {
              await updateJob({ id, ...values } as any)
              message.success(textConst.msg.updateSuccess)
            } else {
              await createJob(values as any)
              message.success(textConst.msg.createSuccess)
            }
            onSuccess()
            return true
          } catch (e) {
            message.error(textConst.error.operationFail)
            return false
          }
        }}
      >
        <ProFormText
          name="name"
          label="任务名称"
          rules={[{ required: true, message: '请输入任务名称' }]}
          placeholder="请输入任务名称"
        />
        <ProFormText
          name="handlerName"
          label="处理器名称"
          rules={[{ required: true, message: '请输入处理器的名字' }]}
          placeholder="请输入处理器的名称"
        />
        <ProFormText name="handlerParam" label="处理器参数" placeholder="请输入处理器的参数" />
        <ProFormText
          name="cronExpression"
          label="CRON 表达式"
          rules={[{ required: true, message: '请输入 CRON 表达式' }]}
          placeholder="请输入 CRON 表达式"
          fieldProps={{
            addonAfter: (
              <Select
                style={{ width: 160 }}
                placeholder="生成器"
                onChange={(value: string) => {
                  if (value !== 'custom') {
                    formRef.current?.setFieldsValue({ cronExpression: value })
                  } else {
                    setTempCronValue(
                      formRef.current?.getFieldValue('cronExpression') || '0 0 * * * ?'
                    )
                    setCronModalVisible(true)
                  }
                }}
                value={undefined}
                options={[
                  { label: '每分钟', value: '0 * * * * ?' },
                  { label: '每小时', value: '0 0 * * * ?' },
                  { label: '每天零点', value: '0 0 0 * * ?' },
                  { label: '每月一号零点', value: '0 0 0 1 * ?' },
                  { label: '每月最后一天零点', value: '0 0 0 L * ?' },
                  { label: '每周星期日零点', value: '0 0 0 ? * 1' },
                  { label: '自定义', value: 'custom' }
                ]}
              />
            )
          }}
        />
        <ProFormDigit
          name="retryCount"
          label="重试次数"
          rules={[{ required: true, message: '请输入重试次数' }]}
          placeholder="请输入重试次数。设置为 0 时，不进行重试"
          min={0}
        />
        <ProFormDigit
          name="retryInterval"
          label="重试间隔"
          rules={[{ required: true, message: '请输入重试间隔' }]}
          placeholder="请输入重试间隔。设置为 0 时，无需间隔"
          min={0}
          fieldProps={{
            addonAfter: '毫秒(ms)'
          }}
        />
        <ProFormDigit
          name="monitorTimeout"
          label="监控超时时间"
          placeholder="请输入监控超时时间。设置为 0 时，无需监控"
          min={0}
          fieldProps={{
            addonAfter: '毫秒(ms)'
          }}
        />
      </ModalForm>
      <Modal
        title="Cron 规则生成器"
        open={cronModalVisible}
        onOk={() => {
          formRef.current?.setFieldsValue({ cronExpression: tempCronValue })
          setCronModalVisible(false)
        }}
        onCancel={() => setCronModalVisible(false)}
        width={600}
      >
        <CronExpressionGenerator value={tempCronValue} onChange={setTempCronValue} />
      </Modal>
    </>
  )
}

export default JobForm
