import React, { useState } from 'react'
import { Avatar, Descriptions, Drawer, Table, Tag } from 'antd'
import { getCombinationRecordPage } from '@/api/mall/promotion/combination/record'

export let handleOpenCombinationRecordDetail: (record: any) => void

// 拼团状态文案
const COMBINATION_RECORD_STATUS: Record<number, string> = {
  0: '拼团中',
  1: '拼团成功',
  2: '拼团失败'
}

// 拼团记录详情：团信息 + 团成员列表（同一 headId 的全部记录）
const CombinationRecordDetail: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [record, setRecord] = useState<any>()
  const [members, setMembers] = useState<any[]>([])

  handleOpenCombinationRecordDetail = (row) => {
    setRecord(row)
    setVisible(true)
    getCombinationRecordPage({
      pageNo: 1,
      pageSize: 100,
      headId: row.headId ?? row.id
    } as any).then((resp) => {
      if (resp.code === 0) {
        setMembers(resp.data?.list || [])
      }
    })
  }

  return (
    <Drawer
      title="拼团记录详情"
      open={visible}
      onClose={() => setVisible(false)}
      width={680}
      destroyOnHidden
    >
      {record && (
        <>
          <Descriptions column={2} style={{ marginBottom: 16 }}>
            <Descriptions.Item label="拼团编号">{record.id}</Descriptions.Item>
            <Descriptions.Item label="拼团状态">
              {COMBINATION_RECORD_STATUS[record.status] || record.status}
            </Descriptions.Item>
            <Descriptions.Item label="拼团商品">{record.spuName || '-'}</Descriptions.Item>
            <Descriptions.Item label="几人团">
              {record.userSize ? `${record.userSize} 人团` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="已参团">
              {record.userCount !== undefined ? `${record.userCount} 人` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="虚拟成团">{record.virtualGroup ? '是' : '否'}</Descriptions.Item>
            <Descriptions.Item label="开团时间">{record.startTime || '-'}</Descriptions.Item>
            <Descriptions.Item label="过期时间">{record.expireTime || '-'}</Descriptions.Item>
            <Descriptions.Item label="结束时间">{record.endTime || '-'}</Descriptions.Item>
          </Descriptions>
          <Table
            rowKey="id"
            size="small"
            pagination={false}
            dataSource={members}
            columns={[
              {
                title: '成员',
                render: (_, row) => (
                  <span>
                    <Avatar src={row.avatar} size="small" style={{ marginRight: 6 }} />
                    {row.nickname || row.userId}
                    {row.headId === row.userId || row.id === record.headId ? (
                      <Tag color="blue" style={{ marginLeft: 6 }}>
                        团长
                      </Tag>
                    ) : null}
                  </span>
                )
              },
              { title: '订单编号', dataIndex: 'orderId', align: 'center' },
              {
                title: '参团时间',
                dataIndex: 'createTime',
                align: 'center',
                render: (_, row) => row.createTime || row.startTime || '-'
              },
              {
                title: '状态',
                align: 'center',
                render: (_, row) =>
                  COMBINATION_RECORD_STATUS[row.status] || row.status || '-'
              }
            ]}
          />
        </>
      )}
    </Drawer>
  )
}

export default CombinationRecordDetail
