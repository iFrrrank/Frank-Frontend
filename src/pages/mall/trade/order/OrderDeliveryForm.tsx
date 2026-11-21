import React, { useState } from 'react'
import { message } from 'antd'
import {
  ModalForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText
} from '@ant-design/pro-components'
import { deliveryOrder } from '@/api/mall/trade/order'
import { getSimpleDeliveryExpressList } from '@/api/mall/trade/delivery/express'
import { textConst } from '@/locales/zh-CN'

export let handleOpenOrderDelivery: (record: any, onSuccess: () => void) => void

// 订单发货：支持快递发货（选择物流公司 + 填写单号）与无需发货两种方式
const OrderDeliveryForm: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<any>(null)
  const [successCallback, setSuccessCallback] = useState<() => void>(() => () => {})
  // 发货方式：express 快递发货 / none 无需发货
  const [deliveryType, setDeliveryType] = useState<'express' | 'none'>('express')

  handleOpenOrderDelivery = (record: any, onSuccess: () => void) => {
    setCurrentOrder(record)
    setSuccessCallback(() => onSuccess)
    setDeliveryType('express')
    setVisible(true)
  }

  return (
    <ModalForm
      title="订单发货"
      open={visible}
      onOpenChange={setVisible}
      width={560}
      modalProps={{ destroyOnHidden: true }}
      onFinish={async (values) => {
        if (!currentOrder) {
          return false
        }
        try {
          // 无需发货时按约定传 logisticsId=0、单号为空
          const data =
            deliveryType === 'none'
              ? { id: currentOrder.id, logisticsId: 0, logisticsNo: '' }
              : {
                  id: currentOrder.id,
                  logisticsId: values.logisticsId,
                  logisticsNo: values.logisticsNo
                }
          const resp = await deliveryOrder(data as any)
          if (resp.code === 0) {
            message.success('发货成功')
            successCallback()
            return true
          }
          message.error(resp.msg || textConst.error.operationFail)
          return false
        } catch {
          message.error(textConst.error.operationFail)
          return false
        }
      }}
    >
      <ProFormRadio.Group
        label="发货方式"
        options={[
          { label: '快递发货', value: 'express' },
          { label: '无需发货', value: 'none' }
        ]}
        fieldProps={{
          value: deliveryType,
          onChange: (e) => setDeliveryType(e.target.value)
        }}
      />
      {deliveryType === 'express' && (
        <>
          <ProFormSelect
            name="logisticsId"
            label="物流公司"
            rules={[{ required: true, message: '请选择物流公司' }]}
            placeholder="请选择物流公司"
            request={async () => {
              const resp = await getSimpleDeliveryExpressList()
              return resp.data?.map((item: any) => ({ label: item.name, value: item.id })) || []
            }}
          />
          <ProFormText
            name="logisticsNo"
            label="物流单号"
            rules={[{ required: true, message: '请输入物流单号' }]}
            placeholder="请输入物流单号"
          />
        </>
      )}
    </ModalForm>
  )
}

export default OrderDeliveryForm
