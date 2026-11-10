import React, { useState } from 'react'
import { Button, Col, Modal, Progress, Row, Spin, Tag } from 'antd'
import { fmsInitialBalanceGetTrialBalance } from '@/api/fms/config/initialBalance'
import { formatAmount } from '../../utils/format'

export interface FmsTrialBalanceDialogRef {
  open: (accountSetId: number) => void
}

/**
 * 期初试算平衡检查弹窗
 */
const FmsTrialBalanceDialog = React.forwardRef<FmsTrialBalanceDialogRef>((_, ref) => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<API.FmsTrialBalanceRespVO>({
    openingDebitAmount: 0,
    openingCreditAmount: 0,
    openingDifferenceAmount: 0,
    yearDebitAmount: 0,
    yearCreditAmount: 0,
    yearDifferenceAmount: 0,
    balanced: true
  })

  React.useImperativeHandle(ref, () => ({
    open: async (accountSetId: number) => {
      setVisible(true)
      setLoading(true)
      try {
        const resp = await fmsInitialBalanceGetTrialBalance({ accountSetId })
        if (resp.code === 0 && resp.data) {
          setData(resp.data)
        }
      } finally {
        setLoading(false)
      }
    }
  }))

  const calcPercent = (current?: number, other?: number) => {
    const c = Math.abs(Number(current || 0))
    const o = Math.abs(Number(other || 0))
    const maxVal = Math.max(c, o)
    if (maxVal === 0) return 0
    return Math.round((c / maxVal) * 100)
  }

  const openingBalanced = Math.abs(Number(data.openingDifferenceAmount || 0)) < 0.005
  const yearBalanced = Math.abs(Number(data.yearDifferenceAmount || 0)) < 0.005

  return (
    <Modal
      title="试算平衡检查"
      open={visible}
      onCancel={() => setVisible(false)}
      width={680}
      footer={
        <Button type="primary" onClick={() => setVisible(false)}>
          关闭
        </Button>
      }
      destroyOnHidden
    >
      <Spin spinning={loading}>
        <Row gutter={16} style={{ marginTop: 12 }}>
          <Col span={12}>
            <div
              style={{
                border: '1px solid #f0f0f0',
                borderRadius: 8,
                padding: 16
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16
                }}
              >
                <span style={{ fontWeight: 600 }}>期初余额</span>
                <Tag color={openingBalanced ? 'success' : 'error'}>
                  {openingBalanced
                    ? '平衡'
                    : `不平衡（差额：${formatAmount(data.openingDifferenceAmount)}）`}
                </Tag>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 4
                  }}
                >
                  <span>借方</span>
                  <span>{formatAmount(data.openingDebitAmount)}</span>
                </div>
                <Progress
                  percent={calcPercent(data.openingDebitAmount, data.openingCreditAmount)}
                  showInfo={false}
                  strokeColor="#409eff"
                />
              </div>
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 4
                  }}
                >
                  <span>贷方</span>
                  <span>{formatAmount(data.openingCreditAmount)}</span>
                </div>
                <Progress
                  percent={calcPercent(data.openingCreditAmount, data.openingDebitAmount)}
                  showInfo={false}
                  strokeColor="#67c23a"
                />
              </div>
            </div>
          </Col>

          <Col span={12}>
            <div
              style={{
                border: '1px solid #f0f0f0',
                borderRadius: 8,
                padding: 16
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16
                }}
              >
                <span style={{ fontWeight: 600 }}>累计发生</span>
                <Tag color={yearBalanced ? 'success' : 'error'}>
                  {yearBalanced
                    ? '平衡'
                    : `不平衡（差额：${formatAmount(data.yearDifferenceAmount)}）`}
                </Tag>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 4
                  }}
                >
                  <span>借方</span>
                  <span>{formatAmount(data.yearDebitAmount)}</span>
                </div>
                <Progress
                  percent={calcPercent(data.yearDebitAmount, data.yearCreditAmount)}
                  showInfo={false}
                  strokeColor="#409eff"
                />
              </div>
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 4
                  }}
                >
                  <span>贷方</span>
                  <span>{formatAmount(data.yearCreditAmount)}</span>
                </div>
                <Progress
                  percent={calcPercent(data.yearCreditAmount, data.yearDebitAmount)}
                  showInfo={false}
                  strokeColor="#67c23a"
                />
              </div>
            </div>
          </Col>
        </Row>
      </Spin>
    </Modal>
  )
})

FmsTrialBalanceDialog.displayName = 'FmsTrialBalanceDialog'

export default FmsTrialBalanceDialog
