import React, { useState } from 'react'
import { message } from 'antd'
import {
  ModalForm,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components'
import { Editor } from '@/components/Editor'
import { createNotice, updateNotice } from '@/api/system/notice'
import { textConstants } from '@/locales/zh-CN'

export let handleCreateNotice: () => void
export let handleEditNotice: (record: API.SystemNoticeRespVO) => void

interface SaveNoticeModalProps {
  onSuccess: () => void
}

const SaveNoticeForm: React.FC<SaveNoticeModalProps> = ({ onSuccess }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [editingNotice, setEditingNotice] = useState<API.SystemNoticeRespVO | null>(null)

  handleCreateNotice = () => {
    setEditingNotice(null)
    setModalVisible(true)
  }

  handleEditNotice = (record: API.SystemNoticeRespVO) => {
    setEditingNotice(record)
    setModalVisible(true)
  }

  return (
    <ModalForm<API.SystemNoticeSaveReqVO>
      title={editingNotice ? textConstants.action.update : textConstants.action.create}
      width={900}
      open={modalVisible}
      onOpenChange={(visible) => {
        setModalVisible(visible)
        if (!visible) setEditingNotice(null)
      }}
      initialValues={editingNotice ? { ...editingNotice } : { status: 0, type: 1 }}
      layout="horizontal"
      labelCol={{ span: 3 }}
      wrapperCol={{ span: 20 }}
      colon={false}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false
      }}
      onFinish={async (values) => {
        try {
          let resp
          if (editingNotice) {
            resp = await updateNotice({ ...values, id: editingNotice.id } as any)
          } else {
            resp = await createNotice(values as any)
          }
          if (resp.code === 0) {
            message.success(
              editingNotice ? textConstants.msg.updateSuccess : textConstants.msg.createSuccess
            )
            onSuccess()
            return true
          } else {
            message.error(
              resp.msg ||
                (editingNotice ? textConstants.msg.updateError : textConstants.msg.createError)
            )
            return false
          }
        } catch {
          message.error(
            editingNotice ? textConstants.msg.updateError : textConstants.msg.createError
          )
          return false
        }
      }}
    >
      <ProFormText
        name="title"
        label="公告标题"
        placeholder="textConstants.common.inputText公告标题"
        rules={[{ required: true, message: `${textConstants.common.inputText}公告标题` }]}
      />
      <ProForm.Item
        name="content"
        label="公告内容"
        rules={[{ required: true, message: `${textConstants.common.inputText}公告内容` }]}
      >
        <Editor height={75} />
      </ProForm.Item>
      <ProFormSelect
        name="type"
        label="公告类型"
        placeholder="textConstants.common.selectText公告类型"
        rules={[{ required: true, message: `${textConstants.common.inputText}公告类型` }]}
        options={[
          { label: '通知', value: 1 },
          { label: '公告', value: 2 }
        ]}
      />
      <ProFormSelect
        name="status"
        label="状态"
        placeholder="textConstants.common.selectText状态"
        rules={[{ required: true, message: `${textConstants.common.inputText}状态` }]}
        options={[
          { label: '开启', value: 0 },
          { label: '关闭', value: 1 }
        ]}
      />
      <ProFormTextArea
        name="remark"
        label="备注"
        placeholder="textConstants.common.inputText备注"
        fieldProps={{ rows: 3 }}
      />
    </ModalForm>
  )
}

export default SaveNoticeForm
