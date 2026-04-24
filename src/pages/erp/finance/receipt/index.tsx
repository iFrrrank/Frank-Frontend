import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import { PlusOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable, ProFormInstance } from '@ant-design/pro-components'
import FinanceReceiptForm from './FinanceReceiptForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete, handleBatchDelete } from '@/components/Delete'
import {
  getFinanceReceiptPage,
  deleteFinanceReceipt,
  exportFinanceReceiptExcel
} from '@/api/erp/finance/receipt'
import { ERP_AUDIT_STATUS } from '@/utils/constantsValue'
import { handleExport } from '@/components/Export'

const FinanceReceiptManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const handleExportBtnClick = () => {
    // 获取表单当前的值
    const formValues = formRef.current?.getFieldsValue?.() || {}
    handleExport({
      exportApi: exportFinanceReceiptExcel,
      exportParams: { ...formValues },
      fileName: '收款单.xlsx'
    })
  }

  const columns: ProColumns<API.ErpFinanceReceiptRespVO>[] = [
    {
      title: '收款单号',
      dataIndex: 'no',
      width: 180,
      align: 'center',
      fieldProps: { placeholder: '请输入收款单号' }
    },
    {
      title: '客户',
      dataIndex: 'customerId',
      width: 180,
      align: 'center',
      fieldProps: { placeholder: '请选择客户' },
      valueType: 'select',
      render: (_, record) => record.customerName
    },
    {
      title: '收款时间',
      dataIndex: 'receiptTime',
      valueType: 'dateRange',
      width: 180,
      align: 'center',
      fieldProps: { placeholder: ['开始日期', '结束日期'] },
      render: (_, record) => record.receiptTime
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
      title: '收款账户',
      dataIndex: 'accountId',
      hideInTable: true,
      align: 'center',
      width: 180,
      fieldProps: { placeholder: '请选择收款账户' },
      valueType: 'select'
    },
    {
      title: '合计收款',
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
      title: '实际收款',
      dataIndex: 'receiptPrice',
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
      valueEnum: ERP_AUDIT_STATUS
    },
    {
      title: '备注',
      dataIndex: 'remark',
      hideInSearch: true,
      width: 180,
      align: 'center',
      fieldProps: { placeholder: '请输入备注' }
    },
    {
      title: '销售单号',
      dataIndex: 'orderNo',
      hideInTable: true,
      align: 'center',
      width: 180,
      fieldProps: { placeholder: '请输入销售单号' }
    },
    {
      title: textConst.table.action,
      valueType: 'option',
      width: 180,
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
              handleDelete(record, deleteFinanceReceipt, () => actionRef.current?.reload())
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
      <ProTable<API.ErpFinanceReceiptRespVO>
        headerTitle="收款单"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        search={{ labelWidth: 80, span: 6 }}
        request={async (params) => {
          const { current, pageSize, receiptTime, ...rest } = params
          const req = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            startTime: receiptTime?.[0] ? receiptTime[0] + ' 00:00:00' : undefined,
            endTime: receiptTime?.[1] ? receiptTime[1] + ' 23:59:59' : undefined,
            ...rest
          }
          try {
            const res = await getFinanceReceiptPage(req as any)
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
                deleteFinanceReceipt,
                () => setSelectedRowKeys([]),
                () => actionRef.current?.reload()
              )
            }
          >
            {textConst.action.batchDelete}
          </Button>
        ]}
      />

      <FinanceReceiptForm
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

export default FinanceReceiptManagement
