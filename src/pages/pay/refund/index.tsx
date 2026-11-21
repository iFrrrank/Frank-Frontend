import React, { useRef } from 'react'
import RefundDetail, { handleOpenRefundDetail } from './RefundDetail'
import { message, Button, Space } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable, ProFormInstance } from '@ant-design/pro-components'
import { tableActionStyle } from '@/styles/common.style'
import { getRefundPage, exportRefundExcel } from '@/api/pay/refund'
import { getAppList } from '@/api/pay/app'
import { PAY_CHANNEL, PAY_REFUND_STATUS } from '@/utils/constantsValue'
import { textConst } from '@/locales/zh-CN'
import { handleExport } from '@/components/Export'

const PayRefundManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  const handleExportBtnClick = () => {
    // 获取表单当前的值
    const formValues = formRef.current?.getFieldsValue?.() || {}
    handleExport({
      exportApi: exportRefundExcel,
      exportParams: { ...formValues },
      fileName: '退款订单.xlsx'
    })
  }

  const columns: ProColumns<API.PayRefundPageItemRespVO>[] = [
    {
      title: '应用编号',
      dataIndex: 'appId',
      valueType: 'select',
      hideInTable: true,
      fieldProps: { placeholder: '请选择应用信息' },
      request: async () => {
        const resp = await getAppList()
        return resp.data?.map((item: any) => ({ label: item.name, value: item.id })) || []
      }
    },
    {
      title: '商户支付单号',
      dataIndex: 'merchantOrderId',
      hideInTable: true,
      fieldProps: { placeholder: '请输入商户支付单号' }
    },
    {
      title: '商户退款单号',
      dataIndex: 'merchantRefundId',
      hideInTable: true,
      fieldProps: { placeholder: '请输入商户退款单号' }
    },
    {
      title: '渠道支付单号',
      dataIndex: 'channelOrderNo',
      hideInTable: true,
      fieldProps: { placeholder: '请输入渠道支付单号' }
    },
    {
      title: '渠道退款单号',
      dataIndex: 'channelRefundNo',
      hideInTable: true,
      fieldProps: { placeholder: '请输入渠道退款单号' }
    },
    {
      title: '编号',
      dataIndex: 'id',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '支付订单号',
      dataIndex: 'orderNo',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '退款订单号',
      dataIndex: 'no',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '支付金额',
      dataIndex: 'payPrice',
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
      title: '退款金额',
      dataIndex: 'refundPrice',
      align: 'center',
      width: 120,
      hideInSearch: true,
      renderText: (val) => (val ? `￥${(val / 100).toFixed(2)}` : '￥0.00')
    },
    {
      title: '退款状态',
      dataIndex: 'status',
      valueType: 'select',
      align: 'center',
      width: 120,
      valueEnum: PAY_REFUND_STATUS,
      fieldProps: { placeholder: '请选择退款状态' }
    },
    {
      title: '退款渠道',
      dataIndex: 'channelCode',
      valueType: 'select',
      valueEnum: PAY_CHANNEL,
      fieldProps: { placeholder: '请选择退款渠道' },
      align: 'center',
      width: 120
    },
    {
      title: '成功时间',
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
          <a onClick={() => handleOpenRefundDetail(record)}>
            {textConst.action.detail}
          </a>
        </Space>
      )
    }
  ]

  return (
    <>
      <ProTable<API.PayRefundPageItemRespVO>
      headerTitle="退款订单"
      actionRef={actionRef}
      rowKey="id"
      form={{ colon: false }}
      columns={columns}
      search={{
        labelWidth: 100,
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
          const res = await getRefundPage(req as any)
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

      <RefundDetail />
    </>
  )
}

export default PayRefundManagement
