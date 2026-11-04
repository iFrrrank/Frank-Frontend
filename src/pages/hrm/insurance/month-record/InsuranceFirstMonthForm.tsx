import React from 'react'
import { Form, message } from 'antd'
import { ModalForm, ProFormDatePicker } from '@ant-design/pro-components'
import { createFirstMonthRecord } from '@/api/hrm/insurance/monthRecord'
import { textConst } from '@/locales/zh-CN'

interface InsuranceFirstMonthFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  /** 创建成功，返回所选年份，列表据此切换到对应年份 */
  onSuccess: (year: number) => void
}

/** 新建首月社保表 */
const InsuranceFirstMonthForm: React.FC<InsuranceFirstMonthFormProps> = ({
  visible,
  setVisible,
  onSuccess
}) => {
  const [form] = Form.useForm()

  return (
    <ModalForm
      title="新建首月社保表"
      open={visible}
      onOpenChange={setVisible}
      form={form}
      layout="horizontal"
      colon={false}
      labelAlign="right"
      width={500}
      labelCol={{ flex: '104px' }}
      modalProps={{ destroyOnHidden: true, onCancel: () => form.resetFields() }}
      submitter={{ searchConfig: { submitText: '确 定', resetText: '取 消' } }}
      onFinish={async (values) => {
        try {
          const [year, month] = String(values.yearMonth).split('-').map(Number)
          await createFirstMonthRecord({ year, month })
          message.success('创建成功')
          onSuccess(year)
          return true
        } catch {
          message.error(textConst.msg.createError)
          return false
        }
      }}
    >
      <ProFormDatePicker.Month
        name="yearMonth"
        label="社保月份"
        placeholder="请选择社保月份"
        width="xl"
        fieldProps={{ format: 'YYYY-MM', style: { width: '100%' } }}
        rules={[{ required: true, message: '社保月份不能为空' }]}
      />
    </ModalForm>
  )
}

export default InsuranceFirstMonthForm
