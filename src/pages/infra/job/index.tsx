import React, { useRef, useState } from 'react'
import { Button, Dropdown, MenuProps, message, Modal, Space, Switch } from 'antd'
import {
  DeleteOutlined,
  DownloadOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  UnorderedListOutlined
} from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { history } from '@umijs/max'
import {
  deleteJob,
  exportJob,
  getJobPage,
  JobVO,
  triggerJob,
  updateJobStatus
} from '@/api/infra/job'
import JobForm from './JobForm'
import JobDetail from './JobDetail'
import { textConstants } from '@/locales/zh-CN'

export const JOB_STATUS_OPTIONS = [
  { label: '正常', value: 0 },
  { label: '暂停', value: 1 }
]

const JobPage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)

  const [formVisible, setFormVisible] = useState(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  const [detailVisible, setDetailVisible] = useState(false)
  const [detailId, setDetailId] = useState<number | undefined>(undefined)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const handleCreate = () => {
    setCurrentId(undefined)
    setFormVisible(true)
  }

  const handleUpdate = (id: number) => {
    setCurrentId(id)
    setFormVisible(true)
  }

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: textConstants.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '确认删除该定时任务？',
      okText: textConstants.common.ok,
      cancelText: textConstants.common.cancel,
      onOk: async () => {
        try {
          await deleteJob(id)
          message.success(textConstants.msg.delSuccess)
          actionRef.current?.reload()
        } catch {
          message.error(textConstants.msg.delFail)
        }
      }
    })
  }

  const handleUpdateStatus = async (record: JobVO) => {
    try {
      const newStatus = record.status === 0 ? 1 : 0
      await updateJobStatus(record.id, newStatus)
      message.success(newStatus === 0 ? '已开启任务' : '已暂停任务')
      actionRef.current?.reload()
    } catch {
      message.error('状态修改失败')
    }
  }

  const handleTrigger = (id: number) => {
    Modal.confirm({
      title: textConstants.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '确认要立即执行一次该任务吗？',
      okText: textConstants.common.ok,
      cancelText: textConstants.common.cancel,
      onOk: async () => {
        try {
          await triggerJob(id)
          message.success('执行成功')
        } catch {
          message.error('执行失败')
        }
      }
    })
  }

  const handleDetail = (id: number) => {
    setDetailId(id)
    setDetailVisible(true)
  }

  const handleGoLog = (id?: number) => {
    let url = '/infra/job/job-log'
    if (id !== undefined) url += `?jobId=${id}`
    history.push(url)
  }

  const getMenu = (record: JobVO): MenuProps => ({
    items: [
      {
        key: '1',
        label: '执行一次',
        onClick: () => handleTrigger(record.id)
      },
      {
        key: '2',
        label: '任务详情',
        onClick: () => handleDetail(record.id)
      },
      {
        key: '3',
        label: '调度日志',
        onClick: () => handleGoLog(record.id)
      }
    ]
  })

  /** 导出 */
  const handleExport = async () => {
    try {
      const resp = await exportJob({
        pageNo: '1',
        pageSize: '100'
      })
      const blob = new Blob([resp], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = '定时任务.xlsx'
      link.click()
      window.URL.revokeObjectURL(url)
      message.success('导出成功')
    } catch {
      message.error('导出失败')
    }
  }

  const columns: ProColumns<JobVO>[] = [
    {
      title: '任务编号',
      dataIndex: 'id',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '任务名称',
      dataIndex: 'name',
      align: 'center',
      fieldProps: { placeholder: `${textConstants.common.inputText}任务名称` }
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      align: 'center',
      valueType: 'select',
      valueEnum: JOB_STATUS_OPTIONS.reduce(
        (acc, cur) => {
          acc[cur.value] = { text: cur.label, status: cur.value === 0 ? 'Success' : 'Error' }
          return acc
        },
        {} as Record<string, any>
      ),
      fieldProps: { placeholder: 'textConstants.common.selectText任务状态' },
      render: (_, record) => (
        <Switch
          checked={record.status === 0}
          checkedChildren="开启"
          unCheckedChildren="暂停"
          onChange={() => handleUpdateStatus(record)}
        />
      )
    },
    {
      title: '处理器的名字',
      dataIndex: 'handlerName',
      align: 'center',
      fieldProps: { placeholder: `${textConstants.common.inputText}处理器的名字` }
    },
    {
      title: '处理器的参数',
      dataIndex: 'handlerParam',
      align: 'center',
      hideInSearch: true
    },
    {
      title: 'CRON 表达式',
      dataIndex: 'cronExpression',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 220,
      render: (_, record) => (
        <Space size={12}>
          <a onClick={() => handleUpdate(record.id)} style={{ color: '#1677ff' }}>
            修改
          </a>
          <a onClick={() => handleDelete(record.id)} style={{ color: '#ff4d4f' }}>
            删除
          </a>
          <Dropdown menu={getMenu(record)}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                更多
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </Space>
      )
    }
  ]

  return (
    <>
      <ProTable<JobVO>
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys
        }}
        columns={columns}
        actionRef={actionRef}
        cardBordered
        form={{ colon: false }}
        request={async (params) => {
          const { current, pageSize, ...rest } = params
          try {
            const resp = await getJobPage({
              pageNo: current || 1,
              pageSize: pageSize || 10,
              ...rest
            })
            return {
              data: resp.data?.list || [],
              success: true,
              total: resp.data?.total || 0
            }
          } catch (e) {
            message.error('获取定时任务列表失败')
            return { data: [], success: false, total: 0 }
          }
        }}
        rowKey="id"
        search={{ labelWidth: 'auto', defaultCollapsed: false }}
        options={{ reload: true, setting: true, density: true }}
        pagination={{ align: 'center', showSizeChanger: true }}
        headerTitle={false}
        toolBarRender={() => [
          <Button key="create" type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新增
          </Button>,
          <Button
            key="delete"
            danger
            icon={<DeleteOutlined />}
            style={{ color: '#ff4d4f', borderColor: '#ff4d4f', background: '#fff1f0' }}
            disabled={selectedRowKeys.length === 0}
            onClick={() => {
              if (selectedRowKeys && selectedRowKeys.length > 0) {
                message.warning('尚未对接批量删除接口')
              }
            }}
          >
            批量删除
          </Button>,
          <Button
            key="export"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            style={{ color: '#52c41a', borderColor: '#52c41a', background: '#f6ffed' }}
          >
            导出
          </Button>,
          <Button key="log" icon={<UnorderedListOutlined />} onClick={() => handleGoLog()}>
            执行日志
          </Button>
        ]}
      />

      {formVisible && (
        <JobForm
          visible={formVisible}
          setVisible={setFormVisible}
          id={currentId}
          onSuccess={() => {
            setFormVisible(false)
            actionRef.current?.reload()
          }}
        />
      )}

      {detailVisible && (
        <JobDetail visible={detailVisible} setVisible={setDetailVisible} id={detailId} />
      )}
    </>
  )
}

export default JobPage
