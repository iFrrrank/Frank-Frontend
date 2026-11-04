import React from 'react'
import { Col, Descriptions, Form, Row, message } from 'antd'
import {
  ModalForm,
  ProFormDatePicker,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormTextArea
} from '@ant-design/pro-components'
import dayjs from 'dayjs'
import { quitEmployee } from '@/api/hrm/employee'
import { getQuitInfo } from '@/api/hrm/employee/quitInfo'
import {
  HrmEmployeeEntryStatusEnum,
  HrmEmployeeQuitReasonEnum,
  HrmEmployeeQuitTypeEnum
} from '@/utils/constants'
import { EMPLOYEE_QUIT_REASON_OPTIONS, EMPLOYEE_QUIT_TYPE_OPTIONS } from '@/utils/constantsValue'
import { textConst } from '@/locales/zh-CN'

interface EmployeeQuitFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  employee?: API.HrmEmployeeRespVO
}

// 办理员工离职 / 修改离职信息（对应 Vue 的 EmployeeQuitForm）
const EmployeeQuitForm: React.FC<EmployeeQuitFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  employee
}) => {
  const [form] = Form.useForm()
  // 已离职员工打开时为修改离职信息
  const isUpdate = employee?.entryStatus === HrmEmployeeEntryStatusEnum.LEFT.entryStatus
  const quitType = Form.useWatch('type', form)

  // 退休不需要选择离职原因
  const showReason = quitType !== HrmEmployeeQuitTypeEnum.RETIREMENT.type

  return (
    <ModalForm
      title={isUpdate ? '修改离职信息' : '办理离职'}
      open={visible}
      onOpenChange={setVisible}
      form={form}
      layout="horizontal"
      colon={false}
      labelAlign="right"
      width={680}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
      modalProps={{ destroyOnHidden: true, onCancel: () => form.resetFields() }}
      request={async () => {
        if (!employee) {
          return {}
        }
        // 默认值：申请离职日期为今天，离职类型为主动离职
        const defaults = {
          employeeId: employee.id,
          applyQuitTime: dayjs().format('YYYY-MM-DD'),
          type: HrmEmployeeQuitTypeEnum.VOLUNTARY.type,
          reason: HrmEmployeeQuitReasonEnum.FAMILY.reason
        }
        // 已离职员工回显离职信息
        if (isUpdate) {
          const resp = await getQuitInfo({ employeeId: employee.id })
          if (resp.data) {
            return { ...defaults, ...resp.data }
          }
        }
        return defaults
      }}
      onFinish={async (values) => {
        try {
          await quitEmployee(values as API.HrmEmployeeQuitReqVO)
          message.success('离职信息保存成功')
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
          <ProFormDateTimePicker
            name="planQuitTime"
            label="计划离职时间"
            placeholder="请选择计划离职时间"
            rules={[
              { required: true, message: '请选择计划离职时间' },
              {
                validator: (_rule: any, value: any) => {
                  const applyQuitTime = form.getFieldValue('applyQuitTime')
                  if (
                    value &&
                    applyQuitTime &&
                    dayjs(value).isBefore(dayjs(applyQuitTime), 'day')
                  ) {
                    return Promise.reject(new Error('计划离职日期不能早于申请离职日期'))
                  }
                  return Promise.resolve()
                }
              }
            ]}
          />
        </Col>
        <Col span={12}>
          <ProFormDatePicker
            name="applyQuitTime"
            label="申请离职日期"
            placeholder="请选择申请离职日期"
            rules={[{ required: true, message: '请选择申请离职日期' }]}
          />
        </Col>
      </Row>
      <Row gutter={18}>
        <Col span={12}>
          <ProFormSelect
            name="type"
            label="离职类型"
            placeholder="请选择离职类型"
            options={EMPLOYEE_QUIT_TYPE_OPTIONS}
            rules={[{ required: true, message: '请选择离职类型' }]}
          />
        </Col>
        {showReason && (
          <Col span={12}>
            <ProFormSelect
              name="reason"
              label="离职原因"
              placeholder="请选择离职原因"
              options={EMPLOYEE_QUIT_REASON_OPTIONS}
              rules={[
                {
                  validator: (_rule: any, value: any) => {
                    if (
                      form.getFieldValue('type') !== HrmEmployeeQuitTypeEnum.RETIREMENT.type &&
                      !value
                    ) {
                      return Promise.reject(new Error('请选择离职原因'))
                    }
                    return Promise.resolve()
                  }
                }
              ]}
            />
          </Col>
        )}
      </Row>
      <ProFormDatePicker
        name="salarySettlementTime"
        label="薪资结算日期"
        placeholder="请选择薪资结算日期"
        rules={[
          { required: true, message: '请选择薪资结算日期' },
          {
            validator: (_rule: any, value: any) => {
              const planQuitTime = form.getFieldValue('planQuitTime')
              if (value && planQuitTime && dayjs(value).isBefore(dayjs(planQuitTime), 'day')) {
                return Promise.reject(new Error('薪资结算日期不能早于计划离职日期'))
              }
              return Promise.resolve()
            }
          }
        ]}
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

export default EmployeeQuitForm
