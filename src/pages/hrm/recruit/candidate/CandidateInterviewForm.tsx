import React from 'react'
import { Form, Input, message } from 'antd'
import {
  ModalForm,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components'
import { createRecruitInterview, updateRecruitInterview } from '@/api/hrm/recruit/interview'
import { HrmRecruitInterviewTypeEnum } from '@/utils/constants'
import { getEmployeeOptions } from './options'

const typeOptions = Object.values(HrmRecruitInterviewTypeEnum).map((item) => ({
  label: item.name,
  value: item.type
}))

interface CandidateInterviewFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  candidateId?: number
  interview?: API.HrmRecruitInterviewRespVO
}

// 安排面试 / 修改面试安排
const CandidateInterviewForm: React.FC<CandidateInterviewFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  candidateId,
  interview
}) => {
  const [form] = Form.useForm()
  const isUpdate = interview?.id !== undefined

  return (
    <ModalForm
      title={isUpdate ? '修改面试安排' : '安排面试'}
      open={visible}
      onOpenChange={setVisible}
      form={form}
      layout="horizontal"
      colon={false}
      labelAlign="right"
      width={620}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      modalProps={{ destroyOnHidden: true, onCancel: () => form.resetFields() }}
      initialValues={{
        type: HrmRecruitInterviewTypeEnum.ONSITE.type,
        stageNumber: interview?.stageNumber ?? 1,
        interviewEmployeeId: interview?.interviewEmployeeId,
        otherInterviewEmployeeIds: interview?.otherInterviewEmployeeIds,
        interviewTime: interview?.interviewTime,
        address: interview?.address,
        remark: interview?.remark
      }}
      onFinish={async (values) => {
        try {
          const body = {
            ...values,
            id: interview?.id,
            candidateId: candidateId ?? interview?.candidateId
          } as API.HrmRecruitInterviewSaveReqVO
          if (isUpdate) {
            await updateRecruitInterview(body)
            message.success('面试安排修改成功')
          } else {
            await createRecruitInterview(body)
            message.success('面试安排成功')
          }
          onSuccess()
          return true
        } catch {
          message.error('操作失败')
          return false
        }
      }}
    >
      <ProFormSelect
        name="type"
        label="面试方式"
        placeholder="请选择面试方式"
        options={typeOptions}
        rules={[{ required: true, message: '请选择面试方式' }]}
      />
      <Form.Item
        name="stageNumber"
        label="面试轮次"
        rules={[{ required: true, message: '请输入面试轮次' }]}
      >
        <Input type="number" min={1} placeholder="请输入面试轮次" />
      </Form.Item>
      <ProFormSelect
        name="interviewEmployeeId"
        label="主面试官"
        placeholder="请选择主面试官"
        showSearch
        rules={[{ required: true, message: '请选择主面试官' }]}
        request={getEmployeeOptions}
      />
      <ProFormSelect
        name="otherInterviewEmployeeIds"
        label="其他面试官"
        placeholder="请选择其他面试官"
        mode="multiple"
        showSearch
        request={getEmployeeOptions}
      />
      <ProFormDateTimePicker
        name="interviewTime"
        label="面试时间"
        placeholder="请选择面试时间"
        rules={[{ required: true, message: '请选择面试时间' }]}
      />
      <ProFormText name="address" label="面试地址" placeholder="请输入面试地址" />
      <ProFormTextArea
        name="remark"
        label="备注"
        placeholder="请输入备注"
        fieldProps={{ rows: 3, maxLength: 255, showCount: true }}
      />
    </ModalForm>
  )
}

export default CandidateInterviewForm
