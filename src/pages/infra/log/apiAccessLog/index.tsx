import React, { useRef, useState } from 'react'
import { Button, Drawer, message, Modal, Tag, Typography } from 'antd'
import { DownloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { exportApiAccessLogExcel, getApiAccessLogPage } from '@/api/infra/apiAccessLog'
import { textConst } from '@/locales/zh-CN'

const ApiAccessLogPage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<API.InfraApiAccessLogRespVO | null>(null)

  const columns: ProColumns<API.InfraApiAccessLogRespVO>[] = [
    {
      title: '日志 ID',
      dataIndex: 'id',
      align: 'center',
      width: 80,
      hideInSearch: true
    },
    {
      title: '用户 ID',
      dataIndex: 'userId',
      align: 'center',
      width: 80,
      fieldProps: { placeholder: '请输入用户 ID' }
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
      width: 80,
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
      width: 200,
      hideInSearch: true,
      render: (_, record) => (
        <Typography.Text
          ellipsis={{ tooltip: record.requestUrl }}
          style={{ width: 200, display: 'inline-block' }}
        >
          {record.requestUrl}
        </Typography.Text>
      )
    },
    {
      title: '请求时间',
      dataIndex: 'beginTime',
      align: 'center',
      width: 150,
      valueType: 'dateRange',
      fieldProps: { placeholder: [textConst.columns.startDate, textConst.columns.endDate] },
      hideInTable: true
    },
    {
      title: '请求时间',
      dataIndex: 'beginTime',
      align: 'center',
      width: 150,
      hideInSearch: true,
      render: (_, record) => <span>{record.beginTime}</span>
    },
    {
      title: '执行时长(ms)',
      dataIndex: 'duration',
      align: 'center',
      width: 100,
      fieldProps: { placeholder: '请输入执行时长' },
      render: (_, record) => <span>{record.duration}</span>
    },
    {
      title: '结果码',
      dataIndex: 'resultCode',
      hideInTable: true,
      fieldProps: { placeholder: '请输入结果码' }
    },
    {
      title: '操作结果',
      dataIndex: 'resultCode',
      align: 'center',
      width: 100,
      hideInSearch: true,
      valueType: 'select',
      valueEnum: {
        0: { text: '成功', status: 'Success' },
        400: { text: '失败', status: 'Error' }
      }
    },
    {
      title: '操作模块',
      dataIndex: 'operateModule',
      align: 'center',
      width: 150,
      hideInSearch: true
    },
    {
      title: '操作名',
      dataIndex: 'operateName',
      align: 'center',
      width: 140,
      hideInSearch: true
    },
    {
      title: textConst.form.operate,
      valueType: 'option',
      align: 'center',
      width: 80,
      key: 'option',
      fixed: 'right',
      render: (_, record) => (
        <a
          key="detail"
          onClick={() => {
            setSelectedRecord(record)
            setDetailsDrawerVisible(true)
          }}
        >
          {textConst.action.detail}
        </a>
      )
    }
  ]

  const handleExport = () => {
    Modal.confirm({
      title: textConst.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '确认导出所有访问日志数据项？',
      okText: textConst.common.ok,
      cancelText: textConst.common.cancel,
      onOk: async () => {
        try {
          const formValues = formRef.current?.getFieldsValue?.() || {}

          if (formValues.beginTime && formValues.beginTime.length === 2) {
            formValues.beginTimeStr = formValues.beginTime[0] + ' 00:00:00'
            formValues.endTimeStr = formValues.beginTime[1] + ' 23:59:59'
          }
          delete formValues.beginTime

          const resp = await exportApiAccessLogExcel(formValues as any)
          if (!resp) return
          const blob = new Blob([resp as any], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = 'API访问日志.xlsx'
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
      <ProTable<API.InfraApiAccessLogRespVO>
        columns={columns}
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        formRef={formRef}
        form={{ colon: false }}
        cardBordered
        request={async (params: Record<string, any>) => {
          const { current, pageSize, beginTime, duration, ...rest } = params

          let beginTimeStr, endTimeStr
          if (beginTime && beginTime.length === 2) {
            beginTimeStr = beginTime[0] + ' 00:00:00'
            endTimeStr = beginTime[1] + ' 23:59:59'
          }

          try {
            const resp = await getApiAccessLogPage({
              pageNo: current || 1,
              pageSize: pageSize || 10,
              ...(beginTimeStr ? { beginTime: beginTimeStr } : {}),
              ...(endTimeStr ? { endTime: endTimeStr } : {}),
              ...(duration ? { duration } : {}),
              ...rest
            } as any)

            return {
              data: resp.data?.list || [],
              success: true,
              total: resp.data?.total || 0
            }
          } catch (e) {
            console.error('获取 API 访问日志列表失败', e)
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
        options={false}
        pagination={{
          align: 'center',
          showSizeChanger: true
        }}
        headerTitle={false}
        toolBarRender={() => [
          <Button
            key="export"
            color="volcano"
            variant="outlined"
            icon={<DownloadOutlined />}
            onClick={handleExport}
          >
            {textConst.action.export}
          </Button>
        ]}
      />

      <Drawer
        title="访问日志详情"
        placement="right"
        onClose={() => {
          setDetailsDrawerVisible(false)
          setSelectedRecord(null)
        }}
        open={detailsDrawerVisible}
        width={450}
      >
        {selectedRecord && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <DetailItem label="日志 ID" value={selectedRecord.id} />
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
            <DetailItem label="请求时间" value={selectedRecord.beginTime} />
            <DetailItem label="响应时间" value={selectedRecord.endTime} />
            <DetailItem
              label="执行时长(ms)"
              value={selectedRecord.duration ? `${selectedRecord.duration}` : '-'}
            />
            <DetailItem
              label="操作结果"
              value={selectedRecord.resultCode === 0 ? '成功' : '失败'}
            />
            <DetailItem label="结果码" value={selectedRecord.resultCode} />
            <DetailItem label="结果提示" value={selectedRecord.resultMsg} isLong />
            {selectedRecord.operateModule && (
              <DetailItem label="操作模块" value={selectedRecord.operateModule} />
            )}
            {selectedRecord.operateName && (
              <DetailItem label="操作名" value={selectedRecord.operateName} />
            )}
            {selectedRecord.traceId && (
              <DetailItem label="链路追踪" value={selectedRecord.traceId} isLong />
            )}
            <DetailItem label="客户端 IP" value={selectedRecord.userIp} />
            <DetailItem label="请求参数" value={selectedRecord.requestParams} isLong />
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
      alignItems: 'center',
      borderBottom: '1px solid #f0f0f0',
      paddingBottom: isLong ? '16px' : '12px',
      paddingTop: isLong ? '8px' : '0'
    }}
  >
    <div style={{ fontWeight: 500, width: '80px', flexShrink: 0 }}>{label}</div>
    <div
      style={{
        flex: 1,
        marginLeft: '16px',
        wordBreak: isLong ? 'break-all' : 'normal',
        whiteSpace: isLong ? 'normal' : 'nowrap',
        overflow: isLong ? 'visible' : 'hidden',
        textOverflow: isLong ? 'clip' : 'ellipsis',
        lineHeight: isLong ? '1.5' : '1'
      }}
    >
      {value ?? '-'}
    </div>
  </div>
)

export default ApiAccessLogPage
