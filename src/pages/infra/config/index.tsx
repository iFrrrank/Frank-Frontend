import React, { useRef, useState } from 'react'
import { Button, message, Modal, Space, Tag } from 'antd'
import {
  DeleteOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  PlusOutlined
} from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { deleteConfig, deleteConfigList, exportConfig, getConfigPage } from '@/api/infra/config'
import ConfigForm from './ConfigForm'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/SingleDelete'
import { handleBatchDelete } from '@/components/BatchDelete'

/** 系统内置选项 */
const CONFIG_TYPE_OPTIONS = [
  { label: '是', value: 1 },
  { label: '否', value: 2 }
]

const ConfigPage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const [formVisible, setFormVisible] = useState(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  const handleCreate = () => {
    setCurrentId(undefined)
    setFormVisible(true)
  }

  const handleUpdate = (id: number) => {
    setCurrentId(id)
    setFormVisible(true)
  }

  /** 导出 */
  const handleExport = async () => {
    try {
      const params = formRef.current?.getFieldsValue() || {}
      const { createTime, ...rest } = params
      let beginTimeStr, endTimeStr
      if (createTime && createTime.length === 2) {
        beginTimeStr = createTime[0] + ' 00:00:00'
        endTimeStr = createTime[1] + ' 23:59:59'
      }
      const resp = await exportConfig({
        ...(beginTimeStr && endTimeStr ? { createTime: [beginTimeStr, endTimeStr] } : {}),
        ...rest,
        pageNo: '1',
        pageSize: '100'
      } as any)
      // 处理文件下载
      const blob = new Blob([resp], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = '参数配置.xlsx'
      link.click()
      window.URL.revokeObjectURL(url)
      message.success(textConst.msg.exportSuccess)
    } catch {
      message.error('textConst.msg.exportError')
    }
  }

  const columns: ProColumns<API.InfraConfigRespVO>[] = [
    {
      title: '参数名称',
      dataIndex: 'name',
      align: 'center',
      fieldProps: { placeholder: '请输入参数名称' },
      hideInTable: true
    },
    {
      title: '参数键名',
      dataIndex: 'key',
      align: 'center',
      fieldProps: { placeholder: '请输入参数键名' },
      hideInTable: true
    },
    {
      title: '系统内置',
      dataIndex: 'type',
      align: 'center',
      valueType: 'select',
      fieldProps: {
        placeholder: '请输入系统内置',
        options: CONFIG_TYPE_OPTIONS
      },
      hideInTable: true
    },
    {
      title: textConst.columns.createTime,
      dataIndex: 'createTime',
      align: 'center',
      valueType: 'dateRange',
      hideInTable: true,
      fieldProps: { placeholder: ['开始日期', '结束日期'] }
    },
    {
      title: '参数主键',
      dataIndex: 'id',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '参数分类',
      dataIndex: 'category',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '参数名称',
      dataIndex: 'name',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '参数键名',
      dataIndex: 'key',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '参数键值',
      dataIndex: 'value',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '是否可见',
      dataIndex: 'visible',
      align: 'center',
      hideInSearch: true,
      render: (_, record) =>
        record.visible ? <Tag color="success">是</Tag> : <Tag color="error">否</Tag>
    },
    {
      title: '系统内置',
      dataIndex: 'type',
      align: 'center',
      hideInSearch: true,
      render: (_, record) =>
        record.type === 1 ? <Tag color="error">是</Tag> : <Tag color="success">否</Tag>
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      hideInSearch: true,
      ellipsis: true
    },
    {
      title: textConst.columns.createTime,
      dataIndex: 'createTime',
      align: 'center',
      hideInSearch: true,
      render: (_, record) => <span>{record.createTime}</span>
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size={12}>
          <a key="edit" onClick={() => handleUpdate(record.id)} style={{ color: '#1677ff' }}>
            编辑
          </a>
          <a
            key="delete"
            onClick={() => handleDelete(record, deleteConfig, () => actionRef.current?.reload())}
            style={{ color: '#ff4d4f' }}
          >
            {textConst.action.delete}
          </a>
        </Space>
      )
    }
  ]

  return (
    <>
      <ProTable<API.InfraConfigRespVO>
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys
        }}
        columns={columns}
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        formRef={formRef}
        form={{ colon: false }}
        cardBordered
        request={async (params) => {
          const { current, pageSize, createTime, ...rest } = params
          let beginTimeStr, endTimeStr
          if (createTime && createTime.length === 2) {
            beginTimeStr = createTime[0] + ' 00:00:00'
            endTimeStr = createTime[1] + ' 23:59:59'
          }
          try {
            const resp = await getConfigPage({
              pageNo: current || 1,
              pageSize: pageSize || 10,
              ...(beginTimeStr && endTimeStr ? { createTime: [beginTimeStr, endTimeStr] } : {}),
              ...rest
            } as any)
            return {
              data: resp.data?.list || [],
              success: true,
              total: resp.data?.total || 0
            }
          } catch (e) {
            console.error('获取参数配置列表失败', e)
            message.error('获取数据失败')
            return { data: [], success: false, total: 0 }
          }
        }}
        rowKey="id"
        search={{ labelWidth: 'auto', defaultCollapsed: false }}
        options={false}
        pagination={{ align: 'center', showSizeChanger: true }}
        headerTitle={false}
        toolBarRender={() => [
          <Button key="create" type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            {textConst.action.create}
          </Button>,
          <Button
            key="delete"
            danger
            icon={<DeleteOutlined />}
            disabled={selectedRowKeys.length === 0}
            onClick={() =>
              handleBatchDelete(
                selectedRowKeys,
                deleteConfigList,
                () => setSelectedRowKeys([]),
                () => actionRef.current?.reload()
              )
            }
            style={{ color: '#ff4d4f', borderColor: '#ff4d4f', background: '#fff1f0' }}
          >
            {textConst.action.batchDelete}
          </Button>,
          <Button
            key="export"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            style={{ color: '#e6a23c', borderColor: '#e6a23c', background: '#fdf6ec' }}
          >
            导出
          </Button>
        ]}
      />

      {formVisible && (
        <ConfigForm
          visible={formVisible}
          setVisible={setFormVisible}
          id={currentId}
          onSuccess={() => {
            setFormVisible(false)
            actionRef.current?.reload()
          }}
        />
      )}
    </>
  )
}

export default ConfigPage
