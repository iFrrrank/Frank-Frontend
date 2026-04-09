import React from 'react'
import { Button, message } from 'antd'
import { ModalForm, ProFormInstance, ProFormText } from '@ant-design/pro-components'
import {
  createDataSourceConfig,
  getDataSourceConfig,
  updateDataSourceConfig
} from '@/api/infra/dataSourceConfig'
import { textConst } from '@/locales/zh-CN'

interface DataSourceConfigFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const DataSourceConfigForm: React.FC<DataSourceConfigFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  id
}) => {
  const isUpdate = id !== undefined
  const formRef = React.useRef<ProFormInstance>(undefined)

  return (
    <ModalForm
      title={isUpdate ? textConst.action.update : textConst.action.create}
      open={visible}
      onOpenChange={setVisible}
      formRef={formRef}
      modalProps={{ destroyOnHidden: true }}
      layout="horizontal"
      width={450}
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
          const resp = await getDataSourceConfig({ id })
          return resp.data as Record<string, any>
        }
        return {}
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateDataSourceConfig({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createDataSourceConfig(values as any)
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
        label="数据源名称"
        rules={[{ required: true, message: '请输入参数名称' }]}
        placeholder="请输入参数名称"
      />
      <ProFormText
        name="url"
        label="数据源连接"
        rules={[{ required: true, message: '请输入数据源连接' }]}
        placeholder="请输入数据源连接"
      />
      <ProFormText
        name="username"
        label="用户名"
        rules={[{ required: true, message: '请输入用户名' }]}
        placeholder="请输入用户名"
      />
      <ProFormText.Password
        name="password"
        label="密码"
        rules={[{ required: true, message: '请输入密码' }]}
        placeholder="请输入密码"
      />
    </ModalForm>
  )
}

export default DataSourceConfigForm
