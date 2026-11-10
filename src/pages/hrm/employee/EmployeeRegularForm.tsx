import React from 'react'
import { Col, Descriptions, Form, Row, message } from 'antd'
import {
  ModalForm,
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components'
import dayjs from 'dayjs'
import { regularEmployee } from '@/api/hrm/employee'
import { HrmEmployeeChangeReasonEnum } from '@/utils/constants'
import { EMPLOYEE_CHANGE_REASON_OPTIONS } from '@/utils/constantsValue'
import { textConst } from '@/locales/zh-CN'
import DeptSelect from './components/DeptSelect'
import HrmEmployeeSelect from './components/HrmEmployeeSelect'

interface EmployeeRegularFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  employee?: API.HrmEmployeeRespVO
}

// 办理员工转正（对应 Vue 的 EmployeeRegularForm）
const EmployeeRegularForm: React.FC<EmployeeRegularFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  employee
}) => {
  const [form] = Form.useForm()

  return (
    <ModalForm
      title="办理转正"
      open={visible}
      onOpenChange={setVisible}
      form={form}
      layout="horizontal"
      colon={false}
      labelAlign="right"
      width={760}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
      modalProps={{ destroyOnHidden: true, onCancel: () => form.resetFields() }}
      request={async () => {
        if (!employee) {
          return {}
        }
        // 用当前员工信息回填表单，未调整时保持原值
        return {
          employeeId: employee.id,
          reason: HrmEmployeeChangeReasonEnum.ORGANIZATION_ADJUSTMENT.reason,
          newDeptId: employee.deptId,
          newPostName: employee.postName,
          newPostLevel: employee.postLevel,
          newWorkAddress: employee.workAddress,
          newLeaderEmployeeId: employee.leaderEmployeeId,
          effectTime: dayjs().format('YYYY-MM-DD')
        }
      }}
      onFinish={async (values) => {
        try {
          await regularEmployee(values as API.HrmEmployeeRegularReqVO)
          message.success('转正办理成功')
          onSuccess()
          return true
        } catch {
          message.error(textConst.msg.saveError)
          return false
        }
      }}
    >
      <Descriptions column={2} bordered size="small" style={{ marginBottom: 18 }}>
        <Descriptions.Item label="员工姓名">{employee?.name || '-'}</Descriptions.Item>
        <Descriptions.Item label="当前岗位">{employee?.postName || '-'}</Descriptions.Item>
      </Descriptions>

      <Form.Item name="employeeId" hidden />

      <Row gutter={18}>
        <Col span={12}>
          <ProFormSelect
            name="reason"
            label="异动原因"
            placeholder="请选择异动原因"
            options={EMPLOYEE_CHANGE_REASON_OPTIONS}
            rules={[{ required: true, message: '请选择异动原因' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormDatePicker
            name="effectTime"
            label="生效日期"
            placeholder="请选择生效日期"
            rules={[{ required: true, message: '请选择生效日期' }]}
          />
        </Col>
      </Row>
      <Row gutter={18}>
        <Col span={12}>
          <ProForm.Item name="newDeptId" label="转正后部门">
            <DeptSelect placeholder="请选择转正后部门" />
          </ProForm.Item>
        </Col>
        <Col span={12}>
          <ProFormText
            name="newPostName"
            label="转正后岗位"
            placeholder="未调整则保持当前岗位"
            fieldProps={{ maxLength: 255 }}
          />
        </Col>
      </Row>
      <Row gutter={18}>
        <Col span={12}>
          <ProFormText
            name="newPostLevel"
            label="转正后职级"
            placeholder="未调整则保持当前职级"
            fieldProps={{ maxLength: 255 }}
          />
        </Col>
        <Col span={12}>
          <ProForm.Item name="newLeaderEmployeeId" label="转正后上级">
            <HrmEmployeeSelect
              disabledIds={employee?.id ? [employee.id] : []}
              placeholder="未调整则保持当前直属上级"
            />
          </ProForm.Item>
        </Col>
      </Row>
      <ProFormText
        name="newWorkAddress"
        label="转正后工作地点"
        placeholder="未调整则保持当前工作地点"
        fieldProps={{ maxLength: 255 }}
      />
      <ProFormTextArea
        name="remark"
        label="备注"
        placeholder="请输入备注"
        fieldProps={{ rows: 3, maxLength: 500, showCount: true }}
      />
    </ModalForm>
  )
}

export default EmployeeRegularForm
