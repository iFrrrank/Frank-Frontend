import React from 'react'
import { Form, message } from 'antd'
import { ModalForm, ProFormDigit, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import {
  createRecruitChannel,
  getRecruitChannel,
  updateRecruitChannel
} from '@/api/hrm/recruit/channel'
import { textConst } from '@/locales/zh-CN'

interface ChannelFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

// 新增 / 修改招聘渠道
const ChannelForm: React.FC<ChannelFormProps> = ({ visible, setVisible, onSuccess, id }) => {
  const [form] = Form.useForm()
  const isUpdate = id !== undefined
  const systemFlag = Form.useWatch('systemFlag', form)

  return (
    <ModalForm
      title={isUpdate ? textConst.action.update : textConst.action.create}
      open={visible}
      onOpenChange={setVisible}
      form={form}
      layout="horizontal"
      colon={false}
      labelAlign="right"
      width={620}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
      modalProps={{ destroyOnHidden: true, onCancel: () => form.resetFields() }}
      request={async () => {
        if (isUpdate) {
          const resp = await getRecruitChannel({ id })
          return (resp.data || {}) as Record<string, any>
        }
        return { sort: 0 }
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateRecruitChannel({ ...values, id } as API.HrmRecruitChannelSaveReqVO)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createRecruitChannel(values as API.HrmRecruitChannelSaveReqVO)
            message.success(textConst.msg.createSuccess)
          }
          onSuccess()
          return true
        } catch {
          message.error(isUpdate ? textConst.msg.updateError : textConst.msg.createError)
          return false
        }
      }}
    >
      {/* 系统内置渠道不允许修改名称 */}
      <Form.Item name="systemFlag" hidden />
      <ProFormText
        name="name"
        label="渠道名称"
        placeholder="请输入渠道名称"
        disabled={!!systemFlag}
        fieldProps={{ maxLength: 255 }}
        rules={[{ required: true, message: '渠道名称不能为空' }]}
      />
      <ProFormDigit
        name="sort"
        label="显示顺序"
        placeholder="请输入显示顺序"
        min={0}
        fieldProps={{ controls: false, precision: 0 }}
        rules={[{ required: true, message: '显示顺序不能为空' }]}
      />
      <ProFormTextArea
        name="remark"
        label="备注"
        placeholder="请输入备注"
        fieldProps={{ rows: 3, maxLength: 500 }}
      />
    </ModalForm>
  )
}

export default ChannelForm
