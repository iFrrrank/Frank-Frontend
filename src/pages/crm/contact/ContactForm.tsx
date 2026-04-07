import React from 'react'
import { message } from 'antd'
import {
  ModalForm,
  ProFormInstance,
  ProFormText,
  ProFormSelect,
  ProFormDateTimePicker,
  ProFormTextArea,
  ProFormCascader,
  ProFormRadio
} from '@ant-design/pro-components'
import { createContact, getContact, updateContact } from '@/api/crm/contact'
import { getCustomerSimpleList } from '@/api/crm/customer'
import { getSimpleContactList } from '@/api/crm/contact'
import { getAreaTree } from '@/api/system/area'
import { getSimpleUserList } from '@/api/system/user'
import { textConst } from '@/locales/zh-CN'
import { BOOLEAN_OPTIONS, SEX_OPTIONS } from '@/utils/constantsValue'

interface ContactFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

// 缓存
let areaOptionsCache: any[] | null = null
let userOptionsCache: any[] | null = null
let customerOptionsCache: any[] | null = null
let contactOptionsCache: any[] | null = null

const convertAreaTree = (nodes: any[]): any[] =>
  nodes.map((node) => ({
    value: node.id,
    label: node.name,
    children: node.children?.length ? convertAreaTree(node.children) : undefined
  }))

const ContactForm: React.FC<ContactFormProps> = ({ visible, setVisible, onSuccess, id }) => {
  const isUpdate = id !== undefined
  const formRef = React.useRef<ProFormInstance>(undefined)

  return (
    <ModalForm
      title={isUpdate ? textConst.action.update : textConst.action.create}
      open={visible}
      onOpenChange={setVisible}
      formRef={formRef}
      modalProps={{ destroyOnHidden: true }}
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
          const resp = await getContact({ id })
          return resp.data as Record<string, any>
        }
        return { master: false }
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateContact({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createContact(values as any)
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
        label="联系人姓名"
        rules={[{ required: true, message: '请输入姓名' }]}
        placeholder="请输入姓名"
      />
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
      <ProFormSelect
        name="customerId"
        label="客户名称"
        rules={[{ required: true, message: '请选择客户' }]}
        placeholder="请选择客户"
        showSearch
        request={async () => {
          if (customerOptionsCache) return customerOptionsCache
          const res = await getCustomerSimpleList()
          if (res.data) {
            customerOptionsCache = res.data.map((c: any) => ({ label: c.name, value: c.id }))
          }
          return customerOptionsCache || []
        }}
      />
      <ProFormText
        name="mobile"
        label="手机"
        placeholder="请输入手机"
      />
      <ProFormText
        name="telephone"
        label="电话"
        placeholder="请输入电话"
      />
      <ProFormText
        name="email"
        label="邮箱"
        placeholder="请输入邮箱"
      />
      <ProFormText
        name="wechat"
        label="微信"
        placeholder="请输入微信"
      />
      <ProFormText
        name="qq"
        label="QQ"
        placeholder="请输入 QQ"
      />
      <ProFormText
        name="post"
        label="职位"
        placeholder="请输入职位"
      />
      <ProFormRadio.Group
        name="master"
        label="关键决策人"
        options={BOOLEAN_OPTIONS}
      />
      <ProFormSelect
        name="sex"
        label="性别"
        placeholder="请选择性别"
        options={SEX_OPTIONS}
      />
      <ProFormSelect
        name="parentId"
        label="直属上级"
        placeholder="请选择直属上级"
        showSearch
        request={async () => {
          if (contactOptionsCache) return contactOptionsCache
          const res = await getSimpleContactList()
          if (res.data) {
            contactOptionsCache = res.data.map((c: any) => ({ label: c.name, value: c.id }))
          }
          return contactOptionsCache || []
        }}
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
        fieldProps={{ showSearch: true }}
      />
      <ProFormText
        name="detailAddress"
        label="详细地址"
        placeholder="请输入详细地址"
      />
      <ProFormDateTimePicker
        name="contactNextTime"
        label="下次联系时间"
        placeholder="选择下次联系时间"
        fieldProps={{ style: { width: '100%' } }}
      />
      <ProFormTextArea
        name="remark"
        label="备注"
        placeholder="请输入备注"
        fieldProps={{ rows: 2 }}
      />
    </ModalForm>
  )
}

export default ContactForm
