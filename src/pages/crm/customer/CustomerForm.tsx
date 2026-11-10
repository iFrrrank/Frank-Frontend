import React from 'react'
import { message } from 'antd'
import {
  ModalForm,
  ProFormInstance,
  ProFormText,
  ProFormSelect,
  ProFormDateTimePicker,
  ProFormTextArea,
  ProFormCascader
} from '@ant-design/pro-components'
import { createCustomer, getCustomer, updateCustomer } from '@/api/crm/customer'
import { getAreaTree } from '@/api/system/area'
import { getSimpleUserList } from '@/api/system/user'
import { textConst } from '@/locales/zh-CN'
import { INDUSTRY_LIST, CUSTOMER_SOURCE, CUSTOMER_LEVEL } from '@/utils/constantsValue'

interface CustomerFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

// 地区树缓存
let areaOptionsCache: any[] | null = null
// 用户列表缓存
let userOptionsCache: any[] | null = null

const convertAreaTree = (nodes: any[]): any[] =>
  nodes.map((node) => ({
    value: node.id,
    label: node.name,
    children: node.children?.length ? convertAreaTree(node.children) : undefined
  }))

const CustomerForm: React.FC<CustomerFormProps> = ({ visible, setVisible, onSuccess, id }) => {
  const isUpdate = id !== undefined
  const formRef = React.useRef<ProFormInstance>(undefined)

  return (
    <ModalForm
      title={isUpdate ? textConst.action.update : textConst.action.create}
      open={visible}
      onOpenChange={setVisible}
      formRef={formRef}
      modalProps={{
        destroyOnHidden: true,
        onCancel: () => {
          formRef.current?.resetFields()
          setVisible(false)
        }
      }}
      layout="horizontal"
      width={800}
      grid={true}
      rowProps={{ gutter: 24 }}
      colProps={{ span: 12 }}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      colon={false}
      request={async () => {
        if (id !== undefined) {
          const resp = await getCustomer({ id })
          return resp.data as Record<string, any>
        }
        return {}
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateCustomer({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createCustomer(values as any)
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
        label="客户名称"
        rules={[{ required: true, message: '请输入客户名称' }]}
        placeholder="请输入客户名称"
      />
      <ProFormSelect
        name="source"
        label="客户来源"
        valueEnum={CUSTOMER_SOURCE}
        placeholder="请选择客户来源"
      />
      <ProFormText name="mobile" label="手机" placeholder="请输入手机" />
      <ProFormSelect
        name="ownerUserId"
        label="负责人"
        rules={[{ required: true, message: '请选择负责人' }]}
        placeholder="请选择负责人"
        showSearch
        request={async () => {
          if (userOptionsCache) return userOptionsCache
          const res = await getSimpleUserList()
          if (res.data) {
            userOptionsCache = res.data.map((u: any) => ({ label: u.nickname, value: u.id }))
          }
          return userOptionsCache || []
        }}
      />
      <ProFormText name="telephone" label="电话" placeholder="请输入电话" />
      <ProFormText name="email" label="邮箱" placeholder="请输入邮箱" />
      <ProFormText name="wechat" label="微信" placeholder="请输入微信" />
      <ProFormText name="qq" label="QQ" placeholder="请输入 QQ" />
      <ProFormSelect
        name="industryId"
        label="客户行业"
        valueEnum={INDUSTRY_LIST}
        placeholder="请选择客户行业"
      />
      <ProFormSelect
        name="level"
        label="客户级别"
        valueEnum={CUSTOMER_LEVEL}
        placeholder="请选择客户级别"
      />
      <ProFormCascader
        name="areaId"
        label="地址"
        placeholder="请选择城市"
        request={async () => {
          if (areaOptionsCache) return areaOptionsCache
          const res = await getAreaTree()
          if (res.data) {
            areaOptionsCache = convertAreaTree(res.data)
          }
          return areaOptionsCache || []
        }}
        fieldProps={{
          showSearch: true
        }}
      />
      <ProFormText name="detailAddress" label="详细地址" placeholder="请输入详细地址" />
      <ProFormDateTimePicker
        name="contactNextTime"
        label="下次联系时间"
        placeholder="请选择时间"
        fieldProps={{ style: { width: '100%' } }}
      />
      <ProFormTextArea
        name="remark"
        label="备注"
        placeholder="请输入备注"
        fieldProps={{
          rows: 2
        }}
      />
    </ModalForm>
  )
}

export default CustomerForm
