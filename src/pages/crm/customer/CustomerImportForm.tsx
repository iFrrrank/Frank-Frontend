import React, { useState } from 'react'
import { message, Upload, Checkbox } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { ModalForm, ProFormInstance, ProFormSelect } from '@ant-design/pro-components'
import { importExcel, importTemplate } from '@/api/crm/customer'
import download from '@/utils/download'
import { getSimpleUserList } from '@/api/system/user'

const { Dragger } = Upload

interface CustomerImportFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
}

// 用户列表缓存
let userOptionsCache: any[] | null = null

const CustomerImportForm: React.FC<CustomerImportFormProps> = ({
  visible,
  setVisible,
  onSuccess
}) => {
  const formRef = React.useRef<ProFormInstance>(undefined)
  const [fileList, setFileList] = useState<any[]>([])
  const [updateSupport, setUpdateSupport] = useState(false)

  const handleDownloadTemplate = async () => {
    try {
      const res = await importTemplate()
      download.excel(res, '客户导入模板.xls')
    } catch (e) {
      message.error('下载模板失败')
    }
  }

  const uploadProps = {
    name: 'file',
    multiple: false,
    fileList,
    beforeUpload: (file: any) => {
      setFileList([file])
      return false
    },
    onRemove: () => {
      setFileList([])
    }
  }

  return (
    <ModalForm
      title="客户导入"
      open={visible}
      onOpenChange={(open) => {
        setVisible(open)
        if (!open) {
          setFileList([])
          setUpdateSupport(false)
        }
      }}
      modalProps={{
        destroyOnHidden: true
      }}
      formRef={formRef}
      layout="horizontal"
      width={500}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      colon={false}
      onFinish={async (values) => {
        if (fileList.length === 0) {
          message.error('请上传文件')
          return false
        }
        try {
          const formData = new FormData()
          formData.append('file', fileList[0])
          formData.append('updateSupport', updateSupport ? 'true' : 'false')
          if (values.ownerUserId) {
            formData.append('ownerUserId', values.ownerUserId)
          }

          const res = await importExcel(formData as any)
          if (res.code === 0) {
            message.success('导入成功')
            onSuccess()
            return true
          } else {
            message.error(res.msg || '导入失败')
            return false
          }
        } catch (e) {
          message.error('导入失败')
          return false
        }
      }}
    >
      <ProFormSelect
        name="ownerUserId"
        label="负责人"
        rules={[{ required: true, message: '请选择负责人' }]}
        placeholder="请选择负责人"
        showSearch
        request={async () => {
          if (userOptionsCache) return userOptionsCache
          const res = await getSimpleUserList()
          if (res.data) {
            userOptionsCache = res.data.map((u: any) => ({ label: u.nickname, value: u.id }))
          }
          return userOptionsCache || []
        }}
      />
      <div style={{ marginTop: 16 }}>
        <Dragger {...uploadProps} accept=".xls,.xlsx">
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">将文件拖到此处，或点击上传</p>
        </Dragger>
      </div>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Checkbox
          checked={updateSupport}
          onChange={(e) => setUpdateSupport(e.target.checked)}
        >
          是否更新已经存在的客户数据（“客户名称” 重复）
        </Checkbox>
        <div style={{ marginTop: 8, color: '#888' }}>
          仅允许导入 xls、xlsx 格式文件。
          <a onClick={handleDownloadTemplate} style={{ marginLeft: 8 }}>
            下载模板
          </a>
        </div>
      </div>
    </ModalForm>
  )
}

export default CustomerImportForm
