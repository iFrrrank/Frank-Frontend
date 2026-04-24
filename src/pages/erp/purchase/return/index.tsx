import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import { PlusOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable, ProFormInstance } from '@ant-design/pro-components'
import PurchaseReturnForm from './PurchaseReturnForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete, handleBatchDelete } from '@/components/Delete'
import {
  getPurchaseReturnPage,
  deletePurchaseReturn,
  exportPurchaseReturnExcel
} from '@/api/erp/purchase/return'
import { handleExport } from '@/components/Export'

const PurchaseReturnManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const handleExportBtnClick = () => {
    // 获取表单当前的值
    const formValues = formRef.current?.getFieldsValue?.() || {}
    handleExport({
      exportApi: exportPurchaseReturnExcel,
      exportParams: { ...formValues },
      fileName: '采购退货.xlsx'
    })
  }

  const columns: ProColumns<API.ErpPurchaseReturnRespVO>[] = [
    {
      title: '退货单号',
      dataIndex: 'no',
      width: 150,
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
      width: 180,
      align: 'center',
      hideInSearch: true,
      ellipsis: true
    },
    {
      title: '供应商',
      dataIndex: 'supplierId',
      width: 150,
      align: 'center',
      fieldProps: { placeholder: '请选择供应商' },
      valueType: 'select',
      render: (_, record) => record.supplierName
    },
    {
      title: '退货时间',
      dataIndex: 'returnTime',
      valueType: 'dateRange',
      width: 160,
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
      valueEnum: {
        0: { text: '待审核', status: 'Processing' },
        1: { text: '已审核', status: 'Success' }
      }
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
      width: 120,
      hideInSearch: true,
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
              handleDelete(record, deletePurchaseReturn, () => actionRef.current?.reload())
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
      <ProTable<API.ErpPurchaseReturnRespVO>
        headerTitle="采购退货"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        search={{ labelWidth: 80, span: 6 }}
        options={false}
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
            const res = await getPurchaseReturnPage({ pageReqVO: req } as any)
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
                deletePurchaseReturn,
                () => setSelectedRowKeys([]),
                () => actionRef.current?.reload()
              )
            }
          >
            {textConst.action.batchDelete}
          </Button>
        ]}
      />

      <PurchaseReturnForm
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

export default PurchaseReturnManagement
