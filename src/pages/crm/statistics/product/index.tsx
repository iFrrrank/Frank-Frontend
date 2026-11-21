import React, { useEffect, useMemo, useState } from 'react'
import { Card, Tabs } from 'antd'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import ReactECharts from 'echarts-for-react'
import dayjs from 'dayjs'
import StatFilter from '../components/StatFilter'
import { getProductCategorySummary, getProductSalesList } from '@/api/crm/statistics/product'

// 默认统计本月
const defaultParams = () => ({
  times: [
    dayjs().startOf('month').format('YYYY-MM-DD') + ' 00:00:00',
    dayjs().format('YYYY-MM-DD') + ' 23:59:59'
  ]
})

// 产品分析：产品销售明细（合同维度）与产品分类汇总
const ProductAnalysis: React.FC = () => {
  const [queryParams, setQueryParams] = useState<any>(defaultParams())
  const [salesList, setSalesList] = useState<API.CrmStatisticsProductSalesRespVO[]>([])
  const [categoryList, setCategoryList] = useState<API.CrmStatisticsProductCategorySummaryRespVO[]>(
    []
  )

  useEffect(() => {
    const load = async () => {
      const [salesResp, categoryResp] = await Promise.all([
        getProductSalesList({ reqVO: queryParams } as any),
        getProductCategorySummary({ reqVO: queryParams } as any)
      ])
      if (salesResp.code === 0) setSalesList(salesResp.data || [])
      if (categoryResp.code === 0) setCategoryList(categoryResp.data || [])
    }
    load()
  }, [queryParams])

  const categoryOption = useMemo(
    () => ({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['产品数量', '销售金额'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: categoryList.map((i) => i.categoryName) },
      yAxis: [{ type: 'value' }, { type: 'value' }],
      series: [
        { name: '产品数量', type: 'bar', data: categoryList.map((i) => i.productCount) },
        {
          name: '销售金额',
          type: 'line',
          yAxisIndex: 1,
          data: categoryList.map((i) => i.productTotalPrice)
        }
      ]
    }),
    [categoryList]
  )

  const salesColumns: ProColumns<API.CrmStatisticsProductSalesRespVO>[] = [
    { title: '产品名称', dataIndex: 'productName', width: 160 },
    { title: '产品分类', dataIndex: 'categoryName', align: 'center', width: 120 },
    { title: '合同名称', dataIndex: 'contractName', width: 160 },
    { title: '合同编号', dataIndex: 'contractNo', align: 'center', width: 140 },
    { title: '客户名称', dataIndex: 'customerName', width: 140 },
    { title: '负责人', dataIndex: 'ownerUserName', align: 'center', width: 100 },
    {
      title: '产品单价',
      dataIndex: 'productPrice',
      align: 'center',
      width: 110,
      render: (_, r) => `￥${(r.productPrice || 0).toFixed(2)}`
    },
    { title: '产品数量', dataIndex: 'productCount', align: 'center', width: 90 },
    {
      title: '产品总价',
      dataIndex: 'productTotalPrice',
      align: 'center',
      width: 110,
      render: (_, r) => `￥${(r.productTotalPrice || 0).toFixed(2)}`
    }
  ]

  const categoryColumns: ProColumns<API.CrmStatisticsProductCategorySummaryRespVO>[] = [
    { title: '产品分类', dataIndex: 'categoryName', align: 'center' },
    { title: '合同数量', dataIndex: 'contractCount', align: 'center' },
    { title: '产品数量', dataIndex: 'productCount', align: 'center' },
    {
      title: '销售金额',
      dataIndex: 'productTotalPrice',
      align: 'center',
      render: (_, r) => `￥${(r.productTotalPrice || 0).toFixed(2)}`
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <StatFilter onQuery={setQueryParams} />
      <Card>
        <Tabs
          items={[
            {
              key: 'sales',
              label: '产品销售情况',
              children: (
                <ProTable
                  columns={salesColumns}
                  dataSource={salesList}
                  rowKey={(r) => `${r.contractId}-${r.productId}`}
                  search={false}
                  options={false}
                  pagination={{ pageSize: 10, align: 'center' }}
                  scroll={{ x: 'max-content' }}
                />
              )
            },
            {
              key: 'category',
              label: '产品分类汇总',
              children: (
                <>
                  <ReactECharts option={categoryOption} style={{ height: 320, marginBottom: 16 }} />
                  <ProTable
                    columns={categoryColumns}
                    dataSource={categoryList}
                    rowKey="categoryId"
                    search={false}
                    options={false}
                    pagination={false}
                  />
                </>
              )
            }
          ]}
        />
      </Card>
    </div>
  )
}

export default ProductAnalysis
