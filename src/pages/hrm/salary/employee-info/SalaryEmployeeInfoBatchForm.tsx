import React, { useEffect, useState } from 'react'
import {
  Alert,
  Col,
  DatePicker,
  Form,
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
  updateSalaryEmployeeInfoList
} from '@/api/hrm/salary/employeeInfo'
import { getSalaryOptionSimpleList } from '@/api/hrm/salary/option'
import { textConst } from '@/locales/zh-CN'
import DeptSelect from '@/pages/hrm/employee/components/DeptSelect'
import HrmEmployeeSelect from '@/pages/hrm/employee/components/HrmEmployeeSelect'

interface SalaryEmployeeInfoBatchFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  selectedEmployeeIds?: number[]
  onSuccess: () => void
}

const CHANGE_REASON_OPTIONS = [
  { label: '年中调薪', value: 5 },
  { label: '年度调薪', value: 6 },
  { label: '特别调薪', value: 7 },
  { label: '其他', value: 8 }
]

interface BatchOptionRow {
  code: number
  name: string
  value: number
}

const SalaryEmployeeInfoBatchForm: React.FC<SalaryEmployeeInfoBatchFormProps> = ({
  visible,
  setVisible,
  selectedEmployeeIds = [],
  onSuccess
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [adjustType, setAdjustType] = useState<number>(1) // 1: 按比例, 2: 按金额
  const [minEffectDate, setMinEffectDate] = useState<string>()
  const [effectTime, setEffectTime] = useState<number>()
  const [optionRows, setOptionRows] = useState<BatchOptionRow[]>([])

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

        const defaultEffect = dayjs().add(1, 'day')
        setEffectTime(defaultEffect.valueOf())
        setAdjustType(1)

        form.setFieldsValue({
          deptIds: [],
          employeeIds: selectedEmployeeIds,
          changeReason: 5,
          effectTime: defaultEffect,
          type: 1
        })

        setOptionRows(
          availableOptions.map((opt) => ({
            code: opt.code!,
            name: opt.name!,
            value: 0
          }))
        )
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [visible, selectedEmployeeIds, form])

  const handleRowValueChange = (code: number, val: number) => {
    setOptionRows((prev) => prev.map((row) => (row.code === code ? { ...row, value: val } : row)))
  }

  const isPendingChange = () => {
    if (!effectTime) return false
    return dayjs(effectTime).isAfter(dayjs(), 'day')
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      const deptIds = values.deptIds || []
      const employeeIds = values.employeeIds || []
      if (!deptIds.length && !employeeIds.length) {
        message.warning('请选择调薪部门或指定员工')
        return
      }

      setLoading(true)
      const payload: API.HrmSalaryEmployeeInfoUpdateListReqVO = {
        deptIds,
        employeeIds,
        changeReason: values.changeReason,
        effectTime: values.effectTime ? dayjs(values.effectTime).format('YYYY-MM-DD HH:mm:ss') : '',
        type: adjustType,
        salaryOptions: optionRows
          .filter((r) => r.value !== 0)
          .map((r) => ({ code: r.code, value: r.value }))
      }

      await updateSalaryEmployeeInfoList(payload)
      message.success('批量调薪操作成功')
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
      title: '调薪项',
      dataIndex: 'name',
      key: 'name',
      minWidth: 180
    },
    {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
      align: 'center' as const,
      width: 120
    },
    {
      title: adjustType === 1 ? '调薪比例 (%)' : '调薪金额 (元)',
      key: 'value',
      align: 'center' as const,
      width: 240,
      render: (_: any, record: BatchOptionRow) => (
        <InputNumber
          value={record.value}
          precision={2}
          style={{ width: '100%' }}
          addonAfter={adjustType === 1 ? '%' : '元'}
          onChange={(val) => handleRowValueChange(record.code, val || 0)}
        />
      )
    }
  ]

  return (
    <Modal
      title="批量调薪"
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
            <Form.Item name="deptIds" label="部门范围">
              <DeptSelect placeholder="请选择调薪部门" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="employeeIds" label="指定员工">
              <HrmEmployeeSelect multiple placeholder="请选择调薪员工" />
            </Form.Item>
          </Col>
        </Row>

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
                  minEffectDate ? current && current < dayjs(minEffectDate).startOf('day') : false
                }
                onChange={(date) => setEffectTime(date ? date.valueOf() : undefined)}
              />
            </Form.Item>
          </Col>
        </Row>

        {isPendingChange() && (
          <Alert
            message="批量调整将在生效日期前保持待生效，不会提前修改所选员工的薪资档案。"
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form.Item name="type" label="调薪方式">
          <Radio.Group onChange={(e) => setAdjustType(e.target.value)}>
            <Radio value={1}>按比例调薪</Radio>
            <Radio value={2}>按金额调薪</Radio>
          </Radio.Group>
        </Form.Item>

        <Table
          columns={columns}
          dataSource={optionRows}
          rowKey="code"
          pagination={false}
          size="small"
          bordered
          scroll={{ y: 260 }}
          style={{ marginBottom: 16 }}
        />
      </Form>
    </Modal>
  )
}

export default SalaryEmployeeInfoBatchForm
