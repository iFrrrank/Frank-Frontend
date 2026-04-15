import React, { useState } from 'react'
import { message, Form, Space, Button } from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormDigit,
  ProFormTextArea,
  ProFormDateTimeRangePicker,
  ProFormDependency,
  ProFormSelect,
  ProFormUploadButton,
  ProForm
} from '@ant-design/pro-components'
import {
  createCouponTemplate,
  updateCouponTemplate,
  getCouponTemplate
} from '@/api/mall/promotion/coupon/template'
import { textConst } from '@/locales/zh-CN'
import {
  COUPON_TYPE_OPTIONS,
  DISCOUNT_TYPE_OPTIONS,
  COUPON_TEMPLATE_VALIDITY_TYPE_OPTIONS,
  COUPON_TAKE_TYPE_OPTIONS
} from '@/utils/constantsValue'
import ProductSelectModal from './ProductSelectModal'

interface CouponTemplateFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const CouponTemplateForm: React.FC<CouponTemplateFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  id
}) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()
  const [productModalVisible, setProductModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  return (
    <ModalForm
      title={isUpdate ? textConst.action.update : textConst.action.create}
      open={visible}
      onOpenChange={setVisible}
      form={form}
      layout="horizontal"
      modalProps={{
        destroyOnHidden: true,
        onCancel: () => form.resetFields()
      }}
      colon={false}
      labelAlign="right"
      width={550}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getCouponTemplate({ id } as any)
          return resp.data as Record<string, any>
        }
        return {
          productScope: 1, // 默认"通用券"
          discountType: 1, // 默认"满减"
          takeType: 1, // 默认"直接领取"
          validityType: 1 // 默认"固定日期"
        }
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateCouponTemplate({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createCouponTemplate(values as any)
            message.success(textConst.msg.createSuccess)
          }
          onSuccess()
          return true
        } catch (e) {
          message.error(textConst.error.operationFail)
          return false
        }
      }}
    >
      <ProFormText
        name="name"
        label="优惠券名称"
        rules={[{ required: true, message: '请输入优惠券名称' }]}
        placeholder="请输入优惠券名称"
      />
      <ProFormTextArea
        name="description"
        label="优惠券描述"
        placeholder="请输入优惠券描述"
        fieldProps={{ maxLength: 512, showCount: true, rows: 2 }}
      />
      <ProFormRadio.Group
        name="productScope"
        label="优惠券类型"
        rules={[{ required: true, message: '请选择优惠券类型' }]}
        options={COUPON_TYPE_OPTIONS}
      />
      <ProFormDependency name={['productScope']}>
        {({ productScope }) => {
          if (productScope === 2) {
            return (
              <ProForm.Item
                name="description"
                label="商品"
                rules={[{ required: true, message: '请选择关联商品' }]}
                required
              >
                <Button onClick={() => setProductModalVisible(true)}>选择商品</Button>
                {selectedProduct && (
                  <span style={{ marginLeft: 8 }}>已选: {selectedProduct.name}</span>
                )}
                <ProductSelectModal
                  visible={productModalVisible}
                  setVisible={setProductModalVisible}
                  multiple={false}
                  onSelect={(rows) => {
                    setSelectedProduct(rows[0])
                    message.success(`成功关联商品: ${rows[0].name}`)
                  }}
                />
              </ProForm.Item>
            )
          }
          if (productScope === 3) {
            return (
              <ProFormSelect
                name="categoryIds"
                label="分类"
                rules={[{ required: true, message: '请选择商品分类' }]}
                placeholder="请选择商品分类"
                request={async () => []}
              />
            )
          }
          return null
        }}
      </ProFormDependency>
      <ProFormRadio.Group
        name="discountType"
        label="优惠类型"
        rules={[{ required: true, message: '请选择优惠类型' }]}
        options={DISCOUNT_TYPE_OPTIONS}
      />
      <ProFormDependency name={['discountType']}>
        {({ discountType }) => {
          if (discountType === 1) {
            return (
              <>
                <ProFormDigit
                  name="discountPrice"
                  label="优惠券面额"
                  rules={[{ required: true, message: '请输入优惠券面额' }]}
                  placeholder="请输入优惠金额"
                  fieldProps={{ addonAfter: '元', precision: 2 }}
                />
                <ProFormDigit
                  name="usePrice"
                  label="满减金额"
                  rules={[{ required: true, message: '请输入使用门槛' }]}
                  placeholder="无门槛请设为 0"
                  fieldProps={{ addonAfter: '元', precision: 2 }}
                />
              </>
            )
          }
          if (discountType === 2) {
            return (
              <>
                <ProFormDigit
                  name="discountPercent"
                  label="优惠券折扣"
                  rules={[{ required: true, message: '请输入优惠券折扣' }]}
                  placeholder="优惠券折扣不能小于 1 折，且不可大于 9.9 折"
                  fieldProps={{ addonAfter: '折', precision: 2 }}
                />
                <ProFormDigit
                  name="discountLimitPrice"
                  label="最多优惠"
                  rules={[{ required: true, message: '请输入最多优惠' }]}
                  placeholder="请输入最多优惠的金额"
                  fieldProps={{ addonAfter: '元', precision: 2 }}
                />
                <ProFormDigit
                  name="usePrice"
                  label="满减金额"
                  rules={[{ required: true, message: '请输入使用门槛' }]}
                  placeholder="无门槛请设为 0"
                  fieldProps={{ addonAfter: '元', precision: 2 }}
                />
              </>
            )
          }
          return null
        }}
      </ProFormDependency>

      <ProFormRadio.Group
        name="takeType"
        label="领取方式"
        rules={[{ required: true, message: '请选择领取方式' }]}
        options={COUPON_TAKE_TYPE_OPTIONS}
      />
      <ProFormDependency name={['takeType']}>
        {({ takeType }) => {
          if (takeType === 1) {
            return (
              <>
                <ProFormDigit
                  name="totalCount"
                  label="发放数量"
                  rules={[{ required: true, message: '请输入发放数量' }]}
                  placeholder="全部发放完之后不能领取或继续发放，-1为不限制"
                  fieldProps={{ addonAfter: '张', precision: 0, min: -1 }}
                />
                <ProFormDigit
                  name="takeLimitCount"
                  label="每人限领个数"
                  rules={[{ required: true, message: '请输入限领个数' }]}
                  placeholder="设置为 -1 时，可无限领取"
                  fieldProps={{ addonAfter: '张', precision: 0, min: -1 }}
                />
              </>
            )
          }
          return null
        }}
      </ProFormDependency>

      <ProFormRadio.Group
        name="validityType"
        label="有效期类型"
        rules={[{ required: true, message: '请选择有效期类型' }]}
        options={COUPON_TEMPLATE_VALIDITY_TYPE_OPTIONS}
      />
      <ProFormDependency name={['validityType']}>
        {({ validityType }) => {
          if (validityType === 1) {
            return (
              <ProFormDateTimeRangePicker
                name="validTimes"
                label="固定日期"
                placeholder={['开始日期', '结束日期']}
                rules={[{ required: true, message: '请选择固定日期' }]}
                fieldProps={{
                  style: { width: '100%' },
                  format: 'YYYY-MM-DD HH:mm:ss',
                  showTime: true
                }}
              />
            )
          }
          if (validityType === 2) {
            return (
              <Form.Item label="领取日期" required>
                <Space align="baseline">
                  <span>第</span>
                  <ProFormDigit
                    name="fixedStartTerm"
                    noStyle
                    rules={[{ required: true, message: '生效天数是必填项!' }]}
                    fieldProps={{ placeholder: '0为今天生效', precision: 0, style: { width: 140 } }}
                  />
                  <span>至</span>
                  <ProFormDigit
                    name="fixedEndTerm"
                    noStyle
                    rules={[{ required: true, message: '结束天数是必填项!' }]}
                    fieldProps={{
                      placeholder: '请输入结束天数',
                      precision: 0,
                      style: { width: 140 }
                    }}
                  />
                  <span>天有效</span>
                </Space>
              </Form.Item>
            )
          }
          return null
        }}
      </ProFormDependency>
    </ModalForm>
  )
}

export default CouponTemplateForm
