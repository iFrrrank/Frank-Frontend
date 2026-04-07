import React, { useEffect, useState } from 'react'
import { Descriptions, Drawer, message, Spin } from 'antd'
import { getJob } from '@/api/infra/job'

interface JobDetailProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  id?: number
}

const JobDetail: React.FC<JobDetailProps> = ({ visible, setVisible, id }) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (visible && id !== undefined) {
      setLoading(true)
      getJob(id)
        .then((res) => {
          setData(res.data)
        })
        .catch(() => {
          message.error('获取任务详情失败')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setData({})
    }
  }, [visible, id])

  return (
    <Drawer
      title="任务详情"
      width={700}
      open={visible}
      onClose={() => setVisible(false)}
      destroyOnHidden
    >
      <Spin spinning={loading}>
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="任务编号">{data.id}</Descriptions.Item>
          <Descriptions.Item label="任务名称">{data.name}</Descriptions.Item>
          <Descriptions.Item label="任务状态">
            {data.status === 0 ? '正常' : data.status === 1 ? '暂停' : '未知'}
          </Descriptions.Item>
          <Descriptions.Item label="处理器的名字">{data.handlerName}</Descriptions.Item>
          <Descriptions.Item label="处理器的参数" span={2}>
            {data.handlerParam}
          </Descriptions.Item>
          <Descriptions.Item label="CRON 表达式" span={2}>
            {data.cronExpression}
          </Descriptions.Item>
          <Descriptions.Item label="重试次数">{data.retryCount}</Descriptions.Item>
          <Descriptions.Item label="重试间隔">{data.retryInterval} ms</Descriptions.Item>
          <Descriptions.Item label="监控超时时间">{data.monitorTimeout} ms</Descriptions.Item>
          <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
        </Descriptions>
      </Spin>
    </Drawer>
  )
}

export default JobDetail
