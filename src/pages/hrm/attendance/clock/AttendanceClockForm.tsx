import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Alert, Col, DatePicker, Form, Input, Modal, Row, Select, TimePicker, message } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import * as AttendanceClockApi from '@/api/hrm/attendance/clock'
import { HrmAttendanceClockTypeEnum } from '@/utils/constants'
import { ATTENDANCE_CLOCK_TYPE_OPTIONS } from '@/utils/constantsValue'
import { formatHrmDate, formatHrmDateTime } from '@/pages/hrm/utils/format'
import HrmEmployeeSelect from '@/pages/hrm/employee/components/HrmEmployeeSelect'

export interface AttendanceClockFormProps {
  onSuccess: () => void
}

export interface AttendanceClockFormRef {
  open: (type: 'create' | 'update', id?: number) => Promise<void>
}

const AttendanceClockForm = forwardRef<AttendanceClockFormRef, AttendanceClockFormProps>(
  ({ onSuccess }, ref) => {
    const [open, setOpen] = useState(false)
    const [formType, setFormType] = useState<'create' | 'update'>('create')
    const [loading, setLoading] = useState(false)
    const [shiftLoading, setShiftLoading] = useState(false)
    const [shiftInfo, setShiftInfo] = useState<API.HrmAttendanceClockShiftRespVO>()
    const [clockId, setClockId] = useState<number>()
    const [form] = Form.useForm()

    const loadShift = async (employeeId?: number, attendanceDate?: Dayjs, applyDefault = false) => {
      setShiftInfo(undefined)
      if (!employeeId || !attendanceDate) return

      setShiftLoading(true)
      try {
        const resp = await AttendanceClockApi.getAttendanceClockShift({
          employeeId,
          attendanceTime: attendanceDate.format('YYYY-MM-DD HH:mm:ss')
        } as any)
        const shift = resp.data
        setShiftInfo(shift)

        if (applyDefault && shift) {
          const type = form.getFieldValue('type') || HrmAttendanceClockTypeEnum.ON_DUTY.type
          const defaultTime =
            type === HrmAttendanceClockTypeEnum.ON_DUTY.type ? shift.startTime : shift.endTime
          if (defaultTime) {
            form.setFieldsValue({ clockTime: dayjs(defaultTime) })
          }
        }
      } finally {
        setShiftLoading(false)
      }
    }

    useImperativeHandle(ref, () => ({
      open: async (type, id) => {
        setFormType(type)
        setClockId(id)
        setOpen(true)
        form.resetFields()
        setShiftInfo(undefined)

        if (id && type === 'update') {
          setLoading(true)
          try {
            const resp = await AttendanceClockApi.getAttendanceClock({ id })
            const data = resp.data
            if (data) {
              const attTime = data.attendanceTime ? dayjs(data.attendanceTime) : undefined
              const clkTime = data.clockTime ? dayjs(data.clockTime) : undefined
              form.setFieldsValue({
                employeeId: data.employeeId,
                type: data.type || HrmAttendanceClockTypeEnum.ON_DUTY.type,
                attendanceTime: attTime,
                clockTime: clkTime,
                remark: data.remark || ''
              })
              await loadShift(data.employeeId, attTime, false)
            }
          } finally {
            setLoading(false)
          }
        } else {
          const today = dayjs()
          form.setFieldsValue({
            employeeId: undefined,
            type: HrmAttendanceClockTypeEnum.ON_DUTY.type,
            attendanceTime: today,
            clockTime: undefined,
            remark: ''
          })
        }
      }
    }))

    const handleEmployeeChange = (employeeId?: number | number[]) => {
      const singleId = Array.isArray(employeeId) ? employeeId[0] : employeeId
      form.setFieldsValue({ employeeId: singleId })
      const attendanceDate = form.getFieldValue('attendanceTime')
      loadShift(singleId, attendanceDate, true)
    }

    const handleDateChange = (date: Dayjs | null) => {
      const employeeId = form.getFieldValue('employeeId')
      if (date) {
        loadShift(employeeId, date, true)
      } else {
        setShiftInfo(undefined)
      }
    }

    const handleTypeChange = (val: number) => {
      if (shiftInfo) {
        const defaultTime =
          val === HrmAttendanceClockTypeEnum.ON_DUTY.type ? shiftInfo.startTime : shiftInfo.endTime
        if (defaultTime) {
          form.setFieldsValue({ clockTime: dayjs(defaultTime) })
        }
      }
    }

    const formatShiftTimeRange = (begin?: any, end?: any) => {
      if (!begin || !end) return '-'
      return `${dayjs(begin).format('MM-DD HH:mm')} 至 ${dayjs(end).format('MM-DD HH:mm')}`
    }

    const buildClockTime = (attendanceDate: Dayjs, time: Dayjs, beginTime?: any, endTime?: any) => {
      const baseStr = `${attendanceDate.format('YYYY-MM-DD')} ${time.format('HH:mm:ss')}`
      let clockTime = dayjs(baseStr)
      if (!beginTime || !endTime) return clockTime

      const begin = dayjs(beginTime)
      const end = dayjs(endTime)
      const nextDayTime = clockTime.add(1, 'day')
      if (clockTime.isBefore(begin) && (nextDayTime.isBefore(end) || nextDayTime.isSame(end))) {
        clockTime = nextDayTime
      }
      return clockTime.isBefore(begin) || clockTime.isAfter(end) ? undefined : clockTime
    }

    const handleSubmit = async () => {
      try {
        const values = await form.validateFields()
        if (!shiftInfo) {
          message.warning('该员工当天未配置有效班次，不能补录打卡')
          return
        }

        const isDuty = values.type === HrmAttendanceClockTypeEnum.ON_DUTY.type
        const attendanceTime = isDuty ? shiftInfo.startTime : shiftInfo.endTime
        const beginClockTime = isDuty ? shiftInfo.clockInStartTime : shiftInfo.clockOutStartTime
        const endClockTime = isDuty ? shiftInfo.clockInEndTime : shiftInfo.clockOutEndTime

        const targetClockTime = buildClockTime(
          values.attendanceTime,
          values.clockTime,
          beginClockTime,
          endClockTime
        )

        if (!targetClockTime) {
          message.warning(`打卡时间需在 ${formatShiftTimeRange(beginClockTime, endClockTime)} 内`)
          return
        }

        setLoading(true)
        const payload: any = {
          id: clockId,
          employeeId: values.employeeId,
          type: values.type,
          attendanceTime: dayjs(attendanceTime).valueOf(),
          clockTime: targetClockTime.valueOf(),
          remark: values.remark
        }

        if (formType === 'create') {
          await AttendanceClockApi.createAttendanceClock(payload)
          message.success('创建成功')
        } else {
          await AttendanceClockApi.updateAttendanceClock(payload)
          message.success('修改成功')
        }

        setOpen(false)
        onSuccess()
      } catch (err: any) {
        if (err?.errorFields) return
        message.error(err?.message || '保存失败')
      } finally {
        setLoading(false)
      }
    }

    const shiftTimeTip = shiftInfo
      ? `班次 ${dayjs(shiftInfo.startTime).format('HH:mm')}-${dayjs(shiftInfo.endTime).format(
          'HH:mm'
        )}；上班可打卡 ${formatShiftTimeRange(
          shiftInfo.clockInStartTime,
          shiftInfo.clockInEndTime
        )}；下班可打卡 ${formatShiftTimeRange(
          shiftInfo.clockOutStartTime,
          shiftInfo.clockOutEndTime
        )}`
      : ''

    const currentEmployeeId = Form.useWatch('employeeId', form)
    const currentAttendanceDate = Form.useWatch('attendanceTime', form)

    return (
      <Modal
        title={formType === 'create' ? '新增打卡记录' : '修改打卡记录'}
        width={680}
        open={open}
        onOk={handleSubmit}
        onCancel={() => setOpen(false)}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form form={form} layout="horizontal" labelCol={{ flex: '112px' }}>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item
                name="employeeId"
                label="员工"
                rules={[{ required: true, message: '员工不能为空' }]}
              >
                <HrmEmployeeSelect
                  disabled={formType === 'update'}
                  onChange={handleEmployeeChange}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="打卡类型"
                rules={[{ required: true, message: '打卡类型不能为空' }]}
              >
                <Select options={ATTENDANCE_CLOCK_TYPE_OPTIONS} onChange={handleTypeChange} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={20}>
            <Col span={12}>
              <Form.Item
                name="attendanceTime"
                label="打卡日期"
                rules={[{ required: true, message: '打卡日期不能为空' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="请选择打卡日期"
                  onChange={handleDateChange}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="clockTime"
                label="打卡时间"
                rules={[{ required: true, message: '打卡时间不能为空' }]}
              >
                <TimePicker
                  format="HH:mm:ss"
                  style={{ width: '100%' }}
                  placeholder="请选择打卡时间"
                />
              </Form.Item>
            </Col>
          </Row>

          {shiftInfo ? (
            <Alert message={shiftTimeTip} type="info" showIcon style={{ marginBottom: 18 }} />
          ) : currentEmployeeId && currentAttendanceDate && !shiftLoading ? (
            <Alert
              message="该员工当天未配置有效班次，不能补录打卡"
              type="warning"
              showIcon
              style={{ marginBottom: 18 }}
            />
          ) : null}

          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} maxLength={255} placeholder="请输入备注" showCount />
          </Form.Item>
        </Form>
      </Modal>
    )
  }
)

export default AttendanceClockForm
