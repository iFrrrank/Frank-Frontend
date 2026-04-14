import React, { useRef, useState } from 'react'
import { Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import CouponTemplateForm from './CouponTemplateForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'
import { getCouponTemplatePage, deleteCouponTemplate } from '@/api/mall/promotion/coupon/template'
import { COMMON_STATUS, DISCOUNT_TYPE, COUPON_TAKE_TYPE, COUPON_TYPE } from '@/utils/constantsValue'

const CouponTemplateManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  const columns: ProColumns<any>[] = [
    {
      title: '优惠券名称',
      dataIndex: 'name',
      align: 'center',
      width: 120,
      fieldProps: { placeholder: '请输入优惠券名称' }
    },
    {
      title: '优惠类型',
      dataIndex: 'discountType',
      align: 'center',
      width: 120,
      valueType: 'select',
      fieldProps: { placeholder: '请选择优惠类型' },
      valueEnum: DISCOUNT_TYPE
    },
    {
      title: '优惠券类型',
      dataIndex: 'discount',
      align: 'center',
      width: 120,
      valueType: 'select',
      fieldProps: { placeholder: '请选择优惠券类型' },
      valueEnum: COUPON_TYPE
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 120,
      valueType: 'select',
      fieldProps: { placeholder: '请选择优惠券状态' },
      valueEnum: COMMON_STATUS
    },
    {
      title: '领取方式',
      dataIndex: 'takeType',
      align: 'center',
      width: 120,
      hideInSearch: true,
      valueEnum: COUPON_TAKE_TYPE
    },
    {
      title: '发放数量',
      dataIndex: 'totalCount',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '剩余数量',
      dataIndex: 'remainCount',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '领取上限',
      dataIndex: 'takeLimitCount',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      align: 'center',
      width: 120,
      fieldProps: { placeholder: ['开始日期', '结束日期'] },
      render: (_, record) => record.createTime
    },
    {
      title: '使用时间',
      dataIndex: 'validTime',
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
              handleDelete(record, deleteCouponTemplate, () => actionRef.current?.reload())
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
        headerTitle="优惠券列表"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        search={{ labelWidth: 80, span: 6 }}
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
            const res = await getCouponTemplatePage(req as any)
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

      <CouponTemplateForm
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

export default CouponTemplateManagement
