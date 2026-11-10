import React from 'react'
import { Button, Popover } from 'antd'
import { KeyOutlined } from '@ant-design/icons'

interface ShortcutItem {
  key: string
  description: string
}

const VOUCHER_SHORTCUTS: ShortcutItem[] = [
  { key: 'F12', description: '保存并新增' },
  { key: 'Ctrl+S', description: '保存凭证' },
  { key: 'Alt+N', description: '新增空白凭证' },
  { key: 'Enter', description: '切换到下一个输入框；最后一行自动新增分录' },
  { key: '=', description: '在借贷金额格自动找平差额' },
  { key: '↑ ↓ ← →', description: '在分录输入框之间移动焦点' }
]

/**
 * 凭证录入快捷键提示组件
 */
const FmsVoucherShortcutHelp: React.FC = () => {
  return (
    <Popover
      placement="bottomRight"
      trigger="hover"
      content={
        <div style={{ width: 320 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>快捷键列表</div>
          {VOUCHER_SHORTCUTS.map((item) => (
            <div
              key={item.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: '6px 0',
                fontSize: 12,
                borderTop: '1px solid #f0f0f0'
              }}
            >
              <kbd
                style={{
                  border: '1px solid #d9d9d9',
                  borderRadius: 4,
                  backgroundColor: '#fafafa',
                  padding: '2px 8px',
                  fontFamily: 'monospace'
                }}
              >
                {item.key}
              </kbd>
              <span style={{ color: 'rgba(0,0,0,0.65)', textAlign: 'right' }}>
                {item.description}
              </span>
            </div>
          ))}
        </div>
      }
    >
      <Button type="text" size="small" icon={<KeyOutlined />} title="快捷键说明" />
    </Popover>
  )
}

export default FmsVoucherShortcutHelp

