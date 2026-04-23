import React, { useRef, useState } from 'react'
import { Button, Descriptions, Drawer, message, Tag, Typography } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { exportApiAccessLogExcel, getApiAccessLogPage } from '@/api/infra/apiAccessLog'
import { textConst } from '@/locales/zh-CN'
import { handleExport } from '@/components/Export'

const ApiAccessLogPage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<API.InfraApiAccessLogRespVO | null>(null)

  const handleExportBtnClick = () => {
    // 获取表单当前的值
    const formValues = formRef.current?.getFieldsValue?.() || {}
    handleExport({
      exportApi: exportApiAccessLogExcel,
      exportParams: { ...formValues },
      fileName: '访问日志.xlsx'
    })
  }

  const columns: ProColumns<API.InfraApiAccessLogRespVO>[] = [
    {
      title: '日志 ID',
      dataIndex: 'id',
      align: 'center',
      width: 70,
      hideInSearch: true
    },
    {
      title: '用户 ID',
      dataIndex: 'userId',
      align: 'center',
      width: 70,
      fieldProps: { placeholder: '请输入用户 ID' }
    },
    {
      title: '用户类型',
      dataIndex: 'userType',
      align: 'center',
      width: 90,
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
      width: 110,
      fieldProps: { placeholder: '请输入应用名称' }
    },
    {
      title: '请求方法',
      dataIndex: 'requestMethod',
      align: 'center',
      width: 75,
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
      width: 140,
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
      width: 105,
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
      width: 90,
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

  return (
    <>
      <ProTable<API.InfraApiAccessLogRespVO>
        headerTitle="访问日志"
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
          span: 6,
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
            color="volcano"
            variant="outlined"
            icon={<DownloadOutlined />}
            onClick={handleExportBtnClick}
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
          <Descriptions
            column={1}
            colon={false}
            labelStyle={{
              width: '100px',
              display: 'flex',
              justifyContent: 'flex-end',
              fontWeight: 'bold',
              color: 'black'
            }}
            contentStyle={{ paddingLeft: '15px' }}
          >
            <Descriptions.Item label="日志 ID">{selectedRecord.id}</Descriptions.Item>
            <Descriptions.Item label="Trace ID">{selectedRecord.traceId}</Descriptions.Item>
            <Descriptions.Item label="用户 ID">{selectedRecord.userId}</Descriptions.Item>
            <Descriptions.Item label="用户类型">
              {selectedRecord.userType === 1
                ? '会员'
                : selectedRecord.userType === 2
                  ? '管理员'
                  : selectedRecord.userType}
            </Descriptions.Item>
            <Descriptions.Item label="应用名称">{selectedRecord.applicationName}</Descriptions.Item>
            <Descriptions.Item label="请求方法">{selectedRecord.requestMethod}</Descriptions.Item>
            <Descriptions.Item label="请求地址">{selectedRecord.requestUrl}</Descriptions.Item>
            <Descriptions.Item label="请求时间">{selectedRecord.beginTime}</Descriptions.Item>
            <Descriptions.Item label="响应时间">{selectedRecord.endTime}</Descriptions.Item>
            <Descriptions.Item label="执行时长(ms)">
              {selectedRecord.duration ? `${selectedRecord.duration}` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="操作结果">
              {selectedRecord.resultCode === 0 ? '成功' : '失败'}
            </Descriptions.Item>
            <Descriptions.Item label="结果码">{selectedRecord.resultCode}</Descriptions.Item>
            <Descriptions.Item label="结果提示">{selectedRecord.resultMsg}</Descriptions.Item>
            <Descriptions.Item label="操作模块">{selectedRecord.operateModule}</Descriptions.Item>
            <Descriptions.Item label="操作名">{selectedRecord.operateName}</Descriptions.Item>
            <Descriptions.Item label="客户端 IP">{selectedRecord.userIp}</Descriptions.Item>
            <Descriptions.Item label="请求参数">{selectedRecord.requestParams}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </>
  )
}

export default ApiAccessLogPage
