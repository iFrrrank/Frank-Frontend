import React, { useEffect, useRef, useState } from 'react'
import { Button, Tag, Typography } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { exportSmsLogExcel, getSmsLogPage } from '@/api/system/smsLog'
import { getSimpleSmsChannelList } from '@/api/system/smsChannel'
import { textConst } from '@/locales/zh-CN'
import { handleExport } from '@/components/Export'

const SmsLogConfig: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  const [channelOptions, setChannelOptions] = useState<{ label: string; value: number }[]>([])

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

  const handleExportBtnClick = () => {
    // 获取表单当前的值
    const formValues = formRef.current?.getFieldsValue?.() || {}
    handleExport({
      exportApi: exportSmsLogExcel,
      exportParams: { ...formValues },
      fileName: '短信日志.xlsx'
    })
  }

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
        placeholder: [textConst.columns.startDate, textConst.columns.endDate]
      }
    },
    {
      title: '接收时间',
      dataIndex: 'receiveTime',
      valueType: 'dateRange',
      hideInTable: true,
      fieldProps: {
        placeholder: [textConst.columns.startDate, textConst.columns.endDate]
      }
    },
    {
      title: textConst.form.operate,
      valueType: 'option',
      align: 'center',
      width: 80,
      key: 'option',
      render: () => <a key="view">{textConst.action.detail}</a>
    }
  ]

  return (
    <>
      <ProTable<API.SystemSmsLogRespVO>
        headerTitle="短信日志"
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
    </>
  )
}

export default SmsLogConfig
