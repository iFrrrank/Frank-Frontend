import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { DatePicker, Form, InputNumber, Modal, Radio, Space, message } from 'antd'
import dayjs from 'dayjs'
import { fmsVoucherTidyVoucher } from '@/api/fms/voucher'
import FmsVoucherWordSelect from '@/pages/fms/config/voucher-word/components/FmsVoucherWordSelect'
import { FMS_VOUCHER_TIDY_TYPE } from '@/pages/fms/utils/constants'

export interface FmsVoucherTidyFormRef {
  open: (accountSetId: number, defaultMonth: string, words: API.FmsVoucherWordRespVO[]) => void
}

interface FmsVoucherTidyFormProps {
  onSuccess?: () => void
}

const FmsVoucherTidyForm = forwardRef<FmsVoucherTidyFormRef, FmsVoucherTidyFormProps>(
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
          startNumber: 1,
          type: FMS_VOUCHER_TIDY_TYPE.FILL_GAPS
        })
      }
    }))

    const handleSubmit = async () => {
      try {
        const values = await form.validateFields()
        setLoading(true)
        const resp = await fmsVoucherTidyVoucher({
          accountSetId,
          month: values.month.format('YYYY-MM'),
          voucherWordId: values.voucherWordId,
          startNumber: values.startNumber,
          type: values.type
        })
        if (resp.code === 0) {
          message.success('整理成功')
          setVisible(false)
          onSuccess?.()
        }
      } finally {
        setLoading(false)
      }
    }

    return (
      <Modal
        title="整理凭证"
        open={visible}
        width={500}
        confirmLoading={loading}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
        destroyOnHidden
      >
        <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
          <Form.Item
            label="整理范围"
            name="month"
            rules={[{ required: true, message: '请选择整理范围' }]}
          >
            <DatePicker
              picker="month"
              allowClear={false}
              placeholder="请选择月份"
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
            label="起始编号"
            name="startNumber"
            rules={[{ required: true, message: '请输入起始编号' }]}
          >
            <InputNumber controls={false} min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="type"
            wrapperCol={{ offset: 2, span: 21 }}
            rules={[{ required: true, message: '请选择整理方式' }]}
          >
            <Radio.Group>
              <Space direction="vertical">
                <Radio value={FMS_VOUCHER_TIDY_TYPE.FILL_GAPS}>
                  按凭证号顺次前移补齐断号
                </Radio>
                <Radio value={FMS_VOUCHER_TIDY_TYPE.REORDER_BY_TIME}>
                  按凭证日期重新顺次编号
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    )
  }
)

FmsVoucherTidyForm.displayName = 'FmsVoucherTidyForm'

export default FmsVoucherTidyForm
