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
import { deletePost, export1, getPostPage } from '@/api/system/post'

import SavePostForm, { handleCreatePost, handleEditPost } from './SavePostForm'
import { textConst } from '@/locales/zh-CN'
import { handleBatchDelete } from '@/components/BatchDelete'
import { handleDelete } from '@/components/SingleDelete'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'

const PostManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // ===== 数据列定义 =====
  const columns: ProColumns<API.SystemPostRespVO>[] = [
    {
      title: '岗位ID',
      dataIndex: 'id',
      align: 'center',
      hideInSearch: true,
      width: 80
    },
    {
      title: '岗位名称',
      dataIndex: 'name',
      align: 'center',
      width: 150,
      fieldProps: {
        placeholder: '请输入岗位名称'
      }
    },
    {
      title: '岗位编码',
      dataIndex: 'code',
      align: 'center',
      width: 150,
      fieldProps: {
        placeholder: '请输入岗位编码'
      }
    },
    {
      title: '岗位顺序',
      dataIndex: 'sort',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '岗位备注',
      dataIndex: 'remark',
      align: 'center',
      width: 180,
      hideInSearch: true,
      ellipsis: true
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
      },
      fieldProps: {
        placeholder: 'textConst.common.selectText状态'
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
      width: 150,
      key: 'option',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a key="edit" onClick={() => handleEditPost(record)}>
            {textConst.action.update}
          </a>
          <a
            key="delete"
            style={deleteTextStyle}
            onClick={() => handleDelete(record, deletePost, () => actionRef.current?.reload())}
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
      content: '确认导出所有岗位数据项?',
      okText: textConst.common.ok,
      cancelText: textConst.common.cancel,
      onOk: async () => {
        try {
          const formValues = formRef.current?.getFieldsValue?.() || {}
          if (formValues.createTime && formValues.createTime.length === 2) {
            formValues.beginTime = formValues.createTime[0] + ' 00:00:00'
            formValues.endTime = formValues.createTime[1] + ' 23:59:59'
            delete formValues.createTime
          }
          const resp = await export1(formValues as any)
          if (!resp) return
          // 处理为 Blob 下载
          const blob = new Blob([resp], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = '岗位数据.xlsx'
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
      <ProTable<API.SystemPostRespVO>
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
          const resp = await getPostPage({
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
            data: resp.data?.list || [],
            success: true,
            total: resp.data?.total || 0
          }
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys: React.Key[]) => setSelectedRowKeys(keys)
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
          <Button key="create" icon={<PlusOutlined />} onClick={handleCreatePost} type="primary">
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
                deletePost,
                () => setSelectedRowKeys([]),
                () => actionRef.current?.reload()
              )
            }
          >
            {textConst.action.batchDelete}
          </Button>
        ]}
      />

      <SavePostForm onSuccess={() => actionRef.current?.reload()} />
    </>
  )
}

export default PostManagement
