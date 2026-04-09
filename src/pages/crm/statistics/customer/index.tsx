import React, { useState } from 'react'
import { Card, Tabs } from 'antd'
import { ProForm, ProFormDateRangePicker, ProFormSelect } from '@ant-design/pro-components'
import dayjs from 'dayjs'
import CustomerSummary from './components/CustomerSummary'
import FollowUpCount from './components/FollowUpCount'
import FollowUpType from './components/FollowUpType'
import ContractSummary from './components/ContractSummary'
import PoolSummary from './components/PoolSummary'
import DealCycleByUser from './components/DealCycleByUser'
import DealCycleByArea from './components/DealCycleByArea'
import DealCycleByProduct from './components/DealCycleByProduct'

const CustomerAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('1')
  const [queryParams, setQueryParams] = useState<any>({})

  const tabItems = [
    {
      key: '1',
      label: '客户总量分析',
      children: <CustomerSummary queryParams={queryParams} />
    },
    {
      key: '2',
      label: '客户跟进次数分析',
      children: <FollowUpCount queryParams={queryParams} />
    },
    {
      key: '3',
      label: '客户跟进方式分析',
      children: <FollowUpType queryParams={queryParams} />
    },
    {
      key: '4',
      label: '客户转化率分析',
      children: <ContractSummary queryParams={queryParams} />
    },
    { key: '5', label: '公海客户分析', children: <PoolSummary queryParams={queryParams} /> },
    {
      key: '6',
      label: '员工客户成交周期分析',
      children: <DealCycleByUser queryParams={queryParams} />
    },
    {
      key: '7',
      label: '地区客户成交周期分析',
      children: <DealCycleByArea queryParams={queryParams} />
    },
    {
      key: '8',
      label: '产品客户成交周期分析',
      children: <DealCycleByProduct queryParams={queryParams} />
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card styles={{ body: { paddingBottom: 0 } }}>
        <ProForm
          layout="inline"
          submitter={{ searchConfig: { submitText: '查询', resetText: '重置' } }}
          onFinish={async (values) => {
            let times: string[] = []
            if (values.dateRange && values.dateRange.length === 2) {
              times = [
                dayjs(values.dateRange[0]).format('YYYY-MM-DD HH:mm:ss'),
                dayjs(values.dateRange[1]).format('YYYY-MM-DD HH:mm:ss')
              ]
            }
            setQueryParams({ ...values, times, dateRange: undefined })
            return true
          }}
        >
          <ProFormDateRangePicker
            name="dateRange"
            label="时间范围"
            fieldProps={{ allowClear: false }}
          />
        </ProForm>
      </Card>

      <Card styles={{ body: { paddingTop: 0 } }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          destroyInactiveTabPane
        />
      </Card>
    </div>
  )
}

export default CustomerAnalysis
