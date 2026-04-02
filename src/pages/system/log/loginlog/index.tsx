import React, { useRef, useState } from 'react'
import { Button, Drawer, message, Modal, Space, Typography, Descriptions } from 'antd'
import { DownloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { exportLoginLog, getLoginLogPage } from '@/api/system/loginLog'
import { textConst } from '@/locales/zh-CN'
import { handleExport } from '@/components/Export'

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
        placeholder: [textConst.columns.startDate, textConst.columns.endDate]
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

  const handleExportClick = () => {
    const formValues = formRef.current?.getFieldsValue?.() || {}
    if (formValues.createTime && formValues.createTime.length === 2) {
      formValues.beginCreateTime = formValues.createTime[0] + ' 00:00:00'
      formValues.endCreateTime = formValues.createTime[1] + ' 23:59:59'
    }
    delete formValues.createTime
    handleExport(exportLoginLog, formValues, '登录日志数据.xlsx', '确认导出所有登录日志数据项?')
  }

  return (
    <>
      <ProTable<API.SystemLoginLogRespVO>
        headerTitle="登录日志"
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
        toolBarRender={() => [
          <Button
            key="export"
            icon={<DownloadOutlined />}
            color="volcano"
            variant="outlined"
            onClick={handleExportClick}
          >
            {textConst.action.export}
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
        width={400}
      >
        {selectedRecord && (
          <Descriptions column={1} colon={false} labelStyle={{ width: '80px', display: 'flex', justifyContent: 'flex-end', fontWeight: 'bold', color: 'black' }} contentStyle={{ paddingLeft: '10px' }} >
            <Descriptions.Item label="日志 ID">{selectedRecord.id || '-'}</Descriptions.Item>
            <Descriptions.Item label="日志类型">{logTypeMap[selectedRecord.logType] || selectedRecord.logType}</Descriptions.Item>
            <Descriptions.Item label="用户 ID">{selectedRecord.userId || '-'}</Descriptions.Item>
            <Descriptions.Item label="用户名">{selectedRecord.username || '-'}</Descriptions.Item>
            <Descriptions.Item label="登录 IP">{selectedRecord.userIp || '-'}</Descriptions.Item>
            <Descriptions.Item label="浏览器 UA">{selectedRecord.userAgent || '-'}</Descriptions.Item>
            <Descriptions.Item label="登录结果">{resultMap[selectedRecord.result] || selectedRecord.result}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{selectedRecord.createTime || '-'}</Descriptions.Item>
            <Descriptions.Item label="Trace ID">{selectedRecord.traceId || '-'}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </>
  )
}

export default LoginLogPage
