import React, { useState, useRef } from 'react'
import { Modal, message } from 'antd'
import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components'
import { emptyTextStyle } from '@/styles/common.style'

interface ProductSelectModalProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSelect: (selectedRows: any[]) => void
  multiple?: boolean
}

const ProductSelectForm: React.FC<ProductSelectModalProps> = ({
  visible,
  setVisible,
  onSelect,
  multiple = true
}) => {
  const actionRef = useRef<ActionType>(undefined)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [selectedRows, setSelectedRows] = useState<any[]>([])

  const handleOk = () => {
    if (selectedRows.length === 0) {
      message.warning('请至少选择一件商品')
      return
    }
    onSelect(selectedRows)
    setVisible(false)
    setSelectedRowKeys([])
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const columns: ProColumns<any>[] = [
    {
      title: '商品编号',
      dataIndex: 'id',
      align: 'center',
      width: 130,
      hideInSearch: true
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      align: 'center',
      width: 130,
      fieldProps: { placeholder: '请输入商品名称' }
    },
    {
      title: '商品分类',
      dataIndex: 'categoryId',
      hideInTable: true,
      valueType: 'select',
      align: 'center',
      width: 130,
      fieldProps: { placeholder: '请选择商品分类' },
      request: async () => []
    },
    {
      title: '商品图',
      dataIndex: 'picUrl',
      valueType: 'image',
      align: 'center',
      width: 130,
      hideInSearch: true
    },
    {
      title: '商品售价',
      dataIndex: 'price',
      valueType: 'money',
      align: 'center',
      width: 130,
      hideInSearch: true
    },
    {
      title: '销量',
      dataIndex: 'sales',
      align: 'center',
      width: 130,
      hideInSearch: true
    },
    {
      title: '库存',
      dataIndex: 'stock',
      align: 'center',
      width: 130,
      hideInSearch: true
    },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      width: 130,
      hideInSearch: true
    }
  ]

  return (
    <Modal
      title="选择商品"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1000}
      destroyOnHidden
    >
      <ProTable<any>
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        scroll={{ x: 900, y: 400 }}
        columns={columns}
        search={{
          labelWidth: 'auto',
          span: 6
        }}
        options={false}
        rowSelection={{
          type: multiple ? 'checkbox' : 'radio',
          selectedRowKeys,
          onChange: (keys, rows) => {
            setSelectedRowKeys(keys)
            setSelectedRows(rows)
          }
        }}
        tableAlertRender={false}
        request={async (params) => {
          const { current, pageSize, createTime, ...rest } = params
          const req = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            startTime: createTime?.[0] ? createTime[0] + ' 00:00:00' : undefined,
            endTime: createTime?.[1] ? createTime[1] + ' 23:59:59' : undefined,
            ...rest
          }
          try {
            return {
              data: [],
              success: true,
              total: 0
            }
          } catch (error) {
            return { data: [], success: false, total: 0 }
          }
        }}
        pagination={{ align: 'center', defaultPageSize: 5 }}
        locale={{
          emptyText: <div style={emptyTextStyle}>暂无数据</div>
        }}
      />
    </Modal>
  )
}

export default ProductSelectForm
