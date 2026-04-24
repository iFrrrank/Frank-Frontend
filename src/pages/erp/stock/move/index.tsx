import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import { PlusOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable, ProFormInstance } from '@ant-design/pro-components'
import StockMoveForm from './StockMoveForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete, handleBatchDelete } from '@/components/Delete'
import { getStockMovePage, deleteStockMove, exportStockMoveExcel } from '@/api/erp/stock/move'
import { ERP_AUDIT_STATUS } from '@/utils/constantsValue'
import { handleExport } from '@/components/Export'

const StockMoveManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const handleExportBtnClick = () => {
    // 获取表单当前的值
    const formValues = formRef.current?.getFieldsValue?.() || {}
    handleExport({
      exportApi: exportStockMoveExcel,
      exportParams: { ...formValues },
      fileName: '库存调拨.xlsx'
    })
  }

  const columns: ProColumns<API.ErpStockMoveRespVO>[] = [
    {
      title: '调拨单号',
      dataIndex: 'no',
      width: 150,
      align: 'center',
      fieldProps: { placeholder: '请输入调拨单号' }
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
      title: '调拨时间',
      dataIndex: 'moveTime',
      valueType: 'dateRange',
      width: 180,
      align: 'center',
      fieldProps: { placeholder: ['开始日期', '结束日期'] },
      render: (_, record) => record.moveTime
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
      width: 180,
      align: 'center',
      fieldProps: { placeholder: '请选择创建人' },
      valueType: 'select',
      render: (_, record) => record.creatorName
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
      align: 'center',
      width: 180,
      fieldProps: { placeholder: '请输入备注' }
    },
    {
      title: '数量',
      dataIndex: 'totalCount',
      width: 180,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '金额',
      dataIndex: 'totalPrice',
      width: 180,
      valueType: 'money',
      align: 'center',
      hideInSearch: true
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
            onClick={() => handleDelete(record, deleteStockMove, () => actionRef.current?.reload())}
          >
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<API.ErpStockMoveRespVO>
        headerTitle="库存调拨"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        search={{ labelWidth: 80, span: 6 }}
        request={async (params) => {
          const { current, pageSize, moveTime, ...rest } = params
          const req = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            startTime: moveTime?.[0] ? moveTime[0] + ' 00:00:00' : undefined,
            endTime: moveTime?.[1] ? moveTime[1] + ' 23:59:59' : undefined,
            ...rest
          }
          try {
            const res = await getStockMovePage(req as any)
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
                deleteStockMove,
                () => setSelectedRowKeys([]),
                () => actionRef.current?.reload()
              )
            }
          >
            {textConst.action.batchDelete}
          </Button>
        ]}
      />

      <StockMoveForm
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

export default StockMoveManagement
