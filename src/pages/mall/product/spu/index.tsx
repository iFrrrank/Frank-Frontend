import React, { useRef, useState } from 'react'
import { Button, message } from 'antd'
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable, ProFormInstance } from '@ant-design/pro-components'
import { useNavigate } from '@umijs/max'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { PRODUCT_SPU_TYPE, SPU_STATUS } from '@/utils/constantsValue'
import { handleExport } from '@/components/Export'
import { exportSpuList } from '@/api/mall/product/spu'

const ProductSpuManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<string>('0')

  const handleExportBtnClick = () => {
    // 获取表单当前的值
    const formValues = formRef.current?.getFieldsValue?.() || {}
    handleExport({
      exportApi: exportSpuList,
      exportParams: { ...formValues },
      fileName: '商品 SPU.xlsx'
    })
  }

  const columns: ProColumns<any>[] = [
    {
      title: '商品名称',
      dataIndex: 'name',
      align: 'center',
      width: 200,
      fieldProps: { placeholder: '请输入商品名称' }
    },
    {
      title: '商品分类',
      dataIndex: 'categoryId',
      valueType: 'select',
      align: 'center',
      width: 200,
      fieldProps: { placeholder: '请选择商品分类' },
      request: async () => []
    },
    { title: '商品编号', dataIndex: 'spuNo', align: 'center', width: 150, hideInSearch: true },
    {
      title: '商品信息',
      dataIndex: 'productInfo',
      align: 'center',
      width: 150,
      hideInSearch: true
    },
    {
      title: '价格',
      dataIndex: 'price',
      align: 'center',
      width: 150,
      valueType: 'money',
      hideInSearch: true
    },
    { title: '销量', dataIndex: 'sales', align: 'center', width: 150, hideInSearch: true },
    { title: '库存', dataIndex: 'stock', align: 'center', width: 150, hideInSearch: true },
    { title: '排序', dataIndex: 'sort', align: 'center', width: 150, hideInSearch: true },
    {
      title: '销售状态',
      dataIndex: 'saleStatus',
      align: 'center',
      hideInSearch: true,
      width: 150,
      valueEnum: SPU_STATUS
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      align: 'center',
      width: 150,
      fieldProps: { placeholder: ['开始日期', '结束日期'] }
    },
    {
      title: '操作',
      valueType: 'option',
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a key="edit" onClick={() => navigate(`/mall/product/spu/edit?id=${record.id}`)}>
            {textConst.action.update}
          </a>
          <a
            key="delete"
            style={deleteTextStyle}
            onClick={() => message.success(textConst.msg.delSuccess)}
          >
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <ProTable<any>
      actionRef={actionRef}
      rowKey="id"
      form={{ colon: false }}
      columns={columns}
      search={{ labelWidth: 'auto', span: 6 }}
      params={{ tabStatus: activeTab }}
      request={async (params) => {
        // TODO
        return { data: [], success: true, total: 0 }
      }}
      pagination={{ align: 'center', showSizeChanger: true }}
      toolbar={{
        actions: [
          <Button
            key="create"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => navigate('/mall/product/spu/add')}
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
        ],
        menu: {
          type: 'tab',
          activeKey: activeTab,
          items: PRODUCT_SPU_TYPE.map((item) => ({
            key: String(item.value),
            label: item.label
          })),
          onChange: (key) => {
            setActiveTab(key as string)
            actionRef.current?.reload()
          }
        }
      }}
    />
  )
}

export default ProductSpuManagement
