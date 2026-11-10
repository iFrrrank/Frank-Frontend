import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Card, Modal, Pagination, message } from 'antd'
import { PageContainer } from '@ant-design/pro-components'
import * as PerformanceAssessmentApi from '@/api/hrm/portal/performance'
import {
  HrmPerformanceAssessmentStageStatus,
  HrmPerformanceStageType
} from '@/pages/hrm/performance/constants'
import { checkHrmPortalAccess } from '@/pages/hrm/portal/utils'
import PerformanceTaskTabs from './PerformanceTaskTabs'
import PerformanceTaskTable from './PerformanceTaskTable'
import PerformanceAssessmentDetail, { type PerformanceAssessmentDetailRef } from './detail'
import PerformanceAppealForm, {
  type PerformanceAppealFormRef
} from './process/PerformanceAppealForm'
import PerformanceHandleForm, {
  type PerformanceHandleFormRef
} from './process/PerformanceHandleForm'
import PerformanceTargetConfirmForm, {
  type PerformanceTargetConfirmFormRef
} from './process/PerformanceTargetConfirmForm'
import PerformanceQuotaForm, { type PerformanceQuotaFormRef } from './review/PerformanceQuotaForm'
import PerformanceReviewForm, {
  type PerformanceReviewFormRef
} from './review/PerformanceReviewForm'

const HrmPortalPerformanceAssessmentPage: React.FC = () => {
  const [accessible, setAccessible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<number>(HrmPerformanceStageType.FILL_QUOTA)
  const [activeStatus, setActiveStatus] = useState<number>(
    HrmPerformanceAssessmentStageStatus.PENDING
  )
  const [keyword, setKeyword] = useState('')
  const [list, setList] = useState<PerformanceAssessmentApi.PortalPerformanceAssessmentVO[]>([])
  const [total, setTotal] = useState(0)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [taskCount, setTaskCount] = useState<PerformanceAssessmentApi.PortalPerformanceTaskCountVO>(
    {
      fillPendingCount: 0,
      fillCompletedCount: 0,
      targetPendingCount: 0,
      targetCompletedCount: 0,
      reviewPendingCount: 0,
      reviewCompletedCount: 0,
      resultAuditPendingCount: 0,
      resultAuditCompletedCount: 0,
      resultConfirmationPendingCount: 0,
      resultConfirmationCompletedCount: 0,
      resultConfirmationAppealedCount: 0,
      appealPendingCount: 0,
      appealCompletedCount: 0
    }
  )

  const detailRef = useRef<PerformanceAssessmentDetailRef>(null)
  const quotaFormRef = useRef<PerformanceQuotaFormRef>(null)
  const targetConfirmFormRef = useRef<PerformanceTargetConfirmFormRef>(null)
  const reviewFormRef = useRef<PerformanceReviewFormRef>(null)
  const appealFormRef = useRef<PerformanceAppealFormRef>(null)
  const resultAuditFormRef = useRef<PerformanceHandleFormRef>(null)
  const appealHandleFormRef = useRef<PerformanceHandleFormRef>(null)

  const statusTabs = useMemo(() => {
    if (activeTab === HrmPerformanceStageType.FILL_QUOTA) {
      return [
        {
          label: '待填写',
          name: HrmPerformanceAssessmentStageStatus.PENDING,
          count: taskCount.fillPendingCount || 0
        },
        {
          label: '已填写',
          name: HrmPerformanceAssessmentStageStatus.PROCESSED,
          count: taskCount.fillCompletedCount || 0
        }
      ]
    }
    if (activeTab === HrmPerformanceStageType.TARGET_CONFIRM) {
      return [
        {
          label: '待确认',
          name: HrmPerformanceAssessmentStageStatus.PENDING,
          count: taskCount.targetPendingCount || 0
        },
        {
          label: '已确认',
          name: HrmPerformanceAssessmentStageStatus.PROCESSED,
          count: taskCount.targetCompletedCount || 0
        }
      ]
    }
    if (activeTab === HrmPerformanceStageType.OTHER_SCORE) {
      return [
        {
          label: '待评分',
          name: HrmPerformanceAssessmentStageStatus.PENDING,
          count: taskCount.reviewPendingCount || 0
        },
        {
          label: '已评分',
          name: HrmPerformanceAssessmentStageStatus.PROCESSED,
          count: taskCount.reviewCompletedCount || 0
        }
      ]
    }
    if (activeTab === HrmPerformanceStageType.RESULT_AUDIT) {
      return [
        {
          label: '待审核',
          name: HrmPerformanceAssessmentStageStatus.PENDING,
          count: taskCount.resultAuditPendingCount || 0
        },
        {
          label: '已审核',
          name: HrmPerformanceAssessmentStageStatus.PROCESSED,
          count: taskCount.resultAuditCompletedCount || 0
        }
      ]
    }
    if (activeTab === HrmPerformanceStageType.RESULT_CONFIRM) {
      return [
        {
          label: '待确认结果',
          name: HrmPerformanceAssessmentStageStatus.PENDING,
          count: taskCount.resultConfirmationPendingCount || 0
        },
        {
          label: '已确认',
          name: HrmPerformanceAssessmentStageStatus.PROCESSED,
          count: taskCount.resultConfirmationCompletedCount || 0
        },
        {
          label: '已申诉',
          name: HrmPerformanceAssessmentStageStatus.APPEALED,
          count: taskCount.resultConfirmationAppealedCount || 0
        }
      ]
    }
    return [
      {
        label: '待确认',
        name: HrmPerformanceAssessmentStageStatus.PENDING,
        count: taskCount.appealPendingCount || 0
      },
      {
        label: '已确认',
        name: HrmPerformanceAssessmentStageStatus.PROCESSED,
        count: taskCount.appealCompletedCount || 0
      }
    ]
  }, [activeTab, taskCount])

  const getTaskPage = async (params: {
    pageNo: number
    pageSize: number
    search?: string
    stageStatus?: number
  }) => {
    if (activeTab === HrmPerformanceStageType.FILL_QUOTA) {
      return await PerformanceAssessmentApi.getPerformanceAssessmentFillQuotaTaskPage(params)
    }
    if (activeTab === HrmPerformanceStageType.TARGET_CONFIRM) {
      return await PerformanceAssessmentApi.getPerformanceAssessmentTargetConfirmationTaskPage(
        params
      )
    }
    if (activeTab === HrmPerformanceStageType.OTHER_SCORE) {
      return await PerformanceAssessmentApi.getPerformanceAssessmentReviewTaskPage(params)
    }
    if (activeTab === HrmPerformanceStageType.RESULT_AUDIT) {
      return await PerformanceAssessmentApi.getPerformanceAssessmentResultAuditTaskPage(params)
    }
    if (activeTab === HrmPerformanceStageType.RESULT_CONFIRM) {
      return await PerformanceAssessmentApi.getPerformanceAssessmentResultConfirmationTaskPage(
        params
      )
    }
    return await PerformanceAssessmentApi.getPerformanceAssessmentAppealTaskPage(params)
  }

  const getList = async (
    page = pageNo,
    size = pageSize,
    tab = activeTab,
    status = activeStatus,
    kw = keyword
  ) => {
    setLoading(true)
    try {
      const resp = await getTaskPage({
        pageNo: page,
        pageSize: size,
        search: kw.trim() || undefined,
        stageStatus: status
      })
      setList(resp.data?.list || [])
      setTotal(resp.data?.total || 0)
    } finally {
      setLoading(false)
    }
  }

  const getTaskCount = async (kw = keyword) => {
    try {
      const resp = await PerformanceAssessmentApi.getPerformanceAssessmentTaskCount(
        kw.trim() || undefined
      )
      setTaskCount(resp.data || ({} as any))
    } catch {}
  }

  const loadData = async (
    page = pageNo,
    size = pageSize,
    tab = activeTab,
    status = activeStatus,
    kw = keyword
  ) => {
    await Promise.all([getList(page, size, tab, status, kw), getTaskCount(kw)])
  }

  const handleMainTabChange = (tab: number) => {
    setActiveTab(tab)
    setActiveStatus(HrmPerformanceAssessmentStageStatus.PENDING)
    setPageNo(1)
    loadData(1, pageSize, tab, HrmPerformanceAssessmentStageStatus.PENDING, keyword)
  }

  const handleStatusTabChange = (status: number) => {
    setActiveStatus(status)
    setPageNo(1)
    getList(1, pageSize, activeTab, status, keyword)
  }

  const handleSearch = () => {
    setPageNo(1)
    loadData(1, pageSize, activeTab, activeStatus, keyword)
  }

  const handleConfirmResult = (id?: number) => {
    if (!id) return
    Modal.confirm({
      title: '确认当前绩效结果？',
      content: '确认后将进入后续流程。',
      onOk: async () => {
        try {
          await PerformanceAssessmentApi.confirmPerformanceAssessmentResult({
            assessmentId: id,
            pass: 1,
            comment: '结果确认'
          })
          message.success('绩效结果已确认')
          loadData()
        } catch (err: any) {
          message.error(err?.message || '确认失败')
        }
      }
    })
  }

  useEffect(() => {
    const init = async () => {
      const ok = await checkHrmPortalAccess()
      if (!ok) return
      setAccessible(true)
      await loadData()
    }
    init()
  }, [])

  if (!accessible) {
    return null
  }

  return (
    <PageContainer header={{ title: '我的绩效' }}>
      <Card>
        <PerformanceTaskTabs
          activeTab={activeTab}
          onActiveTabChange={handleMainTabChange}
          activeStatus={activeStatus}
          onActiveStatusChange={handleStatusTabChange}
          keyword={keyword}
          onKeywordChange={setKeyword}
          onSearch={handleSearch}
          taskCount={taskCount}
          statusTabs={statusTabs}
        />

        <PerformanceTaskTable
          activeTab={activeTab}
          activeStatus={activeStatus}
          loading={loading}
          list={list}
          onDetail={(row) => detailRef.current?.open(row, activeTab)}
          onQuota={(id) => quotaFormRef.current?.open(id)}
          onResultConfirm={handleConfirmResult}
          onAppeal={(id) => id && appealFormRef.current?.open(id)}
          onTargetConfirm={(assessmentId, stageId) =>
            targetConfirmFormRef.current?.open(assessmentId, stageId)
          }
          onReview={(assessmentId, stageId) => reviewFormRef.current?.open(assessmentId, stageId)}
          onResultAudit={(assessmentId, stageId) =>
            resultAuditFormRef.current?.open(assessmentId, stageId)
          }
          onAppealHandle={(assessmentId, stageId) =>
            appealHandleFormRef.current?.open(assessmentId, stageId)
          }
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <Pagination
            current={pageNo}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            showQuickJumper
            onChange={(page, size) => {
              setPageNo(page)
              setPageSize(size)
              getList(page, size)
            }}
          />
        </div>
      </Card>

      <PerformanceAssessmentDetail ref={detailRef} />
      <PerformanceQuotaForm ref={quotaFormRef} onSuccess={loadData} />
      <PerformanceTargetConfirmForm ref={targetConfirmFormRef} onSuccess={loadData} />
      <PerformanceReviewForm ref={reviewFormRef} onSuccess={loadData} />
      <PerformanceAppealForm ref={appealFormRef} onSuccess={loadData} />
      <PerformanceHandleForm ref={resultAuditFormRef} mode="result-audit" onSuccess={loadData} />
      <PerformanceHandleForm ref={appealHandleFormRef} mode="appeal" onSuccess={loadData} />
    </PageContainer>
  )
}

export default HrmPortalPerformanceAssessmentPage
