import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import CombinationActivityForm from './CombinationActivityForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'
import {
  getCombinationActivityPage,
  deleteCombinationActivity
} from '@/api/mall/promotion/combination/activity'
import { COMMON_STATUS } from '@/utils/constantsValue'

const CombinationActivityManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  const columns: ProColumns<any>[] = [
    {
      title: '活动ID',
      dataIndex: 'id',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '活动名称',
      dataIndex: 'name',
      align: 'center',
      width: 120,
      fieldProps: { placeholder: '请输入活动名称' }
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      align: 'center',
      width: 120,
      valueType: 'select',
      fieldProps: { placeholder: '请选择活动状态' },
      valueEnum: COMMON_STATUS
    },
    {
      title: '活动时间',
      dataIndex: 'activityTime',
      align: 'center',
      width: 120,
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
      width: 120,
      hideInSearch: true
    },
    {
      title: '商品图片',
      dataIndex: 'picUrl',
      valueType: 'image',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '原价',
      dataIndex: 'price',
      valueType: 'money',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '拼团价',
      dataIndex: 'combinationPrice',
      valueType: 'money',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '开团组数',
      dataIndex: 'groupCount',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '成团组数',
      dataIndex: 'groupSuccessCount',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '购买次数',
      dataIndex: 'recordCount',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      align: 'center',
      width: 120,
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
              handleDelete(record, deleteCombinationActivity, () => actionRef.current?.reload())
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
        headerTitle="拼团商品列表"
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
            const res = await getCombinationActivityPage(req as any)
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

      <CombinationActivityForm
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

export default CombinationActivityManagement
