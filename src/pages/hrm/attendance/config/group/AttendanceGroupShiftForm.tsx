import React from 'react'
import { Alert, Checkbox, Form, TimePicker } from 'antd'
import dayjs from 'dayjs'
import { ModalForm } from '@ant-design/pro-components'
import { WEEK_OPTIONS } from '@/utils/constantsValue'
import { createDefaultShift, formatShiftDuration } from '../../utils'
import type { AttendanceShift } from '../../utils'

const { RangePicker } = TimePicker

interface AttendanceGroupShiftFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  // 编辑时传入的班次；不传表示新增
  shift?: AttendanceShift
  onConfirm: (shift: AttendanceShift) => void
}

const TIME_FORMAT = 'HH:mm'

// 单个时间 <-> "HH:mm" 字符串
const timeProps = {
  getValueProps: (value?: string) => ({ value: value ? dayjs(value, TIME_FORMAT) : undefined }),
  normalize: (value?: dayjs.Dayjs | null) => value?.format(TIME_FORMAT)
}

// 时间范围 <-> ["HH:mm", "HH:mm"] 字符串数组
const rangeProps = {
  getValueProps: (value?: string[]) => ({
    value:
      value?.[0] && value?.[1]
        ? [dayjs(value[0], TIME_FORMAT), dayjs(value[1], TIME_FORMAT)]
        : undefined
  }),
  normalize: (value?: (dayjs.Dayjs | null)[] | null) =>
    value?.[0] && value?.[1]
      ? [value[0].format(TIME_FORMAT), value[1].format(TIME_FORMAT)]
      : undefined
}

// 把班次转成表单值：三个时间段合并为范围
const toFormValues = (shift: AttendanceShift) => ({
  weeks: [...shift.weeks],
  startTime: shift.startTime,
  endTime: shift.endTime,
  clockInRange: [shift.clockInStartTime, shift.clockInEndTime],
  clockOutRange: [shift.clockOutStartTime, shift.clockOutEndTime],
  restRange: [shift.restStartTime, shift.restEndTime],
  excludeRestTime: shift.excludeRestTime
})

const toShift = (values: Record<string, any>): AttendanceShift => ({
  weeks: [...(values.weeks || [])].sort((a, b) => a - b),
  startTime: values.startTime,
  endTime: values.endTime,
  clockInStartTime: values.clockInRange?.[0] || '',
  clockInEndTime: values.clockInRange?.[1] || '',
  clockOutStartTime: values.clockOutRange?.[0] || '',
  clockOutEndTime: values.clockOutRange?.[1] || '',
  restStartTime: values.restRange?.[0] || '',
  restEndTime: values.restRange?.[1] || '',
  excludeRestTime: !!values.excludeRestTime
})

// 考勤组班次表单
const AttendanceGroupShiftForm: React.FC<AttendanceGroupShiftFormProps> = ({
  visible,
  setVisible,
  shift,
  onConfirm
}) => {
  const [form] = Form.useForm()
  const values = Form.useWatch([], form)

  return (
    <ModalForm
      title={shift ? '编辑班次' : '新增班次'}
      open={visible}
      onOpenChange={setVisible}
      form={form}
      layout="vertical"
      width={760}
      modalProps={{ destroyOnHidden: true, onCancel: () => form.resetFields() }}
      request={async () => toFormValues(shift ? shift : createDefaultShift())}
      onFinish={async (formValues) => {
        onConfirm(toShift(formValues))
        return true
      }}
    >
      <Form.Item
        name="weeks"
        label="工作日"
        rules={[{ required: true, message: '工作日不能为空' }]}
      >
        <Checkbox.Group options={WEEK_OPTIONS} />
      </Form.Item>
      <Alert
        style={{ marginBottom: 16 }}
        type="info"
        showIcon
        message="打卡窗口需覆盖对应的上下班时间；结束时间早于开始时间时按次日计算，例如 18:00 至次日 04:59。"
      />
      <div style={{ display: 'flex', gap: 24 }}>
        <Form.Item
          style={{ flex: 1 }}
          name="startTime"
          label="上班时间"
          rules={[{ required: true, message: '上班时间不能为空' }]}
          {...timeProps}
        >
          <TimePicker style={{ width: '100%' }} format={TIME_FORMAT} placeholder="请选择上班时间" />
        </Form.Item>
        <Form.Item
          style={{ flex: 1 }}
          name="endTime"
          label="下班时间"
          rules={[{ required: true, message: '下班时间不能为空' }]}
          {...timeProps}
        >
          <TimePicker style={{ width: '100%' }} format={TIME_FORMAT} placeholder="请选择下班时间" />
        </Form.Item>
      </div>
      <Form.Item
        name="clockInRange"
        label="上班打卡时间段"
        rules={[{ required: true, message: '上班打卡时间段不能为空' }]}
        {...rangeProps}
      >
        <RangePicker
          style={{ width: '100%' }}
          format={TIME_FORMAT}
          placeholder={['开始时间', '结束时间']}
        />
      </Form.Item>
      <Form.Item
        name="clockOutRange"
        label="下班打卡时间段"
        rules={[{ required: true, message: '下班打卡时间段不能为空' }]}
        {...rangeProps}
      >
        <RangePicker
          style={{ width: '100%' }}
          format={TIME_FORMAT}
          placeholder={['开始时间', '结束时间']}
        />
      </Form.Item>
      <Form.Item label="休息时间" required>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Form.Item
            noStyle
            name="restRange"
            rules={[{ required: true, message: '休息时间不能为空' }]}
            {...rangeProps}
          >
            <RangePicker
              style={{ flex: 1 }}
              format={TIME_FORMAT}
              placeholder={['开始时间', '结束时间']}
            />
          </Form.Item>
          <Form.Item noStyle name="excludeRestTime" valuePropName="checked">
            <Checkbox>不计入工作时长</Checkbox>
          </Form.Item>
        </div>
      </Form.Item>
      <Form.Item label="合计工作时长">
        <span>{values ? formatShiftDuration(toShift({ ...values })) : '-'}</span>
      </Form.Item>
    </ModalForm>
  )
}

export default AttendanceGroupShiftForm
