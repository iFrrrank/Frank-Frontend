import React, { useEffect, useState } from 'react'
import { Form, Input, Modal, message } from 'antd'
import {
  fmsDigestCreateDigest,
  fmsDigestUpdateDigest
} from '@/api/fms/config/digest'
import { textConst } from '@/locales/zh-CN'

interface FmsDigestFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  accountSetId: number
  row?: API.FmsDigestRespVO
  onSuccess: () => void
}

/**
 * 常用摘要新增/修改弹窗
 */
const FmsDigestForm: React.FC<FmsDigestFormProps> = ({
  visible,
  setVisible,
  accountSetId,
  row,
  onSuccess
}) => {
  const isUpdate = row?.id !== undefined
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!visible) return
    form.resetFields()
    if (isUpdate && row) {
      form.setFieldsValue(row)
    } else {
      form.setFieldsValue({ content: '' })
    }
  }, [visible, row, isUpdate, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      const payload: API.FmsDigestSaveReqVO = {
        id: row?.id,
        accountSetId,
        content: values.content
      }
      const resp = isUpdate
        ? await fmsDigestUpdateDigest(payload)
        : await fmsDigestCreateDigest(payload)
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
      title={isUpdate ? '修改摘要' : '新增摘要'}
      open={visible}
      onCancel={() => setVisible(false)}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={500}
      destroyOnHidden
    >
      <Form
        form={form}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 18 }}
        colon={false}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="content"
          label="摘要内容"
          rules={[{ required: true, message: '摘要内容不能为空' }]}
        >
          <Input.TextArea rows={3} maxLength={500} showCount placeholder="请输入摘要内容" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default FmsDigestForm
