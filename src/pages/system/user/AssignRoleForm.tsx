import React, { useState } from 'react'
import { message } from 'antd'
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-components'
import { assignUserRole, listAdminRoles } from '@/api/system/permission'
import { getSimpleRoleList } from '@/api/system/role'
import { textConst } from '@/locales/zh-CN'

export let handleAssignRole: (record: API.SystemUserRespVO) => void

const AssignRoleForm: React.FC = () => {
  const [assignRoleVisible, setAssignRoleVisible] = useState(false)
  const [assignRoleUser, setAssignRoleUser] = useState<API.SystemUserRespVO | null>(null)
  const [assignRoleIds, setAssignRoleIds] = useState<number[]>([])
  const [roleOptions, setRoleOptions] = useState<{ label: string; value: number }[]>([])
  const [assignRoleLoading, setAssignRoleLoading] = useState(false)

  // 提交分配角色
  const handleAssignRoleSubmit = async () => {
    try {
      const resp = await assignUserRole({
        userId: assignRoleUser!.id,
        roleIds: assignRoleIds
      })
      if (resp.code === 0) {
        message.success('分配角色成功')
        setAssignRoleVisible(false)
      } else {
        message.error(resp.msg || '分配角色失败')
      }
    } catch {
      message.error('分配角色失败')
    }
  }

  // ===== 分配角色 =====
  handleAssignRole = async (record: API.SystemUserRespVO) => {
    setAssignRoleUser(record)
    setAssignRoleLoading(true)
    try {
      // 并行获取角色列表和用户当前角色
      const [rolesResp, userRolesResp] = await Promise.all([
        getSimpleRoleList(),
        listAdminRoles({ userId: record.id })
      ])
      if (rolesResp.code === 0) {
        setRoleOptions(
          (rolesResp.data || []).map((item: any) => ({
            label: item.name,
            value: item.id
          }))
        )
      }
      if (userRolesResp.code === 0) {
        setAssignRoleIds((userRolesResp.data || []) as number[])
      }
      setAssignRoleVisible(true)
    } catch {
      message.error('获取角色信息失败')
    } finally {
      setAssignRoleLoading(false)
    }
  }

  return (
    <ModalForm
      title="分配角色"
      width={500}
      colon={false}
      open={assignRoleVisible}
      onOpenChange={(visible) => {
        setAssignRoleVisible(visible)
        if (!visible) {
          setAssignRoleUser(null)
          setAssignRoleIds([])
        }
      }}
      modalProps={{
        destroyOnClose: true,
        bodyStyle: { paddingBottom: 0 }
      }}
      submitter={{
        searchConfig: {
          submitText: textConst.common.ok,
          resetText: textConst.common.cancel
        },
        submitButtonProps: { type: 'primary' }
      }}
      onFinish={async () => {
        await handleAssignRoleSubmit()
        return true
      }}
    >
      <ProFormText
        name="username"
        label="用户名称"
        initialValue={assignRoleUser?.username}
        disabled
      />
      <ProFormText
        name="nickname"
        label="用户昵称"
        initialValue={assignRoleUser?.nickname}
        disabled
      />
      <ProFormSelect
        name="roleIds"
        label="角色"
        initialValue={assignRoleIds}
        placeholder="请选择角色"
        fieldProps={{
          mode: 'multiple',
          options: roleOptions,
          onChange: (val: number[]) => setAssignRoleIds(val)
        }}
      />
    </ModalForm>
  )
}

export default AssignRoleForm
