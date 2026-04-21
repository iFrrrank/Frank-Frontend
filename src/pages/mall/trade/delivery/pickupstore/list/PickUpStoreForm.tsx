import React from 'react'
import { message, Form, Button } from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormUploadButton,
  ProFormTextArea,
  ProFormTimePicker,
  ProFormCascader,
  ProForm
} from '@ant-design/pro-components'
import {
  createDeliveryPickUpStore,
  updateDeliveryPickUpStore,
  getDeliveryPickUpStore
} from '@/api/mall/trade/delivery/pickUpStore'
import { textConst } from '@/locales/zh-CN'
import { COMMON_STATUS_OPTIONS } from '@/utils/constantsValue'

interface DeliveryPickUpStoreFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const PickUpStoreForm: React.FC<DeliveryPickUpStoreFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  id
}) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()

  return (
    <ModalForm
      title={isUpdate ? textConst.action.update : textConst.action.create}
      open={visible}
      onOpenChange={(val) => {
        setVisible(val)
        if (!val) {
          form.resetFields()
        }
      }}
      form={form}
      colon={false}
      layout="horizontal"
      grid={true}
      rowProps={{ gutter: 24 }}
      labelAlign="right"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      width={900}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false
      }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getDeliveryPickUpStore({ id } as any)
          const data = resp.data as Record<string, any>
          return data
        }
        return { status: 0 }
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateDeliveryPickUpStore({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createDeliveryPickUpStore(values as any)
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
      {/* @ts-ignore */}
      <ProFormUploadButton
        name="logo"
        label="门店 logo"
        max={1}
        title="单击上传"
        rules={[{ required: true, message: '请上传门店 logo' }]}
        listType="picture-card"
        colProps={{ span: 12 }}
        extra="推荐 180x180 图片分辨率"
      />
      <ProFormText
        name="name"
        label="门店名称"
        rules={[{ required: true, message: '请输入门店名称' }]}
        placeholder="请输入门店名称"
        colProps={{ span: 12 }}
      />
      <ProFormRadio.Group
        name="status"
        label="门店状态"
        rules={[{ required: true, message: '请选择门店状态' }]}
        colProps={{ span: 12 }}
        options={COMMON_STATUS_OPTIONS}
      />
      <ProFormText
        name="phone"
        label="门店手机"
        rules={[{ required: true, message: '请输入门店手机' }]}
        placeholder="请输入门店手机"
        colProps={{ span: 12 }}
      />
      <ProFormTextArea
        name="introduction"
        label="门店简介"
        placeholder="请输入门店简介"
        colProps={{ span: 24 }}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
        fieldProps={{ rows: 2 }}
      />
      <ProFormCascader
        name="areaIds"
        label="门店所在地区"
        rules={[{ required: true, message: '请选择所在地区' }]}
        colProps={{ span: 12 }}
        fieldProps={{ placeholder: '请选择门店所在地区' }}
        request={async () => {
          return []
        }}
      />
      <ProFormText
        name="detailAddress"
        label="门店详细地址"
        rules={[{ required: true, message: '请输入门店详细地址' }]}
        placeholder="请输入门店详细地址"
        colProps={{ span: 12 }}
      />
      <ProFormTimePicker
        name="openingTime"
        label="营业开始时间"
        rules={[{ required: true, message: '请选择营业开始时间' }]}
        colProps={{ span: 12 }}
        fieldProps={{ format: 'HH:mm', style: { width: '100%' } }}
        placeholder={'请选择营业开始时间'}
      />
      <ProFormTimePicker
        name="closingTime"
        label="营业结束时间"
        rules={[{ required: true, message: '请选择营业结束时间' }]}
        colProps={{ span: 12 }}
        fieldProps={{ format: 'HH:mm', style: { width: '100%' } }}
        placeholder={'请选择营业结束时间'}
      />
      <ProFormText
        name="longitude"
        label="经度"
        rules={[{ required: true, message: '请输入经度' }]}
        placeholder="请输入门店经度"
        colProps={{ span: 12 }}
      />
      <ProFormText
        name="latitude"
        label="纬度"
        rules={[{ required: true, message: '请输入纬度' }]}
        placeholder="请输入门店纬度"
        colProps={{ span: 12 }}
      />
      <ProForm.Item label="获取经纬度" colProps={{ span: 12 }} className="ant-col-12">
        <Button
          type="default"
          onClick={() => {
            message.info('这里接入地图选点或定位 API，回填上方经纬度')
          }}
        >
          获取
        </Button>
      </ProForm.Item>
    </ModalForm>
  )
}

export default PickUpStoreForm
