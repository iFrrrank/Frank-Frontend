import React from 'react'
import { Card } from 'antd'
import {
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormTreeSelect
} from '@ant-design/pro-components'
import dayjs from 'dayjs'
import { getSimpleDeptList } from '@/api/system/dept'
import { getSimpleUserList } from '@/api/system/user'
import { buildTreeData } from '@/utils/tree'

interface StatFilterProps {
  // 查询条件变化时回调：times 为 [开始, 结束] 的字符串数组
  onQuery: (params: any) => void
  // 是否展示负责人筛选（部分统计按部门汇总时不需要）
  showUser?: boolean
}

// CRM 统计页通用筛选：时间范围 + 部门 + 负责人，产出各统计接口共用的 reqVO 结构
const StatFilter: React.FC<StatFilterProps> = ({ onQuery, showUser = true }) => {
  return (
    <Card styles={{ body: { paddingBottom: 0 } }}>
      <ProForm
        layout="inline"
        submitter={{ searchConfig: { submitText: '查询', resetText: '重置' } }}
        initialValues={{
          // 默认统计本月
          dateRange: [dayjs().startOf('month'), dayjs()]
        }}
        onFinish={async (values) => {
          let times: string[] = []
          if (values.dateRange && values.dateRange.length === 2) {
            times = [
              dayjs(values.dateRange[0]).format('YYYY-MM-DD') + ' 00:00:00',
              dayjs(values.dateRange[1]).format('YYYY-MM-DD') + ' 23:59:59'
            ]
          }
          onQuery({ ...values, times, dateRange: undefined })
          return true
        }}
        onReset={() => {
          onQuery({
            times: [
              dayjs().startOf('month').format('YYYY-MM-DD') + ' 00:00:00',
              dayjs().format('YYYY-MM-DD') + ' 23:59:59'
            ]
          })
        }}
      >
        <ProFormDateRangePicker
          name="dateRange"
          label="时间范围"
          fieldProps={{ allowClear: false }}
        />
        <ProFormTreeSelect
          name="deptId"
          label="部门"
          width={200}
          placeholder="请选择部门"
          request={async () => {
            const resp = await getSimpleDeptList()
            return buildTreeData((resp.data as any[]) || []) as any
          }}
          fieldProps={{ allowClear: true }}
        />
        {showUser && (
          <ProFormSelect
            name="userId"
            label="负责人"
            width={200}
            placeholder="请选择负责人"
            request={async () => {
              const resp = await getSimpleUserList()
              return (
                (resp.data as any[])?.map((item: any) => ({
                  label: item.nickname,
                  value: item.id
                })) || []
              )
            }}
          />
        )}
      </ProForm>
    </Card>
  )
}

export default StatFilter
