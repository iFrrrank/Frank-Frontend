import React, { useState } from 'react'
import { Avatar, Descriptions, Drawer, Table } from 'antd'
import { getBargainHelpPage } from '@/api/mall/promotion/bargain/help'

export let handleOpenBargainRecordDetail: (record: any) => void

// 砍价状态文案
const BARGAIN_RECORD_STATUS: Record<number, string> = {
  0: '砍价中',
  1: '砍价成功',
  2: '砍价失败'
}

// 砍价记录详情：记录信息 + 帮砍明细列表
const BargainRecordDetail: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [record, setRecord] = useState<any>()
  const [helps, setHelps] = useState<any[]>([])

  handleOpenBargainRecordDetail = (row) => {
    setRecord(row)
    setVisible(true)
    getBargainHelpPage({ pageNo: 1, pageSize: 100, recordId: row.id } as any).then((resp) => {
      if (resp.code === 0) {
        setHelps(resp.data?.list || [])
      }
    })
  }

  return (
    <Drawer
      title="砍价记录详情"
      open={visible}
      onClose={() => setVisible(false)}
      width={680}
      destroyOnHidden
    >
      {record && (
        <>
          <Descriptions column={2} style={{ marginBottom: 16 }}>
            <Descriptions.Item label="砍价编号">{record.id}</Descriptions.Item>
            <Descriptions.Item label="订单编号">{record.orderId || '-'}</Descriptions.Item>
            <Descriptions.Item label="砍价活动">{record.activityName || '-'}</Descriptions.Item>
            <Descriptions.Item label="发起用户">{record.nickname || '-'}</Descriptions.Item>
            <Descriptions.Item label="砍价状态">
              {BARGAIN_RECORD_STATUS[record.status] || record.status}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">{record.createTime || '-'}</Descriptions.Item>
            <Descriptions.Item label="最低价">
              {record.bargainMinPrice !== undefined
                ? `￥${(record.bargainMinPrice / 100).toFixed(2)}`
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="当前价">
              {record.bargainPrice !== undefined
                ? `￥${(record.bargainPrice / 100).toFixed(2)}`
                : '-'}
            </Descriptions.Item>
          </Descriptions>
          <Table
            rowKey="id"
            size="small"
            pagination={false}
            dataSource={helps}
            columns={[
              {
                title: '帮砍用户',
                render: (_, row) => (
                  <span>
                    <Avatar src={row.avatar} size="small" style={{ marginRight: 6 }} />
                    {row.nickname || row.userId}
                  </span>
                )
              },
              {
                title: '砍掉金额',
                dataIndex: 'reducePrice',
                align: 'center',
                render: (v) => (v !== undefined ? `￥${(v / 100).toFixed(2)}` : '-')
              },
              { title: '帮砍时间', dataIndex: 'createTime', align: 'center' }
            ]}
          />
        </>
      )}
    </Drawer>
  )
}

export default BargainRecordDetail
