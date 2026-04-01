import React, { useEffect, useRef, useState } from 'react'
import { Button, message, Modal, Tag, Typography } from 'antd'
import { DownloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { exportSmsLogExcel, getSmsLogPage } from '@/api/system/smsLog'
import { getSimpleSmsChannelList } from '@/api/system/smsChannel'
import { textConst } from '@/locales/zh-CN'

const SmsLogConfig: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  const [channelOptions, setChannelOptions] = useState<{ label: string; value: number }[]>([])

  // ===== 加载短信渠道下拉列表 =====
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await getSimpleSmsChannelList()
        if (res.code === 0 && res.data) {
          const options = res.data.map((item: any) => ({
            label: item.signature || item.code,
            value: item.id
          }))
          setChannelOptions(options)
        }
      } catch (e) {
        console.error('加载短信渠道失败', e)
      }
    }
    fetchChannels()
  }, [])

  // 状态常量映射
  const sendStatusEnum = {
    0: { text: '初始化', status: 'Default' },
    10: { text: '成功', status: 'Success' },
    20: { text: '失败', status: 'Error' },
    30: { text: '忽略', status: 'Warning' }
  }

  const receiveStatusEnum = {
    0: { text: '初始', status: 'Default' },
    10: { text: '成功', status: 'Success' },
    20: { text: '失败', status: 'Error' }
  }

  // ===== 数据列定义 =====
  const columns: ProColumns<API.SystemSmsLogRespVO>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      hideInSearch: true,
      width: 80
    },
    {
      title: textConst.columns.createTime,
      dataIndex: 'createTime',
      align: 'center',
      hideInSearch: true,
      width: 180,
      render: (_, record) => <span>{record.createTime as any}</span>
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
      align: 'center',
      width: 150,
      fieldProps: {
        placeholder: '请输入手机号码'
      }
    },
    {
      title: '短信内容',
      dataIndex: 'templateContent',
      align: 'center',
      hideInSearch: true,
      width: 300,
      render: (_, record) =>
        record.templateContent ? (
          <Typography.Text
            style={{ width: 280, margin: 0 }}
            ellipsis={{ tooltip: record.templateContent }}
          >
            {record.templateContent}
          </Typography.Text>
        ) : (
          <span>-</span>
        )
    },
    {
      title: '发送状态',
      dataIndex: 'sendStatus',
      align: 'center',
      width: 100,
      valueType: 'select',
      valueEnum: sendStatusEnum,
      fieldProps: {
        placeholder: '请选择发送状态'
      }
    },
    {
      title: '接收状态',
      dataIndex: 'receiveStatus',
      align: 'center',
      width: 100,
      valueType: 'select',
      valueEnum: receiveStatusEnum,
      fieldProps: {
        placeholder: '请选择接收状态'
      }
    },
    {
      title: '短信渠道',
      dataIndex: 'channelId',
      align: 'center',
      width: 120,
      valueType: 'select',
      fieldProps: {
        options: channelOptions,
        placeholder: '请选择短信渠道',
        showSearch: true
      },
      render: (_, record) => {
        const match = channelOptions.find((o) => o.value === record.channelId)
        return <Tag color="blue">{match ? match.label : record.channelId}</Tag>
      }
    },
    {
      title: '模板 ID',
      dataIndex: 'templateId',
      align: 'center',
      width: 150,
      fieldProps: {
        placeholder: '请输入模板 ID'
      }
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      valueType: 'dateRange',
      hideInTable: true,
      fieldProps: {
        placeholder: ['开始日期', '结束日期']
      }
    },
    {
      title: '接收时间',
      dataIndex: 'receiveTime',
      valueType: 'dateRange',
      hideInTable: true,
      fieldProps: {
        placeholder: ['开始日期', '结束日期']
      }
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 80,
      key: 'option',
      fixed: 'right', // 即使很少操作也占个位，如果没有详情这儿写死展示
      render: () => (
        <a key="view" style={{ color: '#1890ff', cursor: 'not-allowed' }} title="暂未配置详情界面">
          详情
        </a>
      )
    }
  ]

  // ===== 导出短信日志 =====
  const handleExport = () => {
    Modal.confirm({
      title: textConst.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '确认导出所有短信日志数据项?',
      okText: textConst.common.ok,
      cancelText: textConst.common.cancel,
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

          const resp = await exportSmsLogExcel(formValues as any)
          if (!resp) return
          // 处理为 Blob 下载
          const blob = new Blob([resp as any], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = '短信日志数据.xlsx'
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
      <ProTable<API.SystemSmsLogRespVO>
        columns={columns}
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        formRef={formRef}
        form={{ colon: false }}
        cardBordered
        request={async (params: Record<string, any>) => {
          const {
            current,
            pageSize,
            mobile,
            channelId,
            templateId,
            sendStatus,
            sendTime,
            receiveStatus,
            receiveTime,
            ...rest
          } = params

          let beginSendTime, endSendTime, beginReceiveTime, endReceiveTime

          if (sendTime && sendTime.length === 2) {
            beginSendTime = sendTime[0] + ' 00:00:00'
            endSendTime = sendTime[1] + ' 23:59:59'
          }

          if (receiveTime && receiveTime.length === 2) {
            beginReceiveTime = receiveTime[0] + ' 00:00:00'
            endReceiveTime = receiveTime[1] + ' 23:59:59'
          }

          const resp = await getSmsLogPage({
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...(mobile ? { mobile } : {}),
            ...(channelId !== undefined && channelId !== ''
              ? { channelId: Number(channelId) }
              : {}),
            ...(templateId ? { templateId } : {}),
            ...(sendStatus !== undefined && sendStatus !== ''
              ? { sendStatus: Number(sendStatus) }
              : {}),
            ...(receiveStatus !== undefined && receiveStatus !== ''
              ? { receiveStatus: Number(receiveStatus) }
              : {}),
            ...(beginSendTime ? { beginSendTime } : {}),
            ...(endSendTime ? { endSendTime } : {}),
            ...(beginReceiveTime ? { beginReceiveTime } : {}),
            ...(endReceiveTime ? { endReceiveTime } : {}),
            ...rest
          } as any)

          return {
            data: resp.data?.list || [],
            success: true,
            total: resp.data?.total || 0
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
    </>
  )
}

export default SmsLogConfig
