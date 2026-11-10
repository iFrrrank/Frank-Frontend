import React from 'react'
import { Form, message } from 'antd'
import { ModalForm, ProFormSelect } from '@ant-design/pro-components'
import { updateRecruitCandidateChannel } from '@/api/hrm/recruit/candidate'
import { getRecruitChannelSimpleList } from '@/api/hrm/recruit/channel'

interface CandidateChannelFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  ids: number[]
}

// 批量修改招聘渠道
const CandidateChannelForm: React.FC<CandidateChannelFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  ids
}) => {
  const [form] = Form.useForm()

  return (
    <ModalForm
      title="批量修改招聘渠道"
      open={visible}
      onOpenChange={setVisible}
      form={form}
      layout="horizontal"
      colon={false}
      labelAlign="right"
      width={480}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      modalProps={{ destroyOnHidden: true, onCancel: () => form.resetFields() }}
      onFinish={async (values) => {
        try {
          await Promise.all(
            ids.map((id) =>
              updateRecruitCandidateChannel({ id, channelId: values.channelId as number })
            )
          )
          message.success(`已修改 ${ids.length} 位候选人的招聘渠道`)
          onSuccess()
          return true
        } catch {
          message.error('批量修改渠道失败')
          return false
        }
      }}
    >
      <Form.Item label="候选人数">
        <span>{ids.length} 人</span>
      </Form.Item>
      <ProFormSelect
        name="channelId"
        label="招聘渠道"
        placeholder="请选择招聘渠道"
        showSearch
        rules={[{ required: true, message: '请选择招聘渠道' }]}
        request={async () => {
          const resp = await getRecruitChannelSimpleList()
          return resp.data?.map((item) => ({ label: item.name, value: item.id })) || []
        }}
      />
    </ModalForm>
  )
}

export default CandidateChannelForm
