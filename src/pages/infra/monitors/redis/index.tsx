import React, { useEffect, useState } from 'react'
import { Card, Col, Descriptions, message, Row, Skeleton, Spin } from 'antd'
import ReactECharts from 'echarts-for-react'
import { getRedisMonitorInfo } from '@/api/infra/redisConfig'

const RedisMonitorPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [dbSize, setDbSize] = useState<number>(0)
  const [info, setInfo] = useState<Record<string, any>>({})
  const [commandStats, setCommandStats] = useState<API.CommandStat[]>([])

  const loadData = async () => {
    try {
      setLoading(true)
      const res = await getRedisMonitorInfo()
      if (res.data) {
        setInfo(res.data.info || {})
        setDbSize(res.data.dbSize || 0)
        setCommandStats(res.data.commandStats || [])
      }
    } catch (error) {
      message.error('获取Redis监控数据失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // 基本信息
  const basicInfo = [
    { label: 'Redis版本', value: info.redis_version },
    {
      label: '运行模式',
      value:
        info.redis_mode === 'standalone' ? '单机' : info.redis_mode === 'cluster' ? '集群' : '哨兵'
    },
    { label: '端口', value: info.tcp_port },
    { label: '客户端数', value: info.connected_clients },
    { label: '运行时间(天)', value: info.uptime_in_days },
    { label: '使用内存', value: info.used_memory_human },
    {
      label: '使用CPU',
      value: parseFloat(info.used_cpu_sys || '0') + parseFloat(info.used_cpu_user || '0')
    },
    { label: '内存配置', value: info.maxmemory_human },
    { label: 'AOF是否开启', value: info.aof_enabled === '0' ? '否' : '是' },
    { label: 'RDB是否成功', value: info.rdb_last_bgsave_status === 'ok' ? '是' : '否' },
    { label: 'Key数量', value: dbSize },
    {
      label: '网络入口/出口',
      value: `${info.instantaneous_input_kbps || 0}kps / ${info.instantaneous_output_kbps || 0}kps`
    }
  ]

  // 命令统计饼图配置
  const commandPieOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c} ({d}%)'
    },
    series: [
      {
        name: '命令',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {c}'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true
        },
        data: commandStats.map((item) => ({
          name: item.command,
          value: item.calls
        }))
      }
    ]
  }

  // 计算内存使用率 (假定有 maxmemory，或者用 fixed value 50 作为最大值用于演示)
  const usedMemory = parseFloat(info.used_memory || '0') / 1024 / 1024 // 转成 MB
  let maxMemory = parseFloat(info.maxmemory || '0') / 1024 / 1024
  if (maxMemory === 0) {
    maxMemory = usedMemory > 50 ? usedMemory * 2 : 50 // 如果没限制或者限制是0，做个假定最大值
  }
  const memoryUsage = maxMemory > 0 ? (usedMemory / maxMemory) * 100 : 0

  // 内存使用情况仪表盘配置
  const memoryGaugeOption = {
    tooltip: {
      formatter: '{a} <br/>{b} : {c}MB'
    },
    series: [
      {
        name: '内存使用',
        type: 'gauge',
        min: 0,
        max: Math.ceil(maxMemory),
        splitNumber: 5,
        detail: {
          formatter: '{value}',
          fontSize: 20
        },
        axisLine: {
          lineStyle: {
            width: 15,
            color: [
              [0.3, '#67e0e3'],
              [0.7, '#37a2da'],
              [1, '#fd666d']
            ]
          }
        },
        data: [
          {
            value: usedMemory.toFixed(2),
            name: 'MB'
          }
        ]
      }
    ]
  }

  return (
    <Spin spinning={loading}>
      <Card title="基本信息" bordered={false} style={{ marginBottom: 16 }}>
        <Descriptions
          column={{ xxl: 6, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
          bordered={false}
          size="small"
        >
          {basicInfo.map((item, index) => (
            <Descriptions.Item key={index} label={item.label}>
              {item.value}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="命令统计" bordered={false}>
            {loading ? (
              <Skeleton active />
            ) : (
              <ReactECharts option={commandPieOption} style={{ height: 350 }} />
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="内存使用情况" bordered={false}>
            {loading ? (
              <Skeleton active />
            ) : (
              <ReactECharts option={memoryGaugeOption} style={{ height: 350 }} />
            )}
          </Card>
        </Col>
      </Row>
    </Spin>
  )
}

export default RedisMonitorPage
