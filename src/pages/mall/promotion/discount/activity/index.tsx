import React, { useRef, useState } from 'react'
import { Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import DiscountActivityForm from './DiscountActivityForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'
import {
  getDiscountActivityPage,
  deleteDiscountActivity
} from '@/api/mall/promotion/discountActivity'
import { COMMON_STATUS } from '@/utils/constantsValue'

const DiscountActivityManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  const columns: ProColumns<any>[] = [
    {
      title: '活动ID',
      dataIndex: 'id',
      align: 'center',
      width: 180,
      hideInSearch: true
    },
    {
      title: '活动名称',
      dataIndex: 'name',
      align: 'center',
      width: 180,
      fieldProps: { placeholder: '请输入折扣活动名称' }
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      align: 'center',
      width: 180,
      valueType: 'select',
      fieldProps: { placeholder: '请选择折扣活动状态' },
      valueEnum: COMMON_STATUS
    },
    {
      title: '活动时间',
      dataIndex: 'activityTime',
      valueType: 'dateRange',
      hideInTable: true,
      align: 'center',
      width: 180,
      fieldProps: { placeholder: ['开始日期', '结束日期'] }
    },
    {
      title: '活动时间',
      dataIndex: 'displayTime',
      align: 'center',
      width: 180,
      hideInSearch: true,
      render: (_, record) => (
        <span>
          {record.startTime} ~ {record.endTime}
        </span>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      align: 'center',
      width: 180,
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
              handleDelete(record, deleteDiscountActivity, () => actionRef.current?.reload())
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
        headerTitle="限时折扣活动列表"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        search={{ labelWidth: 'auto', span: 6 }}
        request={async (params) => {
          const { current, pageSize, activityTime, ...rest } = params
          const req = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            startTime: activityTime?.[0] ? activityTime[0] + ' 00:00:00' : undefined,
            endTime: activityTime?.[1] ? activityTime[1] + ' 23:59:59' : undefined,
            ...rest
          }
          try {
            const res = await getDiscountActivityPage(req as any)
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

      <DiscountActivityForm
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

export default DiscountActivityManagement
