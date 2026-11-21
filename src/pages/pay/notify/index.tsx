import React, { useRef } from 'react'
import NotifyDetail, { handleOpenNotifyDetail } from './NotifyDetail'
import { message, Space } from 'antd'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { tableActionStyle } from '@/styles/common.style'
import { getNotifyTaskPage } from '@/api/pay/notify'
import { getAppList } from '@/api/pay/app'
import { PAY_NOTIFY_TYPE, PAY_NOTIFY_STATUS } from '@/utils/constantsValue'
import { textConst } from '@/locales/zh-CN'

const PayNotifyManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)

  const columns: ProColumns<API.PayNotifyTaskRespVO>[] = [
    {
      title: '应用编号',
      dataIndex: 'appId',
      valueType: 'select',
      align: 'center',
      fieldProps: { placeholder: '请选择应用信息' },
      request: async () => {
        const resp = await getAppList()
        return resp.data?.map((item: any) => ({ label: item.name, value: item.id })) || []
      }
    },
    {
      title: '关联编号',
      dataIndex: 'dataId',
      align: 'center',
      fieldProps: { placeholder: '请输入关联编号' }
    },
    {
      title: '商户订单编号',
      dataIndex: 'merchantOrderId',
      hideInTable: true,
      fieldProps: { placeholder: '请输入商户订单编号' }
    },
    {
      title: '商户退款编号',
      dataIndex: 'merchantRefundId',
      hideInTable: true,
      fieldProps: { placeholder: '请输入商户退款编号' }
    },
    {
      title: '商户转账编号',
      dataIndex: 'merchantTransferId',
      hideInTable: true,
      fieldProps: { placeholder: '请输入商户转账编号' }
    },
    {
      title: '通知类型',
      dataIndex: 'type',
      valueType: 'select',
      hideInTable: true,
      valueEnum: PAY_NOTIFY_TYPE,
      align: 'center',
      fieldProps: { placeholder: '请选择通知类型' }
    },
    {
      title: '通知状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: PAY_NOTIFY_STATUS,
      align: 'center',
      fieldProps: { placeholder: '请选择通知状态' }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInTable: true,
      fieldProps: { placeholder: ['开始日期', '结束日期'] }
    },
    {
      title: '任务编号',
      dataIndex: 'id',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '商户单信息',
      dataIndex: 'merchantOrderInfo',
      align: 'center',
      hideInSearch: true,
      render: (_, record) => (
        <div>
          {record.merchantOrderId && <div>订单号: {record.merchantOrderId}</div>}
          {record.merchantRefundId && <div>退款号: {record.merchantRefundId}</div>}
          {record.merchantTransferId && <div>转账号: {record.merchantTransferId}</div>}
        </div>
      )
    },
    {
      title: '最后通知时间',
      dataIndex: 'lastExecuteTime',
      valueType: 'dateTime',
      align: 'center',
      hideInSearch: true,
      renderText: (val) => val || '-'
    },
    {
      title: '下次通知时间',
      dataIndex: 'nextExecuteTime',
      valueType: 'dateTime',
      align: 'center',
      hideInSearch: true,
      renderText: (val) => val || '-'
    },
    {
      title: '通知次数',
      dataIndex: 'notifyTimes',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '操作',
      valueType: 'option',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" style={tableActionStyle}>
          <a onClick={() => handleOpenNotifyDetail(record)}>
            {textConst.action.detail}
          </a>
        </Space>
      )
    }
  ]

  return (
    <>
      <ProTable<API.PayNotifyTaskRespVO>
      headerTitle="回调通知"
      actionRef={actionRef}
      rowKey="id"
      form={{ colon: false }}
      columns={columns}
      search={{ labelWidth: 100, span: 6 }}
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
          const res = await getNotifyTaskPage(req as any)
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

      <NotifyDetail />
    </>
  )
}

export default PayNotifyManagement
