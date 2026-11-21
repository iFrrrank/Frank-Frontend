import React, { useEffect, useRef, useState } from 'react'
import { Button, Modal, Tag, message } from 'antd'
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components'
import { history, useSearchParams } from '@umijs/max'
import { textConst } from '@/locales/zh-CN'
import {
  deletePerformanceArchiveRecords,
  getPerformanceArchivePlanSimpleList,
  getPerformanceAssessmentArchivePage
} from '@/api/hrm/performance/assessment'
import { HrmPerformanceCycleTypeOptions, PERFORMANCE_STAGE_STATUS } from '../../constants'

// 员工绩效档案记录：某位员工在各计划中的考核结果，可按计划筛选、删除档案记录
const PerformanceAssessmentEmployeeArchive: React.FC = () => {
  const [searchParams] = useSearchParams()
  const employeeId = Number(searchParams.get('employeeId'))
  const actionRef = useRef<ActionType>(undefined)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [planOptions, setPlanOptions] = useState<{ label: string; value: number }[]>([])

  useEffect(() => {
    getPerformanceArchivePlanSimpleList().then((resp) => {
      setPlanOptions(
        ((resp.data || []) as any[]).map((item) => ({ label: item.name, value: item.id }))
      )
    })
  }, [])

  const columns: ProColumns<any>[] = [
    {
      title: '考核方案名称',
      dataIndex: 'name',
      width: 220,
      hideInSearch: true,
      render: (_, record) => (
        <a
          onClick={() =>
            history.push(`/hrm/performance/assessment/detail?id=${record.id}&archive=1`)
          }
        >
          {record.name}
        </a>
      )
    },
    {
      title: '考核计划',
      dataIndex: 'planId',
      hideInTable: true,
      valueType: 'select',
      fieldProps: { options: planOptions, placeholder: '请选择考核计划' }
    },
    {
      title: '周期类型',
      align: 'center',
      width: 110,
      hideInSearch: true,
      render: (_, record) =>
        HrmPerformanceCycleTypeOptions.find((o) => o.value === record.cycleType)?.label || '-'
    },
    {
      title: '考核周期',
      dataIndex: 'cycle',
      width: 140,
      hideInSearch: true,
      render: (_, record) => <span>{record.cycle || '-'}</span>
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
      title: '评分',
      dataIndex: 'score',
      align: 'center',
      width: 90,
      hideInSearch: true,
      render: (_, record) => <span>{record.score ?? '-'}</span>
    },
    {
      title: '考核结果',
      dataIndex: 'resultLevel',
      align: 'center',
      width: 100,
      hideInSearch: true,
      render: (_, record) => <span>{record.resultLevel || '-'}</span>
    },
    {
      title: '归档时间',
      dataIndex: 'archiveTime',
      align: 'center',
      width: 170,
      hideInSearch: true,
      render: (_, record) => <span>{record.archiveTime || '-'}</span>
    }
  ]

  return (
    <PageContainer title="员工考核记录" onBack={() => history.push('/hrm/performance/assessment')}>
      <ProTable<any>
        headerTitle="考核记录"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        search={{ labelWidth: 'auto', span: 6 }}
        request={async (params: Record<string, any>) => {
          const { current, pageSize, ...rest } = params
          const resp = await getPerformanceAssessmentArchivePage({
            pageNo: current || 1,
            pageSize: pageSize || 10,
            employeeId,
            ...rest
          } as any)
          return {
            data: resp.data?.list || [],
            success: true,
            total: resp.data?.total || 0
          }
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys)
        }}
        scroll={{ x: 'max-content' }}
        toolBarRender={() => [
          <Button
            key="delete"
            danger
            disabled={selectedRowKeys.length === 0}
            onClick={() =>
              Modal.confirm({
                title: textConst.msg.confirmTitle,
                content: '确认删除所选考核档案记录吗？',
                onOk: async () => {
                  await deletePerformanceArchiveRecords({
                    ids: selectedRowKeys.map(Number)
                  } as any)
                  message.success(textConst.msg.batchDelSuccess)
                  setSelectedRowKeys([])
                  actionRef.current?.reload()
                }
              })
            }
          >
            删除记录
          </Button>
        ]}
        pagination={{ align: 'center', showSizeChanger: true }}
      />
    </PageContainer>
  )
}

export default PerformanceAssessmentEmployeeArchive
