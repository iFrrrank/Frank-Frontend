import React, { useState } from 'react'
import { Descriptions, Drawer } from 'antd'
import { getTransfer1 } from '@/api/pay/transfer'
import { PAY_CHANNEL, PAY_TRANSFER_STATUS } from '@/utils/constantsValue'

export let handleOpenTransferDetail: (record: any) => void

// 金额（分）转元展示
const fenToYuan = (price?: number) => `￥${((price || 0) / 100).toFixed(2)}`

// 转账订单详情
const TransferDetail: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [detailData, setDetailData] = useState<any>(null)

  handleOpenTransferDetail = async (record: any) => {
    try {
      const resp = await getTransfer1({ id: record.id } as any)
      if (resp.code === 0 && resp.data) {
        setDetailData(resp.data)
      } else {
        setDetailData(record)
      }
    } catch {
      setDetailData(record)
    }
    setDrawerVisible(true)
  }

  const transfer = detailData || {}

  return (
    <Drawer
      title="转账订单详情"
      placement="right"
      width={720}
      open={drawerVisible}
      onClose={() => {
        setDrawerVisible(false)
        setDetailData(null)
      }}
      destroyOnHidden
    >
      {detailData && (
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="商户单号">{transfer.merchantTransferId}</Descriptions.Item>
          <Descriptions.Item label="转账单号">{transfer.no}</Descriptions.Item>
          <Descriptions.Item label="应用编号">{transfer.appId}</Descriptions.Item>
          <Descriptions.Item label="应用名称">{transfer.appName}</Descriptions.Item>
          <Descriptions.Item label="转账状态">
            {PAY_TRANSFER_STATUS[transfer.status as keyof typeof PAY_TRANSFER_STATUS] ||
              transfer.status}
          </Descriptions.Item>
          <Descriptions.Item label="转账金额">{fenToYuan(transfer.price)}</Descriptions.Item>
          <Descriptions.Item label="转账时间">{transfer.successTime || '-'}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{transfer.createTime}</Descriptions.Item>
          <Descriptions.Item label="收款人姓名">{transfer.userName}</Descriptions.Item>
          <Descriptions.Item label="收款人账号">{transfer.userAccount}</Descriptions.Item>
          <Descriptions.Item label="支付渠道">
            {PAY_CHANNEL[transfer.channelCode as keyof typeof PAY_CHANNEL] ||
              transfer.channelCode ||
              '-'}
          </Descriptions.Item>
          <Descriptions.Item label="支付 IP">{transfer.userIp}</Descriptions.Item>
          <Descriptions.Item label="渠道单号">{transfer.channelTransferNo || '-'}</Descriptions.Item>
          <Descriptions.Item label="通知 URL">{transfer.notifyUrl}</Descriptions.Item>
          <Descriptions.Item label="渠道错误码">{transfer.channelErrorCode || '-'}</Descriptions.Item>
          <Descriptions.Item label="渠道错误提示">{transfer.channelErrorMsg || '-'}</Descriptions.Item>
          <Descriptions.Item label="转账渠道通知内容" span={2}>
            <span style={{ wordBreak: 'break-all' }}>{transfer.channelNotifyData || '-'}</span>
          </Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  )
}

export default TransferDetail
