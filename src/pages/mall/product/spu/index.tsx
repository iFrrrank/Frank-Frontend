import React, { useEffect, useRef, useState } from 'react'
import { Button, Image } from 'antd'
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable, ProFormInstance } from '@ant-design/pro-components'
import { useNavigate } from '@umijs/max'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { PRODUCT_SPU_TYPE, SPU_STATUS } from '@/utils/constantsValue'
import { handleExport } from '@/components/Export'
import { deleteSpu, exportSpuList, getSpuCount, getSpuPage } from '@/api/mall/product/spu'
import { getCategoryList } from '@/api/mall/product/category'
import { handleDelete } from '@/components/Delete'

const ProductSpuManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<string>('0')
  // 各 tab 的商品数量（接口返回 Map<tabType, count>）
  const [tabCounts, setTabCounts] = useState<Record<string, number>>({})

  const loadTabCounts = async () => {
    try {
      const resp = await getSpuCount()
      if (resp.code === 0 && resp.data) {
        setTabCounts(resp.data as Record<string, number>)
      }
    } catch {
      // 计数加载失败不影响列表本身
    }
  }

  useEffect(() => {
    loadTabCounts()
  }, [])

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
      request: async () => {
        const resp = await getCategoryList({} as any)
        const list = (resp.data as any[]) || []
        return list.map((item: any) => ({ label: item.name, value: item.id }))
      }
    },
    { title: '商品编号', dataIndex: 'id', align: 'center', width: 100, hideInSearch: true },
    {
      title: '商品图片',
      dataIndex: 'picUrl',
      align: 'center',
      width: 90,
      hideInSearch: true,
      render: (_, record) => <Image src={record.picUrl} width={44} height={44} preview={false} />
    },
    {
      title: '价格',
      dataIndex: 'price',
      align: 'center',
      width: 110,
      hideInSearch: true,
      render: (_, record) => `￥${((record.price || 0) / 100).toFixed(2)}`
    },
    { title: '销量', dataIndex: 'salesCount', align: 'center', width: 90, hideInSearch: true },
    { title: '库存', dataIndex: 'stock', align: 'center', width: 150, hideInSearch: true },
    { title: '排序', dataIndex: 'sort', align: 'center', width: 150, hideInSearch: true },
    {
      title: '销售状态',
      dataIndex: 'status',
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
            onClick={() =>
              handleDelete(record, deleteSpu, () => {
                actionRef.current?.reload()
                loadTabCounts()
              })
            }
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
        const { current, pageSize, createTime, tabStatus, ...rest } = params as any
        const queryParams: Record<string, any> = {
          pageNo: current || 1,
          pageSize: pageSize || 10,
          tabType: Number(tabStatus ?? activeTab),
          ...rest
        }
        if (Array.isArray(createTime) && createTime.length === 2) {
          queryParams.createTime = [`${createTime[0]} 00:00:00`, `${createTime[1]} 23:59:59`]
        }
        const resp = await getSpuPage(queryParams as any)
        return {
          data: (resp.data as any)?.list || [],
          success: true,
          total: (resp.data as any)?.total || 0
        }
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
            // 标签形如“出售中”，拼上接口返回的实时数量
            label: `${item.label.replace(/\(\d+\)$/, '')}(${tabCounts[String(item.value)] ?? 0})`
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
