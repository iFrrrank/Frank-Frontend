import React, { useRef, useState } from 'react'
import { Button, message } from 'antd'
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import ProductForm from './ProductForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'
import { getProductPage, deleteProduct, exportProductExcel } from '@/api/erp/product/product'
import { COMMON_STATUS } from '@/utils/constantsValue'

const ProductManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  const handleExportBtnClick = async () => {
    try {
      message.loading({ content: '正在导出...', key: 'export' })
      message.success({ content: '导出成功', key: 'export' })
    } catch (e) {
      message.error({ content: '导出失败', key: 'export' })
    }
  }

  const columns: ProColumns<API.ErpProductRespVO>[] = [
    {
      title: '产品名称',
      dataIndex: 'name',
      align: 'center',
      fieldProps: { placeholder: '请输入产品名称' }
    },
    {
      title: '分类',
      dataIndex: 'categoryId',
      align: 'center',
      valueType: 'select',
      fieldProps: { placeholder: '请选择产品分类' },
      request: async () => []
    },
    {
      title: '条码',
      dataIndex: 'barCode',
      align: 'center',
      width: 150,
      hideInSearch: true
    },
    {
      title: '规格',
      dataIndex: 'standard',
      align: 'center',
      width: 150,
      hideInSearch: true
    },
    {
      title: '单位',
      dataIndex: 'unitId',
      align: 'center',
      width: 150,
      valueType: 'select',
      hideInSearch: true,
      request: async () => []
    },
    {
      title: '采购价格',
      dataIndex: 'purchasePrice',
      align: 'center',
      valueType: 'money',
      width: 150,
      hideInSearch: true
    },
    {
      title: '销售价格',
      dataIndex: 'salesPrice',
      align: 'center',
      width: 150,
      valueType: 'money',
      hideInSearch: true
    },
    {
      title: '最低价格',
      dataIndex: 'minPrice',
      align: 'center',
      width: 150,
      valueType: 'money',
      hideInSearch: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 150,
      hideInSearch: true,
      valueType: 'select',
      valueEnum: COMMON_STATUS
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 180,
      align: 'center',
      hideInSearch: true
    },
    {
      title: textConst.table.action,
      valueType: 'option',
      width: 150,
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
            onClick={() => handleDelete(record, deleteProduct, () => actionRef.current?.reload())}
          >
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<API.ErpProductRespVO>
        headerTitle="产品信息"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        search={{ labelWidth: 'auto', span: 6 }}
        options={false}
        request={async (params) => {
          const { current, pageSize, ...rest } = params
          const req = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...rest
          }
          try {
            const res = await getProductPage(req as any)
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
          </Button>
        ]}
      />

      <ProductForm
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

export default ProductManagement
