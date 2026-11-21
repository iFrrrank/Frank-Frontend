import React, { useRef, useState } from 'react'
import { Button, Drawer, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProFormText,
  ProTable
} from '@ant-design/pro-components'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'
import {
  createPropertyValue,
  deletePropertyValue,
  getPropertyValue,
  getPropertyValuePage,
  updatePropertyValue
} from '@/api/mall/product/property'

export let handleOpenPropertyValueList: (property: { id: number; name?: string }) => void

// 属性值管理抽屉：某个商品属性下的属性值增删改查
const PropertyValueList: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [visible, setVisible] = useState(false)
  const [property, setProperty] = useState<{ id: number; name?: string }>()
  const [formVisible, setFormVisible] = useState(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  handleOpenPropertyValueList = (record) => {
    setProperty(record)
    setVisible(true)
  }

  const columns: ProColumns<any>[] = [
    { title: '编号', dataIndex: 'id', align: 'center', width: 80 },
    { title: '属性值', dataIndex: 'name' },
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
      width: 120,
      align: 'center',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a
            onClick={() => {
              setCurrentId(record.id)
              setFormVisible(true)
            }}
          >
            {textConst.action.update}
          </a>
          <a
            style={deleteTextStyle}
            onClick={() =>
              handleDelete(record, deletePropertyValue, () => actionRef.current?.reload())
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
      <Drawer
        title={`属性值 - ${property?.name || ''}`}
        open={visible}
        onClose={() => setVisible(false)}
        width={640}
        destroyOnHidden
      >
        <ProTable<any>
          actionRef={actionRef}
          rowKey="id"
          form={{ colon: false }}
          columns={columns}
          search={false}
          options={false}
          request={async (params: Record<string, any>) => {
            if (!property) return { data: [], success: true, total: 0 }
            const resp = await getPropertyValuePage({
              pageNo: params.current || 1,
              pageSize: params.pageSize || 10,
              propertyId: property.id
            } as any)
            return {
              data: resp.data?.list || [],
              success: true,
              total: resp.data?.total || 0
            }
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="create"
              size="small"
              onClick={() => {
                setCurrentId(undefined)
                setFormVisible(true)
              }}
            >
              <PlusOutlined /> {textConst.action.create}
            </Button>
          ]}
          pagination={{ align: 'center', pageSize: 10 }}
        />
      </Drawer>

      <ModalForm
        title={currentId !== undefined ? '编辑属性值' : '新增属性值'}
        open={formVisible}
        onOpenChange={setFormVisible}
        width={440}
        modalProps={{ destroyOnHidden: true, zIndex: 1100 }}
        request={async () => {
          if (currentId !== undefined) {
            const resp = await getPropertyValue({ id: currentId } as any)
            return (resp.data as any) || {}
          }
          return {}
        }}
        onFinish={async (values) => {
          try {
            if (currentId !== undefined) {
              await updatePropertyValue({ ...values, id: currentId, propertyId: property?.id })
              message.success(textConst.msg.updateSuccess)
            } else {
              await createPropertyValue({ ...values, propertyId: property?.id })
              message.success(textConst.msg.createSuccess)
            }
            actionRef.current?.reload()
            return true
          } catch {
            message.error(textConst.error.operationFail)
            return false
          }
        }}
      >
        <ProFormText
          name="name"
          label="属性值"
          rules={[{ required: true, message: '请输入属性值' }]}
          placeholder="请输入属性值"
        />
      </ModalForm>
    </>
  )
}

export default PropertyValueList
