import React, { useState } from 'react'
import { message } from 'antd'
import { ModalForm, ProFormRadio, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { createDictType, updateDictType } from '@/api/system/dictType'
import { textConstants } from '@/locales/zh-CN'

export let handleCreateDictType: () => void
export let handleEditDictType: (record: API.SystemDictTypeRespVO) => void

interface SaveDictTypeModalProps {
  onSuccess: () => void
}

const SaveDictTypeModal: React.FC<SaveDictTypeModalProps> = ({ onSuccess }) => {
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editingDictType, setEditingDictType] = useState<API.SystemDictTypeRespVO | null>(null)

  handleCreateDictType = () => {
    setEditingDictType(null)
    setCreateModalVisible(true)
  }

  handleEditDictType = (record: API.SystemDictTypeRespVO) => {
    setEditingDictType(record)
    setCreateModalVisible(true)
  }

  return (
    <ModalForm<API.SystemDictTypeSaveReqVO>
      title={editingDictType ? textConstants.action.update : textConstants.action.create}
      width={600}
      open={createModalVisible}
      onOpenChange={(visible) => {
        setCreateModalVisible(visible)
        if (!visible) {
          setEditingDictType(null)
        }
      }}
      initialValues={
        editingDictType
          ? {
              ...editingDictType
            }
          : { status: 0 }
      }
      layout="horizontal"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      colon={false}
      modalProps={{
        destroyOnClose: true,
        bodyStyle: { paddingBottom: 0 }
      }}
      onFinish={async (values) => {
        try {
          let resp
          if (editingDictType) {
            resp = await updateDictType({ ...values, id: editingDictType.id } as any)
          } else {
            resp = await createDictType(values as any)
          }
          if (resp.code === 0) {
            message.success(
              editingDictType ? textConstants.msg.updateSuccess : textConstants.msg.createSuccess
            )
            onSuccess()
            return true
          } else {
            message.error(
              resp.msg ||
                (editingDictType ? textConstants.msg.updateError : textConstants.msg.createError)
            )
            return false
          }
        } catch {
          message.error(
            editingDictType ? textConstants.msg.updateError : textConstants.msg.createError
          )
          return false
        }
      }}
    >
      <ProFormText
        name="name"
        label="字典名称"
        colProps={{ span: 24 }}
        placeholder="textConstants.common.inputText字典名称"
        rules={[{ required: true, message: `${textConstants.common.inputText}字典名称` }]}
      />
      <ProFormText
        name="type"
        label="字典类型"
        colProps={{ span: 24 }}
        placeholder="textConstants.common.inputText字典类型"
        rules={[
          { required: true, message: `${textConstants.common.inputText}字典类型` },
          { pattern: /^[a-z_0-9]+$/, message: '字典类型必须以小写字母、数字或下划线组成' } // 根据常见业务规则加入正则表达式体验更佳
        ]}
      />
      <ProFormRadio.Group
        name="status"
        label="状态"
        colProps={{ span: 24 }}
        options={[
          { label: '开启', value: 0 },
          { label: '关闭', value: 1 }
        ]}
        rules={[{ required: true, message: 'textConstants.common.selectText状态' }]}
      />
      <ProFormTextArea
        name="remark"
        label="备注"
        colProps={{ span: 24 }}
        placeholder="textConstants.common.inputText备注内容"
        fieldProps={{ rows: 3 }}
      />
    </ModalForm>
  )
}

export default SaveDictTypeModal
