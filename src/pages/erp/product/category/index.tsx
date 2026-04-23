import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import {
  PlusOutlined,
  DownloadOutlined,
  SwapOutlined,
  CaretDownOutlined,
  CaretRightOutlined
} from '@ant-design/icons'
import { ActionType, ProColumns, ProTable, ProFormInstance } from '@ant-design/pro-components'
import ProductCategoryForm from './ProductCategoryForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'
import {
  getProductCategoryList,
  deleteProductCategory,
  exportProductCategoryExcel
} from '@/api/erp/product/category'
import { COMMON_STATUS } from '@/utils/constantsValue'
import { handleTreeData } from '@/utils/tree'
import { handleExport } from '@/components/Export'

const ProductCategoryManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>([])
  const [isExpandAll, setIsExpandAll] = useState(false)
  const [allKeys, setAllKeys] = useState<React.Key[]>([])
  const [flatDeptData, setFlatDeptData] = useState<any[]>([])
  const [hasInitExpanded, setHasInitExpanded] = useState(false)

  // 展开折叠切换
  const handleToggleExpandAll = () => {
    const nextState = !isExpandAll
    setIsExpandAll(nextState)
    if (nextState) {
      setExpandedRowKeys(allKeys)
    } else {
      setExpandedRowKeys([])
    }
  }

  const handleExportBtnClick = () => {
    // 获取表单当前的值
    const formValues = formRef.current?.getFieldsValue?.() || {}
    handleExport({
      exportApi: exportProductCategoryExcel,
      exportParams: { ...formValues },
      fileName: '产品分类列表.xlsx'
    })
  }

  const columns: ProColumns<any>[] = [
    {
      title: '分类名称',
      dataIndex: 'name',
      align: 'center',
      fieldProps: { placeholder: '请输入产品分类名称' }
    },
    {
      title: '分类状态',
      dataIndex: 'status',
      align: 'center',
      valueType: 'select',
      fieldProps: { placeholder: '请选择产品分类状态' },
      valueEnum: COMMON_STATUS
    },
    {
      title: '编码',
      dataIndex: 'code',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
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
        headerTitle="产品分类"
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
          const resp = await getProductCategoryList(rest as any)

          if (resp.code === 0 && resp.data) {
            const list = resp.data || []
            setFlatDeptData(list)

            // 提取所有父节点 id 用于全部展开
            const parentKeys: React.Key[] = list
              .filter((item) => list.some((child) => child.parentId === item.id))
              .map((item) => item.id as number)
            setAllKeys(parentKeys)

            if (!hasInitExpanded && list.length > 0) {
              setExpandedRowKeys(parentKeys)
              setIsExpandAll(true)
              setHasInitExpanded(true)
            }

            // 构建树形数据
            const treeData = handleTreeData(list, 0)
            if (resp.code === 0 && resp.data) {
              return {
                data: treeData,
                success: true
              }
            }
          }
          return { data: [], success: true }
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
            key="export"
            color="volcano"
            variant="outlined"
            icon={<DownloadOutlined />}
            onClick={handleExportBtnClick}
          >
            {textConst.action.export}
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
