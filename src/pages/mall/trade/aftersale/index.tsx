import React, { useRef, useState } from 'react'
import { message, Space } from 'antd'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { tableActionStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { getAfterSalePage } from '@/api/mall/trade/afterSale'
import { AFTERSALE_STATUS, AFTERSALE_WAY, AFTERSALE_TYPE } from '@/utils/constantsValue'

const AfterSaleManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)

  const columns: ProColumns<any>[] = [
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      align: 'center',
      width: 120,
      fieldProps: { placeholder: '请输入订单编号' }
    },
    {
      title: '退款编号',
      dataIndex: 'no',
      align: 'center',
      width: 120,
      fieldProps: { placeholder: '请输入退款编号' }
    },
    {
      title: '商品名称',
      dataIndex: 'spuName',
      align: 'center',
      width: 120,
      fieldProps: { placeholder: '请输入商品 SPU 名称' }
    },
    {
      title: '商品信息',
      dataIndex: 'spuName',
      align: 'center',
      hideInSearch: true,
      width: 250,
      render: (_, record) => (
        <div>
          {record.picUrl && <img src={record.picUrl} />}
          <div>
            <div>{record.spuName || '-'}</div>
            {record.properties && (
              <div>{record.properties.map((p: any) => p.valueName).join(' ')}</div>
            )}
          </div>
        </div>
      )
    },
    {
      title: '买家',
      dataIndex: 'user',
      align: 'center',
      width: 120,
      hideInSearch: true,
      render: (_, record) => (
        <div>
          <div>{record.userNickname || '-'}</div>
          {record.userMobile && <div>{record.userMobile}</div>}
        </div>
      )
    },
    {
      title: '售后状态',
      dataIndex: 'status',
      valueType: 'select',
      align: 'center',
      width: 120,
      fieldProps: { placeholder: '请选择售后状态' },
      valueEnum: AFTERSALE_STATUS
    },
    {
      title: '售后类型',
      dataIndex: 'type',
      align: 'center',
      width: 120,
      valueType: 'select',
      fieldProps: { placeholder: '请选择售后类型' },
      valueEnum: AFTERSALE_TYPE
    },
    {
      title: '售后方式',
      dataIndex: 'way',
      valueType: 'select',
      align: 'center',
      width: 120,
      fieldProps: { placeholder: '请选择售后方式' },
      valueEnum: AFTERSALE_WAY
    },
    {
      title: '订单金额',
      dataIndex: 'refundPrice',
      valueType: 'money',
      align: 'center',
      width: 120,
      hideInSearch: true,
      renderText: (val) => val / 100
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInTable: true,
      align: 'center',
      width: 120,
      fieldProps: { placeholder: ['开始日期', '结束日期'] }
    },
    {
      title: textConst.table.action,
      valueType: 'option',
      width: 150,
      align: 'center',
      fixed: 'right',
      render: (_, record) => {
        const isPending = record.status === 10
        const isReceiving = record.status === 30
        const isRefunding = record.status === 40

        return (
          <Space size="small" style={tableActionStyle}>
            <a onClick={() => message.info(`查看详情：${record.id}`)}>详情</a>
            {isPending && <a onClick={() => message.info('打开同意/拒绝弹窗')}>审核</a>}
            {isReceiving && <a onClick={() => message.info('打开确认收货弹窗')}>收货</a>}
            {isRefunding && <a onClick={() => message.info('打开确认退款弹窗')}>退款</a>}
          </Space>
        )
      }
    }
  ]

  return (
    <ProTable<any>
      headerTitle="售后退款列表"
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
          const res = await getAfterSalePage(req as any)
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

export default AfterSaleManagement
