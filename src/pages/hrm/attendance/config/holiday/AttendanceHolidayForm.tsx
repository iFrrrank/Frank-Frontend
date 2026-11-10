import React from 'react'
import { Form, message } from 'antd'
import dayjs from 'dayjs'
import { ModalForm, ProFormDatePicker, ProFormSelect } from '@ant-design/pro-components'
import {
  createAttendanceHoliday,
  getAttendanceHoliday,
  updateAttendanceHoliday
} from '@/api/hrm/attendance/holiday'
import { HrmAttendanceHolidayTypeEnum } from '@/utils/constants'
import { ATTENDANCE_HOLIDAY_TYPE_OPTIONS } from '@/utils/constantsValue'
import { textConst } from '@/locales/zh-CN'

interface AttendanceHolidayFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

// 考勤节假日表单：新增 / 修改
const AttendanceHolidayForm: React.FC<AttendanceHolidayFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  id
}) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()

  return (
    <ModalForm
      title={isUpdate ? textConst.action.update : textConst.action.addNew}
      open={visible}
      onOpenChange={setVisible}
      form={form}
      layout="horizontal"
      colon={false}
      labelAlign="right"
      width={520}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      modalProps={{ destroyOnHidden: true, onCancel: () => form.resetFields() }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getAttendanceHoliday({ id })
          const data = resp.data || {}
          // 后端日期为时间戳/字符串，转成 dayjs 供日期选择器回显
          return { ...data, date: data.date ? dayjs(data.date as any) : undefined }
        }
        return { type: HrmAttendanceHolidayTypeEnum.REST.type }
      }}
      onFinish={async (values) => {
        try {
          // 与 Vue 保持一致：日期以毫秒时间戳提交
          const body = {
            id,
            type: values.type,
            date: dayjs(values.date).startOf('d').valueOf()
          } as unknown as API.HrmAttendanceHolidaySaveReqVO
          if (isUpdate) {
            await updateAttendanceHoliday(body)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createAttendanceHoliday(body)
            message.success(textConst.msg.createSuccess)
          }
          onSuccess()
          return true
        } catch {
          message.error(textConst.error.operationFail)
          return false
        }
      }}
    >
      <ProFormDatePicker
        name="date"
        label="日期"
        placeholder="请选择日期"
        width="100%"
        fieldProps={{ style: { width: '100%' } }}
        rules={[{ required: true, message: '日期不能为空' }]}
      />
      <ProFormSelect
        name="type"
        label="日期类型"
        placeholder="请选择日期类型"
        options={ATTENDANCE_HOLIDAY_TYPE_OPTIONS}
        rules={[{ required: true, message: '日期类型不能为空' }]}
      />
    </ModalForm>
  )
}

export default AttendanceHolidayForm
