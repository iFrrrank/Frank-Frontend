import React, { useEffect, useState } from 'react'
import { Form, Input, Modal, Radio, message } from 'antd'
import {
  fmsVoucherWordCreateVoucherWord,
  fmsVoucherWordUpdateVoucherWord
} from '@/api/fms/config/voucherWord'
import { textConst } from '@/locales/zh-CN'

interface FmsVoucherWordFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  accountSetId: number
  row?: API.FmsVoucherWordRespVO
  onSuccess: () => void
}

/**
 * 凭证字新增/修改弹窗
 */
const FmsVoucherWordForm: React.FC<FmsVoucherWordFormProps> = ({
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
      form.setFieldsValue({
        name: '',
        printTitle: '',
        defaultStatus: false
      })
    }
  }, [visible, row, isUpdate, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      const payload: API.FmsVoucherWordSaveReqVO = {
        id: row?.id,
        accountSetId,
        name: values.name,
        printTitle: values.printTitle,
        defaultStatus: Boolean(values.defaultStatus)
      }
      const resp = isUpdate
        ? await fmsVoucherWordUpdateVoucherWord(payload)
        : await fmsVoucherWordCreateVoucherWord(payload)
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
      title={isUpdate ? '修改凭证字' : '新增凭证字'}
      open={visible}
      onCancel={() => setVisible(false)}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={500}
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
          label="凭证字"
          rules={[{ required: true, message: '凭证字不能为空' }]}
        >
          <Input placeholder="请输入凭证字，如 记、收、付、转" />
        </Form.Item>
        <Form.Item
          name="printTitle"
          label="打印标题"
          rules={[{ required: true, message: '打印标题不能为空' }]}
        >
          <Input placeholder="请输入打印标题，如 记账凭证" />
        </Form.Item>
        <Form.Item
          name="defaultStatus"
          label="是否默认"
          rules={[{ required: true, message: '请选择是否默认' }]}
        >
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default FmsVoucherWordForm
