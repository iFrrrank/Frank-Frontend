import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Card, Modal, Tabs, message } from 'antd'
import type { MenuProps } from 'antd'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import {
  deleteRecruitCandidate,
  getRecruitCandidatePage,
  getRecruitCandidateStatusCount
} from '@/api/hrm/recruit/candidate'
import { getRecruitInterview } from '@/api/hrm/recruit/interview'
import {
  HrmRecruitCandidateStatusEnum,
  HrmRecruitInterviewResultEnum
} from '@/utils/constants'
import {
  RECRUIT_CANDIDATE_EDUCATION,
  RECRUIT_CANDIDATE_STATUS,
  RECRUIT_INTERVIEW_RESULT,
  RECRUIT_INTERVIEW_TYPE,
  SEX_OPTIONS
} from '@/utils/constantsValue'
import { textConst } from '@/locales/zh-CN'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import CandidateSearchForm from './SearchForm'
import type { BatchCommand, CandidateSearchParams } from './SearchForm'
import CandidateForm from './CandidateForm'
import CandidateCleanForm from './CandidateCleanForm'
import CandidateStatusForm from './CandidateStatusForm'
import CandidatePostForm from './CandidatePostForm'
import CandidateChannelForm from './CandidateChannelForm'
import CandidateEliminateForm from './CandidateEliminateForm'
import CandidateInterviewForm from './CandidateInterviewForm'

const { confirm } = Modal

const STATUS_TABS = Object.values(HrmRecruitCandidateStatusEnum)

// 各状态下允许的批量操作
const BATCH_STATUS_TRANSITIONS: Record<number, number[]> = {
  [HrmRecruitCandidateStatusEnum.NEW.status]: [
    HrmRecruitCandidateStatusEnum.PRIMARY_PASS.status,
    HrmRecruitCandidateStatusEnum.INTERVIEW_PASS.status
  ],
  [HrmRecruitCandidateStatusEnum.PRIMARY_PASS.status]: [
    HrmRecruitCandidateStatusEnum.NEW.status,
    HrmRecruitCandidateStatusEnum.INTERVIEW_PASS.status
  ],
  [HrmRecruitCandidateStatusEnum.INTERVIEW_PASS.status]: [
    HrmRecruitCandidateStatusEnum.OFFER_SENT.status,
    HrmRecruitCandidateStatusEnum.NEW.status,
    HrmRecruitCandidateStatusEnum.PRIMARY_PASS.status
  ],
  [HrmRecruitCandidateStatusEnum.ELIMINATED.status]: [HrmRecruitCandidateStatusEnum.NEW.status]
}

// 允许安排面试的状态
const INTERVIEW_STATUSES = [
  HrmRecruitCandidateStatusEnum.NEW.status,
  HrmRecruitCandidateStatusEnum.PRIMARY_PASS.status,
  HrmRecruitCandidateStatusEnum.INTERVIEW_PASS.status
]

// 允许淘汰的状态
const ELIMINATE_STATUSES = [
  HrmRecruitCandidateStatusEnum.NEW.status,
  HrmRecruitCandidateStatusEnum.PRIMARY_PASS.status,
  HrmRecruitCandidateStatusEnum.INTERVIEW.status,
  HrmRecruitCandidateStatusEnum.INTERVIEW_PASS.status,
  HrmRecruitCandidateStatusEnum.OFFER_SENT.status,
  HrmRecruitCandidateStatusEnum.PENDING_ENTRY.status
]

// 允许删除的状态
const DELETE_STATUSES = [
  HrmRecruitCandidateStatusEnum.NEW.status,
  HrmRecruitCandidateStatusEnum.PRIMARY_PASS.status,
  HrmRecruitCandidateStatusEnum.INTERVIEW.status,
  HrmRecruitCandidateStatusEnum.INTERVIEW_PASS.status,
  HrmRecruitCandidateStatusEnum.ELIMINATED.status
]

const SEX_VALUE_ENUM = SEX_OPTIONS.reduce(
  (acc, item) => {
    acc[item.value] = { text: item.label }
    return acc
  },
  {} as Record<string, { text: string }>
)

const RecruitCandidatePage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [searchParams, setSearchParams] = useState<CandidateSearchParams>({})
  const [activeStatus, setActiveStatus] = useState<string>('all')
  const [statusCounts, setStatusCounts] = useState<Record<number, number>>({})
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)
  const [cleanVisible, setCleanVisible] = useState<boolean>(false)
  const [statusFormVisible, setStatusFormVisible] = useState<boolean>(false)
  const [postFormVisible, setPostFormVisible] = useState<boolean>(false)
  const [channelFormVisible, setChannelFormVisible] = useState<boolean>(false)
  const [eliminateVisible, setEliminateVisible] = useState<boolean>(false)
  const [interviewVisible, setInterviewVisible] = useState<boolean>(false)
  const [interviewCandidateId, setInterviewCandidateId] = useState<number | undefined>(undefined)
  const [interview, setInterview] = useState<API.HrmRecruitInterviewRespVO | undefined>(undefined)
  const [eliminateIds, setEliminateIds] = useState<number[]>([])
  const [eliminateName, setEliminateName] = useState<string>('')

  const selectedIds = useMemo(() => selectedRowKeys.map((key) => Number(key)), [selectedRowKeys])
  const activeStatusValue = activeStatus === 'all' ? undefined : Number(activeStatus)

  const queryStatusCount = useCallback(async () => {
    try {
      const resp = await getRecruitCandidateStatusCount({
        pageReqVO: { pageNo: 1, pageSize: 10, ...searchParams }
      } as API.getRecruitCandidateStatusCountParams)
      const counts = (resp.data || []).reduce(
        (acc, item) => {
          if (item.status !== undefined) {
            acc[item.status] = item.count || 0
          }
          return acc
        },
        {} as Record<number, number>
      )
      setStatusCounts(counts)
    } catch {
      setStatusCounts({})
    }
  }, [searchParams])

  useEffect(() => {
    queryStatusCount()
  }, [queryStatusCount])

  const reload = () => {
    actionRef.current?.reload()
    queryStatusCount()
  }

  const handleSearch = (values: CandidateSearchParams) => {
    setSelectedRowKeys([])
    setSearchParams(values)
    actionRef.current?.reloadAndRest?.()
  }

  const handleTabChange = (key: string) => {
    setActiveStatus(key)
    setSelectedRowKeys([])
    actionRef.current?.reloadAndRest?.()
  }

  const handleCreate = () => {
    setCurrentId(undefined)
    setFormVisible(true)
  }

  const handleUpdate = (id?: number) => {
    setCurrentId(id)
    setFormVisible(true)
  }

  const handleEliminate = (record: API.HrmRecruitCandidateRespVO) => {
    if (record.id === undefined) return
    setEliminateIds([record.id])
    setEliminateName(record.name || '')
    setEliminateVisible(true)
  }

  const handleDelete = (record: API.HrmRecruitCandidateRespVO) => {
    if (record.id === undefined) return
    confirm({
      title: textConst.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: `是否删除候选人「${record.name}」？`,
      okText: textConst.common.ok,
      cancelText: textConst.common.cancel,
      onOk: async () => {
        try {
          await deleteRecruitCandidate({ id: record.id as number })
          message.success(textConst.msg.delSuccess)
          reload()
        } catch {
          message.error(textConst.msg.delError)
        }
      }
    })
  }

  const handleOpenInterview = async (record: API.HrmRecruitCandidateRespVO) => {
    setInterviewCandidateId(record.id)
    if (record.interviewId) {
      try {
        const resp = await getRecruitInterview({ id: record.interviewId })
        setInterview(resp.data)
      } catch {
        setInterview(undefined)
      }
    } else {
      setInterview(undefined)
    }
    setInterviewVisible(true)
  }

  // 批量操作菜单：按当前页签状态动态控制可用性
  const batchMenuItems = useMemo<MenuProps['items']>(() => {
    const status = activeStatusValue
    const canUpdateStatus = status !== undefined && !!BATCH_STATUS_TRANSITIONS[status]
    const canInterview = status !== undefined && INTERVIEW_STATUSES.includes(status)
    const canEliminate = status !== undefined && ELIMINATE_STATUSES.includes(status)
    const canDelete = status !== undefined && DELETE_STATUSES.includes(status)
    const items: MenuProps['items'] = []
    if (canUpdateStatus) {
      items.push({ key: 'status', label: '批量流转' })
    }
    if (canInterview) {
      items.push({ key: 'interview', label: '批量面试' })
    }
    if (canUpdateStatus) {
      items.push({ key: 'post', label: '修改职位' }, { key: 'channel', label: '修改渠道' })
    }
    if (canEliminate) {
      items.push({ key: 'eliminate', label: '批量淘汰' })
    }
    if (canDelete) {
      items.push({ type: 'divider' }, { key: 'delete', label: '批量删除', danger: true })
    }
    return items
  }, [activeStatusValue])

  const batchDisabled = selectedIds.length === 0 || !batchMenuItems?.length

  const handleBatchCommand = (command: BatchCommand) => {
    if (!selectedIds.length) {
      message.warning(textConst.msg.delNoData)
      return
    }
    if (command === 'delete') {
      confirm({
        title: textConst.msg.confirmTitle,
        icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
        content: textConst.msg.delDataMsg,
        okText: textConst.common.ok,
        cancelText: textConst.common.cancel,
        onOk: async () => {
          try {
            await Promise.all(selectedIds.map((id) => deleteRecruitCandidate({ id })))
            message.success(textConst.msg.batchDelSuccess)
            setSelectedRowKeys([])
            reload()
          } catch {
            message.error(textConst.msg.batchDelError)
          }
        }
      })
      return
    }
    if (command === 'status') {
      setStatusFormVisible(true)
      return
    }
    if (command === 'post') {
      setPostFormVisible(true)
      return
    }
    if (command === 'channel') {
      setChannelFormVisible(true)
      return
    }
    if (command === 'eliminate') {
      setEliminateIds(selectedIds)
      setEliminateName('')
      setEliminateVisible(true)
      return
    }
    if (command === 'interview') {
      if (selectedIds.length > 1) {
        message.info('批量面试请逐个安排，暂仅支持单个候选人')
        return
      }
      setInterviewCandidateId(selectedIds[0])
      setInterview(undefined)
      setInterviewVisible(true)
    }
  }

  const columns: ProColumns<API.HrmRecruitCandidateRespVO>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      align: 'center',
      width: 110,
      fixed: 'left',
      hideInSearch: true
    },
    {
      title: '应聘职位',
      dataIndex: 'postName',
      align: 'center',
      width: 160,
      hideInSearch: true
    },
    {
      title: '用人部门',
      dataIndex: 'deptName',
      align: 'center',
      width: 130,
      hideInSearch: true
    },
    {
      title: '候选人状态',
      dataIndex: 'status',
      align: 'center',
      width: 130,
      hideInSearch: true,
      valueEnum: RECRUIT_CANDIDATE_STATUS,
      render: (_, record) => {
        const statusText = record.status !== undefined ? RECRUIT_CANDIDATE_STATUS[record.status]?.text : '-'
        const interviewResult = record.interviewResult
        const showResult =
          record.status === HrmRecruitCandidateStatusEnum.INTERVIEW.status &&
          interviewResult != null &&
          interviewResult !== HrmRecruitInterviewResultEnum.UNFINISHED.result
        return (
          <span>
            {statusText}
            {showResult ? `（${RECRUIT_INTERVIEW_RESULT[interviewResult]?.text}）` : ''}
          </span>
        )
      }
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
      align: 'center',
      width: 130,
      hideInSearch: true
    },
    {
      title: '性别',
      dataIndex: 'sex',
      align: 'center',
      width: 80,
      hideInSearch: true,
      valueEnum: SEX_VALUE_ENUM
    },
    {
      title: '年龄',
      dataIndex: 'age',
      align: 'center',
      width: 80,
      hideInSearch: true
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      align: 'center',
      width: 180,
      hideInSearch: true
    },
    {
      title: '招聘负责人',
      dataIndex: 'ownerEmployeeName',
      align: 'center',
      width: 130,
      hideInSearch: true
    },
    {
      title: '工作年限',
      dataIndex: 'workTime',
      align: 'center',
      width: 100,
      hideInSearch: true,
      render: (_, record) => (record.workTime != null ? `${record.workTime} 年` : '-')
    },
    {
      title: '学历',
      dataIndex: 'education',
      align: 'center',
      width: 90,
      hideInSearch: true,
      valueEnum: RECRUIT_CANDIDATE_EDUCATION
    },
    {
      title: '毕业院校',
      dataIndex: 'graduateSchool',
      align: 'center',
      width: 150,
      hideInSearch: true
    },
    {
      title: '最近工作单位',
      dataIndex: 'latestWorkPlace',
      align: 'center',
      width: 160,
      hideInSearch: true
    },
    {
      title: '招聘渠道',
      dataIndex: 'channelName',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '面试时间',
      dataIndex: 'interviewTime',
      align: 'center',
      width: 170,
      hideInSearch: true
    },
    {
      title: '面试轮次',
      dataIndex: 'stageNumber',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '主面试官',
      dataIndex: 'interviewEmployeeName',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '面试方式',
      dataIndex: 'interviewType',
      align: 'center',
      width: 110,
      hideInSearch: true,
      valueEnum: RECRUIT_INTERVIEW_TYPE
    },
    {
      title: '其他面试官',
      dataIndex: 'otherInterviewEmployeeNames',
      align: 'center',
      width: 150,
      hideInSearch: true,
      render: (_, record) => record.otherInterviewEmployeeNames?.join('、') || '-'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 170,
      hideInSearch: true
    },
    {
      title: textConst.table.action,
      valueType: 'option',
      align: 'center',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a key="edit" onClick={() => handleUpdate(record.id)}>
            {textConst.action.update}
          </a>
          {record.status !== undefined &&
            INTERVIEW_STATUSES.includes(record.status) && (
              <a key="interview" onClick={() => handleOpenInterview(record)}>
                安排面试
              </a>
            )}
          {record.status !== undefined && ELIMINATE_STATUSES.includes(record.status) && (
            <a key="eliminate" onClick={() => handleEliminate(record)}>
              淘汰
            </a>
          )}
          {record.status !== undefined && DELETE_STATUSES.includes(record.status) && (
            <a key="delete" style={deleteTextStyle} onClick={() => handleDelete(record)}>
              {textConst.action.delete}
            </a>
          )}
        </div>
      )
    }
  ]

  const totalCount = Object.values(statusCounts).reduce((sum, count) => sum + count, 0)

  const tabItems = [
    { key: 'all', label: `全部（${totalCount}）` },
    ...STATUS_TABS.map((item) => ({
      key: String(item.status),
      label: `${item.name}（${statusCounts[item.status] || 0}）`
    }))
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card variant="borderless" styles={{ body: { paddingBottom: 16 } }}>
        <CandidateSearchForm
          onSearch={handleSearch}
          onCreate={handleCreate}
          onClean={() => setCleanVisible(true)}
          onBatchCommand={handleBatchCommand}
          batchMenuItems={batchMenuItems}
          batchDisabled={batchDisabled}
        />
      </Card>

      <Card variant="borderless" styles={{ body: { paddingTop: 0 } }}>
        <Tabs activeKey={activeStatus} onChange={handleTabChange} items={tabItems} />
        <ProTable<API.HrmRecruitCandidateRespVO>
          actionRef={actionRef}
          rowKey="id"
          columns={columns}
          search={false}
          options={false}
          scroll={{ x: 'max-content' }}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys)
          }}
          pagination={{ align: 'center', showSizeChanger: true }}
          request={async (params) => {
            const { current, pageSize } = params
            try {
              const resp = await getRecruitCandidatePage({
                pageReqVO: {
                  pageNo: current || 1,
                  pageSize: pageSize || 10,
                  ...searchParams,
                  ...(activeStatusValue !== undefined ? { status: activeStatusValue } : {})
                }
              } as API.getRecruitCandidatePageParams)
              return {
                data: resp.data?.list || [],
                success: resp.code === 0,
                total: resp.data?.total || 0
              }
            } catch {
              return { data: [], success: false, total: 0 }
            }
          }}
        />
      </Card>

      <CandidateForm
        visible={formVisible}
        setVisible={setFormVisible}
        id={currentId}
        onSuccess={() => {
          setFormVisible(false)
          reload()
        }}
      />

      <CandidateCleanForm
        visible={cleanVisible}
        setVisible={setCleanVisible}
        onSuccess={() => {
          setCleanVisible(false)
          reload()
        }}
      />

      <CandidateStatusForm
        visible={statusFormVisible}
        setVisible={setStatusFormVisible}
        ids={selectedIds}
        fromStatus={activeStatusValue}
        onSuccess={() => {
          setStatusFormVisible(false)
          setSelectedRowKeys([])
          reload()
        }}
      />

      <CandidatePostForm
        visible={postFormVisible}
        setVisible={setPostFormVisible}
        ids={selectedIds}
        onSuccess={() => {
          setPostFormVisible(false)
          setSelectedRowKeys([])
          reload()
        }}
      />

      <CandidateChannelForm
        visible={channelFormVisible}
        setVisible={setChannelFormVisible}
        ids={selectedIds}
        onSuccess={() => {
          setChannelFormVisible(false)
          setSelectedRowKeys([])
          reload()
        }}
      />

      <CandidateEliminateForm
        visible={eliminateVisible}
        setVisible={setEliminateVisible}
        ids={eliminateIds}
        candidateName={eliminateName}
        onSuccess={() => {
          setEliminateVisible(false)
          setSelectedRowKeys([])
          reload()
        }}
      />

      <CandidateInterviewForm
        visible={interviewVisible}
        setVisible={setInterviewVisible}
        candidateId={interviewCandidateId}
        interview={interview}
        onSuccess={() => {
          setInterviewVisible(false)
          reload()
        }}
      />
    </div>
  )
}

export default RecruitCandidatePage
