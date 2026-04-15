import React, { useRef, useState } from 'react'
import { Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import SeckillActivityForm from './SeckillActivityForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'
import {
  getSeckillActivityPage1,
  deleteSeckillActivity
} from '@/api/mall/promotion/seckill/activity'
import { COMMON_STATUS } from '@/utils/constantsValue'

const SeckillActivityManagement: React.FC = () => {
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
      title: '秒杀时段',
      dataIndex: 'timeNames',
      align: 'center',
      width: 120,
      hideInSearch: true
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
      title: '秒杀价',
      dataIndex: 'seckillPrice',
      valueType: 'money',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '总库存',
      dataIndex: 'totalStock',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '库存',
      dataIndex: 'stock',
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
              handleDelete(record, deleteSeckillActivity, () => actionRef.current?.reload())
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
        headerTitle="秒杀商品列表"
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
            const res = await getSeckillActivityPage1(req as any)
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

      <SeckillActivityForm
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

export default SeckillActivityManagement
