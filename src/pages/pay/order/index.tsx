import React, { useRef } from 'react'
import OrderDetail, { handleOpenOrderDetail } from './OrderDetail'
import { message, Button, Space } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable, ProFormInstance } from '@ant-design/pro-components'
import { tableActionStyle } from '@/styles/common.style'
import { getOrderPage, exportOrderExcel } from '@/api/pay/order'
import { textConst } from '@/locales/zh-CN'
import { handleExport } from '@/components/Export'
import { PAY_CHANNEL, PAY_ORDER_STATUS } from '@/utils/constantsValue'

const PayOrderManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  const handleExportBtnClick = () => {
    // 获取表单当前的值
    const formValues = formRef.current?.getFieldsValue?.() || {}
    handleExport({
      exportApi: exportOrderExcel,
      exportParams: { ...formValues },
      fileName: '支付订单.xlsx'
    })
  }

  const columns: ProColumns<any>[] = [
    {
      title: '应用编号',
      dataIndex: 'appId',
      valueType: 'select',
      hideInTable: true,
      fieldProps: { placeholder: '请选择应用信息' },
      request: async () => {
        // TODO
        return []
      }
    },
    {
      title: '商户单号',
      dataIndex: 'merchantOrderId',
      hideInTable: true,
      fieldProps: { placeholder: '请输入商户单号' }
    },
    {
      title: '支付单号',
      dataIndex: 'no',
      hideInTable: true,
      fieldProps: { placeholder: '请输入支付单号' }
    },
    {
      title: '渠道单号',
      dataIndex: 'channelOrderNo',
      hideInTable: true,
      fieldProps: { placeholder: '请输入渠道单号' }
    },
    {
      title: '编号',
      dataIndex: 'id',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '订单号',
      dataIndex: 'merchantOrderId',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '商品标题',
      dataIndex: 'subject',
      align: 'center',
      width: 120,
      hideInSearch: true,
      ellipsis: true
    },
    {
      title: '支付金额',
      dataIndex: 'price',
      align: 'center',
      width: 120,
      hideInSearch: true,
      renderText: (val) => (val ? `￥${(val / 100).toFixed(2)}` : '￥0.00')
    },
    {
      title: '退款金额',
      dataIndex: 'refundPrice',
      align: 'center',
      width: 120,
      hideInSearch: true,
      renderText: (val) => (val ? `￥${(val / 100).toFixed(2)}` : '￥0.00')
    },
    {
      title: '手续金额',
      dataIndex: 'channelFeePrice',
      align: 'center',
      width: 120,
      hideInSearch: true,
      renderText: (val) => (val ? `￥${(val / 100).toFixed(2)}` : '￥0.00')
    },
    {
      title: '支付应用',
      dataIndex: 'appName',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '支付状态',
      dataIndex: 'status',
      align: 'center',
      width: 120,
      valueType: 'select',
      valueEnum: PAY_ORDER_STATUS,
      fieldProps: { placeholder: '请选择支付状态' }
    },
    {
      title: '支付渠道',
      dataIndex: 'channelCode',
      align: 'center',
      width: 120,
      valueType: 'select',
      valueEnum: PAY_CHANNEL,
      fieldProps: { placeholder: '请选择支付渠道' }
    },
    {
      title: '支付时间',
      dataIndex: 'successTime',
      valueType: 'dateTime',
      align: 'center',
      width: 120,
      hideInSearch: true,
      renderText: (val) => val || '-'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      align: 'center',
      width: 120,
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
          <a onClick={() => handleOpenOrderDetail(record)}>{textConst.action.detail}</a>
        </Space>
      )
    }
  ]

  return (
    <>
      <ProTable<any>
      headerTitle="支付订单"
      actionRef={actionRef}
      rowKey="id"
      form={{ colon: false }}
      columns={columns}
      search={{
        labelWidth: 'auto',
        span: 6
      }}
      toolBarRender={() => [
        <Button
          key="export"
          color="volcano"
          variant="outlined"
          icon={<DownloadOutlined />}
          onClick={handleExportBtnClick}
        >
          {textConst.action.export}
        </Button>
      ]}
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
          const res = await getOrderPage(req as any)
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

      <OrderDetail />
    </>
  )
}

export default PayOrderManagement
