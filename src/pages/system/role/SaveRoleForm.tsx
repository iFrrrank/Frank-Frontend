import React, { useState } from 'react'
import { message } from 'antd'
import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components'
import { createRole, updateRole } from '@/api/system/role'
import { textConst } from '@/locales/zh-CN'

export let handleCreateRole: () => void
export let handleEditRole: (record: API.SystemRoleRespVO) => void

interface SaveRoleModalProps {
  onSuccess: () => void
}

const SaveRoleForm: React.FC<SaveRoleModalProps> = ({ onSuccess }) => {
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editingRole, setEditingRole] = useState<API.SystemRoleRespVO | null>(null)

  handleCreateRole = () => {
    setEditingRole(null)
    setCreateModalVisible(true)
  }

  handleEditRole = (record: API.SystemRoleRespVO) => {
    setEditingRole(record)
    setCreateModalVisible(true)
  }

  return (
    <ModalForm<API.SystemRoleSaveReqVO>
      title={editingRole ? textConst.action.update : textConst.action.create}
      width={400}
      open={createModalVisible}
      onOpenChange={(visible) => {
        setCreateModalVisible(visible)
        if (!visible) {
          setEditingRole(null)
        }
      }}
      initialValues={
        editingRole
          ? {
            id: editingRole.id,
            name: editingRole.name,
            code: editingRole.code,
            sort: editingRole.sort,
            status: editingRole.status,
            remark: editingRole.remark
          }
          : { sort: 0, status: 0 }
      }
      layout="horizontal"
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
      colon={false}
      modalProps={{
        destroyOnHidden: true,
        bodyStyle: { paddingBottom: 0 }
      }}
      onFinish={async (values) => {
        try {
          let resp
          if (editingRole) {
            resp = await updateRole({ ...values, id: editingRole.id })
          } else {
            resp = await createRole(values)
          }
          if (resp.code === 0) {
            message.success(editingRole ? textConst.msg.updateSuccess : textConst.msg.createSuccess)
            onSuccess()
            return true
          } else {
            message.error(
              resp.msg || (editingRole ? textConst.msg.updateError : textConst.msg.createError)
            )
            return false
          }
        } catch {
          message.error(editingRole ? textConst.msg.updateError : textConst.msg.createError)
          return false
        }
      }}
    >
      <ProFormText
        name="name"
        label="角色名称"
        colProps={{ span: 24 }}
        placeholder="请输入角色名称"
        rules={[{ required: true, message: '请输入角色名称' }]}
      />
      <ProFormText
        name="code"
        label="角色标识"
        colProps={{ span: 24 }}
        placeholder="请输入角色标识"
        rules={[{ required: true, message: '请输入角色标识' }]}
      />
      <ProFormDigit
        name="sort"
        label="显示顺序"
        colProps={{ span: 24 }}
        placeholder="请输入显示顺序"
        rules={[{ required: true, message: '请输入显示顺序' }]}
        fieldProps={{ min: 0 }}
      />
      <ProFormSelect
        name="status"
        label="状态"
        colProps={{ span: 24 }}
        placeholder="请选择状态"
        options={[
          { label: '开启', value: 0 },
          { label: '关闭', value: 1 }
        ]}
        rules={[{ required: true, message: '请选择状态' }]}
      />
      <ProFormTextArea
        name="remark"
        label="备注"
        colProps={{ span: 24 }}
        placeholder="请输入备注内容"
      />
    </ModalForm>
  )
}

export default SaveRoleForm
