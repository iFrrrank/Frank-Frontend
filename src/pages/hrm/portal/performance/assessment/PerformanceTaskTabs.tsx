import React from 'react'
import { Badge, Input, Tabs } from 'antd'
import type { PortalPerformanceTaskCountVO } from '@/api/hrm/portal/performance'
import { HrmPerformanceStageType } from '@/pages/hrm/performance/constants'

export interface PerformanceTaskTabsProps {
  activeTab: number
  onActiveTabChange: (tab: number) => void
  activeStatus: number
  onActiveStatusChange: (status: number) => void
  keyword: string
  onKeywordChange: (keyword: string) => void
  onSearch: () => void
  taskCount: PortalPerformanceTaskCountVO
  statusTabs: Array<{ label: string; name: number; count: number }>
}

const PerformanceTaskTabs: React.FC<PerformanceTaskTabsProps> = ({
  activeTab,
  onActiveTabChange,
  activeStatus,
  onActiveStatusChange,
  keyword,
  onKeywordChange,
  onSearch,
  taskCount,
  statusTabs
}) => {
  const mainTabs = [
    {
      label: '指标填写',
      key: String(HrmPerformanceStageType.FILL_QUOTA),
      count: taskCount.fillPendingCount || 0
    },
    {
      label: '指标确认',
      key: String(HrmPerformanceStageType.TARGET_CONFIRM),
      count: taskCount.targetPendingCount || 0
    },
    {
      label: '指标评分',
      key: String(HrmPerformanceStageType.OTHER_SCORE),
      count: taskCount.reviewPendingCount || 0
    },
    {
      label: '结果审核',
      key: String(HrmPerformanceStageType.RESULT_AUDIT),
      count: taskCount.resultAuditPendingCount || 0
    },
    {
      label: '结果确认',
      key: String(HrmPerformanceStageType.RESULT_CONFIRM),
      count: taskCount.resultConfirmationPendingCount || 0
    },
    {
      label: '申诉确认',
      key: String(HrmPerformanceStageType.APPEAL_CONFIRM),
      count: taskCount.appealPendingCount || 0
    }
  ]

  const mainTabItems = mainTabs.map((item) => ({
    key: item.key,
    label: (
      <span>
        {item.label}
        {item.count > 0 && (
          <Badge
            count={item.count}
            size="small"
            style={{ marginLeft: 6, backgroundColor: '#1890ff' }}
          />
        )}
      </span>
    )
  }))

  const subTabItems = statusTabs.map((item) => ({
    key: String(item.name),
    label: (
      <span>
        {item.label}
        {item.count > 0 && <span style={{ marginLeft: 5, color: '#1890ff' }}>{item.count}</span>}
      </span>
    )
  }))

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 20
        }}
      >
        <Tabs
          activeKey={String(activeTab)}
          onChange={(key) => onActiveTabChange(Number(key))}
          items={mainTabItems}
          style={{ flex: 1, marginBottom: 0 }}
        />
        <Input.Search
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          onSearch={onSearch}
          placeholder="请输入姓名/工号/考核名称"
          allowClear
          style={{ width: 260, marginTop: 8 }}
        />
      </div>

      <Tabs
        activeKey={String(activeStatus)}
        onChange={(key) => onActiveStatusChange(Number(key))}
        items={subTabItems}
        size="small"
        style={{ marginBottom: 12 }}
      />
    </div>
  )
}

export default PerformanceTaskTabs
