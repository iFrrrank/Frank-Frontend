import React, { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Checkbox,
  DatePicker,
  Divider,
  Empty,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Spin,
  Typography,
  message
} from 'antd'
import dayjs from 'dayjs'
import { fmsAccountSetGetAccountSet } from '@/api/fms/config/accountSet'
import { fmsCurrencyGetCurrencySimpleList } from '@/api/fms/config/currency'
import {
  fmsFinanceParameterGetFinanceParameter,
  fmsFinanceParameterUpdateFinanceParameter
} from '@/api/fms/config/financeParameter'
import HasPermi, { useHasPermi } from '@/directives/permission/HasPermi'
import { useFmsStore } from '../../store/fms'
import {
  FMS_ACCOUNTING_STANDARD_OPTIONS,
  FMS_DEFAULT_SUBJECT_CODE_RULE,
  FMS_DEFAULT_SUBJECT_LEVEL,
  FMS_LEDGER_BALANCE_MODE,
  FMS_SUBJECT_CODE_LENGTH_MAX,
  FMS_SUBJECT_CODE_LENGTH_MIN,
  FMS_SUBJECT_LEVEL_MAX
} from '../../utils/constants'

function parseSubjectCodeRules(rule?: string): number[] {
  return (rule || FMS_DEFAULT_SUBJECT_CODE_RULE).split('-').map(Number)
}

/**
 * 财务参数配置页面
 */
const FinanceParameterPage: React.FC = () => {
  const [form] = Form.useForm()
  const hasPermi = useHasPermi()
  const fmsStore = useFmsStore()
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [accountSet, setAccountSet] = useState<API.FmsAccountSetRespVO>()
  const [currency, setCurrency] = useState<API.FmsCurrencyRespVO>()
  const [financeParameter, setFinanceParameter] = useState<API.FmsFinanceParameterRespVO>()
  const [originalLevel, setOriginalLevel] = useState(FMS_DEFAULT_SUBJECT_LEVEL)
  const [originalRules, setOriginalRules] = useState<number[]>(
    parseSubjectCodeRules(FMS_DEFAULT_SUBJECT_CODE_RULE)
  )
  const [subjectCodeRules, setSubjectCodeRules] = useState<number[]>(
    parseSubjectCodeRules(FMS_DEFAULT_SUBJECT_CODE_RULE)
  )

  const formEditable =
    fmsStore.isAccountSetWritable && hasPermi('fms:config:finance-parameter:update')

  const loadParameter = useCallback(async () => {
    const currentAccountSetId = fmsStore.accountSetId
    if (!currentAccountSetId) {
      setAccountSet(undefined)
      setCurrency(undefined)
      setFinanceParameter(undefined)
      form.resetFields()
      return
    }
    setLoading(true)
    try {
      const [accountSetResp, paramResp, currencyResp] = await Promise.all([
        fmsAccountSetGetAccountSet({ id: currentAccountSetId }),
        fmsFinanceParameterGetFinanceParameter({ accountSetId: currentAccountSetId }),
        fmsCurrencyGetCurrencySimpleList({ accountSetId: currentAccountSetId })
      ])
      const accountSetData = accountSetResp.data
      const paramData = paramResp.data
      const currencyList = currencyResp.data || []

      setAccountSet(accountSetData)
      setCurrency(currencyList.find((item) => item.id === accountSetData?.currencyId))
      setFinanceParameter(paramData)

      if (!paramData) {
        return
      }
      const parsedRules = parseSubjectCodeRules(paramData.subjectCodeRule)
      setOriginalLevel(paramData.level || FMS_DEFAULT_SUBJECT_LEVEL)
      setOriginalRules(parsedRules)
      setSubjectCodeRules([...parsedRules])

      form.setFieldsValue({
        standard: accountSetData?.standard ?? FMS_ACCOUNTING_STANDARD_OPTIONS[0].value,
        level: paramData.level,
        sameAsSubjectDirection:
          paramData.ledgerBalanceMode === FMS_LEDGER_BALANCE_MODE.SAME_AS_SUBJECT,
        voucherReviewRequired: paramData.voucherReviewRequired
      })
    } finally {
      setLoading(false)
    }
  }, [fmsStore.accountSetId, form])

  useEffect(() => {
    loadParameter()
  }, [loadParameter])

  const handleLevelChange = (nextLevel: number) => {
    setSubjectCodeRules((prev) => {
      const next = [...prev]
      while (next.length < nextLevel) {
        next.push(FMS_SUBJECT_CODE_LENGTH_MIN)
      }
      next.splice(nextLevel)
      return next
    })
  }

  const handleSubmit = async () => {
    if (!fmsStore.accountSetId) return
    try {
      const values = await form.validateFields()
      setSubmitLoading(true)
      const resp = await fmsFinanceParameterUpdateFinanceParameter({
        accountSetId: fmsStore.accountSetId,
        standard: values.standard,
        level: values.level,
        subjectCodeRule: subjectCodeRules.join('-'),
        ledgerBalanceMode: values.sameAsSubjectDirection
          ? FMS_LEDGER_BALANCE_MODE.SAME_AS_SUBJECT
          : FMS_LEDGER_BALANCE_MODE.OPPOSITE_TO_SUBJECT,
        voucherReviewRequired: Boolean(values.voucherReviewRequired)
      })
      if (resp.code === 0) {
        message.success('财务参数保存成功')
        await loadParameter()
      }
    } finally {
      setSubmitLoading(false)
    }
  }

  const levelOptions = Array.from(
    { length: FMS_SUBJECT_LEVEL_MAX - originalLevel + 1 },
    (_, idx) => ({
      label: `${originalLevel + idx} 级`,
      value: originalLevel + idx
    })
  )

  return (
    <Card title="财务参数" variant="borderless">
      <Spin spinning={loading}>
        {accountSet ? (
          <Form
            form={form}
            disabled={!formEditable}
            labelCol={{ style: { width: 120 } }}
            colon={false}
            style={{ maxWidth: 960 }}
          >
            <Divider orientation="left">基础参数</Divider>
            <Form.Item label="公司名称">
              <Input value={accountSet.companyName} disabled style={{ width: 320 }} />
            </Form.Item>
            <Form.Item label="本位币">
              <Input
                value={currency ? `${currency.code} ${currency.name}` : '-'}
                disabled
                style={{ width: 320 }}
              />
            </Form.Item>
            <Form.Item label="启用期间">
              <DatePicker
                picker="month"
                value={
                  accountSet.startTime
                    ? dayjs(Number(accountSet.startTime) || accountSet.startTime)
                    : undefined
                }
                format="YYYY-MM"
                disabled
                style={{ width: 320 }}
              />
            </Form.Item>
            <Form.Item
              name="standard"
              label="会计制度"
              rules={[{ required: true, message: '请选择会计制度' }]}
            >
              <Select
                options={FMS_ACCOUNTING_STANDARD_OPTIONS as any}
                style={{ width: 320 }}
              />
            </Form.Item>

            {financeParameter ? (
              <>
                <Divider orientation="left">科目参数</Divider>
                <Form.Item
                  name="level"
                  label="科目级次"
                  rules={[{ required: true, message: '请选择科目级次' }]}
                >
                  <Select
                    options={levelOptions}
                    style={{ width: 160 }}
                    onChange={handleLevelChange}
                  />
                </Form.Item>
                <Form.Item label=" ">
                  <Typography.Text type="warning">
                    科目级次和编码长度调大后不能再调小，请谨慎操作
                  </Typography.Text>
                </Form.Item>
                <Form.Item label="编码长度">
                  <Space wrap>
                    {subjectCodeRules.map((val, idx) => (
                      <React.Fragment key={idx}>
                        <InputNumber
                          value={val}
                          min={originalRules[idx] || FMS_SUBJECT_CODE_LENGTH_MIN}
                          max={FMS_SUBJECT_CODE_LENGTH_MAX}
                          style={{ width: 72 }}
                          onChange={(nextVal) => {
                            if (!nextVal) return
                            setSubjectCodeRules((prev) =>
                              prev.map((item, i) => (i === idx ? Number(nextVal) : item))
                            )
                          }}
                        />
                        {idx < subjectCodeRules.length - 1 && <span>-</span>}
                      </React.Fragment>
                    ))}
                  </Space>
                </Form.Item>

                <Divider orientation="left">账簿</Divider>
                <Form.Item
                  name="sameAsSubjectDirection"
                  label="账簿余额方向"
                  valuePropName="checked"
                >
                  <Checkbox>与科目方向相同</Checkbox>
                </Form.Item>
                <Form.Item
                  name="voucherReviewRequired"
                  label="结账条件"
                  valuePropName="checked"
                >
                  <Checkbox>凭证审核后才允许结账</Checkbox>
                </Form.Item>

                {fmsStore.isAccountSetWritable && (
                  <HasPermi value="fms:config:finance-parameter:update">
                    <Form.Item label=" ">
                      <Button type="primary" loading={submitLoading} onClick={handleSubmit}>
                        保存
                      </Button>
                    </Form.Item>
                  </HasPermi>
                )}
              </>
            ) : (
              <Alert
                type="info"
                showIcon
                message={
                  accountSet.initialized
                    ? '当前账套缺少财务参数，请检查初始化数据'
                    : '当前账套尚未初始化，请先完成账套初始化'
                }
              />
            )}
          </Form>
        ) : (
          <Empty description="请选择账套" />
        )}
      </Spin>
    </Card>
  )
}

export default FinanceParameterPage
