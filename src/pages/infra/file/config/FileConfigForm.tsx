import React from 'react'
import { Button, message } from 'antd'
import { ModalForm, ProFormInstance, ProFormSelect, ProFormText } from '@ant-design/pro-components'
import { createFileConfig, getFileConfig, updateFileConfig } from '@/api/infra/fileConfig'
import { textConstants } from '@/locales/zh-CN'

interface FileConfigFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

export const STORAGE_OPTIONS = [
  { label: '数据库', value: 1 },
  { label: '本地配置', value: 10 },
  { label: 'FTP存储', value: 11 },
  { label: 'SFTP存储', value: 12 },
  { label: 'S3对象存储', value: 20 }
]

const FileConfigForm: React.FC<FileConfigFormProps> = ({ visible, setVisible, onSuccess, id }) => {
  const isUpdate = id !== undefined
  const formRef = React.useRef<ProFormInstance>(undefined)

  return (
    <ModalForm
      title={isUpdate ? textConstants.action.update : textConstants.action.create}
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
              确定
            </Button>,
            <Button
              key="cancel"
              onClick={() => {
                props.reset()
                setVisible(false)
              }}
            >
              取消
            </Button>
          ]
        }
      }}
      request={async () => {
        if (id) {
          const resp = await getFileConfig({ id })
          return resp.data as Record<string, any>
        }
        return { storage: 20 }
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateFileConfig({ id, ...values } as any)
            message.success(textConstants.msg.updateSuccess)
          } else {
            await createFileConfig(values as any)
            message.success(textConstants.msg.createSuccess)
          }
          onSuccess()
          return true
        } catch (e) {
          message.error(textConstants.error.operationFail)
          return false
        }
      }}
    >
      <ProFormText
        name="name"
        label="配置名称"
        rules={[{ required: true, message: `${textConstants.common.inputText}配置名称` }]}
        placeholder={`${textConstants.common.inputText}配置名称`}
      />
      <ProFormText
        name="remark"
        label="备注"
        placeholder={`${textConstants.common.inputText}备注`}
      />
      <ProFormSelect
        name="storage"
        label="存储器"
        options={STORAGE_OPTIONS}
        disabled={isUpdate}
        rules={[{ required: true, message: `${textConstants.common.selectText}存储器` }]}
      />
    </ModalForm>
  )
}

export default FileConfigForm
