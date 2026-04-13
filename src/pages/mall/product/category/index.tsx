import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import {
  PlusOutlined,
  SwapOutlined,
  CaretDownOutlined,
  CaretRightOutlined
} from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import CategoryForm from './CategoryForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'
import { getCategoryList, deleteCategory } from '@/api/mall/product/category'
import { handleTreeData } from '@/utils/tree'
import { COMMON_STATUS } from '@/utils/constantsValue'

const ProductCategoryManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  // 树形表格展开/折叠相关状态
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>([])
  const [isExpandAll, setIsExpandAll] = useState(false)
  const [allKeys, setAllKeys] = useState<React.Key[]>([])
  const [hasInitExpanded, setHasInitExpanded] = useState(false)

  // 展开/折叠切换逻辑
  const handleToggleExpandAll = () => {
    const nextState = !isExpandAll
    setIsExpandAll(nextState)
    if (nextState) {
      setExpandedRowKeys(allKeys)
    } else {
      setExpandedRowKeys([])
    }
  }

  const columns: ProColumns<any>[] = [
    {
      title: '分类名称',
      dataIndex: 'name',
      width: 250,
      align: 'center',
      fieldProps: { placeholder: '请输入商品分类名称' }
    },
    {
      title: '分类图片',
      dataIndex: 'picUrl',
      valueType: 'image',
      hideInSearch: true,
      width: 180,
      align: 'center'
    },
    {
      title: '分类状态',
      dataIndex: 'status',
      align: 'center',
      width: 180,
      valueType: 'select',
      fieldProps: { placeholder: '请选择商品分类状态' },
      valueEnum: COMMON_STATUS
    },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      width: 180,
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
            onClick={() =>
              handleDelete(
                record,
                deleteCategory,
                () => actionRef.current?.reload(),
                '确认删除该分类？（若存在子分类则不允许删除）'
              )
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
        headerTitle="商品分类"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        search={{ labelWidth: 'auto', span: 6 }}
        pagination={false}
        // 控制展开和折叠状态
        expandable={{
          expandedRowKeys,
          onExpandedRowsChange: (keys) => {
            setExpandedRowKeys(keys)
            if (keys.length === 0) setIsExpandAll(false)
          },
          expandIcon: ({ expanded, onExpand, record }) => {
            if (record.children && record.children.length > 0) {
              return expanded ? (
                <CaretDownOutlined
                  style={{ marginRight: 8, cursor: 'pointer', color: '#666' }}
                  onClick={(e) => onExpand(record, e)}
                />
              ) : (
                <CaretRightOutlined
                  style={{ marginRight: 8, cursor: 'pointer', color: '#666' }}
                  onClick={(e) => onExpand(record, e)}
                />
              )
            }
            return <span style={{ display: 'inline-block', width: 22 }} />
          }
        }}
        request={async (params) => {
          const { current, pageSize, ...rest } = params
          const resp = await getCategoryList(rest as any)

          if (resp.code === 0 && resp.data) {
            const list = resp.data || []

            const parentKeys: React.Key[] = list
              .filter((item: any) => list.some((child: any) => child.parentId === item.id))
              .map((item: any) => item.id as number)
            setAllKeys(parentKeys)

            if (!hasInitExpanded && list.length > 0) {
              setExpandedRowKeys(parentKeys)
              setIsExpandAll(true)
              setHasInitExpanded(true)
            }
            const treeData = handleTreeData(list, 0)
            return {
              data: treeData,
              success: true
            }
          }
          return { data: [], success: false }
        }}
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
            key="expand"
            type="default"
            color="blue"
            variant="outlined"
            icon={<SwapOutlined rotate={90} />}
            onClick={handleToggleExpandAll}
          >
            {textConst.action.expandOrCollapse}
          </Button>
        ]}
      />

      <CategoryForm
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
