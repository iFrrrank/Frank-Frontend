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
              确 定
            </Button>,
            <Button
              key="cancel"
              onClick={() => {
                props.reset()
                setVisible(false)
              }}
            >
              取 消
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
