import React from 'react'
import { Form, message } from 'antd'
import { ModalForm, ProFormDateTimePicker, ProFormTextArea } from '@ant-design/pro-components'
import dayjs from 'dayjs'
import { createPersonalNote } from '@/api/hrm/employee/personalNote'

interface PersonalNoteFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  // 日历当前选中的日期（YYYY-MM-DD），备忘提醒时间默认为该日期 + 当前时分
  date: string
  onSuccess: () => void
}

/** 新增个人备忘弹窗 */
const PersonalNoteForm: React.FC<PersonalNoteFormProps> = ({
  visible,
  setVisible,
  date,
  onSuccess
}) => {
  const [form] = Form.useForm()

  return (
    <ModalForm
      title="新增备忘"
      open={visible}
      onOpenChange={(open) => {
        setVisible(open)
        // 每次打开重新初始化表单，对应 Vue 版 open(date) 的重置逻辑
        if (open) {
          form.setFieldsValue({
            content: '',
            reminderTime: dayjs(`${date} ${dayjs().format('HH:mm')}:00`)
          })
        }
      }}
      form={form}
      layout="horizontal"
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
      width={520}
      modalProps={{ destroyOnHidden: true, onCancel: () => form.resetFields() }}
      initialValues={{
        content: '',
        reminderTime: dayjs(`${date} ${dayjs().format('HH:mm')}:00`)
      }}
      submitter={{ searchConfig: { submitText: '确 定', resetText: '取 消' } }}
      onFinish={async (values) => {
        try {
          await createPersonalNote({
            content: values.content,
            reminderTime: values.reminderTime
          })
          message.success('新增备忘成功')
          onSuccess()
          return true
        } catch {
          return false
        }
      }}
    >
      <ProFormDateTimePicker
        name="reminderTime"
        label="提醒时间"
        placeholder="请选择提醒时间"
        rules={[{ required: true, message: '提醒时间不能为空' }]}
        fieldProps={{ style: { width: '100%' } }}
      />
      <ProFormTextArea
        name="content"
        label="备忘内容"
        placeholder="请输入备忘内容"
        rules={[{ required: true, message: '备忘内容不能为空' }]}
        fieldProps={{ rows: 4, maxLength: 1024, showCount: true }}
      />
    </ModalForm>
  )
}

export default PersonalNoteForm
