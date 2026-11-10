import React, { useEffect, useState } from 'react'
import { Form, Input, Modal, message } from 'antd'
import {
  fmsVoucherTemplateCategoryCreateTemplateCategory,
  fmsVoucherTemplateCategoryGetTemplateCategoryList,
  fmsVoucherTemplateCategoryUpdateTemplateCategory
} from '@/api/fms/config/voucherTemplateCategory'
import { textConst } from '@/locales/zh-CN'

interface FmsVoucherTemplateCategoryFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  accountSetId: number
  id?: number
  onSuccess: () => void
}

/**
 * 凭证模板类别新增/修改弹窗
 */
const FmsVoucherTemplateCategoryForm: React.FC<FmsVoucherTemplateCategoryFormProps> = ({
  visible,
  setVisible,
  accountSetId,
  id,
  onSuccess
}) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!visible) return
    form.resetFields()
    if (isUpdate && id !== undefined) {
      setLoading(true)
      fmsVoucherTemplateCategoryGetTemplateCategoryList({ accountSetId })
        .then((resp) => {
          if (resp.code === 0 && resp.data) {
            const target = resp.data.find((item) => item.id === id)
            if (target) {
              form.setFieldsValue(target)
            }
          }
        })
        .finally(() => setLoading(false))
    } else {
      form.setFieldsValue({ name: '' })
    }
  }, [visible, id, isUpdate, accountSetId, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      const payload: API.FmsVoucherTemplateCategorySaveReqVO = {
        id,
        accountSetId,
        name: values.name
      }
      const resp = isUpdate
        ? await fmsVoucherTemplateCategoryUpdateTemplateCategory(payload)
        : await fmsVoucherTemplateCategoryCreateTemplateCategory(payload)
      if (resp.code === 0) {
        message.success(isUpdate ? textConst.msg.updateSuccess : textConst.msg.createSuccess)
        setVisible(false)
        onSuccess()
      }
    } catch {
      // 校验或请求失败
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={isUpdate ? '修改模板类别' : '新增模板类别'}
      open={visible}
      onCancel={() => setVisible(false)}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={460}
      destroyOnHidden
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 17 }}
        colon={false}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="name"
          label="类别名称"
          rules={[{ required: true, message: '类别名称不能为空' }]}
        >
          <Input placeholder="请输入模板类别名称" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default FmsVoucherTemplateCategoryForm
