import React, { useEffect, useState } from 'react'
import { Form, Input, InputNumber, Modal, Radio, message } from 'antd'
import {
  fmsCurrencyCreateCurrency,
  fmsCurrencyUpdateCurrency
} from '@/api/fms/config/currency'
import { textConst } from '@/locales/zh-CN'

interface FmsCurrencyFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  accountSetId: number
  row?: API.FmsCurrencyRespVO
  onSuccess: () => void
}

/**
 * 币种新增/修改弹窗
 */
const FmsCurrencyForm: React.FC<FmsCurrencyFormProps> = ({
  visible,
  setVisible,
  accountSetId,
  row,
  onSuccess
}) => {
  const isUpdate = row?.id !== undefined
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const standardStatus = Form.useWatch('standardStatus', form)

  useEffect(() => {
    if (!visible) return
    form.resetFields()
    if (isUpdate && row) {
      form.setFieldsValue(row)
    } else {
      form.setFieldsValue({
        code: '',
        name: '',
        exchangeRate: undefined,
        standardStatus: false
      })
    }
  }, [visible, row, isUpdate, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      const payload: API.FmsCurrencySaveReqVO = {
        id: row?.id,
        accountSetId,
        code: String(values.code || '')
          .trim()
          .toUpperCase(),
        name: values.name,
        exchangeRate: values.exchangeRate
      }
      const resp = isUpdate
        ? await fmsCurrencyUpdateCurrency(payload)
        : await fmsCurrencyCreateCurrency(payload)
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
      title={isUpdate ? '修改币种' : '新增币种'}
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
          name="code"
          label="编码"
          rules={[
            { required: true, message: '编码不能为空' },
            {
              pattern: /^[A-Za-z]{3,}$/,
              message: '编码仅支持不少于 3 位的英文字母'
            }
          ]}
        >
          <Input placeholder="请输入编码，如 RMB、USD" />
        </Form.Item>
        <Form.Item
          name="name"
          label="名称"
          rules={[{ required: true, message: '名称不能为空' }]}
        >
          <Input placeholder="请输入币种名称" />
        </Form.Item>
        <Form.Item
          name="exchangeRate"
          label="汇率"
          rules={[{ required: true, message: '汇率不能为空' }]}
        >
          <InputNumber
            min={0.0001}
            precision={4}
            controls={false}
            disabled={Boolean(standardStatus)}
            placeholder="请输入汇率"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          name="standardStatus"
          label="是否本位币"
          rules={[{ required: true, message: '请选择是否本位币' }]}
        >
          <Radio.Group disabled>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default FmsCurrencyForm
