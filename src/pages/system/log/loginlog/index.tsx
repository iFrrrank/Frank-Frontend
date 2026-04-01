import React, { useRef, useState } from 'react'
import { Button, Drawer, message, Modal, Space, Typography } from 'antd'
import { DownloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { exportLoginLog, getLoginLogPage } from '@/api/system/loginLog'
import { textConst } from '@/locales/zh-CN'

const LoginLogPage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<API.SystemLoginLogRespVO | null>(null)

  const logTypeMap: Record<number, string> = {
    100: '账号登录',
    2: '登出',
    3: '其他'
  }
  const resultMap: Record<number, string> = {
    0: '成功',
    1: '失败'
  }

  const columns: ProColumns<API.SystemLoginLogRespVO>[] = [
    {
      title: '日志 ID',
      dataIndex: 'id',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '日志类型',
      dataIndex: 'logType',
      align: 'center',
      width: 120,
      valueType: 'select',
      valueEnum: {
        100: { text: '账号登录' },
        2: { text: '登出' },
        3: { text: '其他' }
      },
      render: (_, record) => logTypeMap[record.logType] || String(record.logType)
    },
    {
      title: '用户名',
      dataIndex: 'username',
      align: 'center',
      width: 120,
      fieldProps: { placeholder: '请输入用户名' }
    },
    {
      title: '登录地址',
      dataIndex: 'userIp',
      align: 'center',
      width: 160,
      fieldProps: { placeholder: '请输入登录地址' }
    },
    {
      title: '浏览器',
      dataIndex: 'userAgent',
      align: 'center',
      width: 220,
      hideInSearch: true,
      render: (_, record) =>
        record.userAgent ? (
          <Typography.Text ellipsis={{ tooltip: record.userAgent }} style={{ width: 200 }}>
            {record.userAgent}
          </Typography.Text>
        ) : (
          '-'
        )
    },
    {
      title: '登录结果',
      dataIndex: 'result',
      align: 'center',
      width: 120,
      valueType: 'select',
      valueEnum: {
        0: {
          text: '成功',
          status: 'Success'
        },
        1: {
          text: '失败',
          status: 'Error'
        }
      }
    },
    {
      title: '登录日期',
      dataIndex: 'createTime',
      align: 'center',
      width: 200,
      valueType: 'dateRange',
      fieldProps: {
        placeholder: ['开始日期', '结束日期']
      },
      hideInTable: true
    },
    {
      title: '登录日期',
      dataIndex: 'createTime',
      align: 'center',
      width: 180,
      hideInSearch: true,
      render: (_, record) => <span>{record.createTime}</span>
    },
    {
      title: textConst.form.operate,
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

  const handleExport = () => {
    Modal.confirm({
      title: textConst.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '确认导出所有登录日志数据项?',
      okText: textConst.common.ok,
      cancelText: textConst.common.cancel,
      onOk: async () => {
        try {
          const formValues = formRef.current?.getFieldsValue?.() || {}
          if (formValues.createTime && formValues.createTime.length === 2) {
            formValues.beginCreateTime = formValues.createTime[0] + ' 00:00:00'
            formValues.endCreateTime = formValues.createTime[1] + ' 23:59:59'
          }
          delete formValues.createTime

          const resp = await exportLoginLog(formValues as any)
          if (!resp) return

          const blob = new Blob([resp as any], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = '登录日志数据.xlsx'
          link.click()
          window.URL.revokeObjectURL(url)
          message.success(textConst.msg.exportSuccess)
        } catch (error) {
          console.error(error)
          message.error('textConst.msg.exportError')
        }
      }
    })
  }

  return (
    <>
      <ProTable<API.SystemLoginLogRespVO>
        columns={columns}
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        formRef={formRef}
        form={{ colon: false }}
        cardBordered
        request={async (params: Record<string, any>) => {
          const { current, pageSize, username, userIp, result, logType, createTime, ...rest } =
            params
          let beginTime
          let endTime
          if (createTime && createTime.length === 2) {
            beginTime = createTime[0] + ' 00:00:00'
            endTime = createTime[1] + ' 23:59:59'
          }

          try {
            const resp = await getLoginLogPage({
              pageReqVO: {
                pageNo: current || 1,
                pageSize: pageSize || 10,
                ...(username ? { username } : {}),
                ...(userIp ? { userIp } : {}),
                ...(typeof result !== 'undefined' ? { status: result === 1 } : {}),
                ...(logType ? { logType } : {}),
                ...(beginTime ? { createTime: [beginTime, endTime] } : {}),
                ...rest
              }
            } as any)

            return {
              data: resp.data?.list || [],
              success: true,
              total: resp.data?.total || 0
            }
          } catch (e) {
            console.error('获取登录日志列表失败', e)
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

      <Drawer
        title="登录日志详情"
        placement="right"
        onClose={() => {
          setDetailsDrawerVisible(false)
          setSelectedRecord(null)
        }}
        open={detailsDrawerVisible}
        width={500}
      >
        {selectedRecord && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <DetailItem label="日志 ID" value={selectedRecord.id} />
            <DetailItem
              label="日志类型"
              value={logTypeMap[selectedRecord.logType] || selectedRecord.logType}
            />
            <DetailItem label="用户 ID" value={selectedRecord.userId} />
            <DetailItem label="用户名" value={selectedRecord.username} />
            <DetailItem label="登录地址" value={selectedRecord.userIp} />
            <DetailItem label="浏览器 UA" value={selectedRecord.userAgent} isLong />
            <DetailItem
              label="登录结果"
              value={resultMap[selectedRecord.result] || selectedRecord.result}
            />
            <DetailItem label="创建时间" value={selectedRecord.createTime} />
            <DetailItem label="Trace ID" value={selectedRecord.traceId} isLong />
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
    <div style={{ fontWeight: 500, width: '100px', flexShrink: 0 }}>{label}</div>
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

export default LoginLogPage
