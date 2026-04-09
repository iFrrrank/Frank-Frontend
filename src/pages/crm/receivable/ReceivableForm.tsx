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
import { createReceivable, updateReceivable, getReceivable } from '@/api/crm/receivable'
import { getCustomerSimpleList } from '@/api/crm/customer'
import { getSimpleUserList } from '@/api/system/user'
import { getContractSimpleList } from '@/api/crm/contract'
import { textConst } from '@/locales/zh-CN'
import { RECEIVABLE_RETURN_TYPE } from '@/utils/constantsValue'

interface ReceivableFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

let userOptionsCache: any[] | null = null
let customerOptionsCache: any[] | null = null

const ReceivableForm: React.FC<ReceivableFormProps> = ({ visible, setVisible, onSuccess, id }) => {
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
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getReceivable({ id })
          return resp.data as Record<string, any>
        }
        return {}
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateReceivable({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createReceivable(values as any)
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
      <ProFormText name="no" label="回款编号" placeholder="保存时自动生成" disabled />
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
              placeholder={canSelectContract ? '请选择合同' : '请先选择负责人和客户'}
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
      <ProFormDependency name={['ownerUserId', 'customerId', 'contractId']}>
        {({ ownerUserId, customerId, contractId }) => {
          const canSelectPeriod = !!ownerUserId && !!customerId && !!contractId

          if (!canSelectPeriod) {
            form.setFieldValue('period', undefined)
          }

          return (
            <ProFormSelect
              name="period"
              label="回款期数"
              rules={[{ required: true, message: '请选择回款期数' }]}
              placeholder={canSelectPeriod ? '请选择回款期数' : '请先选择合同'}
              disabled={!canSelectPeriod}
              request={async () => {
                if (!canSelectPeriod) return []
                // TODO
                return [
                  { label: '第一期', value: 1 },
                  { label: '第二期', value: 2 },
                  { label: '尾款', value: 3 }
                ]
              }}
            />
          )
        }}
      </ProFormDependency>
      <ProFormSelect
        name="returnType"
        label="回款方式"
        rules={[{ required: true, message: '请选择回款方式' }]}
        placeholder="请选择回款方式"
        options={RECEIVABLE_RETURN_TYPE}
      />

      {/* 第四行 */}
      <ProFormDigit
        name="price"
        label="回款金额"
        rules={[{ required: true, message: '请输入回款金额' }]}
        placeholder="请输入回款金额"
        fieldProps={{
          min: 0,
          precision: 2,
          controls: true,
          suffix: '元'
        }}
      />
      <ProFormDatePicker
        name="returnTime"
        label="回款日期"
        rules={[{ required: true, message: '请选择回款日期' }]}
        placeholder="请选择回款日期"
        fieldProps={{ style: { width: '100%' } }}
      />
      <ProFormTextArea
        name="remark"
        label="备注"
        placeholder="请输入备注"
        colProps={{ span: 24 }}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
        fieldProps={{ rows: 2 }}
      />
    </ModalForm>
  )
}

export default ReceivableForm
