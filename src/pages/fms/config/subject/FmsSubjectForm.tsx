import React, { useEffect, useMemo, useState } from 'react'
import { Checkbox, Col, Form, Input, Modal, Radio, Row, Select, message } from 'antd'
import {
  fmsSubjectCreateSubject,
  fmsSubjectGetSubject,
  fmsSubjectGetSubjectSimpleList,
  fmsSubjectUpdateSubject
} from '@/api/fms/config/subject'
import { textConst } from '@/locales/zh-CN'
import { handleTree } from '@/utils/tree'
import {
  FMS_DEBIT_CREDIT_DIRECTION,
  FMS_DEBIT_CREDIT_DIRECTION_OPTIONS,
  FMS_SUBJECT_CATEGORY_OPTIONS,
  FMS_SUBJECT_LEVEL_MAX,
  FMS_SUBJECT_STATUS,
  FMS_SUBJECT_TYPE,
  FMS_SUBJECT_TYPE_OPTIONS
} from '../../utils/constants'
import FmsAuxiliaryTypeSelect from '../auxiliary/components/FmsAuxiliaryTypeSelect'
import FmsCurrencySelect from '../currency/components/FmsCurrencySelect'
import FmsSubjectSelect, { type SubjectNode } from './components/FmsSubjectSelect'

interface FmsSubjectFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  accountSetId: number
  id?: number
  defaultType?: number
  parentSubject?: API.FmsSubjectRespVO
  onSuccess: () => void
}

const DEFAULT_CATEGORY_MAP: Record<number, number> = {
  [FMS_SUBJECT_TYPE.ASSET]: 101,
  [FMS_SUBJECT_TYPE.LIABILITY]: 201,
  [FMS_SUBJECT_TYPE.EQUITY]: 301,
  [FMS_SUBJECT_TYPE.COST]: 401,
  [FMS_SUBJECT_TYPE.PROFIT_LOSS]: 501
}

/**
 * 会计科目新增/修改弹窗
 */
const FmsSubjectForm: React.FC<FmsSubjectFormProps> = ({
  visible,
  setVisible,
  accountSetId,
  id,
  defaultType = FMS_SUBJECT_TYPE.ASSET,
  parentSubject,
  onSuccess
}) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [allSubjects, setAllSubjects] = useState<API.FmsSubjectRespVO[]>([])

  const selectedType = Form.useWatch('type', form)
  const selectedParentId = Form.useWatch('parentId', form)
  const quantityAccounting = Form.useWatch('quantityAccounting', form)
  const auxiliaryAccounting = Form.useWatch('auxiliaryAccounting', form)
  const foreignCurrencyAccounting = Form.useWatch('foreignCurrencyAccounting', form)
  const usedStatus = Form.useWatch('usedStatus', form)

  const parentChosen = Boolean(selectedParentId && selectedParentId !== 0)
  const coreFieldDisabled = isUpdate && Boolean(usedStatus)

  /** 当前科目类型对应的科目类别选项 */
  const categoryOptions = useMemo(() => {
    const prefix = String(selectedType || '')
    return FMS_SUBJECT_CATEGORY_OPTIONS.filter((item) => String(item.value).startsWith(prefix))
  }, [selectedType])

  /** 可作为上级科目的科目树 */
  const parentSubjectTree = useMemo<SubjectNode[]>(() => {
    const candidates = allSubjects.filter(
      (item) =>
        item.type === selectedType &&
        item.level < FMS_SUBJECT_LEVEL_MAX &&
        item.id !== id
    )
    return handleTree(candidates)
  }, [allSubjects, selectedType, id])

  useEffect(() => {
    if (!visible || !accountSetId) return
    form.resetFields()
    setLoading(true)

    Promise.all([
      fmsSubjectGetSubjectSimpleList({ accountSetId: String(accountSetId) }),
      isUpdate && id !== undefined ? fmsSubjectGetSubject({ accountSetId, id }) : Promise.resolve(null)
    ])
      .then(([listResp, detailResp]) => {
        const subjectList = listResp.code === 0 ? listResp.data || [] : []
        setAllSubjects(subjectList)

        if (isUpdate && detailResp?.code === 0 && detailResp.data) {
          const data = detailResp.data
          form.setFieldsValue({
            ...data,
            parentId: data.parentId || undefined,
            auxiliaryTypeIds: data.auxiliaryTypeIds || [],
            currencyIds: data.currencyIds || []
          })
        } else if (parentSubject) {
          // 新增下级科目：自动计算下一个科目编码
          const childrenCodes = subjectList
            .filter((item) => item.parentId === parentSubject.id)
            .map((item) => Number(item.code))
            .filter((num) => Number.isFinite(num))
          const nextCode = childrenCodes.length
            ? String(Math.max(...childrenCodes) + 1)
            : `${parentSubject.code}01`

          form.setFieldsValue({
            parentId: parentSubject.id,
            code: nextCode,
            name: '',
            type: parentSubject.type,
            category: parentSubject.category,
            balanceDirection: parentSubject.balanceDirection,
            status: FMS_SUBJECT_STATUS.ENABLED,
            quantityAccounting: Boolean(parentSubject.quantityAccounting),
            quantityUnit: parentSubject.quantityUnit,
            auxiliaryAccounting: Boolean(parentSubject.auxiliaryTypeIds?.length),
            auxiliaryTypeIds: parentSubject.auxiliaryTypeIds
              ? [...parentSubject.auxiliaryTypeIds]
              : [],
            foreignCurrencyAccounting: Boolean(parentSubject.currencyIds?.length),
            currencyIds: parentSubject.currencyIds ? [...parentSubject.currencyIds] : [],
            cash: Boolean(parentSubject.cash),
            enablePeriodEndTransfer: false,
            usedStatus: false
          })
        } else {
          // 普通新增一级科目
          const initDirection =
            defaultType === FMS_SUBJECT_TYPE.LIABILITY || defaultType === FMS_SUBJECT_TYPE.EQUITY
              ? FMS_DEBIT_CREDIT_DIRECTION.CREDIT
              : FMS_DEBIT_CREDIT_DIRECTION.DEBIT
          form.setFieldsValue({
            parentId: undefined,
            code: '',
            name: '',
            type: defaultType,
            category: DEFAULT_CATEGORY_MAP[defaultType] || 101,
            balanceDirection: initDirection,
            status: FMS_SUBJECT_STATUS.ENABLED,
            quantityAccounting: false,
            quantityUnit: undefined,
            auxiliaryAccounting: false,
            auxiliaryTypeIds: [],
            foreignCurrencyAccounting: false,
            currencyIds: [],
            enablePeriodEndTransfer: false,
            usedStatus: false
          })
        }
      })
      .finally(() => setLoading(false))
  }, [visible, accountSetId, id, isUpdate, defaultType, parentSubject, form])

  /** 处理科目类型切换 */
  const handleTypeChange = (nextType: number) => {
    const nextDirection =
      nextType === FMS_SUBJECT_TYPE.LIABILITY || nextType === FMS_SUBJECT_TYPE.EQUITY
        ? FMS_DEBIT_CREDIT_DIRECTION.CREDIT
        : FMS_DEBIT_CREDIT_DIRECTION.DEBIT
    form.setFieldsValue({
      parentId: undefined,
      category: DEFAULT_CATEGORY_MAP[nextType],
      balanceDirection: nextDirection
    })
  }

  /** 处理上级科目切换 */
  const handleParentChange = (nextParentId?: number) => {
    if (!nextParentId) return
    const p = allSubjects.find((item) => item.id === nextParentId)
    if (!p) return
    form.setFieldsValue({
      type: p.type,
      category: p.category,
      balanceDirection: p.balanceDirection
    })
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      const payload: API.FmsSubjectSaveReqVO = {
        id,
        accountSetId,
        code: values.code,
        name: values.name,
        parentId: values.parentId || 0,
        type: values.type,
        category: values.category,
        balanceDirection: values.balanceDirection,
        quantityAccounting: Boolean(values.quantityAccounting),
        quantityUnit: values.quantityAccounting ? values.quantityUnit : undefined,
        auxiliaryTypeIds: values.auxiliaryAccounting ? values.auxiliaryTypeIds || [] : [],
        currencyIds: values.foreignCurrencyAccounting ? values.currencyIds || [] : [],
        cash: Boolean(values.cash)
      }
      const resp = isUpdate
        ? await fmsSubjectUpdateSubject(payload)
        : await fmsSubjectCreateSubject(payload)
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
      title={isUpdate ? '修改会计科目' : '新增会计科目'}
      open={visible}
      onCancel={() => setVisible(false)}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={680}
      destroyOnHidden
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 17 }}
        colon={false}
        style={{ marginTop: 16 }}
      >
        <Form.Item name="usedStatus" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="status" hidden>
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="code"
              label="科目编码"
              rules={[
                { required: true, message: '科目编码不能为空' },
                { pattern: /^\d+$/, message: '科目编码只能输入数字' }
              ]}
            >
              <Input disabled={coreFieldDisabled} placeholder="请输入科目编码" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              label="科目名称"
              rules={[{ required: true, message: '科目名称不能为空' }]}
            >
              <Input placeholder="请输入科目名称" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="parentId" label="上级科目">
              <FmsSubjectSelect
                options={parentSubjectTree}
                allowClear
                disabled={isUpdate}
                placeholder="不选则为一级科目"
                onChange={handleParentChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="type"
              label="科目类型"
              rules={[{ required: true, message: '科目类型不能为空' }]}
            >
              <Select
                disabled={isUpdate || parentChosen}
                options={FMS_SUBJECT_TYPE_OPTIONS}
                placeholder="请选择科目类型"
                onChange={handleTypeChange}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="category"
              label="科目类别"
              rules={[{ required: true, message: '科目类别不能为空' }]}
            >
              <Select
                disabled={coreFieldDisabled || parentChosen}
                options={categoryOptions}
                placeholder="请选择科目类别"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="balanceDirection"
              label="余额方向"
              rules={[{ required: true, message: '余额方向不能为空' }]}
            >
              <Radio.Group
                disabled={coreFieldDisabled || parentChosen}
                options={FMS_DEBIT_CREDIT_DIRECTION_OPTIONS}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="quantityAccounting" label="数量核算" valuePropName="checked">
              <Checkbox
                disabled={coreFieldDisabled}
                onChange={(e) => {
                  if (!e.target.checked) {
                    form.setFieldValue('quantityUnit', undefined)
                  }
                }}
              >
                启用数量核算
              </Checkbox>
            </Form.Item>
          </Col>
          {quantityAccounting && (
            <Col span={12}>
              <Form.Item
                name="quantityUnit"
                label="计量单位"
                rules={[{ required: true, message: '启用数量核算时，计量单位不能为空' }]}
              >
                <Input disabled={coreFieldDisabled} placeholder="请输入计量单位" />
              </Form.Item>
            </Col>
          )}
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="auxiliaryAccounting" label="辅助核算" valuePropName="checked">
              <Checkbox
                disabled={coreFieldDisabled}
                onChange={(e) => {
                  if (!e.target.checked) {
                    form.setFieldValue('auxiliaryTypeIds', [])
                  }
                }}
              >
                启用辅助核算
              </Checkbox>
            </Form.Item>
          </Col>
          {auxiliaryAccounting && (
            <Col span={24}>
              <Form.Item
                name="auxiliaryTypeIds"
                label="辅助核算类别"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 20 }}
                rules={[
                  {
                    required: true,
                    type: 'array',
                    min: 1,
                    message: '启用辅助核算时，请至少选择一个辅助核算类别'
                  }
                ]}
              >
                <FmsAuxiliaryTypeSelect
                  mode="multiple"
                  disabled={coreFieldDisabled}
                  placeholder="请选择辅助核算类别"
                />
              </Form.Item>
            </Col>
          )}
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="foreignCurrencyAccounting" label="外币核算" valuePropName="checked">
              <Checkbox
                disabled={coreFieldDisabled}
                onChange={(e) => {
                  if (!e.target.checked) {
                    form.setFieldsValue({
                      currencyIds: [],
                      enablePeriodEndTransfer: false
                    })
                  }
                }}
              >
                启用外币核算
              </Checkbox>
            </Form.Item>
          </Col>
          {foreignCurrencyAccounting && (
            <>
              <Col span={12}>
                <Form.Item name="enablePeriodEndTransfer" label="期末调汇" valuePropName="checked">
                  <Checkbox disabled={coreFieldDisabled}>启用期末调汇</Checkbox>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="currencyIds"
                  label="核算币种"
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 20 }}
                  rules={[
                    {
                      required: true,
                      type: 'array',
                      min: 1,
                      message: '启用外币核算时，请至少选择一个外币币种'
                    }
                  ]}
                >
                  <FmsCurrencySelect
                    mode="multiple"
                    excludeStandard
                    showName
                    disabled={coreFieldDisabled}
                    placeholder="请选择外币币种"
                  />
                </Form.Item>
              </Col>
            </>
          )}
        </Row>
      </Form>
    </Modal>
  )
}

export default FmsSubjectForm
