import React, { useRef } from 'react'
import { Button, message, Modal, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { getDemoWithdrawPage, transferDemoWithdraw } from '@/api/pay/demo/withdraw'
import CreateDemoWithdrawForm, { handleCreateDemoWithdraw } from './CreateDemoWithdrawForm'
import { textConst } from '@/locales/zh-CN'
import { tableActionStyle } from '@/styles/common.style'

// 金额（分）转元展示
const fenToYuan = (price?: number) => `￥${((price || 0) / 100).toFixed(2)}`

// 提现类型文案
const withdrawTypeText: Record<number, string> = {
  1: '支付宝',
  2: '微信余额',
  3: '钱包余额'
}

const DemoWithdraw: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  // ===== 发起/重新转账：二次确认后调用转账接口 =====
  const handleTransfer = (record: API.PayDemoWithdrawRespVO) => {
    Modal.confirm({
      title: '提示',
      content: `是否确认对提现单"${record.id}"发起转账？`,
      okText: textConst.common.ok,
      cancelText: textConst.common.cancel,
      onOk: async () => {
        const resp = await transferDemoWithdraw({ id: record.id })
        if (resp.code === 0) {
          message.success('发起转账成功')
          actionRef.current?.reload()
        } else {
          message.error(resp.msg || '发起转账失败')
        }
      }
    })
  }

  // 提现状态展示：status=0 时再按是否已有转账单区分“等待转账/转账中”
  const renderStatus = (record: API.PayDemoWithdrawRespVO) => {
    if (record.status === 0 && !record.payTransferId) {
      return <Tag color="warning">等待转账</Tag>
    }
    if (record.status === 0 && record.payTransferId) {
      return <Tag color="processing">转账中</Tag>
    }
    if (record.status === 10) {
      return <Tag color="success">转账成功</Tag>
    }
    if (record.status === 20) {
      return <Tag color="error">转账失败</Tag>
    }
    return <Tag>{record.status}</Tag>
  }

  const columns: ProColumns<API.PayDemoWithdrawRespVO>[] = [
    {
      title: textConst.form.operate,
      valueType: 'option',
      align: 'center',
      width: 100,
      key: 'option',
      render: (_, record) => (
        <div style={tableActionStyle}>
          {/* 等待转账可发起转账；转账失败可重新转账 */}
          {record.status === 0 && !record.payTransferId && (
            <a key="transfer" onClick={() => handleTransfer(record)}>
              发起转账
            </a>
          )}
          {record.status === 20 && (
            <a key="retransfer" onClick={() => handleTransfer(record)}>
              重新转账
            </a>
          )}
        </div>
      )
    },
    {
      title: '提现单编号',
      dataIndex: 'id',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '提现标题',
      dataIndex: 'subject',
      align: 'center',
      width: 140,
      hideInSearch: true
    },
    {
      title: '提现类型',
      dataIndex: 'type',
      align: 'center',
      width: 100,
      hideInSearch: true,
      render: (_, record) => <Tag>{withdrawTypeText[record.type] || record.type}</Tag>
    },
    {
      title: '提现金额',
      dataIndex: 'price',
      align: 'center',
      width: 120,
      hideInSearch: true,
      render: (_, record) => <span>{fenToYuan(record.price)}</span>
    },
    {
      title: '收款人姓名',
      dataIndex: 'userName',
      align: 'center',
      width: 140,
      hideInSearch: true
    },
    {
      title: '收款人账号',
      dataIndex: 'userAccount',
      align: 'center',
      width: 220,
      hideInSearch: true
    },
    {
      title: '提现状态',
      dataIndex: 'status',
      align: 'center',
      width: 110,
      hideInSearch: true,
      render: (_, record) => renderStatus(record)
    },
    {
      title: '转账单号',
      dataIndex: 'payTransferId',
      align: 'center',
      width: 120,
      hideInSearch: true,
      render: (_, record) => <span>{record.payTransferId || '-'}</span>
    },
    {
      title: '转账渠道',
      dataIndex: 'transferChannelCode',
      align: 'center',
      width: 160,
      hideInSearch: true,
      render: (_, record) => <span>{record.transferChannelCode || '-'}</span>
    },
    {
      title: '转账时间',
      dataIndex: 'transferTime',
      align: 'center',
      width: 180,
      hideInSearch: true,
      render: (_, record) => <span>{record.transferTime || '-'}</span>
    },
    {
      title: '转账失败原因',
      dataIndex: 'transferErrorMsg',
      align: 'center',
      width: 200,
      hideInSearch: true,
      ellipsis: true,
      render: (_, record) => <span>{record.transferErrorMsg || '-'}</span>
    },
    {
      title: textConst.columns.createTime,
      dataIndex: 'createTime',
      align: 'center',
      width: 180,
      hideInSearch: true,
      render: (_, record) => <span>{record.createTime as any}</span>
    }
  ]

  return (
    <>
      <ProTable<API.PayDemoWithdrawRespVO>
        headerTitle="示例提现"
        columns={columns}
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        formRef={formRef}
        form={{ colon: false }}
        cardBordered
        request={async (params: Record<string, any>) => {
          const resp = await getDemoWithdrawPage({
            pageNo: params.current || 1,
            pageSize: params.pageSize || 10
          })
          return {
            data: resp.data?.list || [],
            success: true,
            total: resp.data?.total || 0
          }
        }}
        rowKey="id"
        search={false}
        options={false}
        pagination={{
          align: 'center',
          showSizeChanger: true
        }}
        toolBarRender={() => [
          <Button
            key="create"
            icon={<PlusOutlined />}
            onClick={() => handleCreateDemoWithdraw()}
            type="primary"
          >
            发起提现
          </Button>
        ]}
      />

      <CreateDemoWithdrawForm onSuccess={() => actionRef.current?.reload()} />
    </>
  )
}

export default DemoWithdraw
