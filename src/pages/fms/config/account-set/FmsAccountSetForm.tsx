import React, { useEffect, useState } from 'react'
import { Col, Divider, Form, Input, Modal, Row, message } from 'antd'
import {
  fmsAccountSetCreateAccountSet,
  fmsAccountSetGetAccountSet,
  fmsAccountSetUpdateAccountSet
} from '@/api/fms/config/accountSet'
import { textConst } from '@/locales/zh-CN'

interface FmsAccountSetFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

/**
 * 账套新增/修改表单弹窗
 */
const FmsAccountSetForm: React.FC<FmsAccountSetFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  id
}) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!visible) return
    form.resetFields()
    if (isUpdate && id !== undefined) {
      setLoading(true)
      fmsAccountSetGetAccountSet({ id })
        .then((resp) => {
          if (resp.code === 0 && resp.data) {
            form.setFieldsValue(resp.data)
          }
        })
        .finally(() => setLoading(false))
    }
  }, [visible, id, isUpdate, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      const payload: API.FmsAccountSetSaveReqVO = {
        ...values,
        id
      }
      const resp = isUpdate
        ? await fmsAccountSetUpdateAccountSet(payload)
        : await fmsAccountSetCreateAccountSet(payload)
      if (resp.code === 0) {
        message.success(isUpdate ? textConst.msg.updateSuccess : textConst.msg.createSuccess)
        setVisible(false)
        onSuccess()
      }
    } catch {
      // 表单校验或请求异常
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={isUpdate ? '修改账套' : '新增账套'}
      open={visible}
      onCancel={() => setVisible(false)}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={920}
      destroyOnHidden
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 17 }}
        colon={false}
        style={{ marginTop: 12 }}
      >
        <Divider orientation="left">基本信息</Divider>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              name="companyCode"
              label="公司编码"
              rules={[{ required: true, message: '公司编码不能为空' }]}
            >
              <Input maxLength={64} placeholder="请输入公司编码" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="companyName"
              label="公司名称"
              rules={[{ required: true, message: '公司名称不能为空' }]}
            >
              <Input maxLength={255} placeholder="请输入公司名称" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="companyProfile"
              label="公司简介"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 20 }}
            >
              <Input.TextArea rows={3} maxLength={500} showCount placeholder="请输入公司简介" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="industry" label="所在行业">
              <Input maxLength={255} placeholder="请输入所在行业" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="location" label="所在地">
              <Input maxLength={255} placeholder="请输入所在地" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="legalRepresentative" label="法人代表">
              <Input maxLength={255} placeholder="请输入法人代表" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="legalRepresentativeIdNumber" label="法人身份证号">
              <Input maxLength={255} placeholder="请输入法人身份证号" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="businessLicenseNumber" label="营业执照号">
              <Input maxLength={255} placeholder="请输入营业执照号" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="organizationCode" label="组织机构代码">
              <Input maxLength={255} placeholder="请输入组织机构代码" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="remark"
              label="备注"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 20 }}
            >
              <Input.TextArea rows={2} maxLength={500} placeholder="请输入备注" />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">联系方式</Divider>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item name="contactName" label="联系人">
              <Input maxLength={255} placeholder="请输入联系人" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="officeTelephone" label="办公电话">
              <Input maxLength={32} placeholder="请输入办公电话" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="mobile" label="手机号码">
              <Input maxLength={32} placeholder="请输入手机号码" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="faxNumber" label="传真号码">
              <Input maxLength={32} placeholder="请输入传真号码" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="qqNumber" label="QQ 号码">
              <Input maxLength={255} placeholder="请输入 QQ 号码" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[{ type: 'email', message: '邮箱格式不正确' }]}
            >
              <Input maxLength={255} placeholder="请输入邮箱" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="otherContact" label="其他">
              <Input maxLength={255} placeholder="请输入其他联系方式" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="address" label="详细地址">
              <Input maxLength={255} placeholder="请输入详细地址" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default FmsAccountSetForm
