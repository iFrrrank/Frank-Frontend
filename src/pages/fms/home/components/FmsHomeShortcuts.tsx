import React from 'react'
import { Card, Col, Row } from 'antd'
import {
  AccountBookOutlined,
  BarChartOutlined,
  CarryOutOutlined,
  EditOutlined,
  FileSearchOutlined,
  PieChartOutlined
} from '@ant-design/icons'
import { history } from '@umijs/max'
import { useHasPermi } from '@/directives/permission/HasPermi'
import { useFmsStore } from '../../store/fms'

interface ShortcutItem {
  label: string
  path: string
  icon: React.ReactNode
  bg: string
  color: string
  permission: string
  writeOnly?: boolean
}

const SHORTCUTS: ShortcutItem[] = [
  {
    label: '录凭证',
    path: '/fms/voucher/create',
    icon: <EditOutlined style={{ fontSize: 22 }} />,
    bg: '#e6f4ff',
    color: '#1677ff',
    permission: 'fms:voucher:create',
    writeOnly: true
  },
  {
    label: '查凭证',
    path: '/fms/voucher/list',
    icon: <FileSearchOutlined style={{ fontSize: 22 }} />,
    bg: '#f6ffed',
    color: '#52c41a',
    permission: 'fms:voucher:query'
  },
  {
    label: '看总账',
    path: '/fms/ledger/general',
    icon: <AccountBookOutlined style={{ fontSize: 22 }} />,
    bg: '#e6fffb',
    color: '#13c2c2',
    permission: 'fms:ledger:general:query'
  },
  {
    label: '科目余额',
    path: '/fms/ledger/subject-balance',
    icon: <BarChartOutlined style={{ fontSize: 22 }} />,
    bg: '#fff7e6',
    color: '#fa8c16',
    permission: 'fms:ledger:subject-balance:query'
  },
  {
    label: '资产负债表',
    path: '/fms/report/balance-sheet',
    icon: <PieChartOutlined style={{ fontSize: 22 }} />,
    bg: '#f9f0ff',
    color: '#722ed1',
    permission: 'fms:report:balance-sheet:query'
  },
  {
    label: '期末结账',
    path: '/fms/closing/period',
    icon: <CarryOutOutlined style={{ fontSize: 22 }} />,
    bg: '#fff1f0',
    color: '#f5222d',
    permission: 'fms:closing:query'
  }
]

/**
 * 财务首页快捷入口组件
 */
const FmsHomeShortcuts: React.FC = () => {
  const hasPermi = useHasPermi()
  const fmsStore = useFmsStore()

  const visibleShortcuts = SHORTCUTS.filter(
    (item) => (!item.writeOnly || fmsStore.isAccountSetWritable) && hasPermi(item.permission)
  )

  return (
    <Card title="快捷入口" variant="borderless" style={{ height: '100%' }}>
      <Row gutter={[16, 16]}>
        {visibleShortcuts.map((item) => (
          <Col xs={12} sm={8} md={4} key={item.path}>
            <div
              onClick={() => history.push(item.path)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '16px 8px',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: '1px solid #f0f0f0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fafafa'
                e.currentTarget.style.borderColor = '#d9d9d9'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.borderColor = '#f0f0f0'
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  backgroundColor: item.bg,
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {item.icon}
              </div>
              <span style={{ fontSize: 13, color: 'rgba(0, 0, 0, 0.85)' }}>{item.label}</span>
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  )
}

export default FmsHomeShortcuts
