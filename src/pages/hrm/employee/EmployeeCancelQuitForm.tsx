import React from 'react'
import { Form, message } from 'antd'
import { ModalForm, ProFormTextArea } from '@ant-design/pro-components'
import { cancelEmployeeQuit } from '@/api/hrm/employee'
import { textConst } from '@/locales/zh-CN'

interface EmployeeCancelQuitFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  employee?: API.HrmEmployeeRespVO
}

// 取消员工离职安排（对应 Vue 中 ElMessageBox.prompt 输入取消原因）
const EmployeeCancelQuitForm: React.FC<EmployeeCancelQuitFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  employee
}) => {
  const [form] = Form.useForm()

  return (
    <ModalForm
      title="取消离职"
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
        if (!employee) {
          return false
        }
        try {
          await cancelEmployeeQuit({
            employeeId: employee.id,
            reason: values.reason
          } as API.HrmEmployeeCancelQuitReqVO)
          message.success('已取消离职')
          onSuccess()
          return true
        } catch {
          message.error(textConst.msg.saveError)
          return false
        }
      }}
    >
      <ProFormTextArea
        name="reason"
        label="取消原因"
        placeholder={`请输入取消员工“${employee?.name || ''}”离职安排的原因`}
        fieldProps={{ rows: 3, maxLength: 500, showCount: true }}
        rules={[
          { required: true, whitespace: true, message: '取消原因不能为空' },
          { max: 500, message: '取消原因不能超过 500 个字符' }
        ]}
      />
    </ModalForm>
  )
}

export default EmployeeCancelQuitForm
