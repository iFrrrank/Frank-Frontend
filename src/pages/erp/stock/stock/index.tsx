import React, { useRef, useEffect, useState } from 'react'
import { Button, message, Select } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { textConst } from '@/locales/zh-CN'
import { getStockPage } from '@/api/erp/stock/stock'
import { getProductSimpleList } from '@/api/erp/product/product'
import { getWarehouseSimpleList } from '@/api/erp/stock/warehouse'

const StockManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [productList, setProductList] = useState<API.ErpProductRespVO[]>([])
  const [warehouseList, setWarehouseList] = useState<API.ErpWarehouseRespVO[]>([])

  useEffect(() => {
    getProductSimpleList().then((res) => {
      if (res.code === 0) setProductList(res.data || [])
    })
    getWarehouseSimpleList().then((res) => {
      if (res.code === 0) setWarehouseList(res.data || [])
    })
  }, [])

  const handleExportBtnClick = async () => {
    try {
      message.loading({ content: '正在导出...', key: 'export' })
      message.success({ content: '导出成功', key: 'export' })
    } catch (e) {
      message.error({ content: '导出失败', key: 'export' })
    }
  }

  const columns: ProColumns<API.ErpStockRespVO>[] = [
    {
      title: '产品',
      dataIndex: 'productId',
      align: 'center',
      hideInTable: true,
      renderFormItem: () => (
        <Select
          placeholder="请选择产品"
          allowClear
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={productList.map((item) => ({
            label: item.name,
            value: item.id
          }))}
        />
      )
    },
    {
      title: '仓库',
      dataIndex: 'warehouseId',
      align: 'center',
      hideInTable: true,
      renderFormItem: () => (
        <Select
          placeholder="请选择仓库"
          allowClear
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={warehouseList.map((item) => ({
            label: item.name,
            value: item.id
          }))}
        />
      )
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      align: 'center',
      width: 200,
      hideInSearch: true
    },
    {
      title: '产品单位',
      dataIndex: 'unitName',
      align: 'center',
      width: 200,
      hideInSearch: true
    },
    {
      title: '产品分类',
      dataIndex: 'categoryName',
      align: 'center',
      width: 200,
      hideInSearch: true
    },
    {
      title: '库存量',
      dataIndex: 'count',
      align: 'center',
      width: 200,
      hideInSearch: true
    },
    {
      title: '仓库',
      dataIndex: 'warehouseName',
      align: 'center',
      width: 150,
      hideInSearch: true
    }
  ]

  return (
    <ProTable<API.ErpStockRespVO>
      headerTitle="产品库存"
      actionRef={actionRef}
      rowKey="id"
      form={{ colon: false }}
      columns={columns}
      search={{ labelWidth: 'auto', span: 6 }}
      request={async (params) => {
        const { current, pageSize, ...rest } = params
        const req = {
          pageNo: current || 1,
          pageSize: pageSize || 10,
          ...rest
        }
        try {
          const res = await getStockPage(req as any)
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

export default StockManagement
