import React, { useRef, useState } from 'react'
import { Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import PickUpStoreForm from './PickUpStoreForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'
import {
  getDeliveryPickUpStorePage,
  deleteDeliveryPickUpStore
} from '@/api/mall/trade/delivery/pickUpStore'
import { COMMON_STATUS } from '@/utils/constantsValue'

const DeliveryPickUpStoreManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  const columns: ProColumns<any>[] = [
    {
      title: '门店 ID',
      dataIndex: 'id',
      align: 'center',
      width: 150,
      hideInSearch: true
    },
    {
      title: '门店名称',
      dataIndex: 'name',
      align: 'center',
      width: 150,
      fieldProps: { placeholder: '请输入门店名称' }
    },
    {
      title: '门店 logo',
      dataIndex: 'logo',
      valueType: 'image',
      align: 'center',
      width: 150,
      hideInSearch: true
    },
    {
      title: '门店状态',
      dataIndex: 'status',
      valueType: 'select',
      align: 'center',
      width: 150,
      fieldProps: { placeholder: '全部' },
      valueEnum: COMMON_STATUS
    },
    {
      title: '门店手机',
      dataIndex: 'phone',
      align: 'center',
      width: 150,
      fieldProps: { placeholder: '请输入门店手机' }
    },
    {
      title: '地址',
      dataIndex: 'detailAddress',
      align: 'center',
      width: 150,
      hideInSearch: true,
      ellipsis: true
    },
    {
      title: '营业时间',
      dataIndex: 'businessTime',
      align: 'center',
      width: 150,
      hideInSearch: true,
      render: (_, record) => (
        <span>
          {record.openingTime} ~ {record.closingTime}
        </span>
      )
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
              handleDelete(record, deleteDeliveryPickUpStore, () => actionRef.current?.reload())
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
        headerTitle="门店管理"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        search={{ labelWidth: 'auto', span: 6 }}
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
            const res = await getDeliveryPickUpStorePage(req as any)
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
          </Button>
        ]}
      />

      <PickUpStoreForm
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

export default DeliveryPickUpStoreManagement
