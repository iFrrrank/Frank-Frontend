import React, { useState } from 'react'
import { theme } from 'antd'

interface SurveyStatProps {
  label: React.ReactNode
  value: React.ReactNode
  // 数值旁的单位（待办提醒使用）
  unit?: string
  disabled?: boolean
  // 是否显示右侧分隔线
  divider?: boolean
  // 分隔线是否加深（用于首项与其他项区分）
  strongDivider?: boolean
  // 右侧外边距
  marginRight?: number
  minHeight?: number
  valueFontSize?: number
  onClick?: () => void
}

/**
 * 工作台统计项：上方大数字，下方说明，可点击跳转。
 * 禁用时不展示悬停高亮，对应 Vue 版中 cursor-default 的按钮。
 */
const SurveyStat: React.FC<SurveyStatProps> = ({
  label,
  value,
  unit,
  disabled,
  divider,
  strongDivider,
  marginRight,
  minHeight = 88,
  valueFontSize = 24,
  onClick
}) => {
  const { token } = theme.useToken()
  const [hover, setHover] = useState(false)
  const active = hover && !disabled
  const textColor = active ? token.colorPrimary : undefined

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        minHeight,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: 0,
        borderRight: divider
          ? `1px solid ${strongDivider ? token.colorBorder : token.colorBorderSecondary}`
          : 0,
        marginRight,
        background: 'transparent',
        cursor: disabled ? 'default' : 'pointer'
      }}
    >
      <strong
        style={{
          fontSize: valueFontSize,
          lineHeight: `${valueFontSize + 8}px`,
          color: textColor || token.colorText
        }}
      >
        {value}
      </strong>
      <span
        style={{
          marginTop: 8,
          fontSize: 13,
          color: textColor || token.colorTextSecondary
        }}
      >
        {label}
      </span>
      {unit ? (
        <small
          style={{
            position: 'absolute',
            left: 'calc(50% + 18px)',
            top: 18,
            color: token.colorTextPlaceholder
          }}
        >
          {unit}
        </small>
      ) : null}
    </button>
  )
}

export default SurveyStat
