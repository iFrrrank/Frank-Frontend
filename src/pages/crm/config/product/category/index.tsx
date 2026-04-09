import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { getProductCategoryList, deleteProductCategory } from '@/api/crm/productCategory'
import ProductCategoryForm from './ProductCategoryForm'
import { handleTreeData } from '@/utils/tree'
import { textConst } from '@/locales/zh-CN'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { handleDelete } from '@/components/Delete'

const ProductCategoryManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
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

  const columns: ProColumns<any>[] = [
    {
      title: '分类编号',
      dataIndex: 'id',
      width: 120,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '分类名称',
      dataIndex: 'name',
      width: 200,
      align: 'center',
      fieldProps: { placeholder: '请输入分类名称' }
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
              handleDelete(record, deleteProductCategory, () => actionRef.current?.reload())
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
      <ProTable<any>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        form={{ colon: false }}
        search={{
          labelWidth: 'auto'
        }}
        pagination={false}
        request={async (params) => {
          const { current, pageSize, ...rest } = params
          const res = await getProductCategoryList({ listReqVO: rest } as any)
          if (res.data) {
            const treeData = handleTreeData(res.data, 0)
            return {
              data: treeData,
              success: true
            }
          }
          return { data: [], success: true }
        }}
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={handleCreate}>
            {textConst.action.create}
          </Button>
        ]}
      />

      <ProductCategoryForm
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

export default ProductCategoryManagement
