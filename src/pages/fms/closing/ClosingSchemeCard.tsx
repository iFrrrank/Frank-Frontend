import React from 'react'
import { Button, Checkbox, Typography } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import HasPermi from '@/directives/permission/HasPermi'
import { useFmsStore } from '@/pages/fms/store/fms'
import { formatMoney } from '@/pages/fms/utils/format'

interface ClosingSchemeCardProps {
  name: string
  checked: boolean
  balance: number
  voucherIds: number[]
  generateDisabled: boolean
  onCheckedChange: (checked: boolean) => void
  onSettings: () => void
  onGenerate: () => void
  onOpenVoucher: (voucherId: number) => void
}

const ClosingSchemeCard: React.FC<ClosingSchemeCardProps> = ({
  name,
  checked,
  balance,
  voucherIds,
  generateDisabled,
  onCheckedChange,
  onSettings,
  onGenerate,
  onOpenVoucher
}) => {
  const fmsStore = useFmsStore()

  return (
    <div
      style={{
        overflow: 'hidden',
        borderRadius: 6,
        border: '1px solid #ebeef5',
        background: '#f5f7fa',
        padding: '0 10px 10px'
      }}
    >
      {/* 方案选择 */}
      <div
        style={{
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {fmsStore.isAccountSetWritable ? (
          <Checkbox checked={checked} onChange={(e) => onCheckedChange(e.target.checked)}>
            {name}
          </Checkbox>
        ) : (
          <span>{name}</span>
        )}
        {fmsStore.isAccountSetWritable && (
          <HasPermi value="fms:closing:update">
            <Button
              type="link"
              icon={<SettingOutlined />}
              style={{ padding: 0 }}
              onClick={onSettings}
            />
          </HasPermi>
        )}
      </div>

      {/* 待结转金额 */}
      <div
        style={{
          minHeight: 82,
          borderRadius: 5,
          background: '#fff',
          padding: 16,
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 600 }}>{formatMoney(balance)}</div>
        <div
          style={{
            marginTop: 8,
            minHeight: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12,
            color: '#909399'
          }}
        >
          <span>金额</span>
          {voucherIds.length > 0 && (
            <span
              style={{
                display: 'flex',
                maxWidth: 150,
                gap: 6,
                overflow: 'auto',
                whiteSpace: 'nowrap'
              }}
            >
              {voucherIds.map((voucherId) => (
                <Typography.Link key={voucherId} onClick={() => onOpenVoucher(voucherId)}>
                  凭证 #{voucherId}
                </Typography.Link>
              ))}
            </span>
          )}
        </div>
      </div>

      {/* 生成凭证 */}
      <div
        style={{
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end'
        }}
      >
        {fmsStore.isAccountSetWritable && (
          <HasPermi value="fms:closing:profit-loss">
            <Button
              type="link"
              disabled={generateDisabled}
              style={{ padding: 0 }}
              onClick={onGenerate}
            >
              {voucherIds.length ? '重新生成' : '生成凭证'}
            </Button>
          </HasPermi>
        )}
      </div>
    </div>
  )
}

export default ClosingSchemeCard
