import React, { useRef, useState } from 'react'
import {
  type ActionType,
  type ProColumns,
  type ProFormInstance,
  ProTable
} from '@ant-design/pro-components'
import { textConstants } from '@/locales/zh-CN'
import { Button, Drawer, message, Modal, Space, Typography } from 'antd'
import { DownloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { exportOperateLog, pageOperateLog } from '@/api/system/operateLog'

const OperateLogConfig: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  // 详情抽屉状态
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<API.SystemOperateLogRespVO | null>(null)

  // 表格列定义
  const columns: ProColumns<API.SystemOperateLogRespVO>[] = [
    {
      title: '日志 ID',
      dataIndex: 'id',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '操作人',
      dataIndex: 'userName',
      align: 'center',
      width: 120,
      fieldProps: { placeholder: `${textConstants.common.inputText}操作人` }
    },
    {
      title: '操作模块',
      dataIndex: 'type',
      align: 'center',
      width: 120,
      fieldProps: { placeholder: `${textConstants.common.inputText}操作模块` }
    },
    {
      title: '操作名',
      dataIndex: 'subType',
      align: 'center',
      width: 120,
      fieldProps: { placeholder: `${textConstants.common.inputText}操作名` }
    },
    {
      title: '操作内容',
      dataIndex: 'action',
      align: 'center',
      width: 200,
      hideInSearch: true,
      render: (_, record) =>
        record.action ? (
          <Typography.Text ellipsis={{ tooltip: record.action }} style={{ width: 180 }}>
            {record.action}
          </Typography.Text>
        ) : (
          '-'
        )
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 180,
      valueType: 'dateRange',
      fieldProps: {
        placeholder: ['开始时间', '结束时间']
      },
      hideInTable: true
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 180,
      hideInSearch: true,
      render: (_, record) => <span>{record.createTime}</span>
    },
    {
      title: '业务 ID',
      dataIndex: 'bizId',
      align: 'center',
      width: 120,
      fieldProps: { placeholder: `${textConstants.common.inputText}业务 ID` }
    },
    {
      title: '操作 IP',
      dataIndex: 'userIp',
      align: 'center',
      width: 140,
      fieldProps: { placeholder: `${textConstants.common.inputText}操作 IP` }
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 100,
      key: 'option',
      fixed: 'right',
      render: (_, record) => (
        <Space size={12}>
          <a
            key="detail"
            onClick={() => {
              setSelectedRecord(record)
              setDetailsDrawerVisible(true)
            }}
          >
            详情
          </a>
        </Space>
      )
    }
  ]

  // ===== 导出操作日志 =====
  const handleExport = () => {
    Modal.confirm({
      title: textConstants.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '确认导出所有操作日志数据项?',
      okText: textConstants.common.ok,
      cancelText: textConstants.common.cancel,
      onOk: async () => {
        try {
          const formValues = formRef.current?.getFieldsValue?.() || {}

          if (formValues.sendTime && formValues.sendTime.length === 2) {
            formValues.beginSendTime = formValues.sendTime[0] + ' 00:00:00'
            formValues.endSendTime = formValues.sendTime[1] + ' 23:59:59'
          }
          if (formValues.receiveTime && formValues.receiveTime.length === 2) {
            formValues.beginReceiveTime = formValues.receiveTime[0] + ' 00:00:00'
            formValues.endReceiveTime = formValues.receiveTime[1] + ' 23:59:59'
          }
          delete formValues.sendTime
          delete formValues.receiveTime

          const resp = await exportOperateLog(formValues as any)
          if (!resp) return
          // 处理为 Blob 下载
          const blob = new Blob([resp as any], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = '操作日志数据.xlsx'
          link.click()
          window.URL.revokeObjectURL(url)
          message.success(textConstants.msg.exportSuccess)
        } catch {
          message.error('textConstants.msg.exportError')
        }
      }
    })
  }

  return (
    <>
      <ProTable<API.SystemOperateLogRespVO>
        columns={columns}
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        formRef={formRef}
        form={{ colon: false }}
        cardBordered
        request={async (params: Record<string, any>) => {
          const { current, pageSize, userName, type, subType, createTime, bizId, userIp, ...rest } =
            params

          let beginTime, endTime
          if (createTime && createTime.length === 2) {
            beginTime = createTime[0] + ' 00:00:00'
            endTime = createTime[1] + ' 23:59:59'
          }

          try {
            const resp = await pageOperateLog({
              pageNo: current || 1,
              pageSize: pageSize || 10,
              ...(userName ? { userName } : {}),
              ...(type ? { type } : {}),
              ...(subType ? { subType } : {}),
              ...(bizId ? { bizId } : {}),
              ...(userIp ? { userIp } : {}),
              ...(beginTime ? { beginTime } : {}),
              ...(endTime ? { endTime } : {}),
              ...rest
            } as any)

            return {
              data: resp.data?.list || [],
              success: true,
              total: resp.data?.total || 0
            }
          } catch (e) {
            console.error('获取操作日志列表失败', e)
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
            icon={<DownloadOutlined />}
            onClick={handleExport}
            style={{ color: '#52c41a', borderColor: '#b7eb8f', background: '#f6ffed' }}
          >
            导出
          </Button>
        ]}
      />

      {/* 详情抽屉 */}
      <Drawer
        title="操作日志详情"
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
            <DetailItem label="操作人 ID" value={selectedRecord.userId} />
            <DetailItem label="操作人名字" value={selectedRecord.userName} />
            <DetailItem label="操作人 IP" value={selectedRecord.userIp} />
            <DetailItem label="操作人 UA" value={selectedRecord.userAgent} isLong />
            <DetailItem label="操作模块" value={selectedRecord.type} />
            <DetailItem label="操作名" value={selectedRecord.subType} />
            <DetailItem label="操作内容" value={selectedRecord.action} isLong />
            <DetailItem label="操作结果" value={selectedRecord.requestMethod} />
            <DetailItem label="请求 URL" value={selectedRecord.requestUrl} />
            <DetailItem label="操作时间" value={selectedRecord.createTime} />
            <DetailItem label="业务 ID" value={selectedRecord.bizId} />
          </div>
        )}
      </Drawer>
    </>
  )
}

// 详情项组件
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
      {value || '-'}
    </div>
  </div>
)

export default OperateLogConfig
