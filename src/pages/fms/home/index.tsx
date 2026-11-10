import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Card, Spin } from 'antd'
import { fmsHomeGetHome, fmsHomeGetMetricDetail } from '@/api/fms/home'
import { useFmsStore } from '../store/fms'
import FmsHomeMetricCards from './components/FmsHomeMetricCards'
import FmsHomeMetricCharts from './components/FmsHomeMetricCharts'
import FmsHomeShortcuts from './components/FmsHomeShortcuts'

/**
 * 财务首页（快捷入口、当期财务指标卡片、指标变化趋势与科目构成分析）
 */
const FmsHomePage: React.FC = () => {
  const fmsStore = useFmsStore()
  const accountSetId = fmsStore.accountSetId
  const [loading, setLoading] = useState(false)
  const [metricLoading, setMetricLoading] = useState(false)
  const [home, setHome] = useState<API.FmsHomeRespVO>()
  const [metricDetail, setMetricDetail] = useState<API.FmsHomeMetricDetailRespVO>()
  const [selectedMetricKey, setSelectedMetricKey] = useState<string>()
  const metricRequestSequenceRef = useRef(0)

  /** 选择财务指标并加载明细趋势及科目构成 */
  const selectMetric = useCallback(
    async (metric: API.Metric) => {
      if (!accountSetId) return
      const requestSequence = ++metricRequestSequenceRef.current
      setSelectedMetricKey(metric.key)
      setMetricDetail(undefined)
      setMetricLoading(true)
      try {
        const resp = await fmsHomeGetMetricDetail({
          accountSetId,
          metricKey: metric.key
        })
        if (requestSequence === metricRequestSequenceRef.current && resp?.code === 0) {
          setMetricDetail(resp.data)
        }
      } finally {
        if (requestSequence === metricRequestSequenceRef.current) {
          setMetricLoading(false)
        }
      }
    },
    [accountSetId]
  )

  /** 初始化加载首页数据 */
  useEffect(() => {
    metricRequestSequenceRef.current += 1
    setHome(undefined)
    setMetricLoading(false)
    setSelectedMetricKey(undefined)
    setMetricDetail(undefined)

    if (!accountSetId) {
      setLoading(false)
      return
    }

    let cancelled = false
    const fetchHome = async () => {
      setLoading(true)
      try {
        const resp = await fmsHomeGetHome({ accountSetId })
        if (!cancelled && resp?.code === 0 && resp.data) {
          setHome(resp.data)
          const firstMetric = resp.data.metrics?.[0]
          if (firstMetric) {
            await selectMetric(firstMetric)
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchHome()
    return () => {
      cancelled = true
    }
  }, [accountSetId, selectMetric])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <FmsHomeShortcuts />
      <Spin spinning={loading}>
        <Card variant="borderless">
          <FmsHomeMetricCards
            home={home}
            selectedMetricKey={selectedMetricKey}
            onSelect={selectMetric}
          />
          <FmsHomeMetricCharts
            home={home}
            metricDetail={metricDetail}
            selectedMetricKey={selectedMetricKey}
            loading={metricLoading}
          />
        </Card>
      </Spin>
    </div>
  )
}

export default FmsHomePage
