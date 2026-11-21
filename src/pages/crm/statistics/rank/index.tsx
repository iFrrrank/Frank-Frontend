import React, { useEffect, useMemo, useState } from 'react'
import { Card, Tabs } from 'antd'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import ReactECharts from 'echarts-for-react'
import dayjs from 'dayjs'
import StatFilter from '../components/StatFilter'
import {
  getContactsCountRank,
  getContractCountRank,
  getContractPriceRank,
  getCustomerCountRank,
  getFollowCountRank,
  getFollowCustomerCountRank,
  getProductSalesRank,
  getReceivablePriceRank
} from '@/api/crm/statistics/rank'

// 默认统计本月
const defaultParams = () => ({
  times: [
    dayjs().startOf('month').format('YYYY-MM-DD') + ' 00:00:00',
    dayjs().format('YYYY-MM-DD') + ' 23:59:59'
  ]
})

interface RankPanelProps {
  queryParams: any
  loader: (params: any) => Promise<any>
  countLabel: string
}

// 排行榜面板：横向条形图（负责人维度）+ 明细表
const RankPanel: React.FC<RankPanelProps> = ({ queryParams, loader, countLabel }) => {
  const [data, setData] = useState<API.CrmStatisticsRankRespVO[]>([])

  useEffect(() => {
    const load = async () => {
      const resp = await loader({ rankingReqVO: queryParams })
      if (resp.code === 0) {
        setData(resp.data || [])
      }
    }
    load()
  }, [queryParams, loader])

  const option = useMemo(
    () => ({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'value' },
      yAxis: {
        type: 'category',
        inverse: true,
        data: data.map((i) => i.nickname)
      },
      series: [
        {
          name: countLabel,
          type: 'bar',
          data: data.map((i) => i.count)
        }
      ]
    }),
    [data, countLabel]
  )

  const columns: ProColumns<API.CrmStatisticsRankRespVO>[] = [
    {
      title: '排名',
      align: 'center',
      width: 70,
      render: (_, __, index) => index + 1
    },
    { title: '负责人', dataIndex: 'nickname', align: 'center' },
    { title: '部门', dataIndex: 'deptName', align: 'center' },
    { title: countLabel, dataIndex: 'count', align: 'center' }
  ]

  return (
    <>
      <ReactECharts option={option} style={{ height: 320, marginBottom: 16 }} />
      <ProTable
        columns={columns}
        dataSource={data}
        rowKey="ownerUserId"
        search={false}
        options={false}
        pagination={false}
      />
    </>
  )
}

// 数据排行榜：八个负责人维度的业务量排名
const RankAnalysis: React.FC = () => {
  const [queryParams, setQueryParams] = useState<any>(defaultParams())

  const tabs: { key: string; label: string; loader: any; countLabel: string }[] = [
    { key: 'customer', label: '客户数排行', loader: getCustomerCountRank, countLabel: '客户数' },
    { key: 'follow', label: '跟进次数排行', loader: getFollowCountRank, countLabel: '跟进次数' },
    {
      key: 'followCustomer',
      label: '跟进客户数排行',
      loader: getFollowCustomerCountRank,
      countLabel: '跟进客户数'
    },
    { key: 'contact', label: '联系人数量排行', loader: getContactsCountRank, countLabel: '联系人数' },
    { key: 'contractCount', label: '合同数量排行', loader: getContractCountRank, countLabel: '合同数' },
    { key: 'contractPrice', label: '合同金额排行', loader: getContractPriceRank, countLabel: '合同金额' },
    {
      key: 'receivablePrice',
      label: '回款金额排行',
      loader: getReceivablePriceRank,
      countLabel: '回款金额'
    },
    { key: 'productSales', label: '产品销售排行', loader: getProductSalesRank, countLabel: '销售金额' }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 排行榜按部门下全体负责人统计，不单选负责人 */}
      <StatFilter onQuery={setQueryParams} showUser={false} />
      <Card>
        <Tabs
          destroyInactiveTabPane
          items={tabs.map((tab) => ({
            key: tab.key,
            label: tab.label,
            children: (
              <RankPanel queryParams={queryParams} loader={tab.loader} countLabel={tab.countLabel} />
            )
          }))}
        />
      </Card>
    </div>
  )
}

export default RankAnalysis
