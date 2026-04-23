import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import { PlusOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable, ProFormInstance } from '@ant-design/pro-components'
import {
  getPurchaseOrderPage,
  deletePurchaseOrder,
  exportPurchaseOrderExcel
} from '@/api/erp/purchase/order'
import { getSupplierSimpleList } from '@/api/erp/purchase/supplier'
import { getSimpleUserList } from '@/api/system/user'
import PurchaseOrderForm from './PurchaseOrderForm'
import { textConst } from '@/locales/zh-CN'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { handleDelete, handleBatchDelete } from '@/components/Delete'
import { handleExport } from '@/components/Export'

const PurchaseOrderManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const handleCreate = () => {
    setCurrentId(undefined)
    setFormVisible(true)
  }

  const handleUpdate = (id: number) => {
    setCurrentId(id)
    setFormVisible(true)
  }

  const handleExportBtnClick = () => {
    // 获取表单当前的值
    const formValues = formRef.current?.getFieldsValue?.() || {}
    handleExport({
      exportApi: exportPurchaseOrderExcel,
      exportParams: { ...formValues },
      fileName: '采购订单.xlsx'
    })
  }

  const columns: ProColumns<API.ErpPurchaseOrderRespVO>[] = [
    {
      title: '订单号',
      dataIndex: 'no',
      width: 160,
      align: 'center',
      fieldProps: { placeholder: '请输入订单号' }
    },
    {
      title: '产品',
      dataIndex: 'productId',
      hideInTable: true,
      align: 'center',
      valueType: 'select',
      fieldProps: { placeholder: '请选择产品' }
    },
    {
      title: '订单时间',
      dataIndex: 'orderTime',
      valueType: 'dateRange',
      width: 160,
      align: 'center',
      fieldProps: { placeholder: ['开始日期', '结束日期'] },
      render: (_, record) => record.orderTime
    },
    {
      title: '供应商',
      dataIndex: 'supplierId',
      width: 160,
      align: 'center',
      valueType: 'select',
      fieldProps: { placeholder: '请选择供应商' },
      request: async () => {
        const res = await getSupplierSimpleList()
        return res.data?.map((item: any) => ({ label: item.name, value: item.id })) || []
      },
      render: (_, record) => record.supplierName
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      width: 120,
      align: 'center',
      fieldProps: { placeholder: '请选择创建人' },
      valueType: 'select',
      request: async () => {
        const res = await getSimpleUserList()
        return res.data?.map((item: any) => ({ label: item.nickname, value: item.id })) || []
      },
      render: (_, record) => record.creatorName
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      fieldProps: { placeholder: '请选择订单状态' },
      valueType: 'select',
      valueEnum: {
        0: { text: '待审核', status: 'Processing' },
        1: { text: '已审核', status: 'Success' }
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      hideInTable: true,
      align: 'center',
      fieldProps: { placeholder: '请输入备注' }
    },
    {
      title: '产品信息',
      dataIndex: 'productNames',
      width: 200,
      align: 'center',
      hideInSearch: true,
      ellipsis: true
    },
    {
      title: '总数量',
      dataIndex: 'totalCount',
      width: 100,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '入库数量',
      dataIndex: 'inCount',
      width: 100,
      align: 'center',
      valueType: 'select',
      fieldProps: { placeholder: '请选择入库数量' }
    },
    {
      title: '退货数量',
      dataIndex: 'returnCount',
      width: 100,
      align: 'center',
      fieldProps: { placeholder: '请选择退货数量' },
      valueType: 'select'
    },
    {
      title: '金额合计',
      dataIndex: 'totalPrice',
      width: 120,
      align: 'center',
      valueType: 'money',
      hideInSearch: true
    },
    {
      title: '含税金额',
      dataIndex: 'taxTotalPrice',
      width: 120,
      align: 'center',
      valueType: 'money',
      hideInSearch: true
    },
    {
      title: '支付订金',
      dataIndex: 'depositPrice',
      width: 120,
      align: 'center',
      valueType: 'money',
      hideInSearch: true
    },
    {
      title: '操作',
      valueType: 'option',
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a key="update" onClick={() => handleUpdate(record.id as number)}>
            {textConst.action.update}
          </a>
          <a
            key="delete"
            style={deleteTextStyle}
            onClick={() =>
              handleDelete(record, deletePurchaseOrder, () => actionRef.current?.reload())
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
      <ProTable<API.ErpPurchaseOrderRespVO>
        headerTitle="采购订单"
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys
        }}
        form={{ colon: false }}
        search={{
          labelWidth: 80,
          span: 6 // 一行设置 4 个搜索项
        }}
        request={async (params) => {
          const { current, pageSize, orderTime, ...rest } = params
          const req = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            startTime: orderTime?.[0] ? orderTime[0] + ' 00:00:00' : undefined,
            endTime: orderTime?.[1] ? orderTime[1] + ' 23:59:59' : undefined,
            ...rest
          }
          const res = await getPurchaseOrderPage({ pageReqVO: req } as any)
          return {
            data: res.data?.list || [],
            success: res.code === 0,
            total: res.data?.total || 0
          }
        }}
        pagination={{ align: 'center', showSizeChanger: true }}
        toolBarRender={() => [
          <Button key="create" icon={<PlusOutlined />} type="primary" onClick={handleCreate}>
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
                deletePurchaseOrder,
                () => setSelectedRowKeys([]),
                () => actionRef.current?.reload()
              )
            }
          >
            {textConst.action.batchDelete}
          </Button>
        ]}
      />

      <PurchaseOrderForm
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

export default PurchaseOrderManagement
