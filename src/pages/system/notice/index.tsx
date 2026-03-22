import React, { useEffect, useRef, useState } from 'react'
import { Badge, Button, message, Modal, Space, Tag, Typography } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import {
  ModalForm,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable
} from '@ant-design/pro-components'
import { Editor } from '@/components/Editor'
import { createNotice, deleteNotice, getNoticePage, push, updateNotice } from '@/api/system/notice'

const NoticeConfig: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  const [modalVisible, setModalVisible] = useState(false)
  const [editingNotice, setEditingNotice] = useState<API.SystemNoticeRespVO | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // 公告类型枚举
  const typeEnum: Record<number, { text: string; color: string }> = {
    1: { text: '通知', color: 'success' },
    2: { text: '公告', color: 'default' }
  }

  // 状态枚举
  const statusEnum: Record<number, { text: string; color: string }> = {
    0: { text: '开启', color: 'success' },
    1: { text: '关闭', color: 'default' }
  }

  const columns: ProColumns<API.SystemNoticeRespVO>[] = [
    {
      title: '公告 ID',
      dataIndex: 'id',
      align: 'center',
      width: 50,
      hideInSearch: true
    },
    {
      title: '公告标题',
      dataIndex: 'title',
      align: 'center',
      width: 220,
      fieldProps: { placeholder: '请输入公告标题' },
      render: (_, record) => (
        <Typography.Text style={{ width: 200, margin: 0 }} ellipsis={{ tooltip: record.title }}>
          {record.title}
        </Typography.Text>
      )
    },
    {
      title: '公告类型',
      dataIndex: 'type',
      align: 'center',
      width: 100,
      hideInSearch: true,
      valueType: 'select',
      valueEnum: {
        1: { text: '通知', status: 'Success' },
        2: { text: '公告', status: 'Default' }
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      valueType: 'select',
      valueEnum: {
        0: { text: '开启', status: 'Success' },
        1: { text: '关闭', status: 'Error' }
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 180,
      hideInSearch: true,
      render: (_, record) => <span>{record.createTime as any}</span>
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 150,
      key: 'option',
      fixed: 'right',
      render: (_, record) => (
        <Space size={12}>
          <a key="edit" onClick={() => handleEdit(record)}>
            修改
          </a>
          <a key="delete" style={{ color: '#ff4d4f' }} onClick={() => handleDelete(record)}>
            删除
          </a>
          <a key="push" onClick={() => handlePush(record)}>
            推送
          </a>
        </Space>
      )
    }
  ]

  const handleEdit = (record: API.SystemNoticeRespVO) => {
    setEditingNotice(record)
    setModalVisible(true)
  }

  const handleDelete = (record: API.SystemNoticeRespVO) => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: `是否确认删除 ID 为"${record.id}"的公告？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteNotice({ id: record.id })
          message.success('删除成功')
          actionRef.current?.reload()
        } catch {
          message.error('删除失败')
        }
      }
    })
  }

  const handlePush = (record: API.SystemNoticeRespVO) => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '是否推送所选中通知？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await push({ id: record.id })
          message.success('推送成功')
        } catch {
          message.error('推送失败')
        }
      }
    })
  }

  const handleBatchDelete = () => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: `是否确认删除选中的 ${selectedRowKeys.length} 条公告?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await Promise.all(selectedRowKeys.map((id) => deleteNotice({ id: Number(id) })))
          message.success('批量删除成功')
          setSelectedRowKeys([])
          actionRef.current?.reload()
        } catch {
          message.error('批量删除失败')
        }
      }
    })
  }

  return (
    <>
      <ProTable<API.SystemNoticeRespVO>
        columns={columns}
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        formRef={formRef}
        form={{ colon: false }}
        cardBordered
        request={async (params: Record<string, any>) => {
          const { current, pageSize, title, status, ...rest } = params
          const resp = await getNoticePage({
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...(title ? { title } : {}),
            ...(status !== undefined && status !== '' ? { status: Number(status) } : {}),
            ...rest
          } as any)
          return {
            data: resp.data?.list || [],
            success: true,
            total: resp.data?.total || 0
          }
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys)
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false,
          optionRender: (searchConfig, formProps, dom) => [...dom.reverse()]
        }}
        options={false}
        pagination={{
          align: 'center',
          showSizeChanger: true
        }}
        headerTitle={false}
        toolBarRender={() => [
          <Button
            key="create"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setEditingNotice(null)
              setModalVisible(true)
            }}
          >
            新增
          </Button>,
          <Button
            key="batchDelete"
            icon={<DeleteOutlined />}
            danger
            disabled={selectedRowKeys.length === 0}
            style={
              selectedRowKeys.length > 0
                ? { color: '#ff4d4f', borderColor: '#ffccc7', background: '#fff2f0' }
                : { color: '#ffccc7', borderColor: '#ffe6e6', background: '#fffaf0' }
            }
            onClick={handleBatchDelete}
          >
            批量删除
          </Button>
        ]}
      />

      <ModalForm<API.SystemNoticeSaveReqVO>
        title={editingNotice ? '修改' : '新增'}
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
              message.success(editingNotice ? '修改成功' : '创建成功')
              actionRef.current?.reload()
              return true
            } else {
              message.error(resp.msg || (editingNotice ? '修改失败' : '创建失败'))
              return false
            }
          } catch {
            message.error(editingNotice ? '修改失败' : '创建失败')
            return false
          }
        }}
      >
        <ProFormText
          name="title"
          label="公告标题"
          placeholder="请输入公告标题"
          rules={[{ required: true, message: '请输入公告标题' }]}
        />
        <ProForm.Item
          name="content"
          label="公告内容"
          rules={[{ required: true, message: '请输入公告内容' }]}
        >
          <Editor height={75} />
        </ProForm.Item>
        <ProFormSelect
          name="type"
          label="公告类型"
          placeholder="请选择公告类型"
          rules={[{ required: true, message: '请选择公告类型' }]}
          options={[
            { label: '通知', value: 1 },
            { label: '公告', value: 2 }
          ]}
        />
        <ProFormSelect
          name="status"
          label="状态"
          placeholder="请选择状态"
          rules={[{ required: true, message: '请选择状态' }]}
          options={[
            { label: '开启', value: 0 },
            { label: '关闭', value: 1 }
          ]}
        />
        <ProFormTextArea
          name="remark"
          label="备注"
          placeholder="请输入备注"
          fieldProps={{ rows: 3 }}
        />
      </ModalForm>
    </>
  )
}

export default NoticeConfig

