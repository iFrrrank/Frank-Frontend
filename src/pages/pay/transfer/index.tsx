import React, { useRef } from 'react'
import { message, Space } from 'antd'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { tableActionStyle } from '@/styles/common.style'
import { getTransferPage } from '@/api/pay/transfer'
import { PAY_TRANSFER_STATUS, PAY_TRANSFER_TYPE, PAY_CHANNEL } from '@/utils/constantsValue'

const PayTransferManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)

  const columns: ProColumns<API.PayTransferRespVO>[] = [
    {
      title: '编号',
      dataIndex: 'id',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '转账单号',
      dataIndex: 'no',
      align: 'center',
      width: 100,
      fieldProps: { placeholder: '请输入转账单号' }
    },
    {
      title: '商户单号',
      dataIndex: 'merchantOrderId',
      hideInTable: true,
      fieldProps: { placeholder: '请输入商户单号' }
    },
    {
      title: '类型',
      dataIndex: 'type',
      valueType: 'select',
      hideInTable: true,
      fieldProps: { placeholder: '请选择类型' },
      valueEnum: PAY_TRANSFER_TYPE
    },
    {
      title: '渠道单号',
      dataIndex: 'channelOrderNo',
      hideInTable: true,
      fieldProps: { placeholder: '请输入渠道单号' }
    },
    {
      title: '转账标题',
      dataIndex: 'subject',
      align: 'center',
      width: 100,
      hideInSearch: true,
      ellipsis: true
    },
    {
      title: '支付应用',
      dataIndex: 'appName',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '转账金额',
      dataIndex: 'price',
      align: 'center',
      width: 100,
      hideInSearch: true,
      renderText: (val) => (val ? `￥${(val / 100).toFixed(2)}` : '￥0.00')
    },
    {
      title: '转账渠道',
      dataIndex: 'channelCode',
      valueType: 'select',
      valueEnum: PAY_CHANNEL,
      align: 'center',
      width: 100,
      fieldProps: { placeholder: '请选择支付渠道' }
    },
    {
      title: '转账状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: PAY_TRANSFER_STATUS,
      align: 'center',
      width: 100,
      fieldProps: { placeholder: '请选择转账状态' }
    },
    {
      title: '转账成功时间',
      dataIndex: 'successTime',
      valueType: 'dateTime',
      align: 'center',
      width: 100,
      hideInSearch: true,
      renderText: (val) => val || '-'
    },
    {
      title: '收款人姓名',
      dataIndex: 'payeeName',
      align: 'center',
      width: 100,
      fieldProps: { placeholder: '请输入收款人姓名' },
      renderText: (val) => val || '-'
    },
    {
      title: '收款人账号',
      dataIndex: 'payeeAccount',
      align: 'center',
      width: 100,
      fieldProps: { placeholder: '请输入收款人账号' },
      renderText: (val) => val || '-'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      align: 'center',
      width: 100,
      fieldProps: { placeholder: ['开始日期', '结束日期'] }
    },
    {
      title: '操作',
      valueType: 'option',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" style={tableActionStyle}>
          <a onClick={() => message.info(`查看详情：${record.id}`)}>详情</a>
        </Space>
      )
    }
  ]

  return (
    <ProTable<API.PayTransferRespVO>
      headerTitle="转账订单"
      actionRef={actionRef}
      rowKey="id"
      form={{ colon: false }}
      columns={columns}
      search={{
        labelWidth: 80,
        span: 6
      }}
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
          const res = await getTransferPage(req as any)
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

export default PayTransferManagement
