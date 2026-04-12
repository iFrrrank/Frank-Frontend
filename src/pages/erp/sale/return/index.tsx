import React, { useRef, useState } from 'react'
import { Button, message } from 'antd'
import { PlusOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import SaleReturnForm from './SaleReturnForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete, handleBatchDelete } from '@/components/Delete'
import { getSaleReturnPage, deleteSaleReturn, exportSaleReturnExcel } from '@/api/erp/sale/return'
import { ERP_AUDIT_STATUS } from '@/utils/constantsValue'

const SaleReturnManagement: React.FC = () => {
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

  const columns: ProColumns<API.ErpSaleReturnRespVO>[] = [
    {
      title: '退货单号',
      dataIndex: 'no',
      width: 80,
      align: 'center',
      fieldProps: { placeholder: '请输入退货单号' }
    },
    {
      title: '产品',
      dataIndex: 'productId',
      hideInTable: true,
      valueType: 'select',
      align: 'center',
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
      width: 100,
      align: 'center',
      fieldProps: { placeholder: '请选择客户' },
      valueType: 'select',
      render: (_, record) => record.customerName
    },
    {
      title: '退货时间',
      dataIndex: 'returnTime',
      valueType: 'dateRange',
      width: 120,
      align: 'center',
      fieldProps: { placeholder: ['开始日期', '结束日期'] },
      render: (_, record) => record.returnTime
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
      title: '退款状态',
      dataIndex: 'refundStatus',
      hideInTable: true,
      align: 'center',
      fieldProps: { placeholder: '请选择退款状态' },
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
      title: '应退金额',
      dataIndex: 'payableAmount',
      width: 120,
      valueType: 'money',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '已退金额',
      dataIndex: 'paidAmount',
      width: 120,
      align: 'center',
      valueType: 'money',
      hideInSearch: true
    },
    {
      title: '未退金额',
      dataIndex: 'unpaidAmount',
      width: 120,
      align: 'center',
      valueType: 'money',
      hideInSearch: true
    },
    {
      title: '备注',
      dataIndex: 'remark',
      hideInSearch: true,
      width: 100,
      align: 'center',
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
            onClick={() =>
              handleDelete(record, deleteSaleReturn, () => actionRef.current?.reload())
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
      <ProTable<API.ErpSaleReturnRespVO>
        headerTitle="销售退货"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        search={{ labelWidth: 80, span: 6 }}
        request={async (params) => {
          const { current, pageSize, returnTime, ...rest } = params
          const req = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            startTime: returnTime?.[0] ? returnTime[0] + ' 00:00:00' : undefined,
            endTime: returnTime?.[1] ? returnTime[1] + ' 23:59:59' : undefined,
            ...rest
          }
          try {
            const res = await getSaleReturnPage(req as any)
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
                deleteSaleReturn,
                () => setSelectedRowKeys([]),
                () => actionRef.current?.reload()
              )
            }
          >
            {textConst.action.batchDelete}
          </Button>
        ]}
      />

      <SaleReturnForm
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

export default SaleReturnManagement
