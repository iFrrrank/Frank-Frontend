import React from 'react'
import { message, Form } from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormDatePicker,
  ProFormDigit,
  ProFormTextArea,
  ProFormDependency
} from '@ant-design/pro-components'
import {
  createReceivablePlan,
  updateReceivablePlan,
  getReceivablePlan
} from '@/api/crm/receivablePlan'
import { getCustomerSimpleList } from '@/api/crm/customer'
import { getSimpleUserList } from '@/api/system/user'
import { getContractSimpleList } from '@/api/crm/contract'
import { textConst } from '@/locales/zh-CN'
import { RECEIVABLE_RETURN_TYPE } from '@/utils/constantsValue'

interface ReceivablePlanFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

let userOptionsCache: any[] | null = null
let customerOptionsCache: any[] | null = null

const ReceivablePlanForm: React.FC<ReceivablePlanFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  id
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
      width={700}
      colon={false}
      labelAlign="right"
      grid={true}
      rowProps={{ gutter: 24 }}
      colProps={{ span: 12 }}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getReceivablePlan({ id })
          return resp.data as Record<string, any>
        }
        return {}
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateReceivablePlan({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createReceivablePlan(values as any)
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
      <ProFormText name="period" label="还款期数" placeholder="保存时自动生成" disabled />
      <ProFormSelect
        name="ownerUserId"
        label="负责人"
        rules={[{ required: true, message: '请选择负责人' }]}
        placeholder="请选择负责人"
        showSearch
        request={async () => {
          if (userOptionsCache) return userOptionsCache
          const res = await getSimpleUserList()
          userOptionsCache =
            res.data?.map((item: any) => ({ label: item.nickname, value: item.id })) || []
          return userOptionsCache
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
          customerOptionsCache =
            res.data?.map((item: any) => ({ label: item.name, value: item.id })) || []
          return customerOptionsCache
        }}
      />
      <ProFormDependency name={['ownerUserId', 'customerId']}>
        {({ ownerUserId, customerId }) => {
          const canSelectContract = !!ownerUserId && !!customerId

          if (!canSelectContract) {
            form.setFieldValue('contractId', undefined)
          }

          return (
            <ProFormSelect
              name="contractId"
              label="合同名称"
              rules={[{ required: true, message: '请选择合同' }]}
              placeholder={canSelectContract ? '请选择合同' : '请先选择客户'}
              disabled={!canSelectContract}
              showSearch
              request={async () => {
                if (!canSelectContract) return []
                const res = await getContractSimpleList({ customerId })
                return res.data?.map((item: any) => ({ label: item.name, value: item.id })) || []
              }}
            />
          )
        }}
      </ProFormDependency>
      <ProFormDigit
        name="price"
        label="计划回款金额"
        rules={[{ required: true, message: '请输入计划回款金额' }]}
        placeholder="请输入计划回款金额"
        fieldProps={{
          min: 0,
          precision: 2,
          controls: true,
          suffix: '元'
        }}
      />
      <ProFormDatePicker
        name="returnTime"
        label="计划回款日期"
        rules={[{ required: true, message: '请选择计划回款日期' }]}
        placeholder="选择计划回款日期"
        fieldProps={{ style: { width: '100%' } }}
      />
      <ProFormDigit
        name="remindDays"
        label="提前几天提醒"
        placeholder="请输入提前几天提醒"
        fieldProps={{
          min: 0,
          precision: 0,
          controls: true
        }}
      />
      <ProFormSelect
        name="returnType"
        label="回款方式"
        placeholder="请选择回款方式"
        options={RECEIVABLE_RETURN_TYPE}
      />
      <ProFormTextArea
        name="remark"
        label="备注"
        placeholder="请输入备注"
        colProps={{ span: 24 }}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        fieldProps={{ rows: 2 }}
      />
    </ModalForm>
  )
}

export default ReceivablePlanForm
