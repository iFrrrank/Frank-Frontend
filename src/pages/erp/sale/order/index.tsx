import React, { useRef, useState } from 'react'
import { Button, message } from 'antd'
import { PlusOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import SaleOrderForm from './SaleOrderForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete, handleBatchDelete } from '@/components/Delete'
import { getSaleOrderPage, deleteSaleOrder } from '@/api/erp/sale/order'
import { ERP_AUDIT_STATUS } from '@/utils/constantsValue'

const SaleOrderManagement: React.FC = () => {
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

  const columns: ProColumns<API.ErpSaleOrderRespVO>[] = [
    {
      title: '订单号',
      dataIndex: 'no',
      width: 100,
      align: 'center',
      fieldProps: { placeholder: '请输入订单号' }
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
      width: 120,
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
      title: '订单时间',
      dataIndex: 'orderTime',
      valueType: 'dateRange',
      width: 150,
      align: 'center',
      fieldProps: { placeholder: ['开始日期', '结束日期'] },
      render: (_, record) => record.orderTime
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      width: 120,
      align: 'center',
      fieldProps: { placeholder: '请选择创建人' },
      valueType: 'select',
      render: (_, record) => record.creatorName
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      fieldProps: { placeholder: '请选择状态' },
      valueType: 'select',
      valueEnum: ERP_AUDIT_STATUS
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
      title: '出库数量',
      dataIndex: 'outCount',
      align: 'center',
      width: 120,
      fieldProps: { placeholder: '请选择出库数量' },
      valueType: 'select'
    },
    {
      title: '退货数量',
      dataIndex: 'returnCount',
      align: 'center',
      width: 120,
      fieldProps: { placeholder: '请选择退货数量' },
      valueType: 'select'
    },
    { title: '总数量', dataIndex: 'totalCount', width: 120, align: 'center', hideInSearch: true },
    {
      title: '金额合计',
      dataIndex: 'totalPrice',
      width: 120,
      valueType: 'money',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '含税金额',
      dataIndex: 'taxTotalPrice',
      width: 120,
      valueType: 'money',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '收取订金',
      dataIndex: 'depositPrice',
      width: 120,
      valueType: 'money',
      align: 'center',
      hideInSearch: true
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
            onClick={() => handleDelete(record, deleteSaleOrder, () => actionRef.current?.reload())}
          >
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<API.ErpSaleOrderRespVO>
        headerTitle="销售订单"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        search={{ labelWidth: 80, span: 6 }}
        request={async (params) => {
          const { current, pageSize, orderTime, ...rest } = params
          const req = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            startTime: orderTime?.[0] ? orderTime[0] + ' 00:00:00' : undefined,
            endTime: orderTime?.[1] ? orderTime[1] + ' 23:59:59' : undefined,
            ...rest
          }
          try {
            const res = await getSaleOrderPage(req as any)
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
                deleteSaleOrder,
                () => setSelectedRowKeys([]),
                () => actionRef.current?.reload()
              )
            }
          >
            {textConst.action.batchDelete}
          </Button>
        ]}
      />

      <SaleOrderForm
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

export default SaleOrderManagement
