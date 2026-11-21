import React, { useState } from 'react'
import { Descriptions, Drawer, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { getNotifyTaskDetail } from '@/api/pay/notify'
import { PAY_NOTIFY_STATUS, PAY_NOTIFY_TYPE } from '@/utils/constantsValue'

export let handleOpenNotifyDetail: (record: any) => void

// 回调通知详情：任务信息 + 每次通知的日志列表
const NotifyDetail: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [detailData, setDetailData] = useState<any>(null)

  handleOpenNotifyDetail = async (record: any) => {
    try {
      const resp = await getNotifyTaskDetail({ id: record.id } as any)
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

  const task = detailData || {}
  const logs: any[] = task.logs || []

  const logColumns: ColumnsType<any> = [
    {
      title: '日志编号',
      dataIndex: 'id',
      align: 'center',
      width: 90
    },
    {
      title: '通知状态',
      dataIndex: 'status',
      align: 'center',
      width: 110,
      render: (_, record) =>
        PAY_NOTIFY_STATUS[record.status as keyof typeof PAY_NOTIFY_STATUS] || record.status
    },
    {
      title: '通知次数',
      dataIndex: 'notifyTimes',
      align: 'center',
      width: 90
    },
    {
      title: '通知时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 170
    },
    {
      title: '响应结果',
      dataIndex: 'response',
      ellipsis: true
    }
  ]

  return (
    <Drawer
      title="回调通知详情"
      placement="right"
      width={760}
      open={drawerVisible}
      onClose={() => {
        setDrawerVisible(false)
        setDetailData(null)
      }}
      destroyOnHidden
    >
      {detailData && (
        <>
          <Descriptions column={2} bordered size="small" style={{ marginBottom: 16 }}>
            <Descriptions.Item label="通知状态">
              {PAY_NOTIFY_STATUS[task.status as keyof typeof PAY_NOTIFY_STATUS] || task.status}
            </Descriptions.Item>
            <Descriptions.Item label="通知类型">
              {PAY_NOTIFY_TYPE[task.type as keyof typeof PAY_NOTIFY_TYPE] || task.type}
            </Descriptions.Item>
            <Descriptions.Item label="商户订单编号">{task.merchantOrderId || '-'}</Descriptions.Item>
            <Descriptions.Item label="商户退款编号">{task.merchantRefundId || '-'}</Descriptions.Item>
            <Descriptions.Item label="商户转账编号">
              {task.merchantTransferId || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="应用编号">{task.appId}</Descriptions.Item>
            <Descriptions.Item label="应用名称">{task.appName}</Descriptions.Item>
            <Descriptions.Item label="关联编号">{task.dataId}</Descriptions.Item>
            <Descriptions.Item label="通知次数">{task.notifyTimes}</Descriptions.Item>
            <Descriptions.Item label="最大通知次数">{task.maxNotifyTimes}</Descriptions.Item>
            <Descriptions.Item label="最后通知时间">{task.lastExecuteTime || '-'}</Descriptions.Item>
            <Descriptions.Item label="下次通知时间">{task.nextNotifyTime || '-'}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{task.createTime}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{task.updateTime}</Descriptions.Item>
          </Descriptions>

          {/* 回调日志：每一次通知尝试一条 */}
          <Table
            columns={logColumns}
            dataSource={logs}
            rowKey="id"
            size="small"
            pagination={false}
          />
        </>
      )}
    </Drawer>
  )
}

export default NotifyDetail
