import React from 'react'
import { Form, message } from 'antd'
import { ModalForm, ProFormSelect } from '@ant-design/pro-components'
import { updateRecruitCandidatePost } from '@/api/hrm/recruit/candidate'
import { getRecruitPostSimpleList } from '@/api/hrm/recruit/post'

interface CandidatePostFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  ids: number[]
}

// 批量修改应聘职位
const CandidatePostForm: React.FC<CandidatePostFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  ids
}) => {
  const [form] = Form.useForm()

  return (
    <ModalForm
      title="批量修改应聘职位"
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
            ids.map((id) => updateRecruitCandidatePost({ id, postId: values.postId as number }))
          )
          message.success(`已修改 ${ids.length} 位候选人的应聘职位`)
          onSuccess()
          return true
        } catch {
          message.error('批量修改职位失败')
          return false
        }
      }}
    >
      <Form.Item label="候选人数">
        <span>{ids.length} 人</span>
      </Form.Item>
      <ProFormSelect
        name="postId"
        label="应聘职位"
        placeholder="请选择应聘职位"
        showSearch
        rules={[{ required: true, message: '请选择应聘职位' }]}
        request={async () => {
          const resp = await getRecruitPostSimpleList()
          return resp.data?.map((item) => ({ label: item.postName, value: item.id })) || []
        }}
      />
    </ModalForm>
  )
}

export default CandidatePostForm
