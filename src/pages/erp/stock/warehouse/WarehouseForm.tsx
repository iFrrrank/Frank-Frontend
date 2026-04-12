import React from 'react'
import { message, Form } from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormDigit,
  ProFormTextArea
} from '@ant-design/pro-components'
import { createWarehouse, updateWarehouse, getWarehouse } from '@/api/erp/stock/warehouse'
import { textConst } from '@/locales/zh-CN'
import { COMMON_STATUS_OPTIONS } from '@/utils/constantsValue'

interface WarehouseFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const WarehouseForm: React.FC<WarehouseFormProps> = ({ visible, setVisible, onSuccess, id }) => {
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
      width={500}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getWarehouse({ id } as any)
          return resp.data as Record<string, any>
        }
        return { status: 0 }
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateWarehouse({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createWarehouse(values as any)
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
        label="仓库名称"
        rules={[{ required: true, message: '请输入仓库名称' }]}
        placeholder="请输入仓库名称"
      />
      <ProFormText name="address" label="仓库地址" placeholder="请输入仓库地址" />
      <ProFormRadio.Group
        name="status"
        label="仓库状态"
        rules={[{ required: true, message: '请选择仓库状态' }]}
        options={COMMON_STATUS_OPTIONS}
      />
      <ProFormDigit
        name="warehousePrice"
        label="仓储费"
        placeholder="请输入仓储费"
        fieldProps={{ precision: 2, min: 0, suffix: '元/天/Kg' }}
      />
      <ProFormDigit
        name="truckagePrice"
        label="搬运费"
        placeholder="请输入搬运费"
        fieldProps={{ precision: 2, min: 0, suffix: '元' }}
      />
      <ProFormText name="principal" label="负责人" placeholder="请输入负责人" />
      <ProFormDigit
        name="sort"
        label="排序"
        rules={[{ required: true, message: '请输入排序' }]}
        placeholder="请输入排序"
        fieldProps={{ precision: 0 }}
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

export default WarehouseForm
