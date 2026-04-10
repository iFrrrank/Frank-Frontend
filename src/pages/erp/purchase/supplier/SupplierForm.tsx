import React from 'react'
import { message, Form } from 'antd'
import { ModalForm, ProFormText, ProFormRadio, ProFormDigit } from '@ant-design/pro-components'
import { createSupplier, updateSupplier, getSupplier } from '@/api/erp/purchase/supplier'
import { textConst } from '@/locales/zh-CN'
import { COMMON_STATUS_OPTIONS } from '@/utils/constantsValue'

interface SupplierFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const SupplierForm: React.FC<SupplierFormProps> = ({ visible, setVisible, onSuccess, id }) => {
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
      grid={true}
      colon={false}
      labelAlign="right"
      width={800}
      rowProps={{ gutter: 24 }}
      colProps={{ span: 12 }}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getSupplier({ id } as any)
          return resp.data as Record<string, any>
        }
        return { status: 0 }
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateSupplier({ id, ...values } as any)
            message.success('更新成功')
          } else {
            await createSupplier(values as any)
            message.success('新增成功')
          }
          onSuccess()
          return true
        } catch (e) {
          message.error('操作失败')
          return false
        }
      }}
    >
      <ProFormText
        name="name"
        label="名称"
        rules={[{ required: true, message: '请输入名称' }]}
        placeholder="请输入名称"
      />
      <ProFormText name="contact" label="联系人" placeholder="请输入联系人" />
      <ProFormText name="mobile" label="手机号码" placeholder="请输入手机号码" />
      <ProFormText name="telephone" label="联系电话" placeholder="请输入联系电话" />
      <ProFormText name="email" label="电子邮箱" placeholder="请输入电子邮箱" />
      <ProFormText name="fax" label="传真" placeholder="请输入传真" />
      <ProFormRadio.Group
        name="status"
        label="开启状态"
        rules={[{ required: true, message: '请选择开启状态' }]}
        options={COMMON_STATUS_OPTIONS}
      />
      <ProFormDigit
        name="sort"
        label="排序"
        rules={[{ required: true, message: '请输入排序' }]}
        placeholder="请输入排序"
        fieldProps={{ precision: 0 }}
      />
      <ProFormText name="taxNo" label="纳税人识别号" placeholder="请输入纳税人识别号" />
      <ProFormDigit
        name="taxPercent"
        label="税率"
        placeholder="请输入税率"
        fieldProps={{ precision: 2, min: 0, max: 100, suffix: '%' }}
      />
      <ProFormText name="bankName" label="开户行" placeholder="请输入开户行" />
      <ProFormText name="bankAccount" label="开户账号" placeholder="请输入开户账号" />
      <ProFormText name="bankAddress" label="开户地址" placeholder="请输入开户地址" />
      <ProFormText name="remark" label="备注" placeholder="请输入备注" />
    </ModalForm>
  )
}

export default SupplierForm
