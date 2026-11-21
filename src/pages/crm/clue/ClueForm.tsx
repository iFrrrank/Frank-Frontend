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
import { createClue, getClue, updateClue } from '@/api/crm/clue'
import { getAreaTree } from '@/api/system/area'
import { getSimpleUserList } from '@/api/system/user'
import { textConst } from '@/locales/zh-CN'
import { INDUSTRY_LIST, CUSTOMER_SOURCE, CUSTOMER_LEVEL } from '@/utils/constantsValue'

interface ClueFormProps {
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

// 线索表单：字段与客户基本一致（线索转化为客户时直接复用这批资料）
const ClueForm: React.FC<ClueFormProps> = ({ visible, setVisible, onSuccess, id }) => {
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
          const resp = await getClue({ id })
          return resp.data as Record<string, any>
        }
        return {}
      }}
      onFinish={async (values) => {
        try {
          // 地区级联值为路径数组，提交时取末级地区编号
          const submitData = {
            ...values,
            areaId: Array.isArray(values.areaId)
              ? values.areaId[values.areaId.length - 1]
              : values.areaId
          }
          if (isUpdate) {
            await updateClue({ id, ...submitData } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createClue(submitData as any)
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
        label="线索名称"
        rules={[{ required: true, message: '请输入线索名称' }]}
        placeholder="请输入线索名称"
      />
      <ProFormSelect
        name="source"
        label="线索来源"
        valueEnum={CUSTOMER_SOURCE}
        placeholder="请选择线索来源"
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
        label="所属行业"
        valueEnum={INDUSTRY_LIST}
        placeholder="请选择所属行业"
      />
      <ProFormSelect
        name="level"
        label="线索等级"
        valueEnum={CUSTOMER_LEVEL}
        placeholder="请选择线索等级"
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

export default ClueForm
