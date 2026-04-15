import React, { useState } from 'react'
import { message, Form, Button, Table, Image } from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormDigit,
  ProFormTextArea,
  ProFormDateTimePicker,
  ProFormSelect,
  ProForm
} from '@ant-design/pro-components'
import {
  createSeckillActivity,
  updateSeckillActivity,
  getSeckillActivity
} from '@/api/mall/promotion/seckill/activity'
import { getSeckillConfigSimpleList } from '@/api/mall/promotion/seckill/config'
import ProductSelectModal from '@/pages/mall/promotion/coupon/list/ProductSelectModal'
import { textConst } from '@/locales/zh-CN'

interface SeckillActivityFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const SeckillActivityForm: React.FC<SeckillActivityFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  id
}) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()

  // 管理商品选择弹窗的状态和已选择的商品数据
  const [productModalVisible, setProductModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  return (
    <ModalForm
      title={isUpdate ? `编辑秒杀活动` : `新增`}
      open={visible}
      colon={false}
      onOpenChange={(val) => {
        setVisible(val)
        if (!val) {
          form.resetFields()
          setSelectedProduct(null) // 关闭时清空商品
        }
      }}
      form={form}
      layout="horizontal"
      grid={true}
      rowProps={{ gutter: 24 }}
      labelAlign="right"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      width={900}
      request={async () => {
        if (id !== undefined) {
          const resp = await getSeckillActivity({ id } as any)
          const data = resp.data as Record<string, any>
          if (data.spuId) {
            setSelectedProduct(data.spuInfo)
          }
          return data
        }
        return {}
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateSeckillActivity({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createSeckillActivity(values as any)
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
        label="活动名称"
        rules={[{ required: true, message: '请输入秒杀活动名称' }]}
        placeholder="请输入秒杀活动名称"
        colProps={{ span: 12 }}
      />
      <ProForm.Item
        name="spuId"
        label="秒杀活动商品"
        rules={[{ required: true, message: '请选择商品' }]}
        className="ant-col-12"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Button onClick={() => setProductModalVisible(true)}>选择商品</Button>
        {selectedProduct && <span>已选: {selectedProduct.name}</span>}

        <ProductSelectModal
          visible={productModalVisible}
          setVisible={setProductModalVisible}
          multiple={false}
          onSelect={(rows) => {
            setSelectedProduct(rows[0])
            form.setFieldValue('spuId', rows[0].id)
            message.success(`成功关联商品: ${rows[0].name}`)
          }}
        />
      </ProForm.Item>
      <ProFormDateTimePicker
        name="startTime"
        label="开始时间"
        rules={[{ required: true, message: '请选择活动开始时间' }]}
        placeholder="请选择活动开始时间"
        colProps={{ span: 12 }}
        fieldProps={{ style: { width: '100%' } }}
      />
      <ProFormDateTimePicker
        name="endTime"
        label="结束时间"
        rules={[{ required: true, message: '请选择活动结束时间' }]}
        placeholder="请选择活动结束时间"
        colProps={{ span: 12 }}
        fieldProps={{ style: { width: '100%' } }}
      />
      <ProFormSelect
        name="configIds"
        label="秒杀时段"
        rules={[{ required: true, message: '请选择秒杀时段' }]}
        placeholder="请选择秒杀时段"
        colProps={{ span: 12 }}
        request={async () => {
          const res = await getSeckillConfigSimpleList()
          return (res.data || []).map((item: any) => ({
            label: item.name,
            value: item.id
          }))
        }}
      />
      <ProFormDigit
        name="totalLimitCount"
        label="总限购数量"
        rules={[{ required: true, message: '请输入总限购数量' }]}
        placeholder="请输入总限购数量"
        colProps={{ span: 12 }}
        fieldProps={{ precision: 0 }}
      />
      <ProFormDigit
        name="singleLimitCount"
        label="单次限购数量"
        rules={[{ required: true, message: '请输入单次限购数量' }]}
        placeholder="请输入单次限购数量"
        colProps={{ span: 12 }}
        fieldProps={{ precision: 0 }}
      />
      <ProFormDigit
        name="sort"
        label="排序"
        rules={[{ required: true, message: '请输入排序' }]}
        placeholder="请输入排序"
        colProps={{ span: 12 }}
        fieldProps={{ precision: 0 }}
      />
      <ProFormTextArea
        name="remark"
        label="备注"
        placeholder="请输入备注"
        colProps={{ span: 24 }}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
        fieldProps={{ rows: 2 }}
      />
    </ModalForm>
  )
}

export default SeckillActivityForm
