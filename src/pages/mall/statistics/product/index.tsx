import React, { useEffect, useState } from 'react'
import { Card, DatePicker, Image } from 'antd'
import { PageContainer, ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import {
  getProductStatisticsAnalyse,
  getProductStatisticsList,
  getProductStatisticsRankPage
} from '@/api/mall/statistics/product'

// 金额（分）转元展示
const fenToYuan = (price?: number) => `￥${((price || 0) / 100).toFixed(2)}`

// 商品统计：时段汇总（与对照期并列）、按天明细、商品排行榜
const ProductStatistics: React.FC = () => {
  const [range, setRange] = useState<[Dayjs, Dayjs]>([dayjs().subtract(29, 'day'), dayjs()])
  const [analyse, setAnalyse] = useState<API.StatisticsComparison<API.ProductStatisticsRespVO>>()
  const [list, setList] = useState<API.ProductStatisticsRespVO[]>([])

  const timesParam = (times: [Dayjs, Dayjs]) => ({
    times: [times[0].format('YYYY-MM-DD') + ' 00:00:00', times[1].format('YYYY-MM-DD') + ' 23:59:59']
  })

  const load = async (times: [Dayjs, Dayjs]) => {
    const params = timesParam(times)
    const [analyseResp, listResp] = await Promise.all([
      getProductStatisticsAnalyse(params),
      getProductStatisticsList(params)
    ])
    if (analyseResp.code === 0) {
      setAnalyse(analyseResp.data)
    }
    if (listResp.code === 0) {
      setList(listResp.data || [])
    }
  }

  useEffect(() => {
    load(range)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const summaryMetrics: { title: string; field: keyof API.ProductStatisticsRespVO; money?: boolean }[] = [
    { title: '浏览量', field: 'browseCount' },
    { title: '浏览用户数', field: 'browseUserCount' },
    { title: '收藏数', field: 'favoriteCount' },
    { title: '加购数', field: 'cartCount' },
    { title: '下单数', field: 'orderCount' },
    { title: '支付数', field: 'orderPayCount' },
    { title: '支付金额', field: 'orderPayPrice', money: true },
    { title: '售后退款金额', field: 'afterSaleRefundPrice', money: true }
  ]

  const listColumns: ProColumns<API.ProductStatisticsRespVO>[] = [
    { title: '日期', dataIndex: 'day', align: 'center', width: 110 },
    { title: '浏览量', dataIndex: 'browseCount', align: 'center' },
    { title: '浏览用户数', dataIndex: 'browseUserCount', align: 'center' },
    { title: '收藏数', dataIndex: 'favoriteCount', align: 'center' },
    { title: '加购数', dataIndex: 'cartCount', align: 'center' },
    { title: '下单数', dataIndex: 'orderCount', align: 'center' },
    { title: '支付数', dataIndex: 'orderPayCount', align: 'center' },
    {
      title: '支付金额',
      dataIndex: 'orderPayPrice',
      align: 'center',
      render: (_, r) => fenToYuan(r.orderPayPrice)
    },
    { title: '售后数', dataIndex: 'afterSaleCount', align: 'center' },
    {
      title: '售后退款金额',
      dataIndex: 'afterSaleRefundPrice',
      align: 'center',
      render: (_, r) => fenToYuan(r.afterSaleRefundPrice)
    }
  ]

  const rankColumns: ProColumns<API.ProductStatisticsRespVO>[] = [
    {
      title: '商品',
      dataIndex: 'spuName',
      width: 240,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Image src={record.spuPicUrl} width={36} height={36} preview={false} />
          <span>{record.spuName}</span>
        </div>
      )
    },
    { title: '浏览量', dataIndex: 'browseCount', align: 'center', sorter: true },
    { title: '浏览用户数', dataIndex: 'browseUserCount', align: 'center' },
    { title: '收藏数', dataIndex: 'favoriteCount', align: 'center' },
    { title: '加购数', dataIndex: 'cartCount', align: 'center' },
    { title: '下单数', dataIndex: 'orderCount', align: 'center' },
    { title: '支付数', dataIndex: 'orderPayCount', align: 'center' },
    {
      title: '支付金额',
      dataIndex: 'orderPayPrice',
      align: 'center',
      render: (_, r) => fenToYuan(r.orderPayPrice)
    },
    {
      title: '浏览转化率',
      dataIndex: 'browseConvertPercent',
      align: 'center',
      render: (_, r) => `${r.browseConvertPercent ?? 0}%`
    }
  ]

  return (
    <PageContainer header={{ title: false }}>
      <Card style={{ marginBottom: 16 }}>
        <DatePicker.RangePicker
          value={range}
          onChange={(values) => {
            if (values && values[0] && values[1]) {
              const next: [Dayjs, Dayjs] = [values[0], values[1]]
              setRange(next)
              load(next)
            }
          }}
          allowClear={false}
        />
      </Card>

      {/* 时段汇总：本期与对照期两行对照展示 */}
      <ProTable<API.ProductStatisticsRespVO>
        headerTitle="商品数据汇总（本期 / 对照期）"
        columns={[
          { title: '口径', dataIndex: 'label', width: 100, align: 'center' },
          ...summaryMetrics.map((m) => ({
            title: m.title,
            dataIndex: m.field as string,
            align: 'center' as const,
            render: (_: any, r: any) => (m.money ? fenToYuan(r[m.field]) : r[m.field] ?? 0)
          }))
        ]}
        dataSource={[
          { ...(analyse?.value || {}), id: 1, label: '本期' } as any,
          { ...(analyse?.reference || {}), id: 2, label: '对照期' } as any
        ]}
        rowKey="id"
        search={false}
        options={false}
        pagination={false}
        style={{ marginBottom: 16 }}
      />

      <ProTable<API.ProductStatisticsRespVO>
        headerTitle="商品状况明细"
        columns={listColumns}
        dataSource={list}
        rowKey={(r) => `${r.day}-${r.spuId}`}
        search={false}
        options={false}
        pagination={false}
        style={{ marginBottom: 16 }}
      />

      <ProTable<API.ProductStatisticsRespVO>
        headerTitle="商品排行榜"
        columns={rankColumns}
        rowKey="spuId"
        search={false}
        request={async (params) => {
          const resp = await getProductStatisticsRankPage({
            pageNo: params.current || 1,
            pageSize: params.pageSize || 10,
            ...timesParam(range)
          } as any)
          return {
            data: resp.data?.list || [],
            success: true,
            total: resp.data?.total || 0
          }
        }}
        pagination={{ align: 'center', showSizeChanger: true }}
      />
    </PageContainer>
  )
}

export default ProductStatistics
