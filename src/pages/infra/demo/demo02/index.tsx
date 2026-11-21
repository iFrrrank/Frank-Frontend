import React, { useEffect, useState } from 'react'
import { Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  ModalForm,
  ProFormText,
  ProFormTreeSelect,
  ProTable,
  ProColumns
} from '@ant-design/pro-components'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'
import { handleExport } from '@/components/Export'
import {
  createDemo02Category,
  deleteDemo02Category,
  exportDemo02Category,
  getDemo02Category,
  getDemo02CategoryList,
  updateDemo02Category
} from '@/api/infra/demo02'

// 将平铺分类列表组装为树形结构（parentId 为 0 表示顶级）
const buildCategoryTree = (list: any[]): any[] => {
  const map = new Map<number, any>()
  list.forEach((item) => map.set(item.id, { ...item, children: [] }))
  const roots: any[] = []
  list.forEach((item) => {
    const node = map.get(item.id)
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId).children.push(node)
    } else {
      roots.push(node)
    }
  })
  const prune = (nodes: any[]) =>
    nodes.forEach((node) => {
      if (node.children.length === 0) delete node.children
      else prune(node.children)
    })
  prune(roots)
  return roots
}

// 示例分类列表（树表 CRUD 示例页）
const Demo02CategoryManagement: React.FC = () => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [formVisible, setFormVisible] = useState(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  const load = async () => {
    setLoading(true)
    try {
      const resp = await getDemo02CategoryList()
      if (resp.code === 0) {
        setData(buildCategoryTree(resp.data || []))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const columns: ProColumns<any>[] = [
    { title: '分类名称', dataIndex: 'name', width: 260 },
    { title: '编号', dataIndex: 'id', align: 'center', width: 100 },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 170,
      render: (_, record) => <span>{record.createTime || '-'}</span>
    },
    {
      title: textConst.table.action,
      valueType: 'option',
      width: 160,
      align: 'center',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a
            onClick={() => {
              setCurrentId(undefined)
              setFormVisible(true)
              // 新增子分类时预置父级
              setTimeout(() => setPendingParentId(record.id), 0)
            }}
          >
            新增子分类
          </a>
          <a
            onClick={() => {
              setCurrentId(record.id)
              setFormVisible(true)
            }}
          >
            {textConst.action.update}
          </a>
          <a style={deleteTextStyle} onClick={() => handleDelete(record, deleteDemo02Category, load)}>
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  const [pendingParentId, setPendingParentId] = useState<number>()

  return (
    <>
      <ProTable<any>
        headerTitle="示例分类"
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        dataSource={data}
        loading={loading}
        search={false}
        options={{ reload: load }}
        pagination={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            onClick={() => {
              setCurrentId(undefined)
              setPendingParentId(0)
              setFormVisible(true)
            }}
          >
            <PlusOutlined /> {textConst.action.create}
          </Button>,
          <Button
            key="export"
            onClick={() =>
              handleExport({
                exportApi: exportDemo02Category,
                exportParams: {},
                fileName: '示例分类.xls'
              })
            }
          >
            {textConst.action.export}
          </Button>
        ]}
      />

      <ModalForm
        title={currentId !== undefined ? '编辑示例分类' : '新增示例分类'}
        open={formVisible}
        onOpenChange={(val) => {
          setFormVisible(val)
          if (!val) setPendingParentId(undefined)
        }}
        width={480}
        modalProps={{ destroyOnHidden: true }}
        request={async () => {
          if (currentId !== undefined) {
            const resp = await getDemo02Category({ id: currentId })
            return (resp.data as any) || {}
          }
          return { parentId: pendingParentId ?? 0 }
        }}
        onFinish={async (values) => {
          try {
            if (currentId !== undefined) {
              await updateDemo02Category({ ...values, id: currentId })
              message.success(textConst.msg.updateSuccess)
            } else {
              await createDemo02Category(values)
              message.success(textConst.msg.createSuccess)
            }
            load()
            return true
          } catch {
            message.error(textConst.error.operationFail)
            return false
          }
        }}
      >
        <ProFormTreeSelect
          name="parentId"
          label="父级分类"
          rules={[{ required: true, message: '请选择父级分类' }]}
          fieldProps={{ style: { width: '100%' } }}
          request={async () => {
            const resp = await getDemo02CategoryList()
            const list = (resp.data || []) as any[]
            // 组装为 TreeSelect 数据（value/title/children）
            const map = new Map<number, any>()
            list.forEach((item) =>
              map.set(item.id, { title: item.name, value: item.id, children: [] })
            )
            const roots: any[] = []
            list.forEach((item) => {
              const node = map.get(item.id)
              if (item.parentId && map.has(item.parentId)) {
                map.get(item.parentId).children.push(node)
              } else {
                roots.push(node)
              }
            })
            const prune = (nodes: any[]) =>
              nodes.forEach((node) => {
                if (node.children.length === 0) delete node.children
                else prune(node.children)
              })
            prune(roots)
            return [{ title: '顶级分类', value: 0, children: roots }]
          }}
        />
        <ProFormText
          name="name"
          label="分类名称"
          rules={[{ required: true, message: '请输入分类名称' }]}
          placeholder="请输入分类名称"
        />
      </ModalForm>
    </>
  )
}

export default Demo02CategoryManagement
