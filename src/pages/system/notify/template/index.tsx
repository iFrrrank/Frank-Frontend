import React, { useRef, useState } from 'react'
import { Button, message, Modal, Space, Typography } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { deleteNotifyTemplate, getNotifyTemplatePage } from '@/api/system/notifyTemplate'
import SaveNotifyTemplateForm, {
  handleCreateNotifyTemplate,
  handleEditNotifyTemplate
} from './SaveNotifyTemplateForm'
import { textConst } from '@/locales/zh-CN'
import { handleBatchDelete } from '@/components/BatchDelete'
import { handleDelete } from '@/components/SingleDelete'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'

const NotifyTemplateConfig: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // 状态枚举
  const statusEnum = {
    0: { text: '开启', status: 'Success' },
    1: { text: '关闭', status: 'Error' }
  }

  // 类型枚举 (这里假设1和2为常用类型，由于没有具体字典值，先使用这俩)
  const typeEnum = {
    1: { text: '系统通知' },
    2: { text: '业务通知' },
    3: { text: '会议通知' }
  }

  // ===== 数据列定义 =====
  const columns: ProColumns<API.SystemNotifyTemplateRespVO>[] = [
    {
      title: '模板编码',
      dataIndex: 'code',
      align: 'center',
      width: 150,
      fieldProps: {
        placeholder: '请输入模板编码'
      },
      order: 2
    },
    {
      title: '模板名称',
      dataIndex: 'name',
      align: 'center',
      width: 150,
      fieldProps: {
        placeholder: '请输入模板名称'
      },
      order: 3
    },
    {
      title: '类型',
      dataIndex: 'type',
      align: 'center',
      width: 120,
      hideInSearch: true,
      valueType: 'select',
      valueEnum: typeEnum
    },
    {
      title: '发送人名称',
      dataIndex: 'nickname',
      align: 'center',
      width: 150,
      hideInSearch: true
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
      title: '开启状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      valueType: 'select',
      valueEnum: statusEnum,
      fieldProps: {
        placeholder: '请输入开启状态'
      },
      order: 1
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
      title: textConst.columns.createTime,
      dataIndex: 'createTime',
      align: 'center',
      width: 180,
      valueType: 'dateRange',
      render: (_, record) => <span>{record.createTime as any}</span>,
      fieldProps: {
        placeholder: [textConst.columns.startDate, textConst.columns.endDate]
      },
      order: 0
    },
    {
      title: textConst.form.operate,
      valueType: 'option',
      align: 'center',
      width: 120,
      key: 'option',
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a key="edit" onClick={() => handleEditNotifyTemplate(record)}>
            {textConst.action.update}
          </a>
          <a
            key="delete"
            style={deleteTextStyle}
            onClick={() =>
              handleDelete(record, deleteNotifyTemplate, () => actionRef.current?.reload())
            }
          >
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<API.SystemNotifyTemplateRespVO>
        columns={columns}
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        formRef={formRef}
        form={{ colon: false }}
        cardBordered
        request={async (params: Record<string, any>) => {
          const { current, pageSize, name, code, status, createTime, ...rest } = params
          let beginCreateTime, endCreateTime
          if (createTime && createTime.length === 2) {
            beginCreateTime = createTime[0] + ' 00:00:00'
            endCreateTime = createTime[1] + ' 23:59:59'
          }

          const resp = await getNotifyTemplatePage({
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...(name ? { name } : {}),
            ...(code ? { code } : {}),
            ...(status !== undefined && status !== '' ? { status: Number(status) } : {}),
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
          defaultCollapsed: false,
          optionRender: (searchConfig, formProps, dom) => [...dom.reverse()]
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
            type="primary"
            onClick={() => handleCreateNotifyTemplate()}
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
                deleteNotifyTemplate,
                () => setSelectedRowKeys([]),
                () => actionRef.current?.reload()
              )
            }
          >
            {textConst.action.batchDelete}
          </Button>
        ]}
      />

      <SaveNotifyTemplateForm onSuccess={() => actionRef.current?.reload()} />
    </>
  )
}

export default NotifyTemplateConfig
