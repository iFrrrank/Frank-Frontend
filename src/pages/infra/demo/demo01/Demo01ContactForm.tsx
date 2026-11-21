import React from 'react'
import { message } from 'antd'
import {
  ModalForm,
  ProFormDatePicker,
  ProFormRadio,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components'
import {
  createDemo01Contact,
  getDemo01Contact,
  updateDemo01Contact
} from '@/api/infra/demo01'
import { textConst } from '@/locales/zh-CN'
import dayjs from 'dayjs'

interface Demo01ContactFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

export const SEX_OPTIONS = [
  { label: '男', value: 1 },
  { label: '女', value: 2 }
]

// 示例联系人表单（单表 CRUD 示例）
const Demo01ContactForm: React.FC<Demo01ContactFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  id
}) => {
  const isUpdate = id !== undefined
  return (
    <ModalForm
      title={isUpdate ? '编辑示例联系人' : '新增示例联系人'}
      open={visible}
      onOpenChange={setVisible}
      width={560}
      modalProps={{ destroyOnHidden: true }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getDemo01Contact({ id })
          const data = resp.data as any
          if (data) {
            return {
              ...data,
              birthday: data.birthday ? dayjs(data.birthday) : undefined
            }
          }
        }
        return { sex: 1 }
      }}
      onFinish={async (values) => {
        const body = {
          ...values,
          birthday: values.birthday
            ? dayjs(values.birthday).format('YYYY-MM-DD HH:mm:ss')
            : undefined
        }
        try {
          if (isUpdate) {
            await updateDemo01Contact({ ...body, id })
            message.success(textConst.msg.updateSuccess)
          } else {
            await createDemo01Contact(body)
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
      <ProFormText
        name="name"
        label="名字"
        rules={[{ required: true, message: '请输入名字' }]}
        placeholder="请输入名字"
      />
      <ProFormRadio.Group name="sex" label="性别" options={SEX_OPTIONS} />
      <ProFormDatePicker
        name="birthday"
        label="出生年"
        fieldProps={{ picker: 'year', style: { width: '100%' } }}
      />
      <ProFormTextArea name="description" label="简介" fieldProps={{ rows: 3 }} />
      <ProFormText name="avatar" label="头像" placeholder="请输入头像地址" />
    </ModalForm>
  )
}

export default Demo01ContactForm
