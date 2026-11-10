import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Modal,
  Row,
  Space,
  Spin,
  Typography,
  message
} from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import {
  fmsClosingPeriodCancelClosePeriod,
  fmsClosingPeriodClosePeriod,
  fmsClosingPeriodGetClosingOverview
} from '@/api/fms/closing/period'
import { fmsAccountSetGetAccountSet } from '@/api/fms/config/accountSet'
import HasPermi from '@/directives/permission/HasPermi'
import { useFmsStore } from '@/pages/fms/store/fms'
import { formatMoney } from '@/pages/fms/utils/format'
import ClosingSchemeList from './ClosingSchemeList'
import ClosingStatusCard from './ClosingStatusCard'

const defaultOverview: API.FmsClosingOverviewRespVO = {
  month: dayjs().format('YYYY-MM'),
  closed: false,
  voucherReviewRequired: false,
  pendingVoucherCount: 0,
  voucherCount: 0,
  profitLossBalance: 0,
  balanceSheetDifference: 0,
  initialBalanceBalanced: false,
  voucherNumberContinuous: false,
  profitLossVoucherGenerated: false,
  incomeStatementBalanced: false,
  incomeStatementUnmappedSubjectCount: 0,
  balanceSheetProfitLossTransferred: false,
  balanceSheetBalanced: false,
  balanceSheetUnmappedSubjectCount: 0,
  canClose: false
}

const FmsClosing: React.FC = () => {
  const fmsStore = useFmsStore()
  const accountSetId = fmsStore.accountSetId

  const [month, setMonth] = useState(dayjs().format('YYYY-MM'))
  const [currentMonth, setCurrentMonth] = useState(dayjs().format('YYYY-MM'))
  const [startMonth, setStartMonth] = useState(dayjs().format('YYYY-MM'))
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [overview, setOverview] = useState<API.FmsClosingOverviewRespVO>(defaultOverview)

  const monthLabel = useMemo(() => dayjs(`${month}-01`).format('YYYY年MM月'), [month])
  const currentMonthLabel = useMemo(
    () => dayjs(`${currentMonth}-01`).format('YYYY年MM月'),
    [currentMonth]
  )
  const isCurrentPeriod = month === currentMonth
  const isBeforeCurrentPeriod = useMemo(
    () => dayjs(`${month}-01`).isBefore(dayjs(`${currentMonth}-01`), 'month'),
    [month, currentMonth]
  )
  const canClose = Boolean(overview.canClose)

  const balanceSheetCheckLabel = useMemo(() => {
    if (!overview.balanceSheetProfitLossTransferred) return '损益未结转'
    if ((overview.balanceSheetUnmappedSubjectCount || 0) > 0) {
      return `${overview.balanceSheetUnmappedSubjectCount} 个科目未纳入公式`
    }
    return overview.balanceSheetBalanced ? '检查通过' : '不平衡'
  }, [overview])

  const getOverview = useCallback(
    async (targetMonth = month) => {
      if (!accountSetId || !targetMonth) return
      setLoading(true)
      try {
        const resp = await fmsClosingPeriodGetClosingOverview({
          accountSetId: String(accountSetId),
          month: targetMonth
        })
        if (resp.code === 0 && resp.data) {
          setOverview(resp.data)
        }
      } finally {
        setLoading(false)
      }
    },
    [accountSetId, month]
  )

  useEffect(() => {
    const init = async () => {
      if (!accountSetId) return
      const [currentMonthValue, accountSetResp] = await Promise.all([
        fmsStore.loadCurrentMonth(),
        fmsAccountSetGetAccountSet({ id: accountSetId })
      ])
      const nextCurrentMonth = currentMonthValue || dayjs().format('YYYY-MM')
      setCurrentMonth(nextCurrentMonth)
      if (accountSetResp.code === 0 && accountSetResp.data?.startTime) {
        setStartMonth(dayjs(accountSetResp.data.startTime).format('YYYY-MM'))
      }
      setMonth(nextCurrentMonth)
      await getOverview(nextCurrentMonth)
    }
    init()
  }, [accountSetId])

  /** 结账 */
  const closeToPeriod = () => {
    if (!accountSetId || isBeforeCurrentPeriod) return
    Modal.confirm({
      title: '系统提示',
      content: isCurrentPeriod
        ? `结账后将锁定 ${monthLabel}，是否继续？`
        : `将按期间顺序结账至 ${monthLabel}，是否继续？`,
      onOk: async () => {
        setSubmitting(true)
        try {
          const resp = await fmsClosingPeriodClosePeriod({
            accountSetId,
            month
          })
          if (resp.code === 0) {
            message.success('结账成功')
            const nextMonth = (await fmsStore.loadCurrentMonth()) || currentMonth
            setCurrentMonth(nextMonth)
            setMonth(nextMonth)
            await getOverview(nextMonth)
          }
        } finally {
          setSubmitting(false)
        }
      }
    })
  }

  /** 反结账 */
  const cancelToPeriod = () => {
    if (!accountSetId || !overview.closed) return
    Modal.confirm({
      title: '系统提示',
      content: `反结账会影响历史报表数据，将撤销 ${monthLabel} 及之后的结账，确认继续吗？`,
      onOk: async () => {
        setSubmitting(true)
        try {
          const resp = await fmsClosingPeriodCancelClosePeriod({
            accountSetId: String(accountSetId),
            month
          })
          if (resp.code === 0) {
            message.success('反结账成功')
            const nextMonth = (await fmsStore.loadCurrentMonth()) || currentMonth
            setCurrentMonth(nextMonth)
            setMonth(nextMonth)
            await getOverview(nextMonth)
          }
        } finally {
          setSubmitting(false)
        }
      }
    })
  }

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {/* 会计期间 */}
      <Card>
        <Form layout="inline">
          <Form.Item label="会计期间">
            <DatePicker
              picker="month"
              format="YYYY年MM月"
              allowClear={false}
              value={dayjs(`${month}-01`)}
              disabledDate={(date) => {
                const selected = date.startOf('month')
                const latest = dayjs().startOf('month')
                return (
                  selected.isBefore(dayjs(`${startMonth}-01`), 'month') ||
                  selected.isAfter(latest, 'month')
                )
              }}
              onChange={(date) => {
                if (date) {
                  const next = date.format('YYYY-MM')
                  setMonth(next)
                  getOverview(next)
                }
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              icon={<ReloadOutlined />}
              loading={loading}
              onClick={() => getOverview()}
            >
              刷新
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 期末结转方案 */}
      {Boolean(accountSetId) && (
        <ClosingSchemeList
          accountSetId={accountSetId!}
          month={month}
          currentPeriod={isCurrentPeriod}
          closed={Boolean(overview.closed)}
          voucherCount={overview.voucherCount || 0}
          profitLossBalance={overview.profitLossBalance || 0}
          onSuccess={() => getOverview()}
        />
      )}

      {/* 结账检查 */}
      <Card>
        <Alert
          message={overview.closed ? `${monthLabel} 已结账` : `${monthLabel} 尚未结账`}
          type={overview.closed ? 'success' : 'info'}
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Spin spinning={loading}>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}>
              <ClosingStatusCard
                title="凭证审核"
                value={`${overview.pendingVoucherCount || 0} 张待审核`}
                tagType={
                  !overview.voucherReviewRequired || overview.pendingVoucherCount === 0
                    ? 'success'
                    : 'danger'
                }
                tagLabel={
                  overview.voucherReviewRequired ? '结账前必须审核' : '当前未强制审核'
                }
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <ClosingStatusCard
                title="初始余额"
                value={overview.initialBalanceBalanced ? '试算平衡' : '试算不平衡'}
                tagType={overview.initialBalanceBalanced ? 'success' : 'danger'}
                tagLabel={overview.initialBalanceBalanced ? '检查通过' : '需要处理'}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <ClosingStatusCard
                title="凭证编号"
                value={overview.voucherNumberContinuous ? '编号连续' : '存在断号'}
                tagType={overview.voucherNumberContinuous ? 'success' : 'danger'}
                tagLabel={overview.voucherNumberContinuous ? '检查通过' : '需要整理'}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <ClosingStatusCard
                title="损益结转"
                value={formatMoney(overview.profitLossBalance)}
                tagType={
                  overview.profitLossVoucherGenerated && overview.profitLossBalance === 0
                    ? 'success'
                    : 'warning'
                }
                tagLabel={
                  !overview.profitLossVoucherGenerated
                    ? '未生成结转凭证'
                    : overview.profitLossBalance === 0
                      ? '已结平'
                      : '待结转'
                }
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <ClosingStatusCard
                title="利润表检查"
                value={
                  overview.incomeStatementUnmappedSubjectCount
                    ? `${overview.incomeStatementUnmappedSubjectCount} 个科目未纳入公式`
                    : overview.incomeStatementBalanced
                      ? '勾稽平衡'
                      : '勾稽不平衡'
                }
                tagType={
                  overview.incomeStatementBalanced &&
                  overview.incomeStatementUnmappedSubjectCount === 0
                    ? 'success'
                    : 'danger'
                }
                tagLabel={
                  overview.incomeStatementBalanced &&
                  overview.incomeStatementUnmappedSubjectCount === 0
                    ? '检查通过'
                    : '需要处理'
                }
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <ClosingStatusCard
                title="资产负债平衡"
                value={`差额 ${formatMoney(overview.balanceSheetDifference)}`}
                tagType={
                  overview.balanceSheetProfitLossTransferred &&
                  overview.balanceSheetBalanced &&
                  overview.balanceSheetUnmappedSubjectCount === 0
                    ? 'success'
                    : 'danger'
                }
                tagLabel={balanceSheetCheckLabel}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <ClosingStatusCard
                title="期间状态"
                value={overview.closed ? '已结账' : '未结账'}
                tagType={overview.closed ? 'success' : 'info'}
                tagLabel={overview.closed ? '账簿已锁定' : '允许继续记账'}
              />
            </Col>
          </Row>
        </Spin>
      </Card>

      {/* 执行结账 */}
      <Card title="执行结账">
        <Space>
          {fmsStore.isAccountSetWritable && !overview.closed && !isBeforeCurrentPeriod && (
            <HasPermi value="fms:closing:close">
              <Button
                type="primary"
                loading={submitting}
                disabled={!canClose}
                onClick={closeToPeriod}
              >
                {isCurrentPeriod ? '结账' : `结账到 ${monthLabel}`}
              </Button>
            </HasPermi>
          )}
          {fmsStore.isAccountSetWritable && overview.closed && (
            <HasPermi value="fms:closing:cancel">
              <Button danger loading={submitting} onClick={cancelToPeriod}>
                {isCurrentPeriod ? '反结账' : `反结账到 ${monthLabel}`}
              </Button>
            </HasPermi>
          )}
          {!overview.closed && !isBeforeCurrentPeriod && !canClose && (
            <Typography.Text type="warning">完成上方检查后才可结账</Typography.Text>
          )}
          {!overview.closed && isBeforeCurrentPeriod && (
            <Typography.Text type="warning">
              结账目标不能早于当前会计期间 {currentMonthLabel}
            </Typography.Text>
          )}
        </Space>
      </Card>
    </Space>
  )
}

export default FmsClosing
