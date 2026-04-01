import React, { useRef, useState } from 'react'
import { Button, message, Modal } from 'antd'
import {
  DeleteOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  PlusOutlined
} from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { deleteRole, exportUsingGet, getRolePage } from '@/api/system/role'

import SaveRoleForm, { handleCreateRole, handleEditRole } from './SaveRoleForm'
import AssignMenuForm, { handleOpenMenuAssign } from './AssignMenuForm'
import AssignDataScopeForm, { handleOpenDataScope } from './AssignDataScopeForm'
import { textConst } from '@/locales/zh-CN'
import { handleBatchDelete } from '@/components/BatchDelete'
import { handleDelete } from '@/components/SingleDelete'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'

const Role: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // 数据列定义
  const columns: ProColumns<API.SystemRoleRespVO>[] = [
    {
      title: '角色 ID',
      dataIndex: 'id',
      align: 'center',
      hideInSearch: true,
      width: 80
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      align: 'center',
      width: 120,
      fieldProps: {
        placeholder: '请输入角色名称'
      }
    },
    {
      title: '角色类型',
      dataIndex: 'type',
      align: 'center',
      width: 100,
      hideInSearch: true,
      render: (_, record) => {
        return record.type === 1 ? (
          <span
            style={{
              color: '#ff4d4f',
              background: '#fff1f0',
              padding: '2px 8px',
              borderRadius: '4px'
            }}
          >
            内置
          </span>
        ) : (
          <span
            style={{
              color: '#1890ff',
              background: '#e6f7ff',
              padding: '2px 8px',
              borderRadius: '4px'
            }}
          >
            自定义
          </span>
        )
      }
    },
    {
      title: '角色标识',
      dataIndex: 'code',
      align: 'center',
      width: 120,
      fieldProps: {
        placeholder: '请输入角色标识'
      }
    },
    {
      title: '显示顺序',
      dataIndex: 'sort',
      align: 'center',
      width: 85,
      hideInSearch: true
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      width: 150,
      hideInSearch: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      valueType: 'select',
      valueEnum: {
        0: {
          text: '开启',
          status: 'Success'
        },
        1: {
          text: '关闭',
          status: 'Error'
        }
      }
    },
    {
      title: textConst.columns.createTime,
      dataIndex: 'createTime',
      valueType: 'dateRange',
      align: 'center',
      width: 180,
      fieldProps: {
        placeholder: [textConst.columns.startDate, textConst.columns.endDate]
      },
      render: (_, record) => <span>{record.createTime as any}</span>
    },
    {
      title: textConst.form.operate,
      valueType: 'option',
      align: 'center',
      width: 260,
      key: 'option',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a key="edit" onClick={() => handleEditRole(record)}>
            {textConst.action.update}
          </a>
          <a key="menu" onClick={() => handleOpenMenuAssign(record)}>
            {textConst.action.menuPermi}
          </a>
          <a key="data" onClick={() => handleOpenDataScope(record)}>
            {textConst.action.dataPermi}
          </a>
          <a
            key="delete"
            style={deleteTextStyle}
            onClick={() => handleDelete(record, deleteRole, () => actionRef.current?.reload())}
          >
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  const handleExport = () => {
    Modal.confirm({
      title: textConst.msg.reminder,
      icon: <ExclamationCircleOutlined />,
      content: '确定要导出角色数据吗？',
      onOk: async () => {
        try {
          const formValues = formRef.current?.getFieldsValue?.() || {}
          // 处理时间范围
          if (formValues.createTime && formValues.createTime.length === 2) {
            formValues.beginTime = formValues.createTime[0] + ' 00:00:00'
            formValues.endTime = formValues.createTime[1] + ' 23:59:59'
            delete formValues.createTime
          }
          const resp = await exportUsingGet({
            exportReqVO: formValues
          })
          const blob = new Blob([resp], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = '角色数据.xlsx'
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
      <ProTable<API.SystemRoleRespVO>
        columns={columns}
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        formRef={formRef}
        form={{ colon: false }}
        cardBordered
        request={async (params: Record<string, any>) => {
          const { current, pageSize, name, code, status, createTime, ...rest } = params
          let beginTime, endTime
          if (createTime && createTime.length === 2) {
            beginTime = createTime[0] + ' 00:00:00'
            endTime = createTime[1] + ' 23:59:59'
          }
          const resp = await getRolePage({
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...(name ? { name } : {}),
            ...(code ? { code } : {}),
            ...(status !== undefined && status !== '' ? { status: Number(status) } : {}),
            ...(beginTime ? { beginTime } : {}),
            ...(endTime ? { endTime } : {}),
            ...rest
          } as any)
          return {
            data: resp.data?.list,
            success: true,
            total: resp.data?.total
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
          <Button key="create" icon={<PlusOutlined />} onClick={handleCreateRole} type="primary">
            {textConst.action.create}
          </Button>,
          <Button
            key="export"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            style={{ color: '#52c41a', borderColor: '#b7eb8f', background: '#f6ffed' }}
          >
            {textConst.action.export}
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
                deleteRole,
                () => setSelectedRowKeys([]),
                () => actionRef.current?.reload()
              )
            }
          >
            {textConst.action.batchDelete}
          </Button>
        ]}
      />

      <SaveRoleForm onSuccess={() => actionRef.current?.reload()} />
      <AssignMenuForm />
      <AssignDataScopeForm />
    </>
  )
}

export default Role
