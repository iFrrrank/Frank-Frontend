import React, { useState } from 'react'
import { message, Modal } from 'antd'
import { ModalForm, ProFormRadio, ProFormTextArea } from '@ant-design/pro-components'
import {
  agreeAfterSale,
  disagreeAfterSale,
  receiveAfterSale,
  refundAfterSale,
  refuseAfterSale
} from '@/api/mall/trade/afterSale'
import { textConst } from '@/locales/zh-CN'

export let handleAuditAfterSale: (record: any, onSuccess: () => void) => void
export let handleReceiveAfterSale: (record: any, onSuccess: () => void) => void
export let handleRefundAfterSale: (record: any, onSuccess: () => void) => void

// 售后处理动作集合：审核（同意/拒绝）、收货（确认/拒绝）、退款（确认）
// 三个弹窗共用同一组件文件，由列表页按售后状态分别触发
const AfterSaleActions: React.FC = () => {
  const [auditVisible, setAuditVisible] = useState(false)
  const [receiveVisible, setReceiveVisible] = useState(false)
  const [current, setCurrent] = useState<any>(null)
  const [successCallback, setSuccessCallback] = useState<() => void>(() => () => {})
  // 审核结果：agree 同意 / disagree 拒绝
  const [auditResult, setAuditResult] = useState<'agree' | 'disagree'>('agree')
  // 收货结果：receive 确认收货 / refuse 拒绝收货
  const [receiveResult, setReceiveResult] = useState<'receive' | 'refuse'>('receive')

  handleAuditAfterSale = (record: any, onSuccess: () => void) => {
    setCurrent(record)
    setSuccessCallback(() => onSuccess)
    setAuditResult('agree')
    setAuditVisible(true)
  }

  handleReceiveAfterSale = (record: any, onSuccess: () => void) => {
    setCurrent(record)
    setSuccessCallback(() => onSuccess)
    setReceiveResult('receive')
    setReceiveVisible(true)
  }

  handleRefundAfterSale = (record: any, onSuccess: () => void) => {
    Modal.confirm({
      title: '确认退款',
      content: `确定要为售后单（编号：${record.id}）确认退款吗？退款将原路退回给买家。`,
      okText: '确认退款',
      cancelText: '取消',
      onOk: async () => {
        const resp = await refundAfterSale({ id: record.id } as any)
        if (resp.code === 0) {
          message.success('退款成功')
          onSuccess()
        } else {
          message.error(resp.msg || textConst.error.operationFail)
        }
      }
    })
  }

  return (
    <>
      {/* 审核弹窗：同意直接通过，拒绝需填写审批备注 */}
      <ModalForm
        title="售后审核"
        open={auditVisible}
        onOpenChange={setAuditVisible}
        width={520}
        modalProps={{ destroyOnHidden: true }}
        onFinish={async (values) => {
          if (!current) {
            return false
          }
          try {
            const resp =
              auditResult === 'agree'
                ? await agreeAfterSale({ id: current.id } as any)
                : await disagreeAfterSale({
                    id: current.id,
                    auditReason: values.auditReason
                  } as any)
            if (resp.code === 0) {
              message.success(auditResult === 'agree' ? '已同意售后' : '已拒绝售后')
              successCallback()
              return true
            }
            message.error(resp.msg || textConst.error.operationFail)
            return false
          } catch {
            message.error(textConst.error.operationFail)
            return false
          }
        }}
      >
        <ProFormRadio.Group
          label="审核结果"
          options={[
            { label: '同意售后', value: 'agree' },
            { label: '拒绝售后', value: 'disagree' }
          ]}
          fieldProps={{
            value: auditResult,
            onChange: (e) => setAuditResult(e.target.value)
          }}
        />
        {auditResult === 'disagree' && (
          <ProFormTextArea
            name="auditReason"
            label="审批备注"
            rules={[{ required: true, message: '请输入拒绝原因' }]}
            placeholder="请输入拒绝原因"
          />
        )}
      </ModalForm>

      {/* 收货弹窗：确认收货后进入待退款；拒绝收货需走 refuse 接口（仅传编号） */}
      <ModalForm
        title="售后收货"
        open={receiveVisible}
        onOpenChange={setReceiveVisible}
        width={520}
        modalProps={{ destroyOnHidden: true }}
        onFinish={async () => {
          if (!current) {
            return false
          }
          try {
            const resp =
              receiveResult === 'receive'
                ? await receiveAfterSale({ id: current.id } as any)
                : await refuseAfterSale({ id: current.id } as any)
            if (resp.code === 0) {
              message.success(receiveResult === 'receive' ? '已确认收货' : '已拒绝收货')
              successCallback()
              return true
            }
            message.error(resp.msg || textConst.error.operationFail)
            return false
          } catch {
            message.error(textConst.error.operationFail)
            return false
          }
        }}
      >
        <ProFormRadio.Group
          label="收货结果"
          options={[
            { label: '确认收货', value: 'receive' },
            { label: '拒绝收货', value: 'refuse' }
          ]}
          fieldProps={{
            value: receiveResult,
            onChange: (e) => setReceiveResult(e.target.value)
          }}
        />
      </ModalForm>
    </>
  )
}

export default AfterSaleActions
