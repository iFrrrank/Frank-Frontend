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
import SaveSmsTemplateModal, {
  handleCreateSmsTemplate,
  handleEditSmsTemplate
} from './SaveSmsTemplateForm'
import { getSimpleSmsChannelList } from '@/api/system/smsChannel'
import { textConstants } from '@/locales/zh-CN'

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
        placeholder: 'textConstants.common.selectText短信类型'
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
        placeholder: 'textConstants.common.selectText开启状态'
      }
    },
    {
      title: '模板编码',
      dataIndex: 'code',
      align: 'center',
      width: 150,
      fieldProps: {
        placeholder: `${textConstants.common.inputText}模板编码`
      }
    },
    {
      title: '短信 API 模板 ID',
      dataIndex: 'apiTemplateId',
      align: 'center',
      hideInTable: true,
      fieldProps: {
        placeholder: `${textConstants.common.inputText}短信 API 模板 ID`
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
        placeholder: 'textConstants.common.selectText短信渠道',
        showSearch: true
      }
    },
    {
      title: textConstants.columns.createTime,
      dataIndex: 'createTime',
      valueType: 'dateRange',
      align: 'center',
      hideInTable: true,
      fieldProps: {
        placeholder: ['开始日期', '结束日期']
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
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 150,
      key: 'option',
      fixed: 'right',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <a key="edit" onClick={() => handleEditSmsTemplate(record)}>
            修改
          </a>
          <a key="delete" style={{ color: '#ff4d4f' }} onClick={() => handleDelete(record)}>
            删除
          </a>
        </div>
      )
    }
  ]

  // ===== 删除短信模板 =====
  const handleDelete = (record: API.SystemSmsTemplateRespVO) => {
    Modal.confirm({
      title: textConstants.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '是否确认删除选中数据？',
      okText: textConstants.common.ok,
      cancelText: textConstants.common.cancel,
      onOk: async () => {
        try {
          await deleteSmsTemplate({ id: record.id })
          message.success(textConstants.msg.delSuccess)
          actionRef.current?.reload()
        } catch {
          message.error(textConstants.msg.delFail)
        }
      }
    })
  }

  // ===== 批量删除 =====
  const handleBatchDelete = () => {
    Modal.confirm({
      title: textConstants.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '是否确认删除选中数据?',
      okText: textConstants.common.ok,
      cancelText: textConstants.common.cancel,
      onOk: async () => {
        try {
          await Promise.all(selectedRowKeys.map((id) => deleteSmsTemplate({ id: Number(id) })))
          message.success(textConstants.msg.batchDelSuccess)
          setSelectedRowKeys([])
          actionRef.current?.reload()
        } catch {
          message.error(textConstants.msg.batchDelFail)
        }
      }
    })
  }

  // ===== 导出短信模板 =====
  const handleExport = () => {
    Modal.confirm({
      title: textConstants.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '确认导出所有短信模板数据项?',
      okText: textConstants.common.ok,
      cancelText: textConstants.common.cancel,
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
          message.success('导出成功')
        } catch {
          message.error('导出失败')
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
            新增
          </Button>,
          <Button
            key="batchDelete"
            icon={<DeleteOutlined />}
            danger
            disabled={selectedRowKeys.length === 0}
            onClick={handleBatchDelete}
            style={
              selectedRowKeys.length > 0
                ? { color: '#ff4d4f', borderColor: '#ffccc7', background: '#fff2f0' }
                : { color: '#ffccc7', borderColor: '#ffe6e6', background: '#fffaf0' }
            }
          >
            批量删除
          </Button>,
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

      <SaveSmsTemplateModal
        onSuccess={() => actionRef.current?.reload()}
        channelOptions={channelOptions}
      />
    </>
  )
}

export default SmsTemplateConfig
