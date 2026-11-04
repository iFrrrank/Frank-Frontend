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
import { HrmEmployeeChangeReasonEnum, HrmEmployeeChangeTypeEnum } from '@/utils/constants'
import { EMPLOYEE_CHANGE_REASON_OPTIONS } from '@/utils/constantsValue'
import { textConst } from '@/locales/zh-CN'
import DeptSelect from './components/DeptSelect'
import HrmEmployeeSelect from './components/HrmEmployeeSelect'

// 支持调岗 / 晋升 / 降级三种岗位异动
export type EmployeeChangeType =
  | typeof HrmEmployeeChangeTypeEnum.TRANSFER.type
  | typeof HrmEmployeeChangeTypeEnum.PROMOTION.type
  | typeof HrmEmployeeChangeTypeEnum.DEMOTION.type

interface EmployeePositionChangeFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  title: string
  changeType: EmployeeChangeType
  submitRequest: (data: API.HrmEmployeeTransferReqVO) => Promise<any>
  employee?: API.HrmEmployeeRespVO
}

/** 通用岗位异动表单：调岗 / 晋升 / 降级共用（对应 Vue 的 EmployeePositionChangeForm） */
const EmployeePositionChangeForm: React.FC<EmployeePositionChangeFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  title,
  changeType,
  submitRequest,
  employee
}) => {
  const [form] = Form.useForm()
  const isDemotion = changeType === HrmEmployeeChangeTypeEnum.DEMOTION.type

  // 降级只允许违规违纪及之后的负面原因，调岗 / 晋升只允许工作安排及之前的正面原因
  const changeReasonOptions = EMPLOYEE_CHANGE_REASON_OPTIONS.filter((item) =>
    isDemotion
      ? (item.value as number) >= HrmEmployeeChangeReasonEnum.VIOLATION.reason
      : (item.value as number) <= HrmEmployeeChangeReasonEnum.WORK_ARRANGEMENT.reason
  )

  return (
    <ModalForm
      title={title}
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
          reason: isDemotion
            ? HrmEmployeeChangeReasonEnum.VIOLATION.reason
            : HrmEmployeeChangeReasonEnum.ORGANIZATION_ADJUSTMENT.reason,
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
          await submitRequest(values as API.HrmEmployeeTransferReqVO)
          message.success(`${title}成功`)
          onSuccess()
          return true
        } catch {
          message.error(textConst.msg.saveError)
          return false
        }
      }}
    >
      {/* 员工基本信息展示 */}
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
            options={changeReasonOptions}
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
          <ProForm.Item name="newDeptId" label="新部门">
            <DeptSelect placeholder="请选择新部门" />
          </ProForm.Item>
        </Col>
        <Col span={12}>
          <ProFormText
            name="newPostName"
            label="新岗位"
            placeholder="请输入新岗位"
            fieldProps={{ maxLength: 255 }}
          />
        </Col>
      </Row>
      <Row gutter={18}>
        <Col span={12}>
          <ProFormText
            name="newPostLevel"
            label="新职级"
            placeholder="请输入新职级"
            fieldProps={{ maxLength: 255 }}
          />
        </Col>
        <Col span={12}>
          <ProForm.Item name="newLeaderEmployeeId" label="新直属上级">
            <HrmEmployeeSelect
              disabledIds={employee?.id ? [employee.id] : []}
              placeholder="请选择新直属上级"
            />
          </ProForm.Item>
        </Col>
      </Row>
      <ProFormText
        name="newWorkAddress"
        label="新工作地点"
        placeholder="请输入新工作地点"
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

export default EmployeePositionChangeForm
