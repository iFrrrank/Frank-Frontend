import React, { useEffect, useState } from 'react'
import { Col, DatePicker, Form, Input, Modal, Radio, Row, Select, message } from 'antd'
import dayjs from 'dayjs'
import {
  fmsAuxiliaryItemCreateAuxiliaryItem,
  fmsAuxiliaryItemGetAuxiliaryItem,
  fmsAuxiliaryItemUpdateAuxiliaryItem
} from '@/api/fms/config/auxiliaryItem'
import { textConst } from '@/locales/zh-CN'
import { CommonStatusEnum } from '@/utils/constants'
import { COMMON_STATUS_OPTIONS } from '@/utils/constantsValue'
import { FMS_AUXILIARY_TYPE } from '../../../utils/constants'
import FmsAuxiliaryItemSelect from '../components/FmsAuxiliaryItemSelect'

interface FmsAuxiliaryItemFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  accountSetId: number
  auxiliaryType?: API.FmsAuxiliaryTypeRespVO
  departmentTypeId?: number
  id?: number
  onSuccess: () => void
}

/**
 * 辅助核算项目新增/修改弹窗（动态适配客户、供应商、职员、部门、项目、存货、自定义）
 */
const FmsAuxiliaryItemForm: React.FC<FmsAuxiliaryItemFormProps> = ({
  visible,
  setVisible,
  accountSetId,
  auxiliaryType,
  departmentTypeId,
  id,
  onSuccess
}) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const currentType = auxiliaryType?.type
  const typeName = auxiliaryType?.name || '辅助核算'

  const isPartnerType =
    currentType === FMS_AUXILIARY_TYPE.CUSTOMER || currentType === FMS_AUXILIARY_TYPE.SUPPLIER
  const isEmployeeType = currentType === FMS_AUXILIARY_TYPE.EMPLOYEE
  const isDepartmentType = currentType === FMS_AUXILIARY_TYPE.DEPARTMENT
  const isProjectType = currentType === FMS_AUXILIARY_TYPE.PROJECT
  const isInventoryType = currentType === FMS_AUXILIARY_TYPE.INVENTORY

  useEffect(() => {
    if (!visible || !auxiliaryType) return
    form.resetFields()
    if (isUpdate && id !== undefined) {
      setLoading(true)
      fmsAuxiliaryItemGetAuxiliaryItem({ accountSetId, id })
        .then((resp) => {
          if (resp.code === 0 && resp.data) {
            const rawData = resp.data as any
            form.setFieldsValue({
              ...rawData,
              birthDate: rawData.birthDate ? dayjs(rawData.birthDate) : undefined,
              entryDate: rawData.entryDate ? dayjs(rawData.entryDate) : undefined,
              leaveDate: rawData.leaveDate ? dayjs(rawData.leaveDate) : undefined,
              startDate: rawData.startDate ? dayjs(rawData.startDate) : undefined,
              endDate: rawData.endDate ? dayjs(rawData.endDate) : undefined
            })
          }
        })
        .finally(() => setLoading(false))
    } else {
      form.setFieldsValue({
        status: CommonStatusEnum.ENABLE
      })
    }
  }, [visible, id, isUpdate, accountSetId, auxiliaryType, form])

  const handleSubmit = async () => {
    if (!auxiliaryType) return
    try {
      const values = await form.validateFields()
      setLoading(true)
      const payload: API.FmsAuxiliaryItemSaveReqVO = {
        ...values,
        id,
        accountSetId,
        auxiliaryTypeId: auxiliaryType.id,
        birthDate: values.birthDate ? dayjs(values.birthDate).format('YYYY-MM-DD') : undefined,
        entryDate: values.entryDate ? dayjs(values.entryDate).format('YYYY-MM-DD') : undefined,
        leaveDate: values.leaveDate ? dayjs(values.leaveDate).format('YYYY-MM-DD') : undefined,
        startDate: values.startDate ? dayjs(values.startDate).format('YYYY-MM-DD') : undefined,
        endDate: values.endDate ? dayjs(values.endDate).format('YYYY-MM-DD') : undefined
      }
      const resp = isUpdate
        ? await fmsAuxiliaryItemUpdateAuxiliaryItem(payload)
        : await fmsAuxiliaryItemCreateAuxiliaryItem(payload)
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
      title={`${isUpdate ? '修改' : '新增'}${typeName}`}
      open={visible}
      onCancel={() => setVisible(false)}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={720}
      destroyOnHidden
    >
      <Form
        form={form}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 16 }}
        colon={false}
        style={{ marginTop: 16 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="code"
              label="编码"
              rules={[{ required: true, message: '编码不能为空' }]}
            >
              <Input placeholder="请输入编码" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              label="名称"
              rules={[{ required: true, message: '名称不能为空' }]}
            >
              <Input placeholder="请输入名称" />
            </Form.Item>
          </Col>

          {/* 客户 / 供应商 */}
          {isPartnerType && (
            <>
              <Col span={12}>
                <Form.Item
                  name="category"
                  label={
                    currentType === FMS_AUXILIARY_TYPE.CUSTOMER ? '客户类别' : '供应商类别'
                  }
                >
                  <Input
                    placeholder={
                      currentType === FMS_AUXILIARY_TYPE.CUSTOMER
                        ? '请输入客户类别'
                        : '请输入供应商类别'
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="taxNo" label="统一社会信用代码">
                  <Input placeholder="请输入统一社会信用代码" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="contactName" label="联系人">
                  <Input placeholder="请输入联系人" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="contactMobile" label="联系方式">
                  <Input placeholder="请输入联系方式" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="address"
                  label="经营地址"
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 20 }}
                >
                  <Input placeholder="请输入经营地址" />
                </Form.Item>
              </Col>
            </>
          )}

          {/* 职员 */}
          {isEmployeeType && (
            <>
              <Col span={12}>
                <Form.Item name="sex" label="性别">
                  <Select
                    allowClear
                    placeholder="请选择性别"
                    options={[
                      { label: '男', value: 1 },
                      { label: '女', value: 2 }
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="departmentItemId" label="部门">
                  <FmsAuxiliaryItemSelect
                    auxiliaryTypeId={departmentTypeId}
                    allowClear
                    placeholder="请选择部门"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="jobTitle" label="职务">
                  <Input placeholder="请输入职务" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="contactMobile" label="手机">
                  <Input placeholder="请输入手机" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="birthDate" label="出生日期">
                  <DatePicker style={{ width: '100%' }} placeholder="请选择出生日期" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="entryDate" label="入职日期">
                  <DatePicker style={{ width: '100%' }} placeholder="请选择入职日期" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="leaveDate" label="离职日期">
                  <DatePicker style={{ width: '100%' }} placeholder="请选择离职日期" />
                </Form.Item>
              </Col>
            </>
          )}

          {/* 部门 */}
          {isDepartmentType && (
            <>
              <Col span={12}>
                <Form.Item name="managerName" label="部门负责人">
                  <Input placeholder="请输入部门负责人" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="contactMobile" label="手机">
                  <Input placeholder="请输入手机" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="startDate" label="成立日期">
                  <DatePicker style={{ width: '100%' }} placeholder="请选择成立日期" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="endDate" label="撤销日期">
                  <DatePicker style={{ width: '100%' }} placeholder="请选择撤销日期" />
                </Form.Item>
              </Col>
            </>
          )}

          {/* 项目 */}
          {isProjectType && (
            <>
              <Col span={12}>
                <Form.Item name="managerName" label="负责部门/人">
                  <Input placeholder="请输入负责部门/人" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="contactMobile" label="手机">
                  <Input placeholder="请输入手机" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="startDate" label="开始日期">
                  <DatePicker style={{ width: '100%' }} placeholder="请选择开始日期" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="endDate" label="结束日期">
                  <DatePicker style={{ width: '100%' }} placeholder="请选择结束日期" />
                </Form.Item>
              </Col>
            </>
          )}

          {/* 存货 */}
          {isInventoryType && (
            <>
              <Col span={12}>
                <Form.Item name="specification" label="规格型号">
                  <Input placeholder="请输入规格型号" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="category" label="存货类别">
                  <Input placeholder="请输入存货类别" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="unit" label="计量单位">
                  <Input placeholder="请输入计量单位" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="startDate" label="启用日期">
                  <DatePicker style={{ width: '100%' }} placeholder="请选择启用日期" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="endDate" label="停用日期">
                  <DatePicker style={{ width: '100%' }} placeholder="请选择停用日期" />
                </Form.Item>
              </Col>
            </>
          )}

          <Col span={24}>
            <Form.Item
              name="remark"
              label="备注"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 20 }}
            >
              <Input.TextArea rows={2} placeholder="请输入备注" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '状态不能为空' }]}
            >
              <Radio.Group options={COMMON_STATUS_OPTIONS} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default FmsAuxiliaryItemForm
