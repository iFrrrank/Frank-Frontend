import React from 'react'
import { Form } from 'antd'
import dayjs from 'dayjs'
import { ModalForm, ProFormDatePicker, ProFormSelect } from '@ant-design/pro-components'
import { ATTENDANCE_HOLIDAY_TYPE_OPTIONS } from '@/utils/constantsValue'
import type { AttendanceSpecialDate } from '../../utils'

interface AttendanceGroupSpecialDateFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  // 编辑时传入；不传表示新增
  specialDate?: AttendanceSpecialDate
  onConfirm: (specialDate: AttendanceSpecialDate) => void
}

// 考勤组特殊日期表单（上班 / 休息）
const AttendanceGroupSpecialDateForm: React.FC<AttendanceGroupSpecialDateFormProps> = ({
  visible,
  setVisible,
  specialDate,
  onConfirm
}) => {
  const [form] = Form.useForm()

  return (
    <ModalForm
      title={specialDate ? '编辑特殊日期' : '新增特殊日期'}
      open={visible}
      onOpenChange={setVisible}
      form={form}
      layout="horizontal"
      colon={false}
      labelAlign="right"
      width={560}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      modalProps={{ destroyOnHidden: true, onCancel: () => form.resetFields() }}
      request={async () => ({
        type: specialDate?.type,
        date: specialDate?.date ? dayjs(specialDate.date) : undefined
      })}
      onFinish={async (values) => {
        // 日期以毫秒时间戳保存，与 Vue 的 value-format="x" 一致
        onConfirm({ type: values.type, date: dayjs(values.date).startOf('d').valueOf() })
        return true
      }}
    >
      <ProFormSelect
        name="type"
        label="特殊日期类型"
        placeholder="请选择特殊日期类型"
        options={ATTENDANCE_HOLIDAY_TYPE_OPTIONS}
        rules={[{ required: true, message: '特殊日期类型不能为空' }]}
      />
      <ProFormDatePicker
        name="date"
        label="日期"
        placeholder="请选择日期"
        width="100%"
        fieldProps={{ style: { width: '100%' } }}
        rules={[{ required: true, message: '日期不能为空' }]}
      />
    </ModalForm>
  )
}

export default AttendanceGroupSpecialDateForm
