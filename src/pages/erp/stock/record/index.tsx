import React, { useRef } from 'react'
import { Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable, ProFormInstance } from '@ant-design/pro-components'
import { getStockRecordPage, exportStockRecordExcel } from '@/api/erp/stock/record'
import { textConst } from '@/locales/zh-CN'
import { BIZ_TYPE } from '@/utils/constantsValue'
import { handleExport } from '@/components/Export'
import { getProductSimpleList } from '@/api/erp/product/product'
import { getWarehouseSimpleList } from '@/api/erp/stock/warehouse'

const StockRecordManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  const handleExportBtnClick = () => {
    // 获取表单当前的值
    const formValues = formRef.current?.getFieldsValue?.() || {}
    handleExport({
      exportApi: exportStockRecordExcel,
      exportParams: { ...formValues },
      fileName: '出入库明细.xlsx'
    })
  }

  const columns: ProColumns<API.ErpStockRecordRespVO>[] = [
    {
      title: '产品',
      dataIndex: 'productId',
      hideInTable: true,
      valueType: 'select',
      align: 'center',
      width: 150,
      fieldProps: { placeholder: '请选择产品' },
      request: async () => {
        const res = await getProductSimpleList()
        return (res.data || []).map((item: any) => ({ label: item.name, value: item.id }))
      }
    },
    {
      title: '仓库',
      dataIndex: 'warehouseId',
      hideInTable: true,
      valueType: 'select',
      align: 'center',
      width: 150,
      fieldProps: { placeholder: '请选择仓库' },
      request: async () => {
        const res = await getWarehouseSimpleList()
        return (res.data || []).map((item: any) => ({ label: item.name, value: item.id }))
      }
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      align: 'center',
      width: 200,
      hideInSearch: true
    },
    {
      title: '产品分类',
      dataIndex: 'productCategoryName',
      align: 'center',
      width: 150,
      hideInSearch: true
    },
    {
      title: '产品单位',
      dataIndex: 'productUnitName',
      align: 'center',
      width: 200,
      hideInSearch: true
    },
    {
      title: '仓库名称',
      dataIndex: 'warehouseName',
      align: 'center',
      width: 200,
      hideInSearch: true
    },
    {
      title: '类型',
      dataIndex: 'bizType',
      align: 'center',
      valueType: 'select',
      fieldProps: { placeholder: '请选择类型' },
      valueEnum: BIZ_TYPE
    },
    {
      title: '业务单号',
      dataIndex: 'bizNo',
      hideInTable: true,
      align: 'center',
      fieldProps: { placeholder: '请输入业务单号' }
    },
    {
      title: '出入库单号',
      dataIndex: 'bizNo',
      align: 'center',
      width: 150,
      hideInSearch: true
    },
    {
      title: '出入库日期',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 150,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '出入库数量',
      dataIndex: 'count',
      align: 'center',
      width: 150,
      hideInSearch: true,
      render: (_, record: any) => {
        return record.count
      }
    },
    {
      title: '库存量',
      dataIndex: 'totalCount',
      align: 'center',
      width: 150,
      hideInSearch: true
    },
    {
      title: '操作人',
      dataIndex: 'creatorName',
      align: 'center',
      width: 150,
      hideInSearch: true
    }
  ]

  return (
    <ProTable<API.ErpStockRecordRespVO>
      headerTitle="出入库明细"
      actionRef={actionRef}
      rowKey="id"
      form={{ colon: false }}
      columns={columns}
      search={{ labelWidth: 'auto', span: 6 }}
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
          const res = await getStockRecordPage(req as any)
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
          key="export"
          color="volcano"
          variant="outlined"
          icon={<DownloadOutlined />}
          onClick={handleExportBtnClick}
        >
          {textConst.action.export}
        </Button>
      ]}
    />
  )
}

export default StockRecordManagement
