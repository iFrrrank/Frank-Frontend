import React, { useRef, useState } from 'react'
import { Drawer } from 'antd'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { getWalletTransactionPage } from '@/api/pay/wallet/transaction'

export let handleOpenWalletTransaction: (record: API.PayWalletRespVO) => void

// 金额（分）转元展示，带正负号区分收支
const fenToYuan = (price?: number) => {
  const value = price || 0
  return `${value > 0 ? '+' : ''}￥${(value / 100).toFixed(2)}`
}

// 钱包交易记录：从钱包余额页打开，按钱包编号查询流水
const WalletTransactionList: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [currentWallet, setCurrentWallet] = useState<API.PayWalletRespVO | null>(null)

  handleOpenWalletTransaction = (record: API.PayWalletRespVO) => {
    setCurrentWallet(record)
    setDrawerVisible(true)
  }

  const columns: ProColumns<API.PayWalletTransactionRespVO>[] = [
    {
      title: '编号',
      dataIndex: 'id',
      align: 'center',
      width: 90
    },
    {
      title: '钱包编号',
      dataIndex: 'walletId',
      align: 'center',
      width: 90
    },
    {
      title: '关联业务标题',
      dataIndex: 'title',
      align: 'center',
      width: 180,
      ellipsis: true
    },
    {
      title: '交易金额',
      dataIndex: 'price',
      align: 'center',
      width: 120,
      render: (_, record) => (
        <span style={{ color: record.price >= 0 ? '#52c41a' : '#f5222d' }}>
          {fenToYuan(record.price)}
        </span>
      )
    },
    {
      title: '钱包余额',
      dataIndex: 'balance',
      align: 'center',
      width: 120,
      render: (_, record) => <span>￥{((record.balance || 0) / 100).toFixed(2)}</span>
    },
    {
      title: '交易时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 180,
      render: (_, record) => <span>{record.createTime as any}</span>
    }
  ]

  return (
    <Drawer
      title={`钱包交易记录（钱包编号：${currentWallet?.id ?? ''}）`}
      placement="right"
      width={900}
      open={drawerVisible}
      onClose={() => {
        setDrawerVisible(false)
        setCurrentWallet(null)
      }}
      destroyOnHidden
    >
      {currentWallet && (
        <ProTable<API.PayWalletTransactionRespVO>
          columns={columns}
          actionRef={actionRef}
          request={async (params: Record<string, any>) => {
            const resp = await getWalletTransactionPage({
              pageNo: params.current || 1,
              pageSize: params.pageSize || 10,
              walletId: currentWallet.id
            } as any)
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
        />
      )}
    </Drawer>
  )
}

export default WalletTransactionList
