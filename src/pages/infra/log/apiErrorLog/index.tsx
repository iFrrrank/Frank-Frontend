import React, { useRef, useState } from 'react'
import { Button, Drawer, message, Modal, Space, Tag, Typography } from 'antd'
import { DownloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import {
  exportApiErrorLogExcel,
  getApiErrorLogPage,
  updateApiErrorLogProcess
} from '@/api/infra/apiErrorLog'
import { textConst } from '@/locales/zh-CN'
import { tableActionStyle } from '@/styles/common.style'

const ApiErrorLogPage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<API.InfraApiErrorLogRespVO | null>(null)

  const handleUpdateStatus = (id: number, processStatus: number, statusText: string) => {
    Modal.confirm({
      title: textConst.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: `确认标记为${statusText}？`,
      okText: textConst.common.ok,
      cancelText: textConst.common.cancel,
      onOk: async () => {
        try {
          const resp = await updateApiErrorLogProcess({ id, processStatus })
          if (resp && resp.data) {
            message.success(`已标记为${statusText}`)
            actionRef.current?.reload()
          } else {
            message.error(textConst.error.operationFail)
          }
        } catch (e) {
          console.error(e)
          message.error(textConst.error.operationFail)
        }
      }
    })
  }

  const columns: ProColumns<API.InfraApiErrorLogRespVO>[] = [
    {
      title: '日志 ID',
      dataIndex: 'id',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '用户编号',
      dataIndex: 'userId',
      align: 'center',
      width: 100,
      fieldProps: { placeholder: '请输入用户编号' }
    },
    {
      title: '用户类型',
      dataIndex: 'userType',
      align: 'center',
      width: 100,
      valueType: 'select',
      valueEnum: {
        1: { text: '会员', status: 'Default' },
        2: { text: '管理员', status: 'Processing' }
      },
      fieldProps: { placeholder: '请输入用户类型' }
    },
    {
      title: '应用名称',
      dataIndex: 'applicationName',
      align: 'center',
      width: 120,
      fieldProps: { placeholder: '请输入应用名称' }
    },
    {
      title: '请求方法',
      dataIndex: 'requestMethod',
      align: 'center',
      width: 100,
      hideInSearch: true,
      render: (_, record) => {
        let color = ''
        switch (record.requestMethod?.toUpperCase()) {
          case 'GET':
            color = 'blue'
            break
          case 'POST':
            color = 'green'
            break
          case 'PUT':
            color = 'orange'
            break
          case 'DELETE':
            color = 'red'
            break
          default:
            color = 'default'
        }
        return <Tag color={color}>{record.requestMethod}</Tag>
      }
    },
    {
      title: '请求地址',
      dataIndex: 'requestUrl',
      align: 'center',
      width: 250,
      hideInSearch: true,
      render: (_, record) => (
        <Typography.Text
          ellipsis={{ tooltip: record.requestUrl }}
          style={{ width: 250, display: 'inline-block' }}
        >
          {record.requestUrl}
        </Typography.Text>
      )
    },
    {
      title: '异常发生时间',
      dataIndex: 'exceptionTime',
      align: 'center',
      width: 160,
      valueType: 'dateRange',
      fieldProps: { placeholder: [textConst.columns.startDate, textConst.columns.endDate] },
      hideInTable: true
    },
    {
      title: '异常发生时间',
      dataIndex: 'exceptionTime',
      align: 'center',
      width: 160,
      hideInSearch: true,
      render: (_, record) => <span>{record.exceptionTime}</span>
    },
    {
      title: '异常名',
      dataIndex: 'exceptionName',
      align: 'center',
      width: 200,
      hideInSearch: true,
      render: (_, record) => (
        <Typography.Text
          ellipsis={{ tooltip: record.exceptionName }}
          style={{ width: 200, display: 'inline-block' }}
        >
          {record.exceptionName}
        </Typography.Text>
      )
    },
    {
      title: '处理状态',
      dataIndex: 'processStatus',
      align: 'center',
      width: 100,
      valueType: 'select',
      valueEnum: {
        0: { text: '未处理', status: 'Processing' },
        1: { text: '已处理', status: 'Success' },
        2: { text: '已忽略', status: 'Default' }
      },
      fieldProps: { placeholder: '请输入处理状态' }
    },
    {
      title: textConst.form.operate,
      valueType: 'option',
      align: 'center',
      width: 150,
      key: 'option',
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a
            key="detail"
            onClick={() => {
              setSelectedRecord(record)
              setDetailsDrawerVisible(true)
            }}
          >
            {textConst.action.detail}
          </a>
          {record.processStatus === 0 && (
            <>
              <a key="process" onClick={() => handleUpdateStatus(record.id, 1, '已处理')}>
                已处理
              </a>
              <a key="ignore" onClick={() => handleUpdateStatus(record.id, 2, '已忽略')}>
                已忽略
              </a>
            </>
          )}
        </div>
      )
    }
  ]

  const handleExport = () => {
    Modal.confirm({
      title: textConst.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '确认导出所有API错误日志？',
      okText: textConst.common.ok,
      cancelText: textConst.common.cancel,
      onOk: async () => {
        try {
          const formValues = formRef.current?.getFieldsValue?.() || {}

          if (formValues.exceptionTime && formValues.exceptionTime.length === 2) {
            formValues.beginTimeStr = formValues.exceptionTime[0] + ' 00:00:00'
            formValues.endTimeStr = formValues.exceptionTime[1] + ' 23:59:59'
          }
          delete formValues.exceptionTime

          const resp = await exportApiErrorLogExcel(formValues as any)
          if (!resp) return
          const blob = new Blob([resp as any], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = 'API错误日志.xlsx'
          link.click()
          window.URL.revokeObjectURL(url)
          message.success(textConst.msg.exportSuccess)
        } catch {
          message.error('textConst.msg.exportError')
        }
      }
    })
  }

  return (
    <>
      <ProTable<API.InfraApiErrorLogRespVO>
        columns={columns}
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        formRef={formRef}
        form={{ colon: false }}
        cardBordered
        request={async (params: Record<string, any>) => {
          const { current, pageSize, exceptionTime, ...rest } = params

          let beginTimeStr, endTimeStr
          if (exceptionTime && exceptionTime.length === 2) {
            beginTimeStr = exceptionTime[0] + ' 00:00:00'
            endTimeStr = exceptionTime[1] + ' 23:59:59'
          }

          try {
            const resp = await getApiErrorLogPage({
              pageNo: current || 1,
              pageSize: pageSize || 10,
              ...(beginTimeStr && endTimeStr ? { exceptionTime: [beginTimeStr, endTimeStr] } : {}),
              ...rest
            } as any)

            // Handling case where exceptionTime is treated as an array of string parameter depending on backend implementation
            // The default framework usually uses exceptionTime for array, or begins with beginTime/endTime. If it fails we can adjust.

            return {
              data: resp.data?.list || [],
              success: true,
              total: resp.data?.total || 0
            }
          } catch (e) {
            console.error('获取 API 错误日志列表失败', e)
            message.error('获取数据失败')
            return {
              data: [],
              success: false,
              total: 0
            }
          }
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false
        }}
        options={{
          reload: true,
          setting: true,
          density: true
        }}
        pagination={{
          align: 'center',
          showSizeChanger: true
        }}
        headerTitle={false}
        toolBarRender={() => [
          <Button
            key="export"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            style={{ color: '#52c41a', borderColor: '#b7eb8f', background: '#f6ffed' }}
          >
            {textConst.action.export}
          </Button>
        ]}
      />

      <Drawer
        title="错误日志详情"
        placement="right"
        onClose={() => {
          setDetailsDrawerVisible(false)
          setSelectedRecord(null)
        }}
        open={detailsDrawerVisible}
        width={600}
      >
        {selectedRecord && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <DetailItem label="日志 ID" value={selectedRecord.id} />
            <DetailItem label="链路追踪" value={selectedRecord.traceId} />
            <DetailItem label="用户 ID" value={selectedRecord.userId} />
            <DetailItem
              label="用户类型"
              value={
                selectedRecord.userType === 1
                  ? '会员'
                  : selectedRecord.userType === 2
                    ? '管理员'
                    : selectedRecord.userType
              }
            />
            <DetailItem label="应用名称" value={selectedRecord.applicationName} />
            <DetailItem label="请求方法" value={selectedRecord.requestMethod} />
            <DetailItem label="请求地址" value={selectedRecord.requestUrl} />
            <DetailItem label="请求参数" value={selectedRecord.requestParams} isLong />
            <DetailItem label="客户端 IP" value={selectedRecord.userIp} />
            <DetailItem label="浏览器 UA" value={selectedRecord.userAgent} isLong />
            <DetailItem label="异常时间" value={selectedRecord.exceptionTime} />
            <DetailItem label="异常名" value={selectedRecord.exceptionName} isLong />
            <DetailItem label="异常提示" value={selectedRecord.exceptionRootCauseMessage} isLong />
            <DetailItem label="异常详情" value={selectedRecord.exceptionMessage} isLong />
            <DetailItem label="异常发生的类全名" value={selectedRecord.exceptionClassName} isLong />
            <DetailItem label="异常发生的类文件" value={selectedRecord.exceptionFileName} />
            <DetailItem label="异常发生的方法名" value={selectedRecord.exceptionMethodName} />
            <DetailItem label="异常发生的方法所在行" value={selectedRecord.exceptionLineNumber} />
            <DetailItem label="异常的栈轨迹" value={selectedRecord.exceptionStackTrace} isLong />
            <DetailItem
              label="处理状态"
              value={
                selectedRecord.processStatus === 0
                  ? '未处理'
                  : selectedRecord.processStatus === 1
                    ? '已处理'
                    : '已忽略'
              }
            />
            <DetailItem label="处理时间" value={selectedRecord.processTime} />
            <DetailItem label="处理用户" value={selectedRecord.processUserId} />
          </div>
        )}
      </Drawer>
    </>
  )
}

const DetailItem: React.FC<{ label: string; value: any; isLong?: boolean }> = ({
  label,
  value,
  isLong = false
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'baseline',
      borderBottom: '1px solid #f0f0f0',
      paddingBottom: '12px',
      paddingTop: '4px'
    }}
  >
    <div
      style={{
        fontWeight: 500,
        width: '120px',
        flexShrink: 0,
        textAlign: 'right',
        paddingRight: '16px'
      }}
    >
      {label}
    </div>
    <div
      style={{
        flex: 1,
        wordBreak: isLong ? 'break-all' : 'normal',
        whiteSpace: isLong ? 'pre-wrap' : 'nowrap',
        overflow: isLong ? 'visible' : 'hidden',
        textOverflow: isLong ? 'clip' : 'ellipsis',
        lineHeight: '1.5',
        color: '#666'
      }}
    >
      {value ?? '-'}
    </div>
  </div>
)

export default ApiErrorLogPage
