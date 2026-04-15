import React, { useState, useRef } from 'react'
import { Modal, message } from 'antd'
import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components'
import { emptyTextStyle } from '@/styles/common.style'
import { getCouponPage } from '@/api/mall/promotion/coupon/coupon'
import { COMMON_STATUS, DISCOUNT_TYPE_OPTIONS, COUPON_TAKE_TYPE } from '@/utils/constantsValue'

interface CouponSelectModalProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSelect: (selectedRows: any[]) => void
  multiple?: boolean
}

const CouponSelectModal: React.FC<CouponSelectModalProps> = ({
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
      message.warning('请至少选择一张优惠券')
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
      title: '优惠券名称',
      dataIndex: 'name',
      align: 'center',
      order: 2,
      fieldProps: { placeholder: '请输入优惠券名称' }
    },
    {
      title: '优惠类型',
      dataIndex: 'discountType',
      align: 'center',
      valueType: 'select',
      order: 1,
      formItemProps: { label: '优惠类型' },
      fieldProps: { placeholder: '请选择优惠类型' },
      request: async () => DISCOUNT_TYPE_OPTIONS
    },
    {
      title: '优惠',
      dataIndex: 'discount',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '领取方式',
      dataIndex: 'takeType',
      align: 'center',
      hideInSearch: true,
      valueEnum: COUPON_TAKE_TYPE
    },
    {
      title: '使用时间',
      dataIndex: 'validTime',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '发放数量',
      dataIndex: 'totalCount',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '剩余数量',
      dataIndex: 'remainCount',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '领取上限',
      dataIndex: 'takeLimitCount',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      hideInSearch: true,
      valueEnum: COMMON_STATUS
    }
  ]

  return (
    <Modal
      title="选择优惠券"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1100}
      destroyOnHidden
    >
      <ProTable<any>
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        scroll={{ x: 'max-content', y: 400 }}
        columns={columns}
        search={{
          labelWidth: 'auto',
          span: 8
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
          const { current, pageSize, ...rest } = params
          const req = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...rest
          }
          try {
            const res = await getCouponPage(req as any)
            return {
              data: res.data?.list || [],
              success: true,
              total: res.data?.total || 0
            }
          } catch (error) {
            return { data: [], success: false, total: 0 }
          }
        }}
        pagination={{ align: 'center', defaultPageSize: 10 }}
        locale={{
          emptyText: <div style={emptyTextStyle}>暂无数据</div>
        }}
      />
    </Modal>
  )
}

export default CouponSelectModal
