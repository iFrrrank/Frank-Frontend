import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { formatAmount } from '../../utils/format'

interface FmsHomeMetricCardsProps {
  home?: API.FmsHomeRespVO
  selectedMetricKey?: string
  onSelect: (metric: API.Metric) => void
}

const CARD_SCROLL_OFFSET = 468 // 单次滚动的卡片组宽度（两个卡片宽度 + 间距）

/**
 * 财务首页核心指标卡片横向滚动列表
 */
const FmsHomeMetricCards: React.FC<FmsHomeMetricCardsProps> = ({
  home,
  selectedMetricKey,
  onSelect
}) => {
  const cardScrollerRef = useRef<HTMLDivElement | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  /** 更新左右滚动按钮的可用状态 */
  const updateScrollState = () => {
    const scroller = cardScrollerRef.current
    if (!scroller) return
    setCanScrollLeft(scroller.scrollLeft > 1)
    setCanScrollRight(scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1)
  }

  useEffect(() => {
    const timer = window.setTimeout(updateScrollState, 50)
    window.addEventListener('resize', updateScrollState)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [home?.metrics])

  /** 按一个卡片组的宽度滚动指标卡片 */
  const scrollCards = (direction: -1 | 1) => {
    cardScrollerRef.current?.scrollBy({
      left: direction * CARD_SCROLL_OFFSET,
      behavior: 'smooth'
    })
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f0f0f0',
          paddingBottom: 14
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 600, color: 'rgba(0,0,0,0.88)' }}>财务指标</div>
        <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>
          {home?.currentMonth} 当期数据
        </div>
      </div>

      <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button
          shape="circle"
          icon={<LeftOutlined />}
          disabled={!canScrollLeft}
          onClick={() => scrollCards(-1)}
        />
        <div
          ref={cardScrollerRef}
          onScroll={updateScrollState}
          style={{
            display: 'flex',
            minWidth: 0,
            flex: 1,
            gap: 14,
            overflowX: 'auto',
            padding: '4px 0',
            scrollbarWidth: 'none'
          }}
        >
          {(home?.metrics || []).map((metric) => {
            const isSelected = selectedMetricKey === metric.key
            return (
              <button
                key={metric.key}
                type="button"
                onClick={() => onSelect(metric)}
                style={{
                  height: 108,
                  width: 220,
                  flex: 'none',
                  border: `1px solid ${isSelected ? '#1677ff' : '#f0f0f0'}`,
                  borderRadius: 6,
                  backgroundColor: isSelected ? '#1677ff' : '#fff',
                  color: isSelected ? '#fff' : 'rgba(0,0,0,0.88)',
                  padding: '0 20px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  boxShadow: isSelected
                    ? '0 4px 12px rgba(22, 119, 255, 0.25)'
                    : '0 1px 2px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.2s'
                }}
              >
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {metric.name}
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 22,
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontVariantNumeric: 'tabular-nums'
                  }}
                >
                  {formatAmount(metric.amount)}
                </div>
              </button>
            )
          })}
        </div>
        <Button
          shape="circle"
          icon={<RightOutlined />}
          disabled={!canScrollRight}
          onClick={() => scrollCards(1)}
        />
      </div>
    </div>
  )
}

export default FmsHomeMetricCards
