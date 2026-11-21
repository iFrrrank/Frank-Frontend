import React, { useEffect, useMemo, useState } from 'react'
import { Card, Col, DatePicker, Row, Statistic } from 'antd'
import { PageContainer, ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import ReactECharts from 'echarts-for-react'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import {
  getMemberAnalyse,
  getMemberAreaStatisticsList,
  getMemberRegisterCountList,
  getMemberSexStatisticsList,
  getMemberTerminalStatisticsList
} from '@/api/mall/statistics/member'

// 金额（分）转元
const fenToYuan = (price?: number) => Number(((price || 0) / 100).toFixed(2))

// 终端枚举文案（商城终端：微信小程序/H5/安卓/iOS 等，与字典口径一致）
const TERMINAL_TEXT: Record<number, string> = {
  0: '未知',
  10: '微信小程序',
  20: '微信公众号',
  21: 'H5',
  30: '苹果 App',
  31: '安卓 App'
}

const SEX_TEXT: Record<number, string> = {
  0: '未知',
  1: '男',
  2: '女'
}

// 会员统计：转化分析、注册趋势、终端/性别分布、地区分布
const MemberStatistics: React.FC = () => {
  const [range, setRange] = useState<[Dayjs, Dayjs]>([dayjs().subtract(29, 'day'), dayjs()])
  const [analyse, setAnalyse] = useState<API.MemberAnalyseRespVO>()
  const [registerList, setRegisterList] = useState<API.MemberRegisterCountRespVO[]>([])
  const [terminalList, setTerminalList] = useState<API.MemberTerminalStatisticsRespVO[]>([])
  const [sexList, setSexList] = useState<API.MemberSexStatisticsRespVO[]>([])
  const [areaList, setAreaList] = useState<API.MemberAreaStatisticsRespVO[]>([])

  const loadRangeData = async (times: [Dayjs, Dayjs]) => {
    const params = {
      times: [times[0].format('YYYY-MM-DD') + ' 00:00:00', times[1].format('YYYY-MM-DD') + ' 23:59:59']
    }
    const [analyseResp, registerResp] = await Promise.all([
      getMemberAnalyse(params),
      getMemberRegisterCountList(params)
    ])
    if (analyseResp.code === 0) {
      setAnalyse(analyseResp.data)
    }
    if (registerResp.code === 0) {
      setRegisterList(registerResp.data || [])
    }
  }

  useEffect(() => {
    loadRangeData(range)
    // 终端/性别/地区分布为全局口径，加载一次
    const loadDistributions = async () => {
      const [terminalResp, sexResp, areaResp] = await Promise.all([
        getMemberTerminalStatisticsList(),
        getMemberSexStatisticsList(),
        getMemberAreaStatisticsList()
      ])
      if (terminalResp.code === 0) setTerminalList(terminalResp.data || [])
      if (sexResp.code === 0) setSexList(sexResp.data || [])
      if (areaResp.code === 0) setAreaList(areaResp.data || [])
    }
    loadDistributions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const registerOption = useMemo(
    () => ({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', boundaryGap: false, data: registerList.map((i) => i.date) },
      yAxis: { type: 'value' },
      series: [
        {
          name: '注册用户数',
          type: 'line',
          smooth: true,
          areaStyle: {},
          data: registerList.map((i) => i.count)
        }
      ]
    }),
    [registerList]
  )

  const pieOption = (title: string, data: { name: string; value: number }[]) => ({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [
      {
        name: title,
        type: 'pie',
        radius: ['40%', '65%'],
        data
      }
    ]
  })

  const areaColumns: ProColumns<API.MemberAreaStatisticsRespVO>[] = [
    { title: '地区', dataIndex: 'areaName', align: 'center' },
    { title: '用户数', dataIndex: 'userCount', align: 'center' },
    { title: '下单用户数', dataIndex: 'orderCreateUserCount', align: 'center' },
    { title: '支付用户数', dataIndex: 'orderPayUserCount', align: 'center' },
    {
      title: '支付金额',
      dataIndex: 'orderPayPrice',
      align: 'center',
      render: (_, r) => `￥${fenToYuan(r.orderPayPrice).toFixed(2)}`
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
              loadRangeData(next)
            }
          }}
          allowClear={false}
        />
      </Card>

      {/* 会员转化分析 */}
      <Row gutter={16}>
        <Col md={6} sm={12} xs={24} style={{ marginBottom: 16 }}>
          <Card>
            <Statistic title="访问用户数" value={analyse?.visitUserCount || 0} />
          </Card>
        </Col>
        <Col md={6} sm={12} xs={24} style={{ marginBottom: 16 }}>
          <Card>
            <Statistic title="下单用户数" value={analyse?.orderUserCount || 0} />
          </Card>
        </Col>
        <Col md={6} sm={12} xs={24} style={{ marginBottom: 16 }}>
          <Card>
            <Statistic title="支付用户数" value={analyse?.payUserCount || 0} />
          </Card>
        </Col>
        <Col md={6} sm={12} xs={24} style={{ marginBottom: 16 }}>
          <Card>
            <Statistic title="客单价" value={fenToYuan(analyse?.atv)} precision={2} prefix="￥" />
          </Card>
        </Col>
        <Col md={6} sm={12} xs={24} style={{ marginBottom: 16 }}>
          <Card>
            <Statistic
              title="新增注册用户（对照期口径）"
              value={analyse?.comparison?.value?.registerUserCount || 0}
            />
          </Card>
        </Col>
        <Col md={6} sm={12} xs={24} style={{ marginBottom: 16 }}>
          <Card>
            <Statistic
              title="充值用户数"
              value={analyse?.comparison?.value?.rechargeUserCount || 0}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col md={12} sm={24} xs={24}>
          <Card title="注册用户趋势" style={{ marginBottom: 16 }}>
            <ReactECharts option={registerOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col md={6} sm={24} xs={24}>
          <Card title="终端分布" style={{ marginBottom: 16 }}>
            <ReactECharts
              option={pieOption(
                '终端分布',
                terminalList.map((i) => ({
                  name: TERMINAL_TEXT[i.terminal] || `终端${i.terminal}`,
                  value: i.userCount
                }))
              )}
              style={{ height: 300 }}
            />
          </Card>
        </Col>
        <Col md={6} sm={24} xs={24}>
          <Card title="性别分布" style={{ marginBottom: 16 }}>
            <ReactECharts
              option={pieOption(
                '性别分布',
                sexList.map((i) => ({ name: SEX_TEXT[i.sex] || '未知', value: i.userCount }))
              )}
              style={{ height: 300 }}
            />
          </Card>
        </Col>
      </Row>

      <ProTable<API.MemberAreaStatisticsRespVO>
        headerTitle="地区分布"
        columns={areaColumns}
        dataSource={areaList}
        rowKey="areaId"
        search={false}
        options={false}
        pagination={false}
      />
    </PageContainer>
  )
}

export default MemberStatistics
