import React, { useState } from 'react'
import { message } from 'antd'
import {
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components'
import {
  createPerformanceAssessmentTemplate,
  getPerformanceAssessmentTemplate,
  updatePerformanceAssessmentTemplate
} from '@/api/hrm/performance/assessTemplate'
import PerformanceAssessmentConfigEditor, {
  type AssessmentDimension
} from './components/PerformanceAssessmentConfigEditor'
import { PERFORMANCE_SCORE_CALCULATION_OPTIONS } from '../../constants'
import { textConst } from '@/locales/zh-CN'

interface PerformanceAssessmentTemplateFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

// 考核模板表单：基础设置（计分方式/分数上限） + 维度指标配置
const PerformanceAssessmentTemplateForm: React.FC<PerformanceAssessmentTemplateFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  id
}) => {
  const isUpdate = id !== undefined
  const [dimensions, setDimensions] = useState<AssessmentDimension[]>([])

  return (
    <ModalForm
      title={isUpdate ? '编辑考核模板' : '新增考核模板'}
      open={visible}
      onOpenChange={(val) => {
        setVisible(val)
        if (!val) setDimensions([])
      }}
      width={860}
      modalProps={{ destroyOnHidden: true }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getPerformanceAssessmentTemplate({ id } as any)
          const data = resp.data as any
          if (data) {
            setDimensions(data.dimensions || [])
            return data
          }
        }
        setDimensions([])
        return { scoreCalculation: 1, upperLimitType: 1, upperLimitScore: 100 }
      }}
      onFinish={async (values) => {
        if (dimensions.length === 0) {
          message.warning('请至少添加一个考核维度')
          return false
        }
        const emptyDimension = dimensions.find((d) => !d.quotas || d.quotas.length === 0)
        if (emptyDimension) {
          message.warning(`维度「${emptyDimension.name || ''}」下请至少添加一个指标`)
          return false
        }
        try {
          const body = { ...values, dimensions }
          if (isUpdate) {
            await updatePerformanceAssessmentTemplate({ id, ...body } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createPerformanceAssessmentTemplate(body as any)
            message.success(textConst.msg.createSuccess)
          }
          onSuccess()
          return true
        } catch {
          message.error(textConst.error.operationFail)
          return false
        }
      }}
    >
      <ProFormText
        name="name"
        label="模板名称"
        rules={[{ required: true, message: '请输入模板名称' }]}
        placeholder="请输入模板名称"
      />
      <ProFormTextArea name="illustrate" label="模板说明" fieldProps={{ rows: 2 }} />
      <ProFormSelect
        name="scoreCalculation"
        label="计分方式"
        options={PERFORMANCE_SCORE_CALCULATION_OPTIONS}
        rules={[{ required: true, message: '请选择计分方式' }]}
      />
      <ProFormSelect
        name="upperLimitType"
        label="分数上限类型"
        options={[{ label: '统一上限', value: 1 }]}
        rules={[{ required: true, message: '请选择分数上限类型' }]}
      />
      <ProFormDigit
        name="upperLimitScore"
        label="分数上限"
        rules={[{ required: true, message: '请输入分数上限' }]}
        fieldProps={{ precision: 0, min: 0, style: { width: '100%' } }}
      />
      <ProForm.Item label="考核维度" required>
        <PerformanceAssessmentConfigEditor dimensions={dimensions} onChange={setDimensions} />
      </ProForm.Item>
    </ModalForm>
  )
}

export default PerformanceAssessmentTemplateForm
