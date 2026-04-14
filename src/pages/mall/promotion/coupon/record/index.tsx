import React, { useRef, useState } from 'react'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'
import { deleteCouponTemplate, getCouponTemplate } from '@/api/mall/promotion/coupon/template'
import { COUPON_STATUS, DISCOUNT_TYPE, COUPON_TAKE_TYPE, COUPON_TYPE } from '@/utils/constantsValue'

const CouponRecordManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [activeStatus, setActiveStatus] = useState<number>(0)

  const columns: ProColumns<any>[] = [
    {
      title: '会员昵称',
      dataIndex: 'userNickname',
      align: 'center',
      width: 150,
      fieldProps: { placeholder: '请输入会员昵称' }
    },
    {
      title: '优惠券名称',
      dataIndex: 'name',
      align: 'center',
      width: 150,
      hideInSearch: true
    },
    {
      title: '优惠类型',
      dataIndex: 'discountType',
      align: 'center',
      width: 150,
      valueType: 'select',
      valueEnum: DISCOUNT_TYPE,
      fieldProps: { placeholder: '请选择优惠类型' }
    },
    {
      title: '优惠券类型',
      dataIndex: 'discount',
      align: 'center',
      width: 150,
      valueType: 'select',
      valueEnum: COUPON_TYPE,
      fieldProps: { placeholder: '请选择优惠券类型' }
    },
    {
      title: '领取方式',
      dataIndex: 'takeType',
      align: 'center',
      width: 150,
      valueType: 'select',
      valueEnum: COUPON_TAKE_TYPE,
      fieldProps: { placeholder: '请选择优惠券领取方式' }
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 150,
      valueType: 'select',
      valueEnum: COUPON_STATUS,
      fieldProps: { placeholder: '请选择优惠券状态' }
    },
    {
      title: '领取时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      align: 'center',
      width: 150,
      hideInSearch: true,
      render: (_, record) => record.createTime
    },
    {
      title: '使用时间',
      dataIndex: 'useTime',
      align: 'center',
      width: 150,
      hideInSearch: true,
      render: (_, record) => record.useTime
    },
    {
      title: textConst.table.action,
      valueType: 'option',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
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
    <ProTable<any>
      actionRef={actionRef}
      rowKey="id"
      form={{ colon: false }}
      columns={columns}
      search={{ labelWidth: 80, span: 6 }}
      toolbar={{
        menu: {
          type: 'tab',
          activeKey: activeStatus,
          items: Object.entries(COUPON_STATUS).map(([key, value]) => ({
            key: key,
            label: value.text
          })),
          onChange: (key) => {
            setActiveStatus(Number(key))
            // 切换 Tab 时回到第一页
            actionRef.current?.setPageInfo?.({ current: 1 })
            actionRef.current?.reload()
          }
        }
      }}
      request={async (params) => {
        const { current, pageSize, createTime, ...rest } = params
        const req = {
          pageNo: current || 1,
          pageSize: pageSize || 10,
          startTime: createTime?.[0] ? createTime[0] + ' 00:00:00' : undefined,
          endTime: createTime?.[1] ? createTime[1] + ' 23:59:59' : undefined,
          status: String(activeStatus) !== '' ? activeStatus : undefined,
          ...rest
        }
        try {
          const res = await getCouponTemplate(req as any)
          return {
            data: [],
            success: res.code === 0,
            total: 0
          }
        } catch (error) {
          return { data: [], success: false, total: 0 }
        }
      }}
      pagination={{ align: 'center', showSizeChanger: true }}
    />
  )
}

export default CouponRecordManagement
