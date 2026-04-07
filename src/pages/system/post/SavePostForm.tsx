import React, { useState } from 'react'
import { message } from 'antd'
import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components'
import { createPost, updatePost } from '@/api/system/post'
import { textConst } from '@/locales/zh-CN'

export let handleCreatePost: () => void
export let handleEditPost: (record: API.SystemPostRespVO) => void

interface SavePostModalProps {
  onSuccess: () => void
}

const SavePostForm: React.FC<SavePostModalProps> = ({ onSuccess }) => {
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editingPost, setEditingPost] = useState<API.SystemPostRespVO | null>(null)

  handleCreatePost = () => {
    setEditingPost(null)
    setCreateModalVisible(true)
  }

  handleEditPost = (record: API.SystemPostRespVO) => {
    setEditingPost(record)
    setCreateModalVisible(true)
  }

  return (
    <ModalForm<API.SystemPostSaveReqVO>
      title={editingPost ? textConst.action.update : textConst.action.create}
      width={400}
      open={createModalVisible}
      onOpenChange={(visible) => {
        setCreateModalVisible(visible)
        if (!visible) {
          setEditingPost(null)
        }
      }}
      initialValues={
        editingPost
          ? {
            ...editingPost
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
          if (editingPost) {
            resp = await updatePost({ ...values, id: editingPost.id } as any)
          } else {
            resp = await createPost(values as any)
          }
          if (resp.code === 0) {
            message.success(editingPost ? textConst.msg.updateSuccess : textConst.msg.createSuccess)
            onSuccess()
            return true
          } else {
            message.error(
              resp.msg || (editingPost ? textConst.msg.updateError : textConst.msg.createError)
            )
            return false
          }
        } catch {
          message.error(editingPost ? textConst.msg.updateError : textConst.msg.createError)
          return false
        }
      }}
    >
      <ProFormText
        name="name"
        label="岗位标题"
        colProps={{ span: 24 }}
        placeholder="请输入岗位名称"
        rules={[{ required: true, message: '请输入岗位标题' }]}
      />
      <ProFormText
        name="code"
        label="岗位编码"
        colProps={{ span: 24 }}
        placeholder="请输入岗位编码"
        rules={[{ required: true, message: '请输入岗位编码' }]}
      />
      <ProFormDigit
        name="sort"
        label="岗位顺序"
        colProps={{ span: 24 }}
        placeholder="请输入岗位顺序"
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
        rules={[{ required: true, message: '请输入状态' }]}
      />
      <ProFormTextArea
        name="remark"
        label="备注"
        colProps={{ span: 24 }}
        placeholder="请输入备注内容"
        fieldProps={{ rows: 3 }}
      />
    </ModalForm>
  )
}

export default SavePostForm
