import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import BargainActivityForm from './BargainActivityForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'
import {
  getBargainActivityPage,
  deleteBargainActivity
} from '@/api/mall/promotion/bargain/activity'
import { COMMON_STATUS } from '@/utils/constantsValue'

const BargainActivityManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  const columns: ProColumns<any>[] = [
    {
      title: '活动ID',
      dataIndex: 'id',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '活动名称',
      dataIndex: 'name',
      align: 'center',
      width: 100,
      fieldProps: { placeholder: '请输入活动名称' }
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      align: 'center',
      valueType: 'select',
      width: 100,
      fieldProps: { placeholder: '请选择活动状态' },
      valueEnum: COMMON_STATUS
    },
    {
      title: '活动时间',
      dataIndex: 'activityTime',
      align: 'center',
      width: 100,
      hideInSearch: true,
      render: (_, record) => (
        <span>
          {record.startTime} ~ {record.endTime}
        </span>
      )
    },
    {
      title: '商品标题',
      dataIndex: 'spuName',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '商品图片',
      dataIndex: 'picUrl',
      valueType: 'image',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '起始价格',
      dataIndex: 'bargainFirstPrice',
      valueType: 'money',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '砍价底价',
      dataIndex: 'bargainMinPrice',
      valueType: 'money',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '总砍价人数',
      dataIndex: 'recordUserCount',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '成功砍价人数',
      dataIndex: 'recordSuccessUserCount',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '助力人数',
      dataIndex: 'helpUserCount',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '库存',
      dataIndex: 'stock',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '总库存',
      dataIndex: 'totalStock',
      align: 'center',
      width: 100,
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
              handleDelete(record, deleteBargainActivity, () => actionRef.current?.reload())
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
        headerTitle="砍价商品列表"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        search={{ labelWidth: 'auto', span: 6 }}
        request={async (params) => {
          const { current, pageSize, ...rest } = params
          const req = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...rest
          }
          try {
            const res = await getBargainActivityPage(req as any)
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

      <BargainActivityForm
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

export default BargainActivityManagement
