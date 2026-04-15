import React, { useState } from 'react'
import { message, Form, Button, Table, Image } from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormDigit,
  ProFormDateTimePicker,
  ProForm
} from '@ant-design/pro-components'
import {
  createBargainActivity,
  updateBargainActivity,
  getBargainActivity
} from '@/api/mall/promotion/bargain/activity'
import ProductSelectModal from '@/pages/mall/promotion/coupon/list/ProductSelectModal'
import { textConst } from '@/locales/zh-CN'

interface BargainActivityFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const BargainActivityForm: React.FC<BargainActivityFormProps> = ({
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
      onOpenChange={(val) => {
        setVisible(val)
        if (!val) {
          form.resetFields()
          setSelectedProduct(null)
        }
      }}
      colon={false}
      form={form}
      layout="horizontal"
      grid={true}
      rowProps={{ gutter: 24 }}
      labelAlign="right"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      width={800}
      request={async () => {
        if (id !== undefined) {
          const resp = await getBargainActivity({ id } as any)
          const data = resp.data as Record<string, any>
          if (data.spuInfo) {
            setSelectedProduct(data.spuInfo)
          }
          return data
        }
        return {
          bargainCount: 2,
          helpMaxCount: 2,
          totalLimitCount: 0,
          randomMinPrice: 0,
          randomMaxPrice: 0
        }
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateBargainActivity({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createBargainActivity(values as any)
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
        label="砍价活动名称"
        rules={[{ required: true, message: '请输入砍价活动名称' }]}
        placeholder="请输入砍价活动名称"
        colProps={{ span: 12 }}
      />
      <ProForm.Item
        name="spuId"
        label="砍价商品"
        rules={[{ required: true, message: '请选择商品' }]}
        className="ant-col-12"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Button type="default" onClick={() => setProductModalVisible(true)}>
          选择商品
        </Button>
        {selectedProduct && <span>已选: {selectedProduct.name}</span>}

        <ProductSelectModal
          visible={productModalVisible}
          setVisible={setProductModalVisible}
          multiple={false}
          onSelect={(rows) => {
            const product = rows[0]
            setSelectedProduct(product)
            form.setFieldValue('spuId', product.id)
            message.success(`成功关联商品: ${product.name}`)
          }}
        />
      </ProForm.Item>
      <ProFormDateTimePicker
        name="startTime"
        label="活动开始时间"
        rules={[{ required: true, message: '请选择开始时间' }]}
        placeholder="请选择活动开始时间"
        colProps={{ span: 12 }}
        fieldProps={{ style: { width: '100%' } }}
      />
      <ProFormDateTimePicker
        name="endTime"
        label="活动结束时间"
        rules={[{ required: true, message: '请选择结束时间' }]}
        placeholder="请选择活动结束时间"
        colProps={{ span: 12 }}
        fieldProps={{ style: { width: '100%' } }}
      />
      <ProFormDigit
        name="bargainCount"
        label="砍价人数"
        tooltip="需要多少人助力才能砍到底价，参与人数不能少于两人"
        rules={[{ required: true, message: '请输入砍价人数' }]}
        colProps={{ span: 12 }}
        fieldProps={{ precision: 0, min: 2, addonAfter: '人' }}
      />
      <ProFormDigit
        name="helpMaxCount"
        label="最大帮砍次数"
        tooltip="每个用户最多可以帮多少人砍价，参与人数不能少于两人"
        rules={[{ required: true, message: '请输入最大帮砍次数' }]}
        colProps={{ span: 12 }}
        fieldProps={{ precision: 0, min: 2 }}
      />
      <ProFormDigit
        name="totalLimitCount"
        label="总限购数量"
        tooltip="用户最大能发起砍价的次数"
        rules={[{ required: true, message: '请输入总限购数量' }]}
        colProps={{ span: 12 }}
        fieldProps={{ precision: 0 }}
      />
      <ProFormDigit
        name="randomMinPrice"
        label="砍价最小金额"
        tooltip="用户每次砍价的最小金额"
        rules={[{ required: true, message: '请输入最小金额' }]}
        colProps={{ span: 12 }}
        fieldProps={{ precision: 2, min: 0.0, addonAfter: '元' }}
      />
      <ProFormDigit
        name="randomMaxPrice"
        label="砍价最大金额"
        tooltip="用户每次砍价的最大金额"
        rules={[{ required: true, message: '请输入最大金额' }]}
        colProps={{ span: 12 }}
        fieldProps={{ precision: 2, min: 0.0, addonAfter: '元' }}
      />
    </ModalForm>
  )
}

export default BargainActivityForm
