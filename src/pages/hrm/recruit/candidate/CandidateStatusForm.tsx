import React from 'react'
import { Form, message } from 'antd'
import { ModalForm, ProFormSelect } from '@ant-design/pro-components'
import { updateRecruitCandidateStatus } from '@/api/hrm/recruit/candidate'
import { HrmRecruitCandidateStatusEnum } from '@/utils/constants'
import { RECRUIT_CANDIDATE_STATUS } from '@/utils/constantsValue'

interface CandidateStatusFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  ids: number[]
  fromStatus?: number
}

// 可直接批量流转的状态映射，与后端 HrmRecruitCandidateStatusEnum 保持一致
const STATUS_TRANSITIONS: Record<number, number[]> = {
  [HrmRecruitCandidateStatusEnum.NEW.status]: [
    HrmRecruitCandidateStatusEnum.PRIMARY_PASS.status,
    HrmRecruitCandidateStatusEnum.INTERVIEW_PASS.status
  ],
  [HrmRecruitCandidateStatusEnum.PRIMARY_PASS.status]: [
    HrmRecruitCandidateStatusEnum.NEW.status,
    HrmRecruitCandidateStatusEnum.INTERVIEW_PASS.status
  ],
  [HrmRecruitCandidateStatusEnum.INTERVIEW_PASS.status]: [
    HrmRecruitCandidateStatusEnum.OFFER_SENT.status,
    HrmRecruitCandidateStatusEnum.NEW.status,
    HrmRecruitCandidateStatusEnum.PRIMARY_PASS.status
  ],
  [HrmRecruitCandidateStatusEnum.ELIMINATED.status]: [HrmRecruitCandidateStatusEnum.NEW.status]
}

const CandidateStatusForm: React.FC<CandidateStatusFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  ids,
  fromStatus
}) => {
  const [form] = Form.useForm()
  const statusValues = fromStatus ? STATUS_TRANSITIONS[fromStatus] || [] : []
  const options = statusValues.map((status) => ({
    label: RECRUIT_CANDIDATE_STATUS[status]?.text as string,
    value: status
  }))

  return (
    <ModalForm
      title="批量流转候选人"
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
            ids.map((id) => updateRecruitCandidateStatus({ id, status: values.status as number }))
          )
          message.success(`已流转 ${ids.length} 位候选人`)
          onSuccess()
          return true
        } catch {
          message.error('批量流转失败')
          return false
        }
      }}
    >
      <Form.Item label="候选人数">
        <span>{ids.length} 人</span>
      </Form.Item>
      <ProFormSelect
        name="status"
        label="目标状态"
        placeholder="请选择目标状态"
        options={options}
        rules={[{ required: true, message: '请选择目标状态' }]}
      />
    </ModalForm>
  )
}

export default CandidateStatusForm
