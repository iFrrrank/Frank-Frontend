import React, { useEffect, useState } from 'react'
import { Form, Input, Modal, message } from 'antd'
import {
  fmsAuxiliaryTypeCreateAuxiliaryType,
  fmsAuxiliaryTypeUpdateAuxiliaryType
} from '@/api/fms/config/auxiliaryType'
import { textConst } from '@/locales/zh-CN'

interface FmsAuxiliaryTypeFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  accountSetId: number
  row?: API.FmsAuxiliaryTypeRespVO
  onSuccess: () => void
}

/**
 * 辅助核算类别新增/修改弹窗
 */
const FmsAuxiliaryTypeForm: React.FC<FmsAuxiliaryTypeFormProps> = ({
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
      form.setFieldsValue({ name: row.name })
    } else {
      form.setFieldsValue({ name: '' })
    }
  }, [visible, row, isUpdate, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      const payload: API.FmsAuxiliaryTypeSaveReqVO = {
        id: row?.id,
        accountSetId,
        name: values.name
      }
      const resp = isUpdate
        ? await fmsAuxiliaryTypeUpdateAuxiliaryType(payload)
        : await fmsAuxiliaryTypeCreateAuxiliaryType(payload)
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
      title={isUpdate ? '修改辅助核算类别' : '新增辅助核算类别'}
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
          <Input placeholder="请输入辅助核算类别名称" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default FmsAuxiliaryTypeForm
