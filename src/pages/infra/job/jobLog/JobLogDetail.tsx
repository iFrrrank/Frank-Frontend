import React, { useEffect, useState } from 'react'
import { Descriptions, Drawer, message, Spin } from 'antd'
import { getJobLog } from '@/api/infra/jobLog'

interface JobLogDetailProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  id?: number
}

const JobLogDetail: React.FC<JobLogDetailProps> = ({ visible, setVisible, id }) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (visible && id !== undefined) {
      setLoading(true)
      getJobLog(id)
        .then((res) => {
          setData(res.data)
        })
        .catch(() => {
          message.error('获取日志详情失败')
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
      title="日志详情"
      width={700}
      open={visible}
      onClose={() => setVisible(false)}
      destroyOnHidden
    >
      <Spin spinning={loading}>
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="日志编号">{data.id}</Descriptions.Item>
          <Descriptions.Item label="任务编号">{data.jobId}</Descriptions.Item>
          <Descriptions.Item label="处理器的名字">{data.handlerName}</Descriptions.Item>
          <Descriptions.Item label="处理器的参数">{data.handlerParam}</Descriptions.Item>
          <Descriptions.Item label="第几次执行">{data.executeIndex}</Descriptions.Item>
          <Descriptions.Item label="执行时间">{data.beginTime}</Descriptions.Item>
          <Descriptions.Item label="执行时长">{data.duration} 毫秒</Descriptions.Item>
          <Descriptions.Item label="任务状态">
            {data.status === 0 ? '成功' : data.status === 1 ? '失败' : data.status}
          </Descriptions.Item>
          <Descriptions.Item label="执行结果" span={2}>
            {data.result}
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </Drawer>
  )
}

export default JobLogDetail
