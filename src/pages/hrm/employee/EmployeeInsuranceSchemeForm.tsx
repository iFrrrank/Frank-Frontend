import React from 'react'
import { Form } from 'antd'
import { ModalForm, ProForm } from '@ant-design/pro-components'
import { request } from '@umijs/max'
import { useBatchOperation } from '@/pages/hrm/utils/batch'
import InsuranceSchemeSelect from '@/pages/hrm/insurance/scheme/components/InsuranceSchemeSelect'

interface EmployeeInsuranceSchemeFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  employeeIds: number[]
}

/** 更新员工参保方案（后端接口暂未生成 API 层，先按 home 模块先例在页面内直接请求） */
const updateEmployeeScheme = (employeeId: number, schemeId: number) =>
  request<API.CommonResultBoolean>('/hrm/insurance/employee-info/update-scheme', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: { employeeId, schemeId }
  })

// 批量设置员工参保方案（对应 Vue 的 EmployeeInsuranceSchemeForm）
const EmployeeInsuranceSchemeForm: React.FC<EmployeeInsuranceSchemeFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  employeeIds
}) => {
  const [form] = Form.useForm()
  const { executeBatch } = useBatchOperation()

  return (
    <ModalForm
      title="设置参保方案"
      open={visible}
      onOpenChange={setVisible}
      form={form}
      layout="horizontal"
      colon={false}
      labelAlign="right"
      width={520}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
      modalProps={{ destroyOnHidden: true, onCancel: () => form.resetFields() }}
      onFinish={async (values) => {
        const schemeId = values.schemeId as number
        const success = await executeBatch(
          employeeIds.map((employeeId) => updateEmployeeScheme(employeeId, schemeId))
        )
        if (success) {
          onSuccess()
        }
        return success
      }}
    >
      <ProForm.Item label="员工数量">
        <span>{employeeIds.length} 人</span>
      </ProForm.Item>
      <ProForm.Item
        name="schemeId"
        label="社保方案"
        rules={[{ required: true, message: '社保方案不能为空' }]}
      >
        <InsuranceSchemeSelect placeholder="请选择社保方案" />
      </ProForm.Item>
    </ModalForm>
  )
}

export default EmployeeInsuranceSchemeForm
