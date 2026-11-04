import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Card, Modal, Input, Tabs, message } from 'antd'
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { history } from '@umijs/max'
import {
  getRecruitPostPage,
  getRecruitPostStatusCount,
  updateRecruitPostStatus
} from '@/api/hrm/recruit/post'
import { HrmEmployeeEntryStatusEnum, HrmRecruitPostStatusEnum } from '@/utils/constants'
import {
  RECRUIT_JOB_NATURE,
  RECRUIT_POST_EDUCATION,
  RECRUIT_POST_STATUS,
  RECRUIT_WORK_TIME
} from '@/utils/constantsValue'
import { textConst } from '@/locales/zh-CN'
import { tableActionStyle } from '@/styles/common.style'
import {
  formatDateTime,
  formatRecruitPostAge,
  formatRecruitPostSalary,
  formatRecruitPostSchedule
} from '../format'
import AreaSelect from '@/pages/hrm/insurance/components/AreaSelect'
import DeptSelect from '@/pages/hrm/employee/components/DeptSelect'
import HrmEmployeeSelect from '@/pages/hrm/employee/components/HrmEmployeeSelect'
import RecruitPostForm from './RecruitPostForm'

const STATUS_TABS = [
  {
    status: HrmRecruitPostStatusEnum.RECRUITING.status,
    name: HrmRecruitPostStatusEnum.RECRUITING.name
  },
  { status: HrmRecruitPostStatusEnum.STOPPED.status, name: HrmRecruitPostStatusEnum.STOPPED.name }
]

const RecruitPostPage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [activeStatus, setActiveStatus] = useState<string>(
    String(HrmRecruitPostStatusEnum.RECRUITING.status)
  )
  const [statusCounts, setStatusCounts] = useState<Record<number, number>>({})
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  const activeStatusValue = Number(activeStatus)

  // 查询状态数量
  const queryStatusCount = useCallback(async (params: any = {}) => {
    try {
      const resp = await getRecruitPostStatusCount({
        pageReqVO: {
          pageNo: 1,
          pageSize: 10,
          ...params
        }
      } as API.getRecruitPostStatusCountParams)
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
  }, [])

  useEffect(() => {
    queryStatusCount()
  }, [queryStatusCount])

  const reload = () => {
    actionRef.current?.reload()
    queryStatusCount()
  }

  // 修改状态（开启/停止招聘）
  const handleToggleStatus = (record: API.HrmRecruitPostRespVO) => {
    if (!record.id) return
    const isRecruiting = record.status === HrmRecruitPostStatusEnum.RECRUITING.status

    if (isRecruiting) {
      let stopReason = ''
      Modal.confirm({
        title: '停止招聘',
        icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
        content: (
          <div style={{ marginTop: 12 }}>
            <Input.TextArea
              placeholder="请输入停止原因，例如：岗位暂停"
              maxLength={255}
              onChange={(e) => {
                stopReason = e.target.value
              }}
            />
          </div>
        ),
        okText: textConst.common.ok,
        cancelText: textConst.common.cancel,
        onOk: async () => {
          if (!stopReason.trim()) {
            message.warning('停止原因不能为空')
            return Promise.reject()
          }
          try {
            await updateRecruitPostStatus({
              id: record.id!,
              status: HrmRecruitPostStatusEnum.STOPPED.status,
              stopReason: stopReason.trim()
            })
            message.success(textConst.msg.updateSuccess)
            reload()
          } catch {
            message.error(textConst.msg.updateError)
          }
        }
      })
    } else {
      Modal.confirm({
        title: textConst.msg.confirmTitle,
        icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
        content: `确认要重新开启职位"${record.postName}"的招聘吗？`,
        okText: textConst.common.ok,
        cancelText: textConst.common.cancel,
        onOk: async () => {
          try {
            await updateRecruitPostStatus({
              id: record.id!,
              status: HrmRecruitPostStatusEnum.RECRUITING.status
            })
            message.success(textConst.msg.updateSuccess)
            reload()
          } catch {
            message.error(textConst.msg.updateError)
          }
        }
      })
    }
  }

  const columns: ProColumns<API.HrmRecruitPostRespVO>[] = [
    {
      title: '职位名称',
      dataIndex: 'postName',
      align: 'center',
      width: 180,
      fixed: 'left',
      render: (_, record) => (
        <a
          onClick={() => {
            history.push(`/hrm/recruit/post/detail?id=${record.id}`)
          }}
        >
          {record.postName}
        </a>
      )
    },
    {
      title: '用人部门',
      dataIndex: 'deptId',
      align: 'center',
      width: 130,
      render: (_, record) => record.deptName || '-',
      renderFormItem: () => <DeptSelect placeholder="请选择用人部门" />
    },
    {
      title: '工作性质',
      dataIndex: 'jobNature',
      align: 'center',
      width: 100,
      valueType: 'select',
      valueEnum: RECRUIT_JOB_NATURE
    },
    {
      title: '工作城市',
      dataIndex: 'areaId',
      align: 'center',
      width: 160,
      render: (_, record) => record.areaName || '-',
      renderFormItem: () => <AreaSelect placeholder="请选择工作城市" />
    },
    {
      title: '招聘人数',
      dataIndex: 'recruitNum',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '已入职人数',
      dataIndex: 'hasEntryNum',
      align: 'center',
      width: 110,
      hideInSearch: true,
      render: (_, record) => record.hasEntryNum ?? 0
    },
    {
      title: '招聘进度',
      dataIndex: 'recruitSchedule',
      align: 'center',
      width: 100,
      hideInSearch: true,
      render: (_, record) => formatRecruitPostSchedule(record)
    },
    {
      title: '工作经验',
      dataIndex: 'workTime',
      align: 'center',
      width: 110,
      hideInSearch: true,
      valueType: 'select',
      valueEnum: RECRUIT_WORK_TIME
    },
    {
      title: '学历要求',
      dataIndex: 'educationRequire',
      align: 'center',
      width: 120,
      hideInSearch: true,
      valueType: 'select',
      valueEnum: RECRUIT_POST_EDUCATION
    },
    {
      title: '薪资范围',
      dataIndex: 'minSalary',
      align: 'center',
      width: 150,
      hideInSearch: true,
      render: (_, record) => formatRecruitPostSalary(record)
    },
    {
      title: '年龄要求',
      dataIndex: 'minAge',
      align: 'center',
      width: 120,
      hideInSearch: true,
      render: (_, record) => formatRecruitPostAge(record)
    },
    {
      title: '最迟到岗时间',
      dataIndex: 'latestEntryTime',
      align: 'center',
      width: 170,
      hideInSearch: true,
      render: (_, record) => formatDateTime(record.latestEntryTime)
    },
    {
      title: '招聘负责人',
      dataIndex: 'ownerEmployeeId',
      align: 'center',
      width: 130,
      render: (_, record) => record.ownerEmployeeName || '-',
      renderFormItem: () => (
        <HrmEmployeeSelect
          entryStatus={HrmEmployeeEntryStatusEnum.ACTIVE.entryStatus}
          placeholder="请选择招聘负责人"
          title="选择招聘负责人"
        />
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 170,
      hideInSearch: true,
      render: (_, record) => formatDateTime(record.createTime)
    },
    {
      title: textConst.table.action,
      valueType: 'option',
      align: 'center',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a
            key="edit"
            onClick={() => {
              setCurrentId(record.id)
              setFormVisible(true)
            }}
          >
            {textConst.action.update}
          </a>
          <a key="status" onClick={() => handleToggleStatus(record)}>
            {record.status === HrmRecruitPostStatusEnum.RECRUITING.status ? '停止招聘' : '开启招聘'}
          </a>
        </div>
      )
    }
  ]

  const tabItems = STATUS_TABS.map((item) => ({
    key: String(item.status),
    label: `${item.name}（${statusCounts[item.status] || 0}）`
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card variant="borderless">
        <Tabs
          activeKey={activeStatus}
          onChange={(key) => {
            setActiveStatus(key)
            actionRef.current?.reloadAndRest?.()
          }}
          items={tabItems}
        />
        <ProTable<API.HrmRecruitPostRespVO>
          headerTitle="招聘职位"
          actionRef={actionRef}
          rowKey="id"
          columns={columns}
          cardBordered
          form={{ colon: false }}
          search={{ labelWidth: 'auto', defaultCollapsed: false }}
          options={false}
          scroll={{ x: 'max-content' }}
          pagination={{ align: 'center', showSizeChanger: true }}
          toolBarRender={() => [
            <Button
              key="create"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setCurrentId(undefined)
                setFormVisible(true)
              }}
            >
              新增
            </Button>
          ]}
          request={async (params) => {
            const { current, pageSize, postName, deptId, jobNature, areaId, ownerEmployeeId } =
              params
            try {
              const resp = await getRecruitPostPage({
                pageReqVO: {
                  pageNo: current || 1,
                  pageSize: pageSize || 10,
                  status: activeStatusValue,
                  ...(postName ? { postName } : {}),
                  ...(deptId ? { deptId: Number(deptId) } : {}),
                  ...(jobNature !== undefined ? { jobNature: Number(jobNature) } : {}),
                  ...(areaId ? { areaId: Number(areaId) } : {}),
                  ...(ownerEmployeeId ? { ownerEmployeeId: Number(ownerEmployeeId) } : {})
                }
              } as API.getRecruitPostPageParams)
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

      <RecruitPostForm
        visible={formVisible}
        setVisible={setFormVisible}
        id={currentId}
        onSuccess={() => {
          setFormVisible(false)
          reload()
        }}
      />
    </div>
  )
}

export default RecruitPostPage
