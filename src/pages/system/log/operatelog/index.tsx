import React, { useRef, useState } from 'react'
import {
  type ActionType,
  type ProColumns,
  type ProFormInstance,
  ProTable
} from '@ant-design/pro-components'
import { textConst } from '@/locales/zh-CN'
import { Button, Drawer, message, Modal, Space, Typography, Descriptions } from 'antd'
import { DownloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { exportOperateLog, pageOperateLog } from '@/api/system/operateLog'
import { handleExport } from '@/components/Export'

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
      fieldProps: { placeholder: '请输入操作人' }
    },
    {
      title: '操作模块',
      dataIndex: 'type',
      align: 'center',
      width: 120,
      fieldProps: { placeholder: '请输入操作模块' }
    },
    {
      title: '操作名',
      dataIndex: 'subType',
      align: 'center',
      width: 120,
      fieldProps: { placeholder: '请输入操作名' }
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
      fieldProps: { placeholder: '请输入业务 ID' }
    },
    {
      title: '操作 IP',
      dataIndex: 'userIp',
      align: 'center',
      width: 140,
      fieldProps: { placeholder: '请输入操作 IP' }
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

  const handleExportClick = () => {
    const formValues = formRef.current?.getFieldsValue?.() || {}

    if (formValues.createTime && formValues.createTime.length === 2) {
      formValues.beginTime = formValues.createTime[0] + ' 00:00:00'
      formValues.endTime = formValues.createTime[1] + ' 23:59:59'
      delete formValues.createTime
    }

    handleExport(exportOperateLog, formValues, '操作日志数据.xlsx', '确认导出所有操作日志数据项?')
  }

  return (
    <>
      <ProTable<API.SystemOperateLogRespVO>
        headerTitle="操作日志"
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
        toolBarRender={() => [
          <Button
            key="export"
            color="volcano"
            variant="outlined"
            icon={<DownloadOutlined />}
            onClick={handleExportClick}
          >
            {textConst.action.export}
          </Button>
        ]}
      />

      <Drawer
        title="操作日志详情"
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
            <Descriptions.Item label="操作人 ID">{selectedRecord.userId || '-'}</Descriptions.Item>
            <Descriptions.Item label="操作人">{selectedRecord.userName || '-'}</Descriptions.Item>
            <Descriptions.Item label="操作人 IP">{selectedRecord.userIp || '-'}</Descriptions.Item>
            <Descriptions.Item label="操作人 UA">{selectedRecord.userAgent || '-'}</Descriptions.Item>
            <Descriptions.Item label="操作模块">{selectedRecord.type || '-'}</Descriptions.Item>
            <Descriptions.Item label="操作名">{selectedRecord.subType || '-'}</Descriptions.Item>
            <Descriptions.Item label="操作内容">{selectedRecord.action || '-'}</Descriptions.Item>
            <Descriptions.Item label="操作结果">{selectedRecord.requestMethod || '-'}</Descriptions.Item>
            <Descriptions.Item label="请求 URL">{selectedRecord.requestUrl || '-'}</Descriptions.Item>
            <Descriptions.Item label="操作时间">{selectedRecord.createTime || '-'}</Descriptions.Item>
            <Descriptions.Item label="业务 ID">{selectedRecord.bizId || '-'}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer >
    </>
  )
}

export default OperateLogConfig
