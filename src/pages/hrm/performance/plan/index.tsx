import React, { useRef, useState } from 'react'
import { Button, Modal, Tag, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { history } from '@umijs/max'
import PerformancePlanAssessmentAddForm from './PerformancePlanAssessmentAddForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'
import {
  archivePerformancePlan,
  deletePerformancePlan,
  getPerformancePlanPage,
  openPerformancePlanScoring,
  startPerformancePlan,
  startPerformancePlanInterview,
  terminatePerformancePlan
} from '@/api/hrm/performance/plan'
import {
  HrmPerformanceCycleTypeOptions,
  PERFORMANCE_PLAN_STATUS,
  PERFORMANCE_STAGE_STATUS
} from '../constants'
import dayjs from 'dayjs'

// 绩效计划列表：按状态提供启动/开启评分/开启面谈/归档/终止等操作
const PerformancePlanManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [addFormVisible, setAddFormVisible] = useState(false)
  const [currentPlanId, setCurrentPlanId] = useState<number>(0)

  const reload = () => actionRef.current?.reload()

  const confirmAction = (title: string, api: (params: any) => Promise<any>, id: number) => {
    Modal.confirm({
      title,
      onOk: async () => {
        await api({ id })
        message.success(textConst.msg.operationSuccess)
        reload()
      }
    })
  }

  const columns: ProColumns<any>[] = [
    {
      title: '计划名称',
      dataIndex: 'name',
      width: 220,
      fieldProps: { placeholder: '请输入计划名称' },
      render: (_, record) => (
        <a onClick={() => history.push(`/hrm/performance/plan/detail?id=${record.id}`)}>
          {record.name}
        </a>
      )
    },
    {
      title: '周期类型',
      dataIndex: 'cycleType',
      align: 'center',
      width: 100,
      valueType: 'select',
      fieldProps: { options: HrmPerformanceCycleTypeOptions },
      render: (_, record) => (
        <span>
          {HrmPerformanceCycleTypeOptions.find((o) => o.value === record.cycleType)?.label || '-'}
        </span>
      )
    },
    {
      title: '考核周期',
      dataIndex: 'cycle',
      align: 'center',
      width: 130,
      hideInSearch: true,
      render: (_, record) => <span>{record.cycle || '-'}</span>
    },
    {
      title: '起止日期',
      align: 'center',
      width: 200,
      hideInSearch: true,
      render: (_, record) =>
        `${record.startTime ? dayjs(record.startTime).format('YYYY-MM-DD') : '-'} ~ ${
          record.endTime ? dayjs(record.endTime).format('YYYY-MM-DD') : '-'
        }`
    },
    {
      title: '参评/完成',
      align: 'center',
      width: 110,
      hideInSearch: true,
      render: (_, record) => `${record.employeeCount ?? 0}/${record.finishedCount ?? 0}`
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      valueType: 'select',
      fieldProps: {
        options: Object.entries(PERFORMANCE_PLAN_STATUS).map(([value, item]) => ({
          label: item.label,
          value: Number(value)
        }))
      },
      render: (_, record) => {
        const item = PERFORMANCE_PLAN_STATUS[record.status]
        return item ? <Tag color={item.color}>{item.label}</Tag> : '-'
      }
    },
    {
      title: '当前阶段',
      align: 'center',
      width: 110,
      hideInSearch: true,
      render: (_, record) => {
        const item = PERFORMANCE_STAGE_STATUS[record.stageType]
        return item ? <Tag color={item.color}>{item.label}</Tag> : '-'
      }
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
      width: 300,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          {record.status === 1 && (
            <a onClick={() => history.push(`/hrm/performance/plan/form?id=${record.id}`)}>
              {textConst.action.update}
            </a>
          )}
          {(record.status === 1 || record.status === 2 || record.status === 3) && (
            <a
              onClick={() => {
                setCurrentPlanId(record.id)
                setAddFormVisible(true)
              }}
            >
              添加员工
            </a>
          )}
          {record.status === 1 && (
            <a
              onClick={() =>
                confirmAction('确认启动该绩效计划吗？', startPerformancePlan, record.id)
              }
            >
              启动
            </a>
          )}
          {record.scoringReady && (
            <a
              onClick={() =>
                confirmAction('确认开启评分吗？', openPerformancePlanScoring, record.id)
              }
            >
              开启评分
            </a>
          )}
          {record.interviewReady && (
            <a
              onClick={() =>
                confirmAction('确认开启绩效面谈吗？', startPerformancePlanInterview, record.id)
              }
            >
              开启面谈
            </a>
          )}
          {record.archiveReady && (
            <a
              onClick={() =>
                confirmAction('确认归档该绩效计划吗？', archivePerformancePlan, record.id)
              }
            >
              归档
            </a>
          )}
          {(record.status === 2 || record.status === 3) && (
            <a
              style={deleteTextStyle}
              onClick={() =>
                confirmAction('确认终止该绩效计划吗？', terminatePerformancePlan, record.id)
              }
            >
              终止
            </a>
          )}
          {record.status === 1 && (
            <a
              style={deleteTextStyle}
              onClick={() => handleDelete(record, deletePerformancePlan, reload)}
            >
              {textConst.action.delete}
            </a>
          )}
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<any>
        headerTitle="绩效计划"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        search={{ labelWidth: 'auto', span: 6 }}
        request={async (params: Record<string, any>) => {
          const { current, pageSize, ...rest } = params
          const resp = await getPerformancePlanPage({
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...rest
          } as any)
          return {
            data: resp.data?.list || [],
            success: true,
            total: resp.data?.total || 0
          }
        }}
        scroll={{ x: 'max-content' }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            onClick={() => history.push('/hrm/performance/plan/form')}
          >
            <PlusOutlined /> {textConst.action.create}
          </Button>
        ]}
        pagination={{ align: 'center', showSizeChanger: true }}
      />

      <PerformancePlanAssessmentAddForm
        visible={addFormVisible}
        setVisible={setAddFormVisible}
        onSuccess={reload}
        planId={currentPlanId}
      />
    </>
  )
}

export default PerformancePlanManagement
