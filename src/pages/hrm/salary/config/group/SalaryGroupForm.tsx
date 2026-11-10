import React, { useEffect, useState } from 'react'
import { Col, Form, Input, Modal, Row, message } from 'antd'
import { createSalaryGroup, getSalaryGroup, updateSalaryGroup } from '@/api/hrm/salary/group'
import { textConst } from '@/locales/zh-CN'
import SalaryTaxRuleSelect from '../tax-rule/components/SalaryTaxRuleSelect'
import DeptSelect from '@/pages/hrm/employee/components/DeptSelect'
import HrmEmployeeSelect from '@/pages/hrm/employee/components/HrmEmployeeSelect'

interface SalaryGroupFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  id?: number
  onSuccess: () => void
}

const SalaryGroupForm: React.FC<SalaryGroupFormProps> = ({
  visible,
  setVisible,
  id,
  onSuccess
}) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!visible) {
      form.resetFields()
      return
    }

    if (id) {
      setLoading(true)
      getSalaryGroup({ id })
        .then((resp) => {
          const data = (resp.data || {}) as API.HrmSalaryGroupRespVO
          form.setFieldsValue({
            ...data,
            deptIds: data.deptIds || [],
            employeeIds: data.employeeIds || []
          })
        })
        .finally(() => setLoading(false))
    } else {
      form.setFieldsValue({
        name: '',
        taxRuleId: undefined,
        deptIds: [],
        employeeIds: []
      })
    }
  }, [visible, id, form])

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      const deptIds = values.deptIds || []
      const employeeIds = values.employeeIds || []
      if (!deptIds.length && !employeeIds.length) {
        message.warning('适用部门和适用员工不能同时为空')
        return
      }

      setLoading(true)
      const payload: API.HrmSalaryGroupSaveReqVO = {
        ...values,
        id
      }

      if (isUpdate) {
        await updateSalaryGroup(payload)
        message.success(textConst.msg.updateSuccess)
      } else {
        await createSalaryGroup(payload)
        message.success(textConst.msg.createSuccess)
      }

      setVisible(false)
      onSuccess()
    } catch {
      // Form error
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={isUpdate ? '修改薪资组' : '新增薪资组'}
      open={visible}
      onCancel={() => setVisible(false)}
      onOk={handleOk}
      confirmLoading={loading}
      destroyOnClose
      okText={textConst.common.ok}
      cancelText={textConst.common.cancel}
      width={780}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        colon={false}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="薪资组"
              rules={[{ required: true, message: '薪资组名称不能为空' }]}
            >
              <Input maxLength={64} placeholder="请输入薪资组名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="taxRuleId"
              label="计税规则"
              rules={[{ required: true, message: '计税规则不能为空' }]}
            >
              <SalaryTaxRuleSelect />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="计薪标准">
              <span style={{ color: 'rgba(0,0,0,0.85)' }}>21.75 天 / 月</span>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="调薪规则">
              <span style={{ color: 'rgba(0,0,0,0.85)' }}>
                按转正、调薪生效日前后的工资混合计算
              </span>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="deptIds" label="部门范围">
              <DeptSelect placeholder="请选择部门" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="employeeIds" label="员工范围">
              <HrmEmployeeSelect multiple placeholder="请选择员工" title="选择薪资组员工" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default SalaryGroupForm
