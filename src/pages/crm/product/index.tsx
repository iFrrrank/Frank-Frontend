import { history } from '@umijs/max'
import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable, ProFormInstance } from '@ant-design/pro-components'
import { getProductPage, deleteProduct, exportProductExcel } from '@/api/crm/product'
import ProductForm from './ProductForm'
import { PRODUCT_STATUS_ENUM } from '@/utils/constantsValue'
import { textConst } from '@/locales/zh-CN'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { handleDelete } from '@/components/Delete'
import { handleExport } from '@/components/Export'

const ProductManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

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
      exportApi: exportProductExcel,
      exportParams: { ...formValues },
      fileName: '产品列表数据.xlsx'
    })
  }

  const columns: ProColumns<API.CrmProductRespVO>[] = [
    {
      title: '产品名称',
      dataIndex: 'name',
      align: 'center',
      width: 160,
      fieldProps: { placeholder: '请输入产品名称' },
      render: (_, record) => (
        <a onClick={() => history.push('/crm/product/detail?id=' + record.id)}>{record.name}</a>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      hideInTable: true,
      valueType: 'select',
      valueEnum: PRODUCT_STATUS_ENUM,
      fieldProps: { placeholder: '请选择产品状态' }
    },
    {
      title: '产品类型',
      dataIndex: 'categoryName',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '产品单位',
      dataIndex: 'unit',
      align: 'center',
      width: 80,
      hideInSearch: true
    },
    {
      title: '产品编码',
      dataIndex: 'barCode',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '价格（元）',
      dataIndex: 'price',
      align: 'center',
      width: 100,
      hideInSearch: true,
      render: (_, record) => (record.price ? record.price.toFixed(2) : '0.00')
    },
    {
      title: '产品描述',
      dataIndex: 'description',
      align: 'center',
      width: 160,
      ellipsis: true,
      hideInSearch: true
    },
    {
      title: '上架状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      hideInSearch: true,
      valueEnum: PRODUCT_STATUS_ENUM
    },
    {
      title: '负责人',
      dataIndex: 'ownerUserName',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      align: 'center',
      valueType: 'dateTime',
      width: 150,
      hideInSearch: true
    },
    {
      title: '创建人',
      dataIndex: 'createUserName',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      align: 'center',
      width: 150,
      hideInSearch: true
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a key="update" onClick={() => handleUpdate(record.id as number)}>
            {textConst.action.update}
          </a>
          <a
            key="delete"
            onClick={() => handleDelete(record, deleteProduct, () => actionRef.current?.reload())}
            style={deleteTextStyle}
          >
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<API.CrmProductRespVO>
        headerTitle="产品管理"
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        form={{ colon: false }}
        request={async (params) => {
          const { current, pageSize, ...rest } = params
          const req = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...rest
          }
          const res = await getProductPage({ pageVO: req } as any)
          return {
            data: res.data?.list || [],
            success: res.code === 0,
            total: res.data?.total || 0
          }
        }}
        search={{
          labelWidth: 'auto',
          span: 6
        }}
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
