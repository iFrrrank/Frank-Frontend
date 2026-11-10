import React, { useMemo } from 'react'
import { Alert, Button } from 'antd'
import { history } from '@umijs/max'
import { FMS_REPORT_TYPE } from '@/pages/fms/utils/constants'
import { formatMoney } from '@/pages/fms/utils/format'

export interface FmsReportCheckResult
  extends Partial<API.FmsBalanceSheetCheckRespVO>,
    Partial<API.FmsIncomeStatementCheckRespVO>,
    Partial<API.FmsCashFlowCheckRespVO> {}

interface FmsReportCheckAlertProps {
  result?: FmsReportCheckResult
  reportType: number
}

const FmsReportCheckAlert: React.FC<FmsReportCheckAlertProps> = ({
  result,
  reportType
}) => {
  const reportName = useMemo(() => {
    if (reportType === FMS_REPORT_TYPE.INCOME_STATEMENT) return '利润表'
    if (reportType === FMS_REPORT_TYPE.CASH_FLOW_STATEMENT) return '现金流量表'
    return '资产负债表'
  }, [reportType])

  const passed = useMemo(() => {
    if (!result) return false
    if (reportType === FMS_REPORT_TYPE.CASH_FLOW_STATEMENT) {
      return result.balanceSheetReady === true
    }
    return (
      result.balanced === true &&
      !(result.unmappedSubjects && result.unmappedSubjects.length > 0) &&
      (reportType === FMS_REPORT_TYPE.INCOME_STATEMENT ||
        (result.initialBalanceBalanced === true &&
          result.profitLossTransferred === true))
    )
  }, [result, reportType])

  const unmappedSubjectText = useMemo(() => {
    const subjects = result?.unmappedSubjects || []
    const text = subjects
      .slice(0, 5)
      .map((s) => `${s.code} ${s.name}`)
      .join('、')
    return subjects.length > 5 ? `${text} 等` : text
  }, [result?.unmappedSubjects])

  const formatCheckAmount = (amount?: number) => {
    return formatMoney(Math.abs(Number(amount || 0))) || '0.00'
  }

  if (!result) return null

  return (
    <Alert
      style={{ marginBottom: 12 }}
      type={passed ? 'success' : 'warning'}
      showIcon
      message={passed ? `${reportName}检查通过` : `${reportName}检查发现问题`}
      description={
        !passed ? (
          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {result.balanced === false &&
              reportType !== FMS_REPORT_TYPE.INCOME_STATEMENT && (
                <div>
                  资产负债表不平衡：年初差额{' '}
                  {formatCheckAmount(result.openingDifferenceAmount)}，期末差额{' '}
                  {formatCheckAmount(result.closingDifferenceAmount)}
                  {reportType === FMS_REPORT_TYPE.CASH_FLOW_STATEMENT && (
                    <Button
                      type="link"
                      style={{ padding: '0 4px' }}
                      onClick={() => history.push('/fms/report/balance-sheet')}
                    >
                      查看资产负债表
                    </Button>
                  )}
                </div>
              )}
            {result.balanced === false &&
              reportType === FMS_REPORT_TYPE.INCOME_STATEMENT && (
                <div>
                  净利润与未分配利润变动不一致，勾稽差额{' '}
                  {formatCheckAmount(result.differenceAmount)}
                  <Button
                    type="link"
                    style={{ padding: '0 4px' }}
                    onClick={() => history.push('/fms/report/balance-sheet')}
                  >
                    查看资产负债表
                  </Button>
                </div>
              )}
            {result.initialBalanceBalanced === false && (
              <div>
                初始余额试算不平衡
                <Button
                  type="link"
                  style={{ padding: '0 4px' }}
                  onClick={() => history.push('/fms/config/initial-balance')}
                >
                  处理初始余额
                </Button>
              </div>
            )}
            {result.profitLossTransferred === false && (
              <div>
                查询期间存在尚未结转的损益余额
                <Button
                  type="link"
                  style={{ padding: '0 4px' }}
                  onClick={() => history.push('/fms/closing/period')}
                >
                  前往结转损益
                </Button>
              </div>
            )}
            {result.unmappedSubjects && result.unmappedSubjects.length > 0 && (
              <div>
                {result.unmappedSubjects.length} 个一级科目尚未纳入报表公式：
                {unmappedSubjectText}
                {reportType === FMS_REPORT_TYPE.CASH_FLOW_STATEMENT ? (
                  <Button
                    type="link"
                    style={{ padding: '0 4px' }}
                    onClick={() => history.push('/fms/report/balance-sheet')}
                  >
                    查看报表公式
                  </Button>
                ) : (
                  <span>，请编辑当前报表公式</span>
                )}
              </div>
            )}
          </div>
        ) : undefined
      }
    />
  )
}

export default FmsReportCheckAlert
