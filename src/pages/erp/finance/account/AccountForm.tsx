import React from 'react'
import { message, Form } from 'antd'
import { ModalForm, ProFormText, ProFormRadio, ProFormDigit } from '@ant-design/pro-components'
import { createAccount, updateAccount, getAccount } from '@/api/erp/finance/account'
import { textConst } from '@/locales/zh-CN'
import { COMMON_STATUS_OPTIONS } from '@/utils/constantsValue'

interface AccountFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const AccountForm: React.FC<AccountFormProps> = ({ visible, setVisible, onSuccess, id }) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()

  return (
    <ModalForm
      title={isUpdate ? textConst.action.update : textConst.action.create}
      open={visible}
      onOpenChange={setVisible}
      form={form}
      layout="horizontal"
      modalProps={{
        destroyOnHidden: true,
        onCancel: () => form.resetFields()
      }}
      colon={false}
      labelAlign="right"
      width={450}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getAccount({ id } as any)
          return resp.data as Record<string, any>
        }
        return { status: 0 }
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateAccount({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createAccount(values as any)
            message.success(textConst.msg.createSuccess)
          }
          onSuccess()
          return true
        } catch (e) {
          message.error(textConst.error.operationFail)
          return false
        }
      }}
    >
      <ProFormText
        name="name"
        label="账户名称"
        rules={[{ required: true, message: '请输入账户名称' }]}
        placeholder="请输入账户名称"
      />
      <ProFormText name="code" label="账户编码" placeholder="请输入账户编码" />
      <ProFormRadio.Group
        name="status"
        label="状态"
        rules={[{ required: true, message: '请选择账户状态' }]}
        options={COMMON_STATUS_OPTIONS}
      />
      <ProFormDigit
        name="sort"
        label="排序"
        rules={[{ required: true, message: '请输入排序' }]}
        placeholder="请输入排序"
        fieldProps={{ precision: 0 }}
      />{' '}
      <ProFormText name="remark" label="备注" placeholder="请输入备注" />
    </ModalForm>
  )
}

export default AccountForm
