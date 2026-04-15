import React, { useState } from 'react'
import { message, Form, Button, Table, Image } from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormDigit,
  ProFormDateTimePicker,
  ProFormRadio,
  ProForm
} from '@ant-design/pro-components'
import {
  createCombinationActivity,
  updateCombinationActivity,
  getCombinationActivity
} from '@/api/mall/promotion/combination/activity'
import ProductSelectModal from '@/pages/mall/promotion/coupon/list/ProductSelectModal'
import { textConst } from '@/locales/zh-CN'
import { BOOLEAN_OPTIONS } from '@/utils/constantsValue'

interface CombinationActivityFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const CombinationActivityForm: React.FC<CombinationActivityFormProps> = ({
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
      form={form}
      layout="horizontal"
      grid={true}
      colon={false}
      rowProps={{ gutter: 24 }}
      labelAlign="right"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      width={900}
      request={async () => {
        if (id !== undefined) {
          const resp = await getCombinationActivity({ id } as any)
          const data = resp.data as Record<string, any>
          if (data.spuInfo) {
            setSelectedProduct(data.spuInfo)
          }
          return data
        }
        return {
          userSize: 2,
          virtualGroup: 0
        }
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateCombinationActivity({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createCombinationActivity(values as any)
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
        label="拼团名称"
        rules={[{ required: true, message: '请输入拼团名称' }]}
        placeholder="请输入拼团名称"
        colProps={{ span: 12 }}
      />
      <ProForm.Item
        name="spuId"
        label="拼团商品"
        rules={[{ required: true, message: '请选择商品' }]}
        className="ant-col-12"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
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
        name="userSize"
        label="参与人数"
        tooltip="参与人数不能少于 2 人"
        placeholder="请输入拼团参与人数"
        rules={[{ required: true, message: '请输入拼团参与人数' }]}
        colProps={{ span: 12 }}
        fieldProps={{ precision: 0, min: 2, addonAfter: '人' }}
      />
      <ProFormDigit
        name="limitDuration"
        label="限制时长"
        placeholder="请输入拼团限制时长"
        tooltip="开团后需要在限制时长内成团，否则拼团失败"
        rules={[{ required: true, message: '请输入限制时长' }]}
        colProps={{ span: 12 }}
        fieldProps={{ precision: 0, addonAfter: '小时(h)' }}
      />
      <ProFormDigit
        name="totalLimitCount"
        label="总限购数量"
        placeholder="请输入拼团总限购数量"
        rules={[{ required: true, message: '请输入拼团总限购数量' }]}
        colProps={{ span: 12 }}
        fieldProps={{ precision: 0, min: 1 }}
      />
      <ProFormDigit
        name="singleLimitCount"
        label="单次限购数量"
        placeholder="请输入拼团单次限购数量"
        rules={[{ required: true, message: '请输入拼团单次限购数量' }]}
        colProps={{ span: 12 }}
        fieldProps={{ precision: 0, min: 1 }}
      />
      <ProFormRadio.Group
        name="virtualGroup"
        label="虚拟成团"
        placeholder="请选择是否虚拟成团"
        rules={[{ required: true, message: '请选择是否虚拟成团' }]}
        colProps={{ span: 12 }}
        options={BOOLEAN_OPTIONS}
      />
    </ModalForm>
  )
}

export default CombinationActivityForm
