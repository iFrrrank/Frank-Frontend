import React, { useEffect, useState } from 'react'
import { Form, Input, Modal, Switch, message } from 'antd'
import {
  createSalaryChangeTemplate,
  getSalaryChangeTemplate,
  updateSalaryChangeTemplate
} from '@/api/hrm/salary/changeTemplate'
import { textConst } from '@/locales/zh-CN'
import SalaryChangeOptionSelect from '../option/components/SalaryChangeOptionSelect'

interface SalaryChangeTemplateFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  id?: number
  onSuccess: () => void
}

const SalaryChangeTemplateForm: React.FC<SalaryChangeTemplateFormProps> = ({
  visible,
  setVisible,
  id,
  onSuccess
}) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!visible) {
      form.resetFields()
      return
    }

    if (id) {
      setLoading(true)
      getSalaryChangeTemplate({ id })
        .then((resp) => {
          const data = (resp.data || {}) as API.HrmSalaryChangeTemplateRespVO
          form.setFieldsValue({
            ...data,
            defaultStatus: data.defaultStatus ?? false,
            options: data.options || []
          })
        })
        .finally(() => setLoading(false))
    } else {
      form.setFieldsValue({
        name: '',
        defaultStatus: false,
        options: []
      })
    }
  }, [visible, id, form])

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const payload: API.HrmSalaryChangeTemplateSaveReqVO = {
        ...values,
        id
      }

      if (isUpdate) {
        await updateSalaryChangeTemplate(payload)
        message.success(textConst.msg.updateSuccess)
      } else {
        await createSalaryChangeTemplate(payload)
        message.success(textConst.msg.createSuccess)
      }

      setVisible(false)
      onSuccess()
    } catch {
      // Form error
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={isUpdate ? '修改调薪模板' : '新增调薪模板'}
      open={visible}
      onCancel={() => setVisible(false)}
      onOk={handleOk}
      confirmLoading={loading}
      destroyOnClose
      okText={textConst.common.ok}
      cancelText={textConst.common.cancel}
      width={680}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        colon={false}
      >
        <Form.Item
          name="name"
          label="模板名称"
          rules={[{ required: true, message: '模板名称不能为空' }]}
        >
          <Input maxLength={64} placeholder="请输入模板名称" />
        </Form.Item>

        <Form.Item name="defaultStatus" label="默认模板" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item name="options" label="调薪项">
          <SalaryChangeOptionSelect />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default SalaryChangeTemplateForm
