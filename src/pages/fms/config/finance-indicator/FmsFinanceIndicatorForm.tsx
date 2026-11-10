import React, { useEffect, useState } from 'react'
import { Form, Input, InputNumber, Modal, Radio, Select, Tooltip, message } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import {
  fmsFinanceIndicatorCreate,
  fmsFinanceIndicatorGet,
  fmsFinanceIndicatorUpdate
} from '@/api/fms/config/financeIndicator'
import { textConst } from '@/locales/zh-CN'
import { CommonStatusEnum } from '@/utils/constants'
import { COMMON_STATUS_OPTIONS } from '@/utils/constantsValue'
import {
  FMS_FINANCE_INDICATOR_TYPE,
  FMS_FINANCE_INDICATOR_TYPE_OPTIONS
} from '../../utils/constants'

interface FmsFinanceIndicatorFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  accountSetId: number
  id?: number
  onSuccess: () => void
}

/**
 * 财务指标新增/修改弹窗
 */
const FmsFinanceIndicatorForm: React.FC<FmsFinanceIndicatorFormProps> = ({
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
      fmsFinanceIndicatorGet({ accountSetId, id })
        .then((resp) => {
          if (resp.code === 0 && resp.data) {
            form.setFieldsValue(resp.data)
          }
        })
        .finally(() => setLoading(false))
    } else {
      form.setFieldsValue({
        type: FMS_FINANCE_INDICATOR_TYPE.INCOME_STATEMENT,
        name: '',
        code: '',
        formula: 'L1',
        sort: 10,
        status: CommonStatusEnum.ENABLE
      })
    }
  }, [visible, id, isUpdate, accountSetId, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      const payload: API.FmsFinanceIndicatorSaveReqVO = {
        id,
        accountSetId,
        type: values.type,
        name: values.name,
        code: values.code,
        formula: values.formula,
        sort: values.sort ?? 10,
        status: values.status ?? CommonStatusEnum.ENABLE
      }
      const resp = isUpdate
        ? await fmsFinanceIndicatorUpdate(payload)
        : await fmsFinanceIndicatorCreate(payload)
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
      title={isUpdate ? '修改财务指标' : '新增财务指标'}
      open={visible}
      onCancel={() => setVisible(false)}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={620}
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
          name="name"
          label="指标名称"
          rules={[{ required: true, message: '指标名称不能为空' }]}
        >
          <Input maxLength={100} placeholder="请输入指标名称" />
        </Form.Item>
        <Form.Item
          name="code"
          label="指标编码"
          rules={[{ required: true, message: '指标编码不能为空' }]}
        >
          <Input maxLength={64} disabled={isUpdate} placeholder="请输入指标编码" />
        </Form.Item>
        <Form.Item
          name="type"
          label="取数报表"
          rules={[{ required: true, message: '请选择取数报表' }]}
        >
          <Select options={FMS_FINANCE_INDICATOR_TYPE_OPTIONS} placeholder="请选择取数报表" />
        </Form.Item>
        <Form.Item
          name="formula"
          label={
            <span>
              指标公式{' '}
              <Tooltip title="支持报表行次公式（L1+L2-L3）或报表科目公式 JSON">
                <QuestionCircleOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />
              </Tooltip>
            </span>
          }
          rules={[{ required: true, message: '指标公式不能为空' }]}
        >
          <Input.TextArea
            rows={4}
            maxLength={2000}
            showCount
            placeholder="例如：L1+L2-L3，或科目公式 JSON"
          />
        </Form.Item>
        <Form.Item
          name="sort"
          label="排序"
          rules={[{ required: true, message: '排序不能为空' }]}
        >
          <InputNumber min={0} style={{ width: 160 }} />
        </Form.Item>
        <Form.Item
          name="status"
          label="状态"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Radio.Group options={COMMON_STATUS_OPTIONS} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default FmsFinanceIndicatorForm
