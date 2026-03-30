import React, { useRef, useState } from 'react'
import { message } from 'antd'
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
  ProFormTextArea
} from '@ant-design/pro-components'
import type { ActionType } from '@ant-design/pro-components'
import { createUser, updateUser, getUser } from '@/api/system/user'
import { getSimpleDeptList } from '@/api/system/dept'
import { getSimplePostList } from '@/api/system/post'

export let handleEditUser: (record: API.SystemUserRespVO) => void
export let handleCreateUser: () => void

const SaveUserModal: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState<API.SystemUserRespVO | null>(null)

  // 新增用户
  handleCreateUser = () => {
    setEditingUser(null)
    setCreateModalVisible(true)
  }

  // 修改用户
  handleEditUser = async (record: API.SystemUserRespVO) => {
    try {
      const resp = await getUser({ id: record.id })
      if (resp.code === 0 && resp.data) {
        setEditingUser(resp.data)
        setCreateModalVisible(true)
      }
    } catch {
      message.error('获取用户信息失败')
    }
  }

  // 将扁平部门数据转换为 TreeSelect 树形结构
  const buildDeptTreeSelectData = (
    list: { id: number; name: string; parentId: number }[]
  ): any[] => {
    const map = new Map<number, any>()
    const tree: any[] = []
    list.forEach((item) => {
      map.set(item.id, { title: item.name, value: item.id, children: [] })
    })
    list.forEach((item) => {
      const node = map.get(item.id)!
      if (item.parentId === 0) {
        tree.push(node)
      } else {
        const parent = map.get(item.parentId)
        if (parent) {
          parent.children.push(node)
        }
      }
    })
    return tree
  }

  return (
    <ModalForm<API.SystemUserSaveReqVO>
      title={editingUser ? '修改用户' : '新增'}
      width={600}
      open={createModalVisible}
      onOpenChange={(visible) => {
        setCreateModalVisible(visible)
        if (!visible) {
          setEditingUser(null)
        }
      }}
      initialValues={
        editingUser
          ? {
              id: editingUser.id,
              nickname: editingUser.nickname,
              deptId: editingUser.deptId,
              mobile: editingUser.mobile,
              email: editingUser.email,
              username: editingUser.username,
              sex: editingUser.sex,
              postIds: editingUser.postIds,
              remark: editingUser.remark
            }
          : undefined
      }
      layout="horizontal"
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 17 }}
      autoFocusFirstInput
      grid={true}
      colon={false}
      rowProps={{ gutter: [16, 0] }}
      modalProps={{
        destroyOnClose: true,
        bodyStyle: { paddingBottom: 0 }
      }}
      onFinish={async (values) => {
        try {
          let resp
          if (editingUser) {
            // 修改模式
            resp = await updateUser({ ...values, id: editingUser.id })
          } else {
            // 新增模式
            resp = await createUser(values)
          }
          if (resp.code === 0) {
            message.success(editingUser ? '修改成功' : '创建成功')
            actionRef.current?.reload()
            return true
          } else {
            message.error(resp.msg || (editingUser ? '修改失败' : '创建失败'))
            return false
          }
        } catch {
          message.error(editingUser ? '修改失败' : '创建失败')
          return false
        }
      }}
    >
      <ProFormText
        name="nickname"
        label="用户昵称"
        colProps={{ span: 12 }}
        placeholder="请输入用户昵称"
        rules={[{ required: true, message: '请输入用户昵称' }]}
      />
      <ProFormTreeSelect
        name="deptId"
        label="归属部门"
        colProps={{ span: 12 }}
        placeholder="请选择归属部门"
        request={async () => {
          const resp = await getSimpleDeptList()
          if (resp.code === 0) {
            return buildDeptTreeSelectData(resp.data || [])
          }
          return []
        }}
        fieldProps={{
          fieldNames: { label: 'title', value: 'value', children: 'children' },
          showSearch: true,
          treeNodeFilterProp: 'title'
        }}
      />
      <ProFormText
        name="mobile"
        label="手机号码"
        colProps={{ span: 12 }}
        placeholder="请输入手机号码"
      />
      <ProFormText
        name="email"
        label="邮箱"
        colProps={{ span: 12 }}
        placeholder="请输入邮箱"
        rules={[{ type: 'email', message: '请输入有效邮箱' }]}
      />
      <ProFormText
        name="username"
        label="用户名称"
        colProps={{ span: 12 }}
        placeholder="请输入用户名称"
        rules={[{ required: true, message: '请输入用户名称' }]}
        disabled={!!editingUser}
      />
      <ProFormText.Password
        name="password"
        label="用户密码"
        colProps={{ span: 12 }}
        placeholder="请输入用户密码"
        rules={[{ required: true, message: '请输入用户密码' }]}
      />
      <ProFormSelect
        name="sex"
        label="用户性别"
        colProps={{ span: 12 }}
        placeholder="请选择性别"
        options={[
          { label: '男', value: 1 },
          { label: '女', value: 2 }
        ]}
      />
      <ProFormSelect
        name="postIds"
        label="岗位"
        colProps={{ span: 12 }}
        placeholder="请选择岗位"
        fieldProps={{ mode: 'multiple' }}
        request={async () => {
          const resp = await getSimplePostList()
          if (resp.code === 0) {
            return (resp.data || []).map((item: any) => ({
              label: item.name,
              value: item.id
            }))
          }
          return []
        }}
      />
      <ProFormTextArea
        name="remark"
        label="备注"
        colProps={{ span: 24 }}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
        placeholder="请输入备注内容"
      />
    </ModalForm>
  )
}

export default SaveUserModal
