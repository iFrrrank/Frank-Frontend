import React, { useRef } from 'react'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { getBrokerageRecordPage } from '@/api/mall/trade/brokerage/record'
import { BROKERAGE_BIZ_TYPE, BROKERAGE_RECORD_STATUS } from '@/utils/constantsValue'

const BrokerageRecordManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)

  const columns: ProColumns<API.BrokerageRecordRespVO>[] = [
    {
      title: '记录 ID',
      dataIndex: 'id',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '用户编号',
      dataIndex: 'userId',
      align: 'center',
      width: 120,
      fieldProps: { placeholder: '请输入用户编号' }
    },
    {
      title: '头像',
      dataIndex: 'userAvatar',
      valueType: 'avatar',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '昵称',
      dataIndex: 'userNickname',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '业务编号',
      dataIndex: 'bizId',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '业务类型',
      dataIndex: 'bizType',
      valueType: 'select',
      align: 'center',
      width: 120,
      fieldProps: { placeholder: '请选择业务类型' },
      valueEnum: BROKERAGE_BIZ_TYPE
    },
    {
      title: '业务状态',
      dataIndex: 'status',
      valueType: 'select',
      align: 'center',
      width: 120,
      fieldProps: { placeholder: '请选择业务状态' },
      valueEnum: BROKERAGE_RECORD_STATUS
    },
    {
      title: '标题',
      dataIndex: 'title',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '金额',
      dataIndex: 'price',
      align: 'center',
      width: 120,
      hideInSearch: true,
      renderText: (val) => (val ? `￥${(val / 100).toFixed(2)}` : '￥0.00')
    },
    {
      title: '说明',
      dataIndex: 'description',
      align: 'center',
      width: 120,
      hideInSearch: true,
      ellipsis: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      align: 'center',
      width: 120,
      hideInSearch: true,
      fieldProps: { placeholder: ['开始日期', '结束日期'] }
    },
    {
      title: '解冻时间',
      dataIndex: 'unfreezeTime',
      valueType: 'dateTime',
      align: 'center',
      width: 120,
      hideInSearch: true,
      renderText: (val) => val || '-'
    }
  ]

  return (
    <ProTable<API.BrokerageRecordRespVO>
      headerTitle="佣金记录列表"
      actionRef={actionRef}
      rowKey="id"
      form={{ colon: false }}
      columns={columns}
      search={{ labelWidth: 'auto', span: 6 }}
      scroll={{ x: 'max-content' }}
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
          const res = await getBrokerageRecordPage(req as any)
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
  )
}

export default BrokerageRecordManagement
