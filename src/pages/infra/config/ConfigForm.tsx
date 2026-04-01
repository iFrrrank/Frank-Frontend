import React from 'react'
import { Button, message } from 'antd'
import {
  ModalForm,
  ProFormInstance,
  ProFormRadio,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components'
import { createConfig, getConfig, updateConfig } from '@/api/infra/config'
import { textConst } from '@/locales/zh-CN'

interface ConfigFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const ConfigForm: React.FC<ConfigFormProps> = ({ visible, setVisible, onSuccess, id }) => {
  const isUpdate = id !== undefined
  const formRef = React.useRef<ProFormInstance>(undefined)

  return (
    <ModalForm
      title={isUpdate ? textConst.action.update : textConst.action.create}
      open={visible}
      onOpenChange={setVisible}
      formRef={formRef}
      modalProps={{ destroyOnClose: true }}
      layout="horizontal"
      width={600}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 19 }}
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
          const resp = await getConfig({ id })
          return resp.data as Record<string, any>
        }
        return { visible: true }
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateConfig({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createConfig(values as any)
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
        name="category"
        label="参数分类"
        rules={[{ required: true, message: '请输入参数分类' }]}
        placeholder="请输入参数分类"
      />
      <ProFormText
        name="name"
        label="参数名称"
        rules={[{ required: true, message: '请输入参数名称' }]}
        placeholder="请输入参数名称"
      />
      <ProFormText
        name="key"
        label="参数键名"
        rules={[{ required: true, message: '请输入参数键名' }]}
        placeholder="请输入参数键名"
      />
      <ProFormText
        name="value"
        label="参数键值"
        rules={[{ required: true, message: '请输入参数键值' }]}
        placeholder="请输入参数键值"
      />
      <ProFormRadio.Group
        name="visible"
        label="是否可见"
        rules={[{ required: true, message: '请输入是否可见' }]}
        options={[
          { label: '是', value: true },
          { label: '否', value: false }
        ]}
      />
      <ProFormTextArea name="remark" label="备注" placeholder="请输入内容" />
    </ModalForm>
  )
}

export default ConfigForm
