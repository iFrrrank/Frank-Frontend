import React from 'react'
import { message, Form } from 'antd'
import {
  ModalForm,
  ProFormSelect,
  ProFormDigit,
  ProFormSwitch,
  ProFormTreeSelect
} from '@ant-design/pro-components'
import {
  createCustomerLimitConfig,
  updateCustomerLimitConfig,
  getCustomerLimitConfig
} from '@/api/crm/customerLimitConfig'
import { getSimpleUserList } from '@/api/system/user'
import { textConst } from '@/locales/zh-CN'
import { handleTreeData } from '@/utils/tree'
import { getSimpleDeptList } from '@/api/system/dept'

interface CustomerLimitConfigFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
  type: string
}

// 缓存
let userOptionsCache: any[] | null = null
let deptOptionsCache: any[] | null = null

const CustomerLimitConfigForm: React.FC<CustomerLimitConfigFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  id,
  type
}) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()

  return (
    <ModalForm
      title={isUpdate ? textConst.action.update : textConst.action.create}
      open={visible}
      onOpenChange={setVisible}
      form={form}
      modalProps={{
        destroyOnHidden: true,
        onCancel: () => {
          form.resetFields()
          setVisible(false)
        }
      }}
      layout="horizontal"
      width={650}
      colon={false}
      labelAlign="right"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getCustomerLimitConfig({ id })
          return resp.data as Record<string, any>
        }
        return { type: Number(type), dealCountEnabled: true }
      }}
      onFinish={async (values) => {
        try {
          const submitData = {
            ...values,
            type: Number(type)
          }
          if (isUpdate) {
            await updateCustomerLimitConfig({ id, ...submitData } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createCustomerLimitConfig(submitData as any)
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
      <ProFormSelect
        name="userIds"
        label="规则适用人群"
        placeholder="请选择规则适用人群"
        mode="multiple"
        showSearch
        request={async () => {
          if (userOptionsCache) return userOptionsCache
          const res = await getSimpleUserList()
          userOptionsCache =
            res.data?.map((item: any) => ({ label: item.nickname, value: item.id })) || []
          return userOptionsCache
        }}
      />
      <ProFormTreeSelect
        name="deptIds"
        label="规则适用部门"
        placeholder="请选择规则适用部门"
        request={async () => {
          if (deptOptionsCache) return deptOptionsCache
          const res = await getSimpleDeptList()
          if (res.data) {
            const flatData = res.data.map((item: any) => ({
              ...item,
              label: item.name,
              value: item.id,
              sort: item.sort || 0
            }))
            deptOptionsCache = handleTreeData(flatData, 0)
            return deptOptionsCache
          }
          return []
        }}
        fieldProps={{
          treeCheckable: true,
          showCheckedStrategy: 'SHOW_ALL',
          treeNodeFilterProp: 'label',
          showSearch: true,
          maxTagCount: 3
        }}
      />
      <ProFormDigit
        name="maxCount"
        label={type === '1' ? '拥有客户数上限' : '锁定客户数上限'}
        rules={[{ required: true, message: '请输入数量' }]}
        placeholder="请输入数量"
        fieldProps={{
          min: 0,
          precision: 0,
          controls: true
        }}
      />
      {type === '1' && <ProFormSwitch name="dealCountEnabled" label="成交客户是否占用拥有客户数" />}
    </ModalForm>
  )
}

export default CustomerLimitConfigForm
