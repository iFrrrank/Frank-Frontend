import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { DatePicker, Form, InputNumber, Modal, message } from 'antd'
import dayjs from 'dayjs'
import { fmsVoucherMoveVoucher } from '@/api/fms/voucher'
import FmsVoucherWordSelect from '@/pages/fms/config/voucher-word/components/FmsVoucherWordSelect'

export interface FmsVoucherMoveFormRef {
  open: (accountSetId: number, defaultMonth: string, words: API.FmsVoucherWordRespVO[]) => void
}

interface FmsVoucherMoveFormProps {
  onSuccess?: () => void
}

const FmsVoucherMoveForm = forwardRef<FmsVoucherMoveFormRef, FmsVoucherMoveFormProps>(
  ({ onSuccess }, ref) => {
    const [form] = Form.useForm()
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [accountSetId, setAccountSetId] = useState(0)
    const [voucherWords, setVoucherWords] = useState<API.FmsVoucherWordRespVO[]>([])

    useImperativeHandle(ref, () => ({
      open: (currentAccountSetId: number, defaultMonth: string, words: API.FmsVoucherWordRespVO[]) => {
        setAccountSetId(currentAccountSetId)
        setVoucherWords(words)
        setVisible(true)
        form.resetFields()
        form.setFieldsValue({
          month: defaultMonth ? dayjs(defaultMonth, 'YYYY-MM') : undefined,
          voucherWordId: words.find((item) => item.defaultStatus)?.id || words[0]?.id,
          sourceNumber: undefined,
          targetNumber: undefined
        })
      }
    }))

    const handleSubmit = async () => {
      try {
        const values = await form.validateFields()
        setLoading(true)
        const resp = await fmsVoucherMoveVoucher({
          accountSetId,
          month: values.month.format('YYYY-MM'),
          voucherWordId: values.voucherWordId,
          sourceNumber: values.sourceNumber,
          targetNumber: values.targetNumber
        })
        if (resp.code === 0) {
          message.success('移动成功')
          setVisible(false)
          onSuccess?.()
        }
      } finally {
        setLoading(false)
      }
    }

    return (
      <Modal
        title="移动凭证"
        open={visible}
        width={480}
        confirmLoading={loading}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
        destroyOnHidden
      >
        <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
          <Form.Item
            label="期间"
            name="month"
            rules={[{ required: true, message: '请选择期间' }]}
          >
            <DatePicker
              picker="month"
              allowClear={false}
              placeholder="请选择期间"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            label="凭证字"
            name="voucherWordId"
            rules={[{ required: true, message: '请选择凭证字' }]}
          >
            <FmsVoucherWordSelect options={voucherWords} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="移动规则"
            required
            dependencies={['sourceNumber', 'targetNumber']}
            rules={[
              ({ getFieldValue }) => ({
                validator() {
                  const sourceNumber = getFieldValue('sourceNumber')
                  const targetNumber = getFieldValue('targetNumber')
                  if (!sourceNumber || !targetNumber) {
                    return Promise.reject(new Error('请输入完整的移动规则'))
                  }
                  if (targetNumber >= sourceNumber) {
                    return Promise.reject(new Error('移动到的凭证号必须小于原凭证号'))
                  }
                  return Promise.resolve()
                }
              })
            ]}
          >
            <div style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
              <span>将上述期间的：</span>
              <Form.Item name="sourceNumber" noStyle>
                <InputNumber
                  controls={false}
                  min={1}
                  style={{ width: 64, margin: '0 6px' }}
                />
              </Form.Item>
              <span>号移动到：</span>
              <Form.Item name="targetNumber" noStyle>
                <InputNumber
                  controls={false}
                  min={1}
                  style={{ width: 64, margin: '0 6px' }}
                />
              </Form.Item>
              <span>号之前</span>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    )
  }
)

FmsVoucherMoveForm.displayName = 'FmsVoucherMoveForm'

export default FmsVoucherMoveForm
