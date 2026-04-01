import React, { useRef, useState } from 'react'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { textConst } from '@/locales/zh-CN'
import { Button, message, Modal, Space, Typography } from 'antd'
import SaveNoticeForm, { handleCreateNotice, handleEditNotice } from './SaveNoticeForm'
import { DeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { deleteNotice, getNoticePage, push } from '@/api/system/notice'
import { handleTreeData } from '@/utils/tree'
import { handleBatchDelete } from '@/components/BatchDelete'
import { handleDelete } from '@/components/SingleDelete'

const NoticeConfig: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

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
      title: textConst.columns.createTime,
      dataIndex: 'createTime',
      align: 'center',
      width: 180,
      hideInSearch: true,
      render: (_, record) => <span>{record.createTime as any}</span>
    },
    {
      title: textConst.form.operate,
      valueType: 'option',
      align: 'center',
      width: 150,
      key: 'option',
      fixed: 'right',
      render: (_, record) => (
        <Space size={12}>
          <a key="edit" onClick={() => handleEditNotice(record)}>
            {textConst.action.update}
          </a>
          <a
            key="delete"
            style={{ color: '#ff4d4f' }}
            onClick={() => handleDelete(record, deleteNotice, () => actionRef.current?.reload())}
          >
            {textConst.action.delete}
          </a>
          <a key="push" onClick={() => handlePush(record)}>
            推送
          </a>
        </Space>
      )
    }
  ]

  const handlePush = (record: API.SystemNoticeRespVO) => {
    Modal.confirm({
      title: textConst.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '是否推送所选中通知？',
      okText: textConst.common.ok,
      cancelText: textConst.common.cancel,
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
            onClick={() => handleCreateNotice()}
          >
            {textConst.action.create}
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
            onClick={() =>
              handleBatchDelete(
                selectedRowKeys,
                deleteNotice,
                () => setSelectedRowKeys([]),
                () => actionRef.current?.reload()
              )
            }
          >
            {textConst.action.batchDelete}
          </Button>
        ]}
      />

      <SaveNoticeForm onSuccess={() => actionRef.current?.reload()} />
    </>
  )
}

export default NoticeConfig
