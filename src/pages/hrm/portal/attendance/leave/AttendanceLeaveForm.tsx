import React, { useEffect, useState } from 'react'
import { Form, Input, InputNumber, Modal, Select, DatePicker, message } from 'antd'
import type { Dayjs } from 'dayjs'
import * as AttendanceLeaveApi from '@/api/hrm/portal/attendance'
import { getLeaveTypeOptions, type LeaveTypeOption } from '@/pages/hrm/attendance/utils'

export interface AttendanceLeaveFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const AttendanceLeaveForm: React.FC<AttendanceLeaveFormProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [leaveTypes, setLeaveTypes] = useState<LeaveTypeOption[]>([])

  useEffect(() => {
    getLeaveTypeOptions().then((opts) => setLeaveTypes(opts || []))
  }, [])

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        type: undefined,
        startTime: undefined,
        endTime: undefined,
        day: 1,
        reason: '',
        remark: ''
      })
    } else {
      form.resetFields()
    }
  }, [open, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      await AttendanceLeaveApi.createMyAttendanceLeave({
        type: values.type,
        startTime: values.startTime.valueOf(),
        endTime: values.endTime.valueOf(),
        day: values.day,
        reason: values.reason,
        remark: values.remark
      })
      message.success('请假申请已提交')
      onOpenChange(false)
      onSuccess()
    } catch (err: any) {
      if (err?.errorFields) return
      message.error(err?.message || '提交失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="请假申请"
      width={600}
      open={open}
      onOk={handleSubmit}
      onCancel={() => onOpenChange(false)}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form form={form} layout="horizontal" labelCol={{ flex: '100px' }}>
        <Form.Item
          name="type"
          label="请假类型"
          rules={[{ required: true, message: '请选择请假类型' }]}
        >
          <Select placeholder="请选择请假类型" options={leaveTypes} allowClear />
        </Form.Item>

        <Form.Item
          name="startTime"
          label="开始时间"
          rules={[{ required: true, message: '请选择开始时间' }]}
        >
          <DatePicker showTime style={{ width: '100%' }} placeholder="请选择开始时间" />
        </Form.Item>

        <Form.Item
          name="endTime"
          label="结束时间"
          dependencies={['startTime']}
          rules={[
            { required: true, message: '请选择结束时间' },
            ({ getFieldValue }) => ({
              validator(_, value: Dayjs | undefined) {
                const start = getFieldValue('startTime') as Dayjs | undefined
                if (value && start && (value.isBefore(start) || value.isSame(start))) {
                  return Promise.reject(new Error('结束时间必须晚于开始时间'))
                }
                return Promise.resolve()
              }
            })
          ]}
        >
          <DatePicker showTime style={{ width: '100%' }} placeholder="请选择结束时间" />
        </Form.Item>

        <Form.Item
          name="day"
          label="请假天数"
          rules={[{ required: true, message: '请输入请假天数' }]}
        >
          <InputNumber
            min={0.01}
            precision={2}
            step={0.5}
            style={{ width: '100%' }}
            placeholder="请输入请假天数"
          />
        </Form.Item>

        <Form.Item
          name="reason"
          label="请假事由"
          rules={[{ required: true, message: '请输入请假事由' }]}
        >
          <Input.TextArea rows={3} maxLength={300} showCount placeholder="请输入请假事由" />
        </Form.Item>

        <Form.Item name="remark" label="备注">
          <Input.TextArea rows={2} maxLength={500} showCount placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AttendanceLeaveForm
