import React, { useEffect, useState } from 'react'
import {
  Alert,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Table,
  message
} from 'antd'
import dayjs from 'dayjs'
import {
  getSalaryAdjustmentMinEffectDate,
  getSalaryEmployeeInfo,
  updateSalaryEmployeeInfo
} from '@/api/hrm/salary/employeeInfo'
import { getSalaryOptionSimpleList } from '@/api/hrm/salary/option'
import { getSalaryChangeRecord } from '@/api/hrm/salary/changeRecord'
import { textConst } from '@/locales/zh-CN'
import HrmEmployeeSelect from '@/pages/hrm/employee/components/HrmEmployeeSelect'
import SalaryChangeTemplateSelect from '../config/change-template/components/SalaryChangeTemplateSelect'

interface SalaryEmployeeInfoFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  employeeId?: number
  recordId?: number
  onSuccess: () => void
}

const CHANGE_REASON_OPTIONS = [
  { label: '入职定薪', value: 0 },
  { label: '入职核定', value: 1 },
  { label: '转正', value: 2 },
  { label: '晋升', value: 3 },
  { label: '调动', value: 4 },
  { label: '年中调薪', value: 5 },
  { label: '年度调薪', value: 6 },
  { label: '特别调薪', value: 7 },
  { label: '其他', value: 8 }
]

interface OptionRow {
  code: number
  name: string
  probationValue: number
  regularValue: number
}

const SalaryEmployeeInfoForm: React.FC<SalaryEmployeeInfoFormProps> = ({
  visible,
  setVisible,
  employeeId,
  recordId,
  onSuccess
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [recordType, setRecordType] = useState<number>(1) // 1: 定薪, 2: 调薪
  const [minEffectDate, setMinEffectDate] = useState<string>()
  const [effectTime, setEffectTime] = useState<string>()
  const [beforeTotal, setBeforeTotal] = useState<number>(0)
  const [probationBeforeTotal, setProbationBeforeTotal] = useState<number>(0)
  const [optionRows, setOptionRows] = useState<OptionRow[]>([])

  useEffect(() => {
    if (!visible) {
      form.resetFields()
      setOptionRows([])
      return
    }

    const init = async () => {
      setLoading(true)
      try {
        const [optResp, minDateResp] = await Promise.all([
          getSalaryOptionSimpleList({ adjustable: true }),
          getSalaryAdjustmentMinEffectDate()
        ])
        const availableOptions = (optResp.data || []).filter((opt) => opt.parentCode !== 0)
        setMinEffectDate(minDateResp.data)

        let targetEmployeeId = employeeId
        let isChange = false

        if (recordId) {
          const recResp = await getSalaryChangeRecord({ id: recordId })
          const rec = recResp.data
          if (rec) {
            targetEmployeeId = rec.employeeId
            isChange = rec.recordType === 2
            setRecordType(rec.recordType || 1)
            setEffectTime(rec.effectTime)
            setBeforeTotal(rec.beforeTotal || 0)
            setProbationBeforeTotal(rec.probationBeforeTotal || 0)

            form.setFieldsValue({
              employeeId: rec.employeeId,
              recordType: rec.recordType,
              changeReason: rec.changeReason,
              effectTime: rec.effectTime ? dayjs(rec.effectTime) : undefined,
              remark: rec.remark
            })

            // 填充金额行
            const regMap = new Map((rec.salaryOptions || []).map((o) => [o.code, o.value || 0]))
            const probMap = new Map(
              (rec.probationSalaryOptions || []).map((o) => [o.code, o.value || 0])
            )

            setOptionRows(
              availableOptions.map((opt) => ({
                code: opt.code!,
                name: opt.name!,
                probationValue: probMap.get(opt.code!) || 0,
                regularValue: regMap.get(opt.code!) || 0
              }))
            )
            return
          }
        }

        if (targetEmployeeId) {
          const empResp = await getSalaryEmployeeInfo({ employeeId: targetEmployeeId })
          const empInfo = empResp.data
          isChange = Boolean(empInfo?.id)
          const rType = isChange ? 2 : 1
          setRecordType(rType)

          const regMap = new Map((empInfo?.salaryOptions || []).map((o) => [o.code, o.value || 0]))
          const probMap = new Map(
            (empInfo?.probationSalaryOptions || []).map((o) => [o.code, o.value || 0])
          )

          setBeforeTotal(empInfo?.regularSalary || 0)
          setProbationBeforeTotal(empInfo?.probationSalary || 0)

          form.setFieldsValue({
            employeeId: targetEmployeeId,
            recordType: rType,
            changeReason: isChange ? 5 : 0,
            effectTime: isChange ? dayjs().add(1, 'day') : undefined,
            remark: ''
          })
          if (isChange) {
            setEffectTime(dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss'))
          }

          setOptionRows(
            availableOptions.map((opt) => ({
              code: opt.code!,
              name: opt.name!,
              probationValue: probMap.get(opt.code!) || 0,
              regularValue: regMap.get(opt.code!) || 0
            }))
          )
        } else {
          setRecordType(1)
          form.setFieldsValue({
            recordType: 1,
            changeReason: 0
          })
          setOptionRows(
            availableOptions.map((opt) => ({
              code: opt.code!,
              name: opt.name!,
              probationValue: 0,
              regularValue: 0
            }))
          )
        }
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [visible, employeeId, recordId, form])

  const handleRowValueChange = (
    code: number,
    field: 'probationValue' | 'regularValue',
    val: number
  ) => {
    setOptionRows((prev) => prev.map((row) => (row.code === code ? { ...row, [field]: val } : row)))
  }

  const isPendingChange = () => {
    if (recordType !== 2 || !effectTime) return false
    return dayjs(effectTime).isAfter(dayjs(), 'day')
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const payload: API.HrmSalaryEmployeeInfoUpdateReqVO = {
        employeeId: values.employeeId,
        recordType,
        changeReason: values.changeReason,
        effectTime: values.effectTime
          ? dayjs(values.effectTime).format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        remark: values.remark,
        salaryOptions: optionRows.map((r) => ({ code: r.code, value: r.regularValue })),
        probationSalaryOptions: optionRows.map((r) => ({
          code: r.code,
          value: r.probationValue
        }))
      }

      await updateSalaryEmployeeInfo(payload)
      message.success(textConst.msg.saveSuccess)
      setVisible(false)
      onSuccess()
    } catch {
      // Form or API error
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: '薪资项',
      dataIndex: 'name',
      key: 'name',
      minWidth: 160
    },
    {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
      align: 'center' as const,
      width: 110
    },
    {
      title: '试用期工资',
      key: 'probationValue',
      align: 'center' as const,
      width: 220,
      render: (_: any, record: OptionRow) => (
        <InputNumber
          value={record.probationValue}
          min={0}
          precision={2}
          style={{ width: '100%' }}
          onChange={(val) => handleRowValueChange(record.code, 'probationValue', val || 0)}
        />
      )
    },
    {
      title: '转正后工资',
      key: 'regularValue',
      align: 'center' as const,
      width: 220,
      render: (_: any, record: OptionRow) => (
        <InputNumber
          value={record.regularValue}
          min={0}
          precision={2}
          style={{ width: '100%' }}
          onChange={(val) => handleRowValueChange(record.code, 'regularValue', val || 0)}
        />
      )
    }
  ]

  return (
    <Modal
      title={recordType === 1 ? '员工定薪' : '员工调薪'}
      open={visible}
      onCancel={() => setVisible(false)}
      onOk={handleOk}
      confirmLoading={loading}
      destroyOnClose
      okText={textConst.common.ok}
      cancelText={textConst.common.cancel}
      width={900}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        colon={false}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="employeeId"
              label="员工"
              rules={[{ required: true, message: '请选择员工' }]}
            >
              <HrmEmployeeSelect disabled={!!employeeId} placeholder="请选择员工" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="recordType" label="记录类型">
              <Radio.Group disabled>
                <Radio value={1}>定薪</Radio>
                <Radio value={2}>调薪</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        {recordType === 2 && (
          <>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="changeReason"
                  label="调整原因"
                  rules={[{ required: true, message: '请选择调整原因' }]}
                >
                  <Select options={CHANGE_REASON_OPTIONS} placeholder="请选择调整原因" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="effectTime"
                  label="生效日期"
                  rules={[{ required: true, message: '请选择生效日期' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    disabledDate={(current) =>
                      minEffectDate
                        ? current && current < dayjs(minEffectDate).startOf('day')
                        : false
                    }
                    onChange={(date) =>
                      setEffectTime(date ? date.format('YYYY-MM-DD HH:mm:ss') : undefined)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="调整前正式">
                  <InputNumber
                    value={beforeTotal}
                    disabled
                    precision={2}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="调整前试用">
                  <InputNumber
                    value={probationBeforeTotal}
                    disabled
                    precision={2}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {isPendingChange() && (
              <Alert
                message="该调整将在生效日期前保持待生效，当前薪资档案不会提前变化"
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}
          </>
        )}

        <Divider orientation="left">薪资明细</Divider>
        <Table
          columns={columns}
          dataSource={optionRows}
          rowKey="code"
          pagination={false}
          size="small"
          bordered
          style={{ marginBottom: 16 }}
        />

        <Form.Item name="remark" label="备注" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
          <Input.TextArea maxLength={500} showCount rows={3} placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default SalaryEmployeeInfoForm
