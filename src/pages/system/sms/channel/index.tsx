import React, { useRef, useState } from 'react'
import { Button, message, Modal, Tag, Typography } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import {
  ModalForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable
} from '@ant-design/pro-components'
import {
  createSmsChannel,
  deleteSmsChannel,
  getSmsChannelPage,
  updateSmsChannel
} from '@/api/system/smsChannel'

const SmsChannelConfig: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editingSmsChannel, setEditingSmsChannel] = useState<API.SystemSmsChannelRespVO | null>(
    null
  )
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
        placeholder: '请输入短信签名'
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
        placeholder: '请选择启用状态'
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
      render: (_, record) => (
        record.apiKey ? (
          <Typography.Text style={{ width: 150, margin: 0 }} ellipsis={{ tooltip: record.apiKey }}>
            {record.apiKey}
          </Typography.Text>
        ) : <span>-</span>
      )
    },
    {
      title: '短信 API 密钥',
      dataIndex: 'apiSecret',
      align: 'center',
      hideInSearch: true,
      width: 180,
      render: (_, record) => (
        record.apiSecret ? (
          <Typography.Text style={{ width: 150, margin: 0 }} ellipsis={{ tooltip: record.apiSecret }}>
            {record.apiSecret}
          </Typography.Text>
        ) : <span>-</span>
      )
    },
    {
      title: '短信发送回调 URL',
      dataIndex: 'callbackUrl',
      align: 'center',
      hideInSearch: true,
      width: 100,
      render: (_, record) => (
        record.callbackUrl ? (
          <Typography.Text style={{ width: 180, margin: 0 }} ellipsis={{ tooltip: record.callbackUrl }}>
            {record.callbackUrl}
          </Typography.Text>
        ) : <span>-</span>
      )
    },
    {
      title: '创建时间',
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
          <a key="edit" onClick={() => handleEdit(record)}>
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
      title: '系统提示',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '是否确认删除选中数据？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteSmsChannel({ id: record.id })
          message.success('删除成功')
          actionRef.current?.reload()
        } catch {
          message.error('删除失败')
        }
      }
    })
  }

  // ===== 批量删除 =====
  const handleBatchDelete = () => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '是否确认删除选中数据?',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await Promise.all(selectedRowKeys.map((id) => deleteSmsChannel({ id: Number(id) })))
          message.success('批量删除成功')
          setSelectedRowKeys([])
          actionRef.current?.reload()
        } catch {
          message.error('批量删除失败')
        }
      }
    })
  }

  // ===== 编辑 =====
  const handleEdit = (record: API.SystemSmsChannelRespVO) => {
    setEditingSmsChannel(record)
    setCreateModalVisible(true)
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
            onClick={() => {
              setEditingSmsChannel(null)
              setCreateModalVisible(true)
            }}
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

      {/* ========== 新增/编辑弹窗 ========== */}
      <ModalForm<API.SystemSmsChannelSaveReqVO>
        title={editingSmsChannel ? '修改' : '新增'}
        width={700}
        open={createModalVisible}
        onOpenChange={(visible) => {
          setCreateModalVisible(visible)
          if (!visible) {
            setEditingSmsChannel(null)
          }
        }}
        initialValues={
          editingSmsChannel
            ? {
              ...editingSmsChannel
            }
            : { status: 0 }
        }
        layout="horizontal"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 18 }}
        colon={false}
        modalProps={{
          destroyOnClose: true,
          bodyStyle: { paddingBottom: 0 }
        }}
        onFinish={async (values) => {
          try {
            let resp
            if (editingSmsChannel) {
              resp = await updateSmsChannel({ ...values, id: editingSmsChannel.id } as any)
            } else {
              resp = await createSmsChannel(values as any)
            }
            if (resp.code === 0) {
              message.success(editingSmsChannel ? '修改成功' : '创建成功')
              actionRef.current?.reload()
              return true
            } else {
              message.error(resp.msg || (editingSmsChannel ? '修改失败' : '创建失败'))
              return false
            }
          } catch {
            message.error(editingSmsChannel ? '修改失败' : '创建失败')
            return false
          }
        }}
      >
        <ProFormText
          name="signature"
          label="短信签名"
          placeholder="请输入短信签名"
          rules={[{ required: true, message: '请输入短信签名' }]}
        />
        <ProFormSelect
          name="code"
          label="渠道编码"
          placeholder="请选择渠道编码"
          rules={[{ required: true, message: '请选择渠道编码' }]}
          options={[
            { label: '阿里云', value: 'ALIYUN' },
            { label: '腾讯云', value: 'TENCENT' },
            { label: '钉钉', value: 'DINGTALK' },
            { label: '华为云', value: 'HUAWEI' },
            { label: '七牛云', value: 'QINIU' }
          ]}
        />
        <ProFormRadio.Group
          name="status"
          label="启用状态"
          options={[
            { label: '开启', value: 0 },
            { label: '关闭', value: 1 }
          ]}
        />
        <ProFormTextArea
          name="remark"
          label="备注"
          placeholder="请输入备注"
          fieldProps={{ rows: 2 }}
        />
        <ProFormText
          name="apiKey"
          label="短信 API 的账号"
          placeholder="请输入短信 API 的账号"
          rules={[{ required: true, message: '请输入短信 API 的账号' }]}
        />
        <ProFormText
          name="apiSecret"
          label="短信 API 的密钥"
          placeholder="请输入短信 API 的密钥"
        />
        <ProFormText
          name="callbackUrl"
          label="短信发送回调 URL"
          placeholder="请输入短信发送回调 URL"
        />
      </ModalForm>
    </>
  )
}

export default SmsChannelConfig
