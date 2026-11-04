import React, { useEffect, useState } from 'react'
import { Form, Modal, Row, Col, Input, Select, DatePicker, message } from 'antd'
import dayjs from 'dayjs'
import * as EmployeeApi from '@/api/hrm/portal/employee'
import { EMPLOYEE_ID_TYPE_OPTIONS } from '@/utils/constantsValue'
import { SEX_OPTIONS, getEducationOptions, type DictOption } from '@/pages/hrm/employee/utils'

export interface EmployeeFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  employee: Partial<EmployeeApi.HrmPortalEmployeeVO>
  fieldConfigList: EmployeeApi.HrmEmployeeFieldConfigVO[]
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  open,
  onOpenChange,
  onSuccess,
  employee,
  fieldConfigList
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [educationOptions, setEducationOptions] = useState<DictOption[]>([])

  const editableFields = new Set(fieldConfigList.filter((f) => f.editable).map((f) => f.name))

  const isEditable = (name: string) => editableFields.has(name)

  useEffect(() => {
    getEducationOptions().then((opts) => setEducationOptions(opts || []))
  }, [])

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        name: employee.name || undefined,
        mobile: employee.mobile || undefined,
        email: employee.email || undefined,
        country: employee.country || undefined,
        nation: employee.nation || undefined,
        idType: employee.idType || undefined,
        idNumber: employee.idNumber || undefined,
        sex: employee.sex || undefined,
        nativePlace: employee.nativePlace || undefined,
        birthday: employee.birthday ? dayjs(employee.birthday) : undefined,
        highestEducation: employee.highestEducation || undefined,
        address: employee.address || undefined
      })
    } else {
      form.resetFields()
    }
  }, [open, employee, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const payload: EmployeeApi.HrmPortalEmployeeUpdateReqVO = {}
      if (isEditable('name') && values.name !== undefined) payload.name = values.name
      if (isEditable('mobile') && values.mobile !== undefined) payload.mobile = values.mobile
      if (isEditable('email') && values.email !== undefined) payload.email = values.email
      if (isEditable('country') && values.country !== undefined) payload.country = values.country
      if (isEditable('nation') && values.nation !== undefined) payload.nation = values.nation
      if (isEditable('idType') && values.idType !== undefined) payload.idType = values.idType
      if (isEditable('idNumber') && values.idNumber !== undefined)
        payload.idNumber = values.idNumber
      if (isEditable('sex') && values.sex !== undefined) payload.sex = values.sex
      if (isEditable('nativePlace') && values.nativePlace !== undefined)
        payload.nativePlace = values.nativePlace
      if (isEditable('birthday')) {
        payload.birthday = values.birthday ? values.birthday.valueOf() : undefined
      }
      if (isEditable('highestEducation') && values.highestEducation !== undefined) {
        payload.highestEducation = values.highestEducation
      }
      if (isEditable('address') && values.address !== undefined) payload.address = values.address

      await EmployeeApi.updateEmployee(payload)
      message.success('保存成功')
      onOpenChange(false)
      onSuccess()
    } catch (err: any) {
      if (err?.errorFields) return
      message.error(err?.message || '保存失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="编辑我的档案"
      width={760}
      open={open}
      onOk={handleSubmit}
      onCancel={() => onOpenChange(false)}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form form={form} layout="horizontal" labelCol={{ flex: '104px' }}>
        <Row gutter={20}>
          {isEditable('name') && (
            <Col span={12}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '姓名不能为空' }]}
              >
                <Input maxLength={255} placeholder="请输入姓名" />
              </Form.Item>
            </Col>
          )}

          {isEditable('mobile') && (
            <Col span={12}>
              <Form.Item
                name="mobile"
                label="手机号"
                rules={[
                  {
                    pattern: /^1[3-9]\d{9}$/,
                    message: '请输入正确的手机号码'
                  }
                ]}
              >
                <Input maxLength={11} placeholder="请输入手机号" />
              </Form.Item>
            </Col>
          )}

          {isEditable('email') && (
            <Col span={12}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[{ type: 'email', message: '请输入正确的邮箱地址' }]}
              >
                <Input maxLength={255} placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
          )}

          {isEditable('country') && (
            <Col span={12}>
              <Form.Item name="country" label="国家或地区">
                <Input maxLength={64} placeholder="请输入国家或地区" />
              </Form.Item>
            </Col>
          )}

          {isEditable('nation') && (
            <Col span={12}>
              <Form.Item name="nation" label="民族">
                <Input maxLength={64} placeholder="请输入民族" />
              </Form.Item>
            </Col>
          )}

          {isEditable('idType') && (
            <Col span={12}>
              <Form.Item name="idType" label="证件类型">
                <Select
                  options={EMPLOYEE_ID_TYPE_OPTIONS}
                  placeholder="请选择证件类型"
                  allowClear
                />
              </Form.Item>
            </Col>
          )}

          {isEditable('idNumber') && (
            <Col span={12}>
              <Form.Item name="idNumber" label="证件号码">
                <Input maxLength={255} placeholder="请输入证件号码" />
              </Form.Item>
            </Col>
          )}

          {isEditable('sex') && (
            <Col span={12}>
              <Form.Item name="sex" label="性别">
                <Select options={SEX_OPTIONS} placeholder="请选择性别" allowClear />
              </Form.Item>
            </Col>
          )}

          {isEditable('nativePlace') && (
            <Col span={12}>
              <Form.Item name="nativePlace" label="籍贯">
                <Input maxLength={128} placeholder="请输入籍贯" />
              </Form.Item>
            </Col>
          )}

          {isEditable('birthday') && (
            <Col span={12}>
              <Form.Item name="birthday" label="出生时间">
                <DatePicker showTime style={{ width: '100%' }} placeholder="请选择出生时间" />
              </Form.Item>
            </Col>
          )}

          {isEditable('highestEducation') && (
            <Col span={12}>
              <Form.Item name="highestEducation" label="最高学历">
                <Select options={educationOptions} placeholder="请选择最高学历" allowClear />
              </Form.Item>
            </Col>
          )}

          {isEditable('address') && (
            <Col span={24}>
              <Form.Item name="address" label="户籍地址">
                <Input maxLength={255} placeholder="请输入户籍地址" />
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>
    </Modal>
  )
}

export default EmployeeForm
