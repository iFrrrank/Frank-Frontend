import React, { useEffect, useMemo, useState } from 'react'
import { Card, Tabs } from 'antd'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import ReactECharts from 'echarts-for-react'
import dayjs from 'dayjs'
import StatFilter from '../components/StatFilter'
import {
  getCustomerAreaSummary,
  getCustomerIndustrySummary,
  getCustomerLevelSummary,
  getCustomerSourceSummary
} from '@/api/crm/statistics/portrait'
import { CUSTOMER_LEVEL, CUSTOMER_SOURCE, INDUSTRY_LIST } from '@/utils/constantsValue'

// 默认统计全部时间（画像为存量分布，时间范围可选）
const defaultParams = () => ({
  times: [
    dayjs().subtract(1, 'year').format('YYYY-MM-DD') + ' 00:00:00',
    dayjs().format('YYYY-MM-DD') + ' 23:59:59'
  ]
})

interface PortraitPanelProps {
  queryParams: any
  loader: (params: any) => Promise<any>
  // 从一行数据中取展示名称（地区直接有名称，行业/等级/来源需按字典映射）
  nameOf: (row: any) => string
}

// 画像面板：饼图（客户数分布）+ 明细表（客户数/成交数/成交率）
const PortraitPanel: React.FC<PortraitPanelProps> = ({ queryParams, loader, nameOf }) => {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const resp = await loader({ reqVO: queryParams })
      if (resp.code === 0) {
        setData(resp.data || [])
      }
    }
    load()
  }, [queryParams, loader])

  const option = useMemo(
    () => ({
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [
        {
          type: 'pie',
          radius: ['40%', '65%'],
          data: data.map((row) => ({ name: nameOf(row), value: row.customerCount }))
        }
      ]
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  )

  const columns: ProColumns<any>[] = [
    {
      title: '分类',
      dataIndex: 'name',
      align: 'center',
      render: (_, r) => nameOf(r)
    },
    { title: '客户数', dataIndex: 'customerCount', align: 'center' },
    { title: '成交数', dataIndex: 'dealCount', align: 'center' },
    {
      title: '成交率',
      align: 'center',
      render: (_, r) =>
        r.customerCount ? `${(((r.dealCount || 0) / r.customerCount) * 100).toFixed(2)}%` : '0%'
    }
  ]

  return (
    <>
      <ReactECharts option={option} style={{ height: 320, marginBottom: 16 }} />
      <ProTable
        columns={columns}
        dataSource={data}
        rowKey={(r) => nameOf(r)}
        search={false}
        options={false}
        pagination={false}
      />
    </>
  )
}

// 客户画像：地区、行业、等级、来源四个维度的客户与成交分布
const PortraitAnalysis: React.FC = () => {
  const [queryParams, setQueryParams] = useState<any>(defaultParams())

  const dictText = (map: Record<string, any>, value: any) =>
    (map[value as keyof typeof map] as any)?.text || map[value]?.text || String(value ?? '-')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <StatFilter onQuery={setQueryParams} />
      <Card>
        <Tabs
          destroyInactiveTabPane
          items={[
            {
              key: 'area',
              label: '地区画像',
              children: (
                <PortraitPanel
                  queryParams={queryParams}
                  loader={getCustomerAreaSummary}
                  nameOf={(r) => r.areaName || '未知地区'}
                />
              )
            },
            {
              key: 'industry',
              label: '行业画像',
              children: (
                <PortraitPanel
                  queryParams={queryParams}
                  loader={getCustomerIndustrySummary}
                  nameOf={(r) => dictText(INDUSTRY_LIST as any, r.industryId)}
                />
              )
            },
            {
              key: 'level',
              label: '等级画像',
              children: (
                <PortraitPanel
                  queryParams={queryParams}
                  loader={getCustomerLevelSummary}
                  nameOf={(r) => dictText(CUSTOMER_LEVEL as any, r.level)}
                />
              )
            },
            {
              key: 'source',
              label: '来源画像',
              children: (
                <PortraitPanel
                  queryParams={queryParams}
                  loader={getCustomerSourceSummary}
                  nameOf={(r) => dictText(CUSTOMER_SOURCE as any, r.source)}
                />
              )
            }
          ]}
        />
      </Card>
    </div>
  )
}

export default PortraitAnalysis
