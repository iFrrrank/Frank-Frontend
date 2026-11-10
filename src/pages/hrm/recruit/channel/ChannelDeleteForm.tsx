import React from 'react'
import { Alert, Form, Input, message } from 'antd'
import { ModalForm } from '@ant-design/pro-components'
import { deleteRecruitChannel } from '@/api/hrm/recruit/channel'
import { textConst } from '@/locales/zh-CN'
import RecruitChannelSelect from './components/RecruitChannelSelect'

interface ChannelDeleteFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  channel?: API.HrmRecruitChannelRespVO
}

// 删除招聘渠道：必须指定承接渠道，相关员工和候选人的渠道将迁移到承接渠道
const ChannelDeleteForm: React.FC<ChannelDeleteFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  channel
}) => {
  const [form] = Form.useForm()

  return (
    <ModalForm
      title="删除招聘渠道"
      open={visible}
      onOpenChange={setVisible}
      form={form}
      layout="horizontal"
      colon={false}
      labelAlign="right"
      width={520}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      modalProps={{ destroyOnHidden: true, onCancel: () => form.resetFields() }}
      submitter={{ submitButtonProps: { danger: true } }}
      onFinish={async (values) => {
        if (!channel?.id) return false
        try {
          await deleteRecruitChannel({
            id: channel.id,
            transferChannelId: values.transferChannelId
          })
          message.success(textConst.msg.delSuccess)
          onSuccess()
          return true
        } catch {
          message.error(textConst.msg.delError)
          return false
        }
      }}
    >
      <Alert
        type="warning"
        showIcon
        style={{ marginBottom: 20 }}
        message="删除后，相关员工和候选人的招聘渠道将同步变更"
      />
      <Form.Item label="删除渠道">
        <Input value={channel?.name} disabled />
      </Form.Item>
      <Form.Item
        name="transferChannelId"
        label="承接渠道"
        rules={[{ required: true, message: '承接渠道不能为空' }]}
      >
        <RecruitChannelSelect
          excludeIds={channel?.id ? [channel.id] : []}
          placeholder="请选择承接渠道"
        />
      </Form.Item>
    </ModalForm>
  )
}

export default ChannelDeleteForm
