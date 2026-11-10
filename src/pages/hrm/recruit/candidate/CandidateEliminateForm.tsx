import React from 'react'
import { Form, message } from 'antd'
import { ModalForm, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components'
import { eliminateRecruitCandidate } from '@/api/hrm/recruit/candidate'
import { getRecruitEliminateReasonList } from '@/api/hrm/recruit/config'

interface CandidateEliminateFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  ids: number[]
  candidateName?: string
}

// 淘汰候选人（单个 / 批量）
const CandidateEliminateForm: React.FC<CandidateEliminateFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  ids,
  candidateName
}) => {
  const [form] = Form.useForm()
  const batchMode = ids.length > 1

  return (
    <ModalForm
      title={batchMode ? '批量淘汰候选人' : '淘汰候选人'}
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
      onFinish={async (values) => {
        try {
          await Promise.all(
            ids.map((id) =>
              eliminateRecruitCandidate({
                id,
                eliminate: values.eliminate as string,
                remark: values.remark as string | undefined
              })
            )
          )
          message.success(batchMode ? `已淘汰 ${ids.length} 位候选人` : '淘汰成功')
          onSuccess()
          return true
        } catch {
          message.error('淘汰失败')
          return false
        }
      }}
    >
      <Form.Item label="候选人">
        <span>{batchMode ? `已选择 ${ids.length} 人` : candidateName}</span>
      </Form.Item>
      <ProFormSelect
        name="eliminate"
        label="淘汰原因"
        placeholder="请选择淘汰原因"
        showSearch
        rules={[{ required: true, message: '请选择淘汰原因' }]}
        request={async () => {
          const resp = await getRecruitEliminateReasonList()
          return resp.data?.map((item) => ({ label: item, value: item })) || []
        }}
      />
      <ProFormTextArea
        name="remark"
        label="备注"
        placeholder="请输入备注"
        fieldProps={{ rows: 3, maxLength: 255, showCount: true }}
      />
    </ModalForm>
  )
}

export default CandidateEliminateForm
