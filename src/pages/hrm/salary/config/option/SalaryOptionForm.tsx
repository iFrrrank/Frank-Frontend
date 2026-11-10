import React, { useEffect, useState } from 'react'
import { Form, Input, Modal, message } from 'antd'
import { createSalaryOption, getSalaryOptionList } from '@/api/hrm/salary/option'
import { textConst } from '@/locales/zh-CN'

interface SalaryOptionFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  parentCode?: number
  onSuccess: () => void
}

const SalaryOptionForm: React.FC<SalaryOptionFormProps> = ({
  visible,
  setVisible,
  parentCode,
  onSuccess
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [categoryName, setCategoryName] = useState<string>('')

  useEffect(() => {
    if (visible && parentCode !== undefined) {
      getSalaryOptionList()
        .then((resp) => {
          const cat = (resp.data || []).find((c) => c.code === parentCode)
          setCategoryName(cat?.name || String(parentCode))
        })
        .catch(() => setCategoryName(String(parentCode)))

      form.setFieldsValue({
        parentCode,
        name: '',
        remark: ''
      })
    } else {
      form.resetFields()
    }
  }, [visible, parentCode, form])

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      await createSalaryOption(values)
      message.success(textConst.msg.createSuccess)
      setVisible(false)
      onSuccess()
    } catch {
      // Validation or API error
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="新增薪资项"
      open={visible}
      onCancel={() => setVisible(false)}
      onOk={handleOk}
      confirmLoading={loading}
      destroyOnClose
      okText={textConst.common.ok}
      cancelText={textConst.common.cancel}
      width={520}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        colon={false}
      >
        <Form.Item label="薪资分类">
          <Input value={categoryName} disabled />
        </Form.Item>
        <Form.Item name="parentCode" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="name"
          label="薪资项名称"
          rules={[{ required: true, message: '薪资项名称不能为空' }]}
        >
          <Input maxLength={64} placeholder="请输入薪资项名称" />
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <Input.TextArea maxLength={255} rows={3} placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default SalaryOptionForm

