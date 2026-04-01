import React, { useEffect, useRef, useState } from 'react'
import { Button, message, Modal, Tag, Typography } from 'antd'
import {
  DeleteOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  PlusOutlined
} from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import {
  deleteSmsTemplate,
  exportSmsTemplateExcel,
  getSmsTemplatePage
} from '@/api/system/smsTemplate'
import SaveSmsTemplateForm, {
  handleCreateSmsTemplate,
  handleEditSmsTemplate
} from './SaveSmsTemplateForm'
import { getSimpleSmsChannelList } from '@/api/system/smsChannel'
import { textConst } from '@/locales/zh-CN'
import { handleBatchDelete } from '@/components/BatchDelete'
import { handleDelete } from '@/components/SingleDelete'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'

const SmsTemplateConfig: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [channelOptions, setChannelOptions] = useState<{ label: string; value: number }[]>([])

  // ===== 加载短信渠道下拉列表 =====
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await getSimpleSmsChannelList()
        if (res.code === 0 && res.data) {
          const options = res.data.map((item: any) => ({
            label: item.signature || item.code, // 一般以标签或者编码为渠道说明
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

  // 短信类型枚举
  const smsTypeEnum = {
    1: { text: '验证码', color: 'blue' },
    2: { text: '通知', color: 'green' },
    3: { text: '营销', color: 'orange' }
  }

  // ===== 数据列定义 =====
  const columns: ProColumns<API.SystemSmsTemplateRespVO>[] = [
    {
      title: '短信类型',
      dataIndex: 'type',
      align: 'center',
      hideInTable: true,
      valueType: 'select',
      valueEnum: smsTypeEnum,
      fieldProps: {
        placeholder: '请输入短信类型'
      }
    },
    {
      title: '开启状态',
      dataIndex: 'status',
      align: 'center',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        0: { text: '开启', status: 'Success' },
        1: { text: '关闭', status: 'Error' }
      },
      fieldProps: {
        placeholder: '请输入开启状态'
      }
    },
    {
      title: '模板编码',
      dataIndex: 'code',
      align: 'center',
      width: 150,
      fieldProps: {
        placeholder: '请输入模板编码'
      }
    },
    {
      title: '短信 API 模板 ID',
      dataIndex: 'apiTemplateId',
      align: 'center',
      hideInTable: true,
      fieldProps: {
        placeholder: '请输入短信 API 模板 ID'
      }
    },
    {
      title: '短信渠道',
      dataIndex: 'channelId',
      align: 'center',
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        options: channelOptions,
        placeholder: '请输入短信渠道',
        showSearch: true
      }
    },
    {
      title: textConst.columns.createTime,
      dataIndex: 'createTime',
      valueType: 'dateRange',
      align: 'center',
      hideInTable: true,
      fieldProps: {
        placeholder: [textConst.columns.startDate, textConst.columns.endDate]
      }
    },
    {
      title: '模板名称',
      dataIndex: 'name',
      align: 'center',
      width: 150,
      hideInSearch: true,
      ellipsis: true
    },
    {
      title: '模板内容',
      dataIndex: 'content',
      align: 'center',
      width: 250,
      hideInSearch: true,
      render: (_, record) =>
        record.content ? (
          <Typography.Text style={{ width: 220, margin: 0 }} ellipsis={{ tooltip: record.content }}>
            {record.content}
          </Typography.Text>
        ) : (
          <span>-</span>
        )
    },
    {
      title: '短信类型', // 作为表格列展示
      dataIndex: 'type',
      align: 'center',
      width: 100,
      hideInSearch: true,
      render: (_, record) => {
        const conf = smsTypeEnum[record.type as keyof typeof smsTypeEnum]
        return conf ? <Tag color={conf.color}>{conf.text}</Tag> : <Tag>{record.type}</Tag>
      }
    },
    {
      title: '状态', // 作为表格列展示
      dataIndex: 'status',
      align: 'center',
      width: 100,
      hideInSearch: true,
      valueEnum: {
        0: { text: '开启', status: 'Success' },
        1: { text: '关闭', status: 'Error' }
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      width: 150,
      hideInSearch: true,
      ellipsis: true
    },
    {
      title: '短信 API 模板 ID', // 作为表格列展示
      dataIndex: 'apiTemplateId',
      align: 'center',
      width: 180,
      hideInSearch: true,
      render: (_, record) =>
        record.apiTemplateId ? (
          <Typography.Text
            style={{ width: 150, margin: 0 }}
            ellipsis={{ tooltip: record.apiTemplateId }}
          >
            {record.apiTemplateId}
          </Typography.Text>
        ) : (
          <span>-</span>
        )
    },
    {
      title: '短信渠道', // 作为表格列展示
      dataIndex: 'channelId',
      align: 'center',
      width: 150,
      hideInSearch: true,
      render: (_, record) => {
        const match = channelOptions.find((o) => o.value === record.channelId)
        return <Tag color="blue">{match ? match.label : record.channelId}</Tag> // 根据实际UI需要可不加颜色
      }
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
          <a key="edit" onClick={() => handleEditSmsTemplate(record)}>
            {textConst.action.update}
          </a>
          <a
            key="delete"
            style={deleteTextStyle}
            onClick={() =>
              handleDelete(record, deleteSmsTemplate, () => actionRef.current?.reload())
            }
          >
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  const handleExport = () => {
    Modal.confirm({
      title: textConst.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '确认导出所有短信模板数据项?',
      okText: textConst.common.ok,
      cancelText: textConst.common.cancel,
      onOk: async () => {
        try {
          const formValues = formRef.current?.getFieldsValue?.() || {}
          if (formValues.createTime && formValues.createTime.length === 2) {
            formValues.beginCreateTime = formValues.createTime[0] + ' 00:00:00'
            formValues.endCreateTime = formValues.createTime[1] + ' 23:59:59'
            delete formValues.createTime
          }
          const resp = await exportSmsTemplateExcel(formValues as any)
          if (!resp) return
          // 处理为 Blob 下载
          const blob = new Blob([resp as any], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = '短信模板数据.xlsx'
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
      <ProTable<API.SystemSmsTemplateRespVO>
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
            type,
            status,
            code,
            apiTemplateId,
            channelId,
            createTime,
            ...rest
          } = params
          let beginCreateTime, endCreateTime
          if (createTime && createTime.length === 2) {
            beginCreateTime = createTime[0] + ' 00:00:00'
            endCreateTime = createTime[1] + ' 23:59:59'
          }
          const resp = await getSmsTemplatePage({
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...(type !== undefined && type !== '' ? { type: Number(type) } : {}),
            ...(status !== undefined && status !== '' ? { status: Number(status) } : {}),
            ...(code ? { code } : {}),
            ...(apiTemplateId ? { apiTemplateId } : {}),
            ...(channelId !== undefined && channelId !== ''
              ? { channelId: Number(channelId) }
              : {}),
            ...(beginCreateTime ? { beginCreateTime } : {}),
            ...(endCreateTime ? { endCreateTime } : {}),
            ...rest
          } as any)
          return {
            data: resp.data?.list || [],
            success: true,
            total: resp.data?.total || 0
          }
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys)
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
            key="create"
            icon={<PlusOutlined />}
            onClick={() => handleCreateSmsTemplate()}
            type="primary"
          >
            {textConst.action.create}
          </Button>,
          <Button
            key="batchDelete"
            icon={<DeleteOutlined />}
            danger
            type="primary"
            disabled={selectedRowKeys.length === 0}
            onClick={() =>
              handleBatchDelete(
                selectedRowKeys,
                deleteSmsTemplate,
                () => setSelectedRowKeys([]),
                () => actionRef.current?.reload()
              )
            }
          >
            {textConst.action.batchDelete}
          </Button>,
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

      <SaveSmsTemplateForm
        onSuccess={() => actionRef.current?.reload()}
        channelOptions={channelOptions}
      />
    </>
  )
}

export default SmsTemplateConfig
