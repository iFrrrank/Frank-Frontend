import React, { useEffect, useRef, useState } from 'react'
import { Button, message } from 'antd'
import {
  type ActionType,
  type ProColumns,
  type ProFormInstance,
  ProTable
} from '@ant-design/pro-components'
import { useLocation } from '@umijs/max'
import { exportJobLog, getJobLogPage, JobLogVO } from '@/api/infra/jobLog'
import { textConst } from '@/locales/zh-CN'
import { DownloadOutlined } from '@ant-design/icons'
import JobLogDetail from '@/pages/infra/job/jobLog/JobLogDetail'
import { handleExport } from '@/components/Export'
import { JOB_LOG_STATUS } from '@/utils/constantsValue'

const JobLogPage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const location = useLocation()

  const [detailVisible, setDetailVisible] = useState(false)
  const [detailId, setDetailId] = useState<number | undefined>(undefined)
  const [jobId, setJobId] = useState<number | undefined>(undefined)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const jId = params.get('jobId')
    if (jId) {
      setJobId(Number(jId))
    }
  }, [location])

  const handleDetail = (id: number) => {
    setDetailId(id)
    setDetailVisible(true)
  }

  const handleExportBtnClick = () => {
    // 获取表单当前的值
    const formValues = formRef.current?.getFieldsValue?.() || {}
    handleExport({
      exportApi: exportJobLog,
      exportParams: { ...formValues },
      fileName: '定时任务日志.xlsx'
    })
  }

  const columns: ProColumns<JobLogVO>[] = [
    {
      title: '日志编号',
      dataIndex: 'id',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '任务编号',
      dataIndex: 'jobId',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '处理器名称',
      dataIndex: 'handlerName',
      align: 'center',
      fieldProps: { placeholder: '请输入处理器的名字' }
    },
    {
      title: '处理器参数',
      dataIndex: 'handlerParam',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '第几次执行',
      dataIndex: 'executeIndex',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '开始执行时间',
      dataIndex: 'beginTime',
      align: 'center',
      valueType: 'dateRange',
      hideInTable: true,
      fieldProps: { placeholder: ['开始时间', '结束时间'] }
    },
    {
      title: '执行时间',
      dataIndex: 'beginTime',
      align: 'center',
      hideInSearch: true,
      render: (_, record) => (
        <>
          <div>开始: {record.beginTime}</div>
          <div>结束: {record.endTime}</div>
        </>
      )
    },
    {
      title: '执行时长',
      dataIndex: 'duration',
      align: 'center',
      hideInSearch: true,
      render: (_, record) => <span>{record.duration} 毫秒</span>
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      align: 'center',
      valueType: 'select',
      valueEnum: JOB_LOG_STATUS,
      fieldProps: { placeholder: '请输入任务状态' }
    },
    {
      title: textConst.form.operate,
      valueType: 'option',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <a key="detail" onClick={() => handleDetail(record.id)}>
          {textConst.action.detail}
        </a>
      )
    }
  ]

  return (
    <>
      <ProTable<JobLogVO>
        headerTitle="定时任务日志"
        columns={columns}
        actionRef={actionRef}
        formRef={formRef}
        cardBordered
        form={{ colon: false }}
        params={{ jobId }}
        request={async (params) => {
          const { current, pageSize, beginTime, ...rest } = params
          let beginTimeStr, endTimeStr
          if (beginTime && beginTime.length === 2) {
            beginTimeStr = beginTime[0] + ' 00:00:00'
            endTimeStr = beginTime[1] + ' 23:59:59'
          }
          try {
            const resp = await getJobLogPage({
              pageNo: current || 1,
              pageSize: pageSize || 10,
              ...(beginTimeStr && endTimeStr
                ? { beginTime: beginTimeStr, endTime: endTimeStr }
                : {}),
              ...rest
            })
            return {
              data: resp.data?.list || [],
              success: true,
              total: resp.data?.total || 0
            }
          } catch (e) {
            message.error('获取定时任务日志列表失败')
            return { data: [], success: false, total: 0 }
          }
        }}
        rowKey="id"
        search={{ labelWidth: 'auto', span: 6, defaultCollapsed: false }}
        options={{ reload: true, setting: true, density: true }}
        pagination={{ align: 'center', showSizeChanger: true }}
        toolBarRender={() => [
          <Button
            key="export"
            color="volcano"
            variant="outlined"
            icon={<DownloadOutlined />}
            onClick={handleExportBtnClick}
          >
            {textConst.action.export}
          </Button>
        ]}
      />

      {detailVisible && (
        <JobLogDetail visible={detailVisible} setVisible={setDetailVisible} id={detailId} />
      )}
    </>
  )
}

export default JobLogPage
