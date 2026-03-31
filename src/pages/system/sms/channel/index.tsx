import React, { useRef, useState } from 'react'
import { ActionType, ProColumns, ProFormInstance, ProTable } from '@ant-design/pro-components'
import { textConstants } from '@/locales/zh-CN'
import { Button, message, Modal, Tag, Typography } from 'antd'
import SaveSmsChannelForm, { handleCreateSmsChannel, handleEditSmsChannel } from './SaveSmsChannelForm'
import { DeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { deleteSmsChannel, getSmsChannelPage } from '@/api/system/smsChannel'

const SmsChannelConfig: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // 模拟渠道编码数据字典
  const channelCodeEnum = {
    ALIYUN: { text: '阿里云', color: 'blue' },
    TENCENT: { text: '腾讯云', color: 'green' },
    DINGTALK: { text: '钉钉', color: 'cyan' },
    HUAWEI: { text: '华为云', color: 'red' },
    QINIU: { text: '七牛云', color: 'magenta' }
  }

  // ===== 数据列定义 =====
  const columns: ProColumns<API.SystemSmsChannelRespVO>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      hideInSearch: true,
      width: 80
    },
    {
      title: '短信签名',
      dataIndex: 'signature',
      align: 'center',
      width: 150,
      fieldProps: {
        placeholder: `${textConstants.common.inputText}短信签名`
      }
    },
    {
      title: '渠道编码',
      dataIndex: 'code',
      align: 'center',
      hideInSearch: true,
      width: 120,
      render: (_, record) => {
        const conf = channelCodeEnum[record.code as keyof typeof channelCodeEnum]
        return conf ? <Tag color={conf.color}>{conf.text}</Tag> : <Tag>{record.code}</Tag>
      }
    },
    {
      title: '启用状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      valueType: 'select',
      valueEnum: {
        0: {
          text: '开启',
          status: 'Success'
        },
        1: {
          text: '关闭',
          status: 'Error'
        }
      },
      fieldProps: {
        placeholder: 'textConstants.common.selectText启用状态'
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      width: 180,
      hideInSearch: true,
      ellipsis: true
    },
    {
      title: '短信 API 账号',
      dataIndex: 'apiKey',
      align: 'center',
      width: 180,
      hideInSearch: true,
      render: (_, record) =>
        record.apiKey ? (
          <Typography.Text style={{ width: 150, margin: 0 }} ellipsis={{ tooltip: record.apiKey }}>
            {record.apiKey}
          </Typography.Text>
        ) : (
          <span>-</span>
        )
    },
    {
      title: '短信 API 密钥',
      dataIndex: 'apiSecret',
      align: 'center',
      hideInSearch: true,
      width: 180,
      render: (_, record) =>
        record.apiSecret ? (
          <Typography.Text
            style={{ width: 150, margin: 0 }}
            ellipsis={{ tooltip: record.apiSecret }}
          >
            {record.apiSecret}
          </Typography.Text>
        ) : (
          <span>-</span>
        )
    },
    {
      title: '短信发送回调 URL',
      dataIndex: 'callbackUrl',
      align: 'center',
      hideInSearch: true,
      width: 100,
      render: (_, record) =>
        record.callbackUrl ? (
          <Typography.Text
            style={{ width: 180, margin: 0 }}
            ellipsis={{ tooltip: record.callbackUrl }}
          >
            {record.callbackUrl}
          </Typography.Text>
        ) : (
          <span>-</span>
        )
    },
    {
      title: textConstants.columns.createTime,
      dataIndex: 'createTime',
      valueType: 'dateRange',
      align: 'center',
      width: 180,
      fieldProps: {
        placeholder: ['开始日期', '结束日期']
      },
      render: (_, record) => <span>{record.createTime as any}</span>
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 120,
      key: 'option',
      // fixed: 'right', // 防止长列表将操作列挤出屏幕
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <a key="edit" onClick={() => handleEditSmsChannel(record)}>
            修改
          </a>
          <a key="delete" style={{ color: '#ff4d4f' }} onClick={() => handleDelete(record)}>
            删除
          </a>
        </div>
      )
    }
  ]

  // ===== 删除短信渠道 =====
  const handleDelete = (record: API.SystemSmsChannelRespVO) => {
    Modal.confirm({
      title: textConstants.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '是否确认删除选中数据？',
      okText: textConstants.common.ok,
      cancelText: textConstants.common.cancel,
      onOk: async () => {
        try {
          await deleteSmsChannel({ id: record.id })
          message.success(textConstants.msg.delSuccess)
          actionRef.current?.reload()
        } catch {
          message.error(textConstants.msg.delError)
        }
      }
    })
  }

  // ===== 批量删除 =====
  const handleBatchDelete = () => {
    Modal.confirm({
      title: textConstants.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '是否确认删除选中数据?',
      okText: textConstants.common.ok,
      cancelText: textConstants.common.cancel,
      onOk: async () => {
        try {
          await Promise.all(selectedRowKeys.map((id) => deleteSmsChannel({ id: Number(id) })))
          message.success(textConstants.msg.batchDelSuccess)
          setSelectedRowKeys([])
          actionRef.current?.reload()
        } catch {
          message.error(textConstants.msg.batchDelError)
        }
      }
    })
  }

  return (
    <>
      <ProTable<API.SystemSmsChannelRespVO>
        columns={columns}
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        formRef={formRef}
        form={{ colon: false }}
        cardBordered
        request={async (params: Record<string, any>) => {
          const { current, pageSize, signature, status, createTime, ...rest } = params
          let beginCreateTime, endCreateTime
          if (createTime && createTime.length === 2) {
            beginCreateTime = createTime[0] + ' 00:00:00'
            endCreateTime = createTime[1] + ' 23:59:59'
          }
          const resp = await getSmsChannelPage({
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...(signature ? { signature } : {}),
            ...(status !== undefined && status !== '' ? { status: Number(status) } : {}),
            ...(beginCreateTime ? { beginCreateTime } : {}),
            ...(endCreateTime ? { endCreateTime } : {}),
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
          defaultCollapsed: false
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
            onClick={() => handleCreateSmsChannel()}
            type="primary"
          >
            新增
          </Button>,
          <Button
            key="batchDelete"
            icon={<DeleteOutlined />}
            danger
            disabled={selectedRowKeys.length === 0}
            onClick={handleBatchDelete}
            style={
              selectedRowKeys.length > 0
                ? { color: '#ff4d4f', borderColor: '#ffccc7', background: '#fff2f0' }
                : { color: '#ffccc7', borderColor: '#ffe6e6', background: '#fffaf0' }
            }
          >
            批量删除
          </Button>
        ]}
      />

      <SaveSmsChannelForm onSuccess={() => actionRef.current?.reload()} />
    </>
  )
}

export default SmsChannelConfig
