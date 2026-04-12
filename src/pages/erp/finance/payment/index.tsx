import React, { useRef, useState } from 'react'
import { Button, message } from 'antd'
import { PlusOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import FinancePaymentForm from './FinancePaymentForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete, handleBatchDelete } from '@/components/Delete'
import { getFinancePaymentPage, deleteFinancePayment } from '@/api/erp/finance/payment'
import { COMMON_STATUS } from '@/utils/constantsValue'

const FinancePaymentManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const handleExportBtnClick = async () => {
    try {
      message.loading({ content: '正在导出...', key: 'export' })
      message.success({ content: '导出成功', key: 'export' })
    } catch (e) {
      message.error({ content: '导出失败', key: 'export' })
    }
  }

  const columns: ProColumns<API.ErpFinancePaymentRespVO>[] = [
    {
      title: '付款单号',
      dataIndex: 'no',
      width: 180,
      align: 'center',
      fieldProps: { placeholder: '请输入付款单号' }
    },
    {
      title: '供应商',
      dataIndex: 'supplierId',
      width: 180,
      align: 'center',
      fieldProps: { placeholder: '请选择供应商' },
      valueType: 'select',
      render: (_, record) => record.supplierName
    },
    {
      title: '付款时间',
      dataIndex: 'paymentTime',
      valueType: 'dateRange',
      width: 180,
      align: 'center',
      fieldProps: { placeholder: ['开始日期', '结束日期'] },
      render: (_, record) => record.paymentTime
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      width: 180,
      align: 'center',
      fieldProps: { placeholder: '请选择创建人' },
      valueType: 'select',
      render: (_, record) => record.creatorName
    },
    {
      title: '财务人员',
      dataIndex: 'financeId',
      hideInTable: true,
      align: 'center',
      width: 180,
      fieldProps: { placeholder: '请选择财务人员' },
      valueType: 'select'
    },
    {
      title: '付款账户',
      dataIndex: 'accountId',
      hideInTable: true,
      align: 'center',
      width: 180,
      fieldProps: { placeholder: '请选择付款账户' },
      valueType: 'select'
    },
    {
      title: '合计付款',
      dataIndex: 'totalPrice',
      width: 180,
      valueType: 'money',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '优惠金额',
      dataIndex: 'discountPrice',
      width: 180,
      valueType: 'money',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '实际付款',
      dataIndex: 'paymentPrice',
      width: 180,
      valueType: 'money',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 180,
      align: 'center',
      fieldProps: { placeholder: '请选择状态' },
      valueType: 'select',
      valueEnum: COMMON_STATUS
    },
    {
      title: '备注',
      dataIndex: 'remark',
      hideInSearch: true,
      align: 'center',
      width: 180,
      fieldProps: { placeholder: '请输入备注' }
    },
    {
      title: '采购单号',
      dataIndex: 'orderNo',
      hideInTable: true,
      align: 'center',
      fieldProps: { placeholder: '请输入采购单号' }
    },
    {
      title: textConst.table.action,
      valueType: 'option',
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a
            key="update"
            onClick={() => {
              setCurrentId(record.id)
              setFormVisible(true)
            }}
          >
            {textConst.action.update}
          </a>
          <a
            key="delete"
            style={deleteTextStyle}
            onClick={() =>
              handleDelete(record, deleteFinancePayment, () => actionRef.current?.reload())
            }
          >
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<API.ErpFinancePaymentRespVO>
        headerTitle="付款单"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        search={{ labelWidth: 80, span: 6 }}
        request={async (params) => {
          const { current, pageSize, paymentTime, ...rest } = params
          const req = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            startTime: paymentTime?.[0] ? paymentTime[0] + ' 00:00:00' : undefined,
            endTime: paymentTime?.[1] ? paymentTime[1] + ' 23:59:59' : undefined,
            ...rest
          }
          try {
            const res = await getFinancePaymentPage(req as any)
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
        toolBarRender={() => [
          <Button
            key="create"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setCurrentId(undefined)
              setFormVisible(true)
            }}
          >
            {textConst.action.create}
          </Button>,
          <Button
            key="export"
            color="volcano"
            variant="outlined"
            icon={<DownloadOutlined />}
            onClick={handleExportBtnClick}
          >
            {textConst.action.export}
          </Button>,
          <Button
            key="batchDelete"
            icon={<DeleteOutlined />}
            danger
            type="primary"
            disabled={selectedRowKeys.length === 0}
            onClick={() =>
              handleBatchDelete(
                selectedRowKeys,
                deleteFinancePayment,
                () => setSelectedRowKeys([]),
                () => actionRef.current?.reload()
              )
            }
          >
            {textConst.action.batchDelete}
          </Button>
        ]}
      />

      <FinancePaymentForm
        visible={formVisible}
        setVisible={setFormVisible}
        id={currentId}
        onSuccess={() => {
          setFormVisible(false)
          actionRef.current?.reload()
        }}
      />
    </>
  )
}

export default FinancePaymentManagement
