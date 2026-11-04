import React, { useEffect, useState } from 'react'
import { Form, Modal, Spin, message } from 'antd'
import {
  createMonthEmployeeRecordList,
  getUninsuredEmployeeList
} from '@/api/hrm/insurance/monthEmployeeRecord'
import { textConst } from '@/locales/zh-CN'
import HrmEmployeeSelect from '../../../employee/components/HrmEmployeeSelect'

interface InsuranceAddEmployeeFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  /** 月度社保表 Id */
  monthRecordId?: number
}

/** 添加参保人员：只能选择本月尚未参保的员工 */
const InsuranceAddEmployeeForm: React.FC<InsuranceAddEmployeeFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  monthRecordId
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [selectableEmployeeIds, setSelectableEmployeeIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!visible || !monthRecordId) {
      return
    }
    form.resetFields()
    form.setFieldsValue({ employeeIds: [] })
    setLoading(true)
    getUninsuredEmployeeList({ monthRecordId })
      .then((resp) =>
        setSelectableEmployeeIds(
          new Set(
            (resp.data || [])
              .map((employee) => employee.id)
              .filter((employeeId): employeeId is number => employeeId !== undefined)
          )
        )
      )
      .finally(() => setLoading(false))
  }, [visible, monthRecordId, form])

  const handleOk = async () => {
    const values = await form.validateFields()
    if (!monthRecordId) return
    setLoading(true)
    try {
      await createMonthEmployeeRecordList({ monthRecordId, employeeIds: values.employeeIds })
      message.success(textConst.msg.createSuccess)
      onSuccess()
    } catch {
      message.error(textConst.msg.createError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="添加参保人员"
      open={visible}
      width={560}
      maskClosable={false}
      forceRender
      okText="确 定"
      cancelText="取 消"
      confirmLoading={loading}
      onOk={handleOk}
      onCancel={() => setVisible(false)}
    >
      <Spin spinning={loading}>
        <Form form={form} colon={false} labelAlign="right" labelCol={{ flex: '76px' }}>
          <Form.Item
            name="employeeIds"
            label="员工"
            rules={[{ required: true, message: '请选择员工' }]}
          >
            <HrmEmployeeSelect
              multiple
              placeholder="请选择员工"
              selectable={(employee: API.HrmEmployeeRespVO) =>
                employee.id !== undefined && selectableEmployeeIds.has(employee.id)
              }
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  )
}

export default InsuranceAddEmployeeForm
