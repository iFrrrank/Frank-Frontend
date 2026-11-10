import React, { useEffect, useState } from 'react'
import { Dropdown, message } from 'antd'
import { BookOutlined, CheckOutlined, DownOutlined, SettingOutlined } from '@ant-design/icons'
import { history, useLocation } from '@umijs/max'
import { useFmsStore } from '../../store/fms'
import FmsAccountSetGuide from './FmsAccountSetGuide'

/**
 * 顶部导航栏账套切换组件（仅在 /fms 路由下显示）
 */
const FmsAccountSetSwitch: React.FC = () => {
  const location = useLocation()
  const fmsStore = useFmsStore()
  const [open, setOpen] = useState(false)

  const isFmsRoute = location.pathname.startsWith('/fms')

  useEffect(() => {
    if (isFmsRoute) {
      fmsStore.loadAccountSetList()
    }
  }, [isFmsRoute, location.pathname])

  if (!isFmsRoute) return null

  const currentAccountSet = fmsStore.accountSet

  const handleSelect = (item: API.FmsAccountSetRespVO) => {
    setOpen(false)
    if (!item.initialized) {
      message.warning(`账套“${item.companyName}”尚未初始化，请先在账套管理中点击【开始记账】`)
      return
    }
    if (item.id === currentAccountSet?.id) return
    fmsStore.setAccountSet({
      id: item.id,
      companyName: item.companyName,
      level: item.level
    })
    message.success(`已切换到账套：${item.companyName}`)
  }

  return (
    <>
      <Dropdown
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen)
          if (nextOpen) {
            fmsStore.loadAccountSetList()
          }
        }}
        trigger={['click']}
        popupRender={() => (
          <div
            style={{
              background: '#fff',
              borderRadius: 8,
              boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08)',
              minWidth: 220,
              padding: '4px 0'
            }}
          >
            <div style={{ maxHeight: 280, overflowY: 'auto' }}>
              {fmsStore.accountSetList.map((item) => {
                const isSelected = item.id === currentAccountSet?.id
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 14px',
                      cursor: 'pointer',
                      color: isSelected ? '#1677ff' : 'rgba(0,0,0,0.88)',
                      fontWeight: isSelected ? 600 : 400,
                      background: isSelected ? '#e6f4ff' : 'transparent'
                    }}
                  >
                    <span
                      style={{
                        maxWidth: 165,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {item.companyName}
                    </span>
                    {isSelected && <CheckOutlined style={{ color: '#1677ff' }} />}
                  </div>
                )
              })}
              {fmsStore.accountSetList.length === 0 && (
                <div
                  style={{
                    padding: '12px 14px',
                    textAlign: 'center',
                    color: 'rgba(0,0,0,0.45)',
                    fontSize: 12
                  }}
                >
                  暂无可用账套
                </div>
              )}
            </div>
            <div
              onClick={() => {
                setOpen(false)
                history.push('/fms/config/account-set')
              }}
              style={{
                borderTop: '1px solid #f0f0f0',
                padding: '8px 14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: 'rgba(0,0,0,0.65)',
                fontSize: 13
              }}
            >
              <SettingOutlined />
              <span>账套管理</span>
            </div>
          </div>
        )}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '0 10px',
            height: 32,
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 13,
            border: '1px solid #d9d9d9',
            backgroundColor: '#fafafa'
          }}
        >
          <BookOutlined style={{ color: '#1677ff' }} />
          <span
            style={{
              maxWidth: 150,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {currentAccountSet ? currentAccountSet.companyName : '未选择账套'}
          </span>
          <DownOutlined style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }} />
        </div>
      </Dropdown>
      <FmsAccountSetGuide />
    </>
  )
}

export default FmsAccountSetSwitch
