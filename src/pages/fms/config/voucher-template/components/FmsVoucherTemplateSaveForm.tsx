import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Button, Checkbox, Form, Input, Modal, message } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import { fmsVoucherTemplateCreateVoucherTemplate } from '@/api/fms/config/voucherTemplate'
import { fmsVoucherTemplateCategoryGetTemplateCategorySimpleList } from '@/api/fms/config/voucherTemplateCategory'
import HasPermi from '@/directives/permission/HasPermi'
import FmsVoucherTemplateCategoryManage, {
  type FmsVoucherTemplateCategoryManageRef
} from './FmsVoucherTemplateCategoryManage'
import FmsVoucherTemplateCategorySelect from './FmsVoucherTemplateCategorySelect'

export interface FmsVoucherTemplateSaveFormRef {
  open: (accountSetId: number, entries: API.FmsVoucherTemplateEntryVO[]) => void
}

/**
 * 另存为凭证模板弹窗
 */
const FmsVoucherTemplateSaveForm = forwardRef<FmsVoucherTemplateSaveFormRef>((_, ref) => {
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [accountSetId, setAccountSetId] = useState(0)
  const [categories, setCategories] = useState<API.FmsVoucherTemplateCategoryRespVO[]>([])
  const [rawEntries, setRawEntries] = useState<API.FmsVoucherTemplateEntryVO[]>([])
  const categoryManageRef = useRef<FmsVoucherTemplateCategoryManageRef>(null)

  const loadCategories = async (id = accountSetId) => {
    if (!id) return
    const resp = await fmsVoucherTemplateCategoryGetTemplateCategorySimpleList({
      accountSetId: id
    })
    if (resp.code === 0) {
      const list = resp.data || []
      setCategories(list)
      const currentCategoryId = form.getFieldValue('categoryId')
      if (!currentCategoryId || !list.some((item) => item.id === currentCategoryId)) {
        form.setFieldValue('categoryId', list[0]?.id)
      }
    }
  }

  useImperativeHandle(ref, () => ({
    open: (id, entries) => {
      setAccountSetId(id)
      setRawEntries(
        entries.map((entry) => ({
          ...entry,
          auxiliaries: entry.auxiliaries ? entry.auxiliaries.map((a) => ({ ...a })) : []
        }))
      )
      form.resetFields()
      form.setFieldsValue({
        name: '',
        saveAmount: true
      })
      setVisible(true)
      loadCategories(id)
    }
  }))

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      const saveAmount = Boolean(values.saveAmount)
      const resp = await fmsVoucherTemplateCreateVoucherTemplate({
        accountSetId,
        categoryId: values.categoryId,
        name: values.name.trim(),
        entries: rawEntries.map((entry) => ({
          ...entry,
          quantity: saveAmount ? entry.quantity : undefined,
          unitPrice: saveAmount ? entry.unitPrice : undefined,
          debitAmount: saveAmount ? entry.debitAmount : undefined,
          creditAmount: saveAmount ? entry.creditAmount : undefined
        }))
      })
      if (resp.code === 0) {
        message.success('模板保存成功')
        setVisible(false)
      }
    } catch {
      // 校验或请求失败
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Modal
        title="存为凭证模板"
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={handleSubmit}
        confirmLoading={loading}
        width={480}
        destroyOnHidden
      >
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 17 }}
          colon={false}
          style={{ marginTop: 16 }}
        >
          <Form.Item label="模板类别" required style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Form.Item
                name="categoryId"
                noStyle
                rules={[{ required: true, message: '请选择模板类别' }]}
              >
                <FmsVoucherTemplateCategorySelect
                  options={categories}
                  style={{ flex: 1 }}
                />
              </Form.Item>
              <HasPermi value="fms:config:voucher-template-category:query">
                <Button
                  type="link"
                  icon={<SettingOutlined />}
                  onClick={() => categoryManageRef.current?.open(accountSetId)}
                >
                  管理类别
                </Button>
              </HasPermi>
            </div>
          </Form.Item>
          <Form.Item
            name="name"
            label="模板名称"
            rules={[{ required: true, message: '请输入模板名称' }]}
          >
            <Input maxLength={100} placeholder="请输入模板名称" />
          </Form.Item>
          <Form.Item name="saveAmount" label="保存金额" valuePropName="checked">
            <Checkbox>保存金额和数量</Checkbox>
          </Form.Item>
        </Form>
      </Modal>

      <FmsVoucherTemplateCategoryManage
        ref={categoryManageRef}
        onSuccess={() => loadCategories()}
      />
    </>
  )
})

FmsVoucherTemplateSaveForm.displayName = 'FmsVoucherTemplateSaveForm'

export default FmsVoucherTemplateSaveForm
