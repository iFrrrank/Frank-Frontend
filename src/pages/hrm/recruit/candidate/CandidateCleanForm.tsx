import React from 'react'
import { Form, InputNumber, message } from 'antd'
import { ModalForm, ProFormSelect } from '@ant-design/pro-components'
import {
  getCleanRecruitCandidateIdList,
  eliminateRecruitCandidate
} from '@/api/hrm/recruit/candidate'
import { textConst } from '@/locales/zh-CN'
import { RECRUIT_CANDIDATE_CLEAN_STATUSES, RECRUIT_CANDIDATE_STATUS } from '@/utils/constantsValue'

interface CandidateCleanFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
}

const DAY_OPTIONS = [3, 5, 7, 15, 30, 45].map((day) => ({ label: `${day} 天`, value: day }))

const statusOptions = RECRUIT_CANDIDATE_CLEAN_STATUSES.map((status) => ({
  label: RECRUIT_CANDIDATE_STATUS[status].text as string,
  value: status
}))

// 一键清理：按状态 + 持续天数筛选候选人，并批量淘汰
const CandidateCleanForm: React.FC<CandidateCleanFormProps> = ({
  visible,
  setVisible,
  onSuccess
}) => {
  const [form] = Form.useForm()

  return (
    <ModalForm
      title="一键清理候选人"
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
      initialValues={{ statuses: RECRUIT_CANDIDATE_CLEAN_STATUSES, days: 30 }}
      onFinish={async (values) => {
        const { statuses, days } = values as { statuses: number[]; days: number }
        try {
          const resp = await getCleanRecruitCandidateIdList({
            reqVO: { statuses, days }
          } as API.getCleanRecruitCandidateIdListParams)
          const ids = resp.data || []
          if (!ids.length) {
            message.warning('暂无可清理候选人')
            return false
          }
          await Promise.all(
            ids.map((id) =>
              eliminateRecruitCandidate({
                id,
                eliminate: '长期未跟进',
                remark: `状态持续 ${days} 天，由一键清理操作淘汰`
              })
            )
          )
          message.success(`已清理 ${ids.length} 位候选人`)
          onSuccess()
          return true
        } catch {
          message.error(textConst.error.operationFail)
          return false
        }
      }}
    >
      <ProFormSelect
        name="statuses"
        label="候选人状态"
        mode="multiple"
        placeholder="请选择候选人状态"
        options={statusOptions}
        rules={[{ required: true, message: '请选择候选人状态' }]}
      />
      <Form.Item
        name="days"
        label="状态持续天数"
        rules={[{ required: true, message: '请输入状态持续天数' }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          min={1}
          max={365}
          precision={0}
          addonAfter="天"
          placeholder="请输入状态持续天数"
        />
      </Form.Item>
      <ProFormSelect
        name="presetDays"
        label="快捷选择"
        placeholder="请选择持续天数"
        options={DAY_OPTIONS}
        fieldProps={{
          onChange: (value: number) => form.setFieldValue('days', value)
        }}
      />
    </ModalForm>
  )
}

export default CandidateCleanForm
