import React, { useRef } from 'react'
import { message } from 'antd'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import BargainRecordDetail, { handleOpenBargainRecordDetail } from './BargainRecordDetail'
import { tableActionStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { getBargainRecordPage } from '@/api/mall/promotion/bargain/record'
import { BARGAIN_RECORD_STATUS } from '@/utils/constantsValue'

const BargainRecordManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)

  const columns: ProColumns<any>[] = [
    {
      title: '砍价ID',
      dataIndex: 'id',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '订单编号',
      dataIndex: 'orderId',
      align: 'center',
      width: 120,
      hideInSearch: true,
      render: (val: any) => (val ? <a>{val}</a> : '-')
    },
    {
      title: '砍价活动',
      dataIndex: 'activityName',
      align: 'center',
      width: 120,
      hideInSearch: true,
      ellipsis: true
    },
    {
      title: '砍价状态',
      dataIndex: 'status',
      valueType: 'select',
      hideInTable: true,
      fieldProps: { placeholder: '请选择砍价状态' },
      valueEnum: BARGAIN_RECORD_STATUS
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInTable: true,
      fieldProps: { placeholder: ['开始日期', '结束日期'] }
    },
    {
      title: '发起用户',
      dataIndex: 'nickname',
      align: 'center',
      width: 120,
      hideInSearch: true,
      render: (_, record) => <span>{record.nickname || record.userId}</span>
    },
    {
      title: '最低价',
      dataIndex: 'bargainMinPrice',
      valueType: 'money',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '当前价',
      dataIndex: 'bargainPrice',
      valueType: 'money',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '总砍价次数',
      dataIndex: 'helpCount',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '剩余砍价次数',
      dataIndex: 'remainHelpCount',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '发起时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      valueType: 'dateTime',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: textConst.table.action,
      valueType: 'option',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a key="detail" onClick={() => handleOpenBargainRecordDetail(record)}>
            {textConst.action.detail}
          </a>
        </div>
      )
    }
  ]

  return (
    <>
    <ProTable<any>
      headerTitle="砍价记录列表"
      actionRef={actionRef}
      rowKey="id"
      form={{ colon: false }}
      columns={columns}
      search={{ labelWidth: 'auto', span: 6 }}
      request={async (params) => {
        const { current, pageSize, createTime, ...rest } = params
        const req = {
          pageNo: current || 1,
          pageSize: pageSize || 10,
          startTime: createTime?.[0] ? createTime[0] + ' 00:00:00' : undefined,
          endTime: createTime?.[1] ? createTime[1] + ' 23:59:59' : undefined,
          ...rest
        }
        try {
          const res = await getBargainRecordPage(req as any)
          return {
            data: res.data?.list || [],
            success: res.code === 0,
            total: res.data?.total || 0
          }
        } catch (error) {
          return { data: [], success: false, total: 0 }
        }
      }}
      pagination={{ align: 'center', showSizeChanger: true }}
    />
      <BargainRecordDetail />
    </>
  )
}

export default BargainRecordManagement
