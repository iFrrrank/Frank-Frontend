import React, { useState } from 'react'
import { message } from 'antd'
import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect
} from '@ant-design/pro-components'
import { createDept, getSimpleDeptList, updateDept } from '@/api/system/dept'
import { getSimpleUserList } from '@/api/system/user'
import { handleTreeData } from '@/utils/tree'
import { textConstants } from '@/locales/zh-CN'

export let handleCreateDept: (parentId?: number) => void
export let handleEditDept: (record: any) => void

interface SaveDeptModalProps {
  onSuccess: () => void
}

// 供 TreeSelect 使用的节点转换
const buildDeptTreeSelectData = (data: any[]): any[] => {
  return data.map((item) => {
    const node: any = {
      title: item.name,
      value: item.id
    }
    if (item.children && item.children.length > 0) {
      node.children = buildDeptTreeSelectData(item.children)
    }
    return node
  })
}

const SaveDeptForm: React.FC<SaveDeptModalProps> = ({ onSuccess }) => {
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editingDept, setEditingDept] = useState<any>(null)

  // 获取用户列表（负责人字典）
  const fetchUserList = async () => {
    try {
      const resp = await getSimpleUserList()
      if (resp.code === 0 && resp.data) {
        return resp.data
      }
    } catch {}
    return []
  }

  handleCreateDept = (parentId?: number) => {
    setEditingDept({ parentId: parentId || 0 })
    setCreateModalVisible(true)
  }

  handleEditDept = (record: any) => {
    setEditingDept(record)
    setCreateModalVisible(true)
  }

  return (
    <ModalForm
      title={editingDept?.id ? '修改部门' : '新增部门'}
      width={500}
      open={createModalVisible}
      onOpenChange={(visible) => {
        setCreateModalVisible(visible)
        if (!visible) setEditingDept(null)
      }}
      // 处理回显数据
      initialValues={
        editingDept?.id
          ? {
              ...editingDept
            }
          : {
              parentId: editingDept?.parentId || 0,
              sort: 0,
              status: 0
            }
      }
      layout="horizontal"
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
      grid={true}
      rowProps={{ gutter: [16, 0] }}
      modalProps={{
        destroyOnClose: true,
        bodyStyle: { paddingBottom: 0 }
      }}
      colon={false}
      onFinish={async (values) => {
        try {
          let resp
          if (editingDept?.id) {
            resp = await updateDept({ ...values, id: editingDept.id } as any)
          } else {
            resp = await createDept(values as any)
          }

          if (resp.code === 0) {
            message.success(
              editingDept?.id ? textConstants.msg.updateSuccess : textConstants.msg.createSuccess
            )
            onSuccess()
            return true
          } else {
            message.error(
              resp.msg ||
                (editingDept?.id ? textConstants.msg.updateError : textConstants.msg.createError)
            )
            return false
          }
        } catch {
          message.error(
            editingDept?.id ? textConstants.msg.updateError : textConstants.msg.createError
          )
          return false
        }
      }}
    >
      <ProFormTreeSelect
        name="parentId"
        label="上级部门"
        colProps={{ span: 24 }}
        placeholder="textConstants.common.selectText上级部门"
        request={async () => {
          // 拉取精简的树形部门数据作为上级选择
          const resp = await getSimpleDeptList()
          const list = resp.code === 0 ? resp.data || [] : []
          const tree = buildDeptTreeSelectData(handleTreeData(list, 0))
          return [{ value: 0, title: '顶级部门', children: tree }]
        }}
        fieldProps={{
          fieldNames: { label: 'title', value: 'value' },
          treeDefaultExpandAll: true
        }}
        rules={[{ required: true, message: 'textConstants.common.selectText上级部门' }]}
      />
      <ProFormText
        name="name"
        label="部门名称"
        colProps={{ span: 24 }}
        placeholder={`${textConstants.common.inputText}部门名称`}
        rules={[{ required: true, message: `${textConstants.common.inputText}部门名称` }]}
      />
      <ProFormDigit
        name="sort"
        label="显示排序"
        colProps={{ span: 24 }}
        placeholder={`${textConstants.common.inputText}显示排序`}
        rules={[{ required: true, message: `${textConstants.common.inputText}显示排序` }]}
        fieldProps={{ min: 0 }}
      />
      <ProFormSelect
        name="leaderUserId"
        label="负责人"
        colProps={{ span: 24 }}
        placeholder={`${textConstants.common.selectText}负责人`}
        showSearch
        request={async () => {
          const list = await fetchUserList()
          return list.map((item: any) => ({
            label: item.nickname,
            value: item.id
          }))
        }}
      />
      <ProFormText
        name="phone"
        label="联系电话"
        colProps={{ span: 24 }}
        placeholder={`${textConstants.common.inputText}联系电话`}
      />
      <ProFormText
        name="email"
        label="邮箱"
        colProps={{ span: 24 }}
        placeholder="textConstants.common.inputText邮箱"
        rules={[{ type: 'email', message: `${textConstants.common.inputText}正确的邮箱格式` }]}
      />
      <ProFormSelect
        name="status"
        label="状态"
        colProps={{ span: 24 }}
        options={[
          { label: '开启', value: 0 },
          { label: '关闭', value: 1 }
        ]}
        rules={[{ required: true, message: 'textConstants.common.selectText状态' }]}
        allowClear
      />
    </ModalForm>
  )
}

export default SaveDeptForm
