import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import { PlusOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable, ProFormInstance } from '@ant-design/pro-components'
import SaleOutForm from './SaleOutForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete, handleBatchDelete } from '@/components/Delete'
import { getSaleOutPage, deleteSaleOut, exportSaleOutExcel } from '@/api/erp/sale/out'
import { ERP_AUDIT_STATUS } from '@/utils/constantsValue'
import { handleExport } from '@/components/Export'

const SaleOutManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const handleExportBtnClick = () => {
    // 获取表单当前的值
    const formValues = formRef.current?.getFieldsValue?.() || {}
    handleExport({
      exportApi: exportSaleOutExcel,
      exportParams: { ...formValues },
      fileName: '销售出库.xlsx'
    })
  }

  const columns: ProColumns<API.ErpSaleOutRespVO>[] = [
    {
      title: '出库单号',
      dataIndex: 'no',
      width: 100,
      align: 'center',
      fieldProps: { placeholder: '请输入出库单号' }
    },
    {
      title: '产品',
      dataIndex: 'productId',
      hideInTable: true,
      valueType: 'select',
      align: 'center',
      width: 120,
      fieldProps: { placeholder: '请选择产品' }
    },
    {
      title: '产品信息',
      dataIndex: 'productNames',
      width: 150,
      align: 'center',
      hideInSearch: true,
      ellipsis: true
    },
    {
      title: '客户',
      dataIndex: 'customerId',
      width: 120,
      align: 'center',
      fieldProps: { placeholder: '请选择客户' },
      valueType: 'select',
      render: (_, record) => record.customerName
    },
    {
      title: '出库时间',
      dataIndex: 'outTime',
      valueType: 'dateRange',
      width: 160,
      align: 'center',
      fieldProps: { placeholder: ['开始日期', '结束日期'] },
      render: (_, record) => record.outTime
    },
    {
      title: '仓库',
      dataIndex: 'warehouseId',
      hideInTable: true,
      align: 'center',
      fieldProps: { placeholder: '请选择仓库' },
      valueType: 'select'
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      width: 100,
      align: 'center',
      fieldProps: { placeholder: '请选择创建人' },
      valueType: 'select',
      render: (_, record) => record.creatorName
    },
    {
      title: '关联订单',
      dataIndex: 'orderNo',
      hideInTable: true,
      align: 'center',
      fieldProps: { placeholder: '请输入关联订单' }
    },
    {
      title: '结算账户',
      dataIndex: 'accountId',
      hideInTable: true,
      align: 'center',
      fieldProps: { placeholder: '请选择结算账户' },
      valueType: 'select'
    },
    {
      title: '收款状态',
      dataIndex: 'receiptStatus',
      hideInTable: true,
      align: 'center',
      fieldProps: { placeholder: '请选择收款状态' },
      valueType: 'select'
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      fieldProps: { placeholder: '请选择审核状态' },
      valueType: 'select',
      valueEnum: ERP_AUDIT_STATUS
    },
    { title: '总数量', dataIndex: 'totalCount', width: 90, align: 'center', hideInSearch: true },
    {
      title: '应收金额',
      dataIndex: 'receivableAmount',
      width: 120,
      valueType: 'money',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '已收金额',
      dataIndex: 'receivedAmount',
      width: 120,
      align: 'center',
      valueType: 'money',
      hideInSearch: true
    },
    {
      title: '未收金额',
      dataIndex: 'unreceivedAmount',
      width: 120,
      align: 'center',
      valueType: 'money',
      hideInSearch: true
    },
    {
      title: '备注',
      dataIndex: 'remark',
      hideInSearch: true,
      align: 'center',
      width: 120,
      fieldProps: { placeholder: '请输入备注' }
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
            onClick={() => handleDelete(record, deleteSaleOut, () => actionRef.current?.reload())}
          >
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<API.ErpSaleOutRespVO>
        headerTitle="销售出库"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        search={{ labelWidth: 80, span: 6 }}
        request={async (params) => {
          const { current, pageSize, outTime, ...rest } = params
          const req = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            startTime: outTime?.[0] ? outTime[0] + ' 00:00:00' : undefined,
            endTime: outTime?.[1] ? outTime[1] + ' 23:59:59' : undefined,
            ...rest
          }
          try {
            const res = await getSaleOutPage(req as any)
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
                deleteSaleOut,
                () => setSelectedRowKeys([]),
                () => actionRef.current?.reload()
              )
            }
          >
            {textConst.action.batchDelete}
          </Button>
        ]}
      />

      <SaleOutForm
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

export default SaleOutManagement
