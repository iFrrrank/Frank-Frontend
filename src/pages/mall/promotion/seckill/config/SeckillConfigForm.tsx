import React from 'react'
import { message, Form } from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormTimePicker,
  ProFormUploadButton
} from '@ant-design/pro-components'
import {
  createSeckillConfig,
  updateSeckillConfig,
  getSeckillConfig
} from '@/api/mall/promotion/seckill/config'
import { textConst } from '@/locales/zh-CN'
import { COMMON_STATUS_OPTIONS } from '@/utils/constantsValue'

interface SeckillConfigFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const SeckillConfigForm: React.FC<SeckillConfigFormProps> = ({
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
      onOpenChange={setVisible}
      form={form}
      layout="horizontal"
      modalProps={{
        destroyOnHidden: true,
        onCancel: () => form.resetFields()
      }}
      colon={false}
      labelAlign="right"
      width={450}
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 17 }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getSeckillConfig({ id } as any)
          return resp.data as Record<string, any>
        }
        return { status: 0 }
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateSeckillConfig({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createSeckillConfig(values as any)
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
        label="秒杀时段名称"
        rules={[{ required: true, message: '请输入秒杀时段名称' }]}
        placeholder="请输入秒杀时段名称"
      />
      <ProFormTimePicker
        name="startTime"
        label="开始时间点"
        rules={[{ required: true, message: '请选择开始时间点' }]}
        placeholder="选择开始时间点"
        fieldProps={{ style: { width: '100%' }, format: 'HH:mm:ss' }}
      />
      <ProFormTimePicker
        name="endTime"
        label="结束时间点"
        rules={[{ required: true, message: '请选择结束时间点' }]}
        placeholder="选择结束时间点"
        fieldProps={{ style: { width: '100%' }, format: 'HH:mm:ss' }}
      />
      {/* @ts-ignore */}
      <ProFormUploadButton
        name="sliderPicUrls"
        label="秒杀轮播图"
        max={5}
        title="单击上传"
        listType="picture-card"
        fieldProps={{
          multiple: true,
          maxCount: 5
        }}
      />
      <ProFormRadio.Group
        name="status"
        label="活动状态"
        rules={[{ required: true, message: '请选择活动状态' }]}
        options={COMMON_STATUS_OPTIONS}
      />
    </ModalForm>
  )
}

export default SeckillConfigForm
