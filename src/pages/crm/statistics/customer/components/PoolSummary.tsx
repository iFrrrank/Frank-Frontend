import React, { useState, useEffect, useRef } from 'react'
import { ProCard, ProTable, ProColumns, ActionType } from '@ant-design/pro-components'
import ReactECharts from 'echarts-for-react'
import { getCustomerSummaryByDate, getCustomerSummaryByUser } from '@/api/crm/statistics/customer'

interface TabProps {
  queryParams: any
}

const PoolSummary: React.FC<TabProps> = ({ queryParams }) => {
  const [chartData, setChartData] = useState<any[]>([])
  const [chartLoading, setChartLoading] = useState<boolean>(false)
  const tableActionRef = useRef<ActionType>(undefined)

  // 1. 监听父组件查询参数变化，获取上方图表数据
  useEffect(() => {
    if (Object.keys(queryParams).length === 0) return

    const fetchChartData = async () => {
      setChartLoading(true)
      try {
        // 请求按日期维度的图表数据
        const res = await getCustomerSummaryByDate({ reqVO: queryParams } as any)
        setChartData(res?.data || [])
      } finally {
        setChartLoading(false)
      }
    }

    fetchChartData()
    tableActionRef.current?.reload()
  }, [queryParams])

  const getChartOptions = () => {
    if (!chartData || chartData.length === 0) {
      return { title: { text: '暂无图表数据', left: 'center', top: 'center' } }
    }

    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['新增客户数', '成交客户数'], top: '0%' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: chartData.map((item) => item.time),
        axisTick: { alignWithLabel: true }
      },
      yAxis: [
        { type: 'value', name: '新增客户数', position: 'left' },
        { type: 'value', name: '成交客户数', position: 'right' }
      ],
      series: [
        {
          name: '新增客户数',
          type: 'bar',
          barWidth: '30%',
          itemStyle: { color: '#5470c6' },
          data: chartData.map((item) => item.customerCreateCount)
        },
        {
          name: '成交客户数',
          type: 'bar',
          yAxisIndex: 1,
          barWidth: '30%',
          itemStyle: { color: '#91cc75' },
          data: chartData.map((item) => item.customerDealCount)
        }
      ]
    }
  }

  const columns: ProColumns<any>[] = [
    { title: '序号', dataIndex: 'index', valueType: 'indexBorder', width: 60, align: 'center' },
    { title: '员工姓名', dataIndex: 'ownerUserName', align: 'center' },
    { title: '新增客户数', dataIndex: 'customerCreateCount', align: 'center' },
    { title: '成交客户数', dataIndex: 'customerDealCount', align: 'center' },
    { title: '客户成交率(%)', dataIndex: 'contractTotalAmount', align: 'center' },
    { title: '合同总金额', dataIndex: 'contractPrice', align: 'center', valueType: 'money' },
    { title: '回款金额', dataIndex: 'receivablePrice', align: 'center', valueType: 'money' }
  ]

  return (
    <>
      <ProCard style={{ marginTop: 16, marginBottom: 24 }} bodyStyle={{ padding: 0 }}>
        <ReactECharts
          option={getChartOptions()}
          style={{ height: 400, width: '100%' }}
          notMerge={true}
          showLoading={chartLoading}
        />
      </ProCard>

      <ProTable<any>
        actionRef={tableActionRef}
        rowKey={(record) => record.id || Math.random().toString()}
        columns={columns}
        search={false}
        options={false}
        pagination={{ defaultPageSize: 10, showSizeChanger: true, align: 'center' }}
        request={async (params) => {
          if (Object.keys(queryParams).length === 0) return { data: [], success: true }

          const reqVO = { pageNo: params.current, pageSize: params.pageSize, ...queryParams }
          try {
            const res = await getCustomerSummaryByUser({ reqVO } as any)
            const listData = Array.isArray(res?.data) ? res.data : res?.data?.list || []
            return { data: listData, success: true, total: res?.data?.total || listData.length }
          } catch (error) {
            return { data: [], success: false }
          }
        }}
        locale={{ emptyText: '暂无数据' }}
      />
    </>
  )
}

export default PoolSummary
