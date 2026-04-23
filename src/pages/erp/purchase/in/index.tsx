import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import { PlusOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable, ProFormInstance } from '@ant-design/pro-components'
import PurchaseInForm from './PurchaseInForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete, handleBatchDelete } from '@/components/Delete'
import { getPurchaseInPage, deletePurchaseIn, exportPurchaseInExcel } from '@/api/erp/purchase/in'
import { handleExport } from '@/components/Export'

const PurchaseInFormManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const handleExportBtnClick = () => {
    // 获取表单当前的值
    const formValues = formRef.current?.getFieldsValue?.() || {}
    handleExport({
      exportApi: exportPurchaseInExcel,
      exportParams: { ...formValues },
      fileName: '采购入库列表.xlsx'
    })
  }

  const columns: ProColumns<API.ErpPurchaseInRespVO>[] = [
    {
      title: '入库单号',
      dataIndex: 'no',
      width: 150,
      align: 'center',
      fieldProps: { placeholder: '请输入入库单号' }
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
      title: '入库时间',
      dataIndex: 'inTime',
      valueType: 'dateRange',
      width: 160,
      align: 'center',
      fieldProps: { placeholder: ['开始日期', '结束日期'] },
      render: (_, record) => record.inTime
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
      valueType: 'select'
    },
    { title: '总数量', dataIndex: 'totalCount', width: 90, align: 'center', hideInSearch: true },
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
      title: '付款状态',
      dataIndex: 'paymentStatus',
      hideInTable: true,
      align: 'center',
      fieldProps: { placeholder: '请选择付款状态' },
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
    {
      title: '应付金额',
      dataIndex: 'payableAmount',
      width: 120,
      valueType: 'money',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '已付金额',
      dataIndex: 'paidAmount',
      width: 120,
      align: 'center',
      valueType: 'money',
      hideInSearch: true
    },
    {
      title: '未付金额',
      dataIndex: 'unpaidAmount',
      width: 120,
      align: 'center',
      valueType: 'money',
      hideInSearch: true
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 100,
      align: 'center',
      hideInSearch: true,
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
          <a key="update" onClick={() => setFormVisible(true)}>
            {textConst.action.update}
          </a>
          <a
            key="delete"
            style={deleteTextStyle}
            onClick={() =>
              handleDelete(record, deletePurchaseIn, () => actionRef.current?.reload())
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
      <ProTable<API.ErpPurchaseInRespVO>
        headerTitle="采购入库"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        search={{ labelWidth: 80, span: 6 }}
        options={false}
        request={async (params) => {
          const { current, pageSize, ...rest } = params
          const req = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...rest
          }
          try {
            const res = await getPurchaseInPage({ pageReqVO: req } as any)
            return {
              data: res.data?.list || [],
              success: res.code === 0,
              total: res.data?.total || 0
            }
          } catch (error) {
            return {
              data: [],
              success: false,
              total: 0
            }
          }
        }}
        pagination={{ align: 'center', showSizeChanger: true }}
        toolBarRender={() => [
          <Button
            key="create"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setFormVisible(true)}
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
                deletePurchaseIn,
                () => setSelectedRowKeys([]),
                () => actionRef.current?.reload()
              )
            }
          >
            {textConst.action.batchDelete}
          </Button>
        ]}
      />

      <PurchaseInForm
        visible={formVisible}
        setVisible={setFormVisible}
        onSuccess={() => {
          setFormVisible(false)
          actionRef.current?.reload()
        }}
      />
    </>
  )
}

export default PurchaseInFormManagement
