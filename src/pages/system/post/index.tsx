import React, { useRef, useState } from 'react'
import { Button, message, Modal } from 'antd'
import {
  DeleteOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  PlusOutlined
} from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable
} from '@ant-design/pro-components'
import {
  createPost,
  deletePost,
  export1,
  getPostPage,
  updatePost
} from '@/api/system/post'

const PostManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editingPost, setEditingPost] = useState<API.SystemPostRespVO | null>(null)
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
        placeholder: '请选择状态'
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      align: 'center',
      width: 180,
      fieldProps: {
        placeholder: ['开始日期', '结束日期']
      },
      render: (_, record) => <span>{record.createTime as any}</span>
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 150,
      key: 'option',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <a key="edit" onClick={() => handleEdit(record)}>
            编辑
          </a>
          <a key="delete" style={{ color: '#ff4d4f' }} onClick={() => handleDelete(record)}>
            删除
          </a>
        </div>
      )
    }
  ]

  // ===== 删除岗位 =====
  const handleDelete = (record: API.SystemPostRespVO) => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '是否删除所选中数据？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deletePost({ id: record.id })
          message.success('删除成功')
          actionRef.current?.reload()
        } catch {
          message.error('删除失败')
        }
      }
    })
  }

  // ===== 批量删除 =====
  const handleBatchDelete = () => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '是否确认删除所选中数据?',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          // 假设后端支持批量或者前端循环请求
          await Promise.all(selectedRowKeys.map((id) => deletePost({ id: Number(id) })))
          message.success('批量删除成功')
          setSelectedRowKeys([])
          actionRef.current?.reload()
        } catch {
          message.error('批量删除失败')
        }
      }
    })
  }

  // ===== 导出岗位 =====
  const handleExport = () => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '确认导出所有岗位数据项?',
      okText: '确定',
      cancelText: '取消',
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
          message.success('导出成功')
        } catch {
          message.error('导出失败')
        }
      }
    })
  }

  // ===== 编辑岗位 =====
  const handleEdit = (record: API.SystemPostRespVO) => {
    setEditingPost(record)
    setCreateModalVisible(true)
  }

  return (
    <>
      <ProTable<API.SystemPostRespVO>
        columns={columns}
        actionRef={actionRef}
        formRef={formRef}
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
            onClick={() => {
              setEditingPost(null)
              setCreateModalVisible(true)
            }}
            type="primary"
          >
            新增
          </Button>,
          <Button
            key="export"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            style={{ color: '#52c41a', borderColor: '#b7eb8f', background: '#f6ffed' }}
          >
            导出
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
                : { color: '#ffccc7', borderColor: '#ffe6e6', background: '#fffaf0' } // 模拟图片中禁用的淡粉色背景
            }
          >
            批量删除
          </Button>
        ]}
      />

      {/* ========== 新增/编辑岗位弹窗 ========== */}
      <ModalForm<API.SystemPostSaveReqVO>
        title={editingPost ? '编辑' : '新增'}
        width={600}
        open={createModalVisible}
        onOpenChange={(visible) => {
          setCreateModalVisible(visible)
          if (!visible) {
            setEditingPost(null)
          }
        }}
        initialValues={
          editingPost
            ? {
              ...editingPost
            }
            : { sort: 0, status: 0 }
        }
        layout="horizontal"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        colon={false}
        modalProps={{
          destroyOnClose: true,
          bodyStyle: { paddingBottom: 0 }
        }}
        onFinish={async (values) => {
          try {
            let resp
            if (editingPost) {
              resp = await updatePost({ ...values, id: editingPost.id } as any)
            } else {
              resp = await createPost(values as any)
            }
            if (resp.code === 0) {
              message.success(editingPost ? '修改成功' : '创建成功')
              actionRef.current?.reload()
              return true
            } else {
              message.error(resp.msg || (editingPost ? '修改失败' : '创建失败'))
              return false
            }
          } catch {
            message.error(editingPost ? '修改失败' : '创建失败')
            return false
          }
        }}
      >
        <ProFormText
          name="name"
          label="岗位标题"
          colProps={{ span: 24 }}
          placeholder="请输入岗位名称"
          rules={[{ required: true, message: '请输入岗位标题' }]}
        />
        <ProFormText
          name="code"
          label="岗位编码"
          colProps={{ span: 24 }}
          placeholder="请输入岗位编码"
          rules={[{ required: true, message: '请输入岗位编码' }]}
        />
        <ProFormDigit
          name="sort"
          label="岗位顺序"
          colProps={{ span: 24 }}
          placeholder="请输入岗位顺序"
          fieldProps={{ min: 0 }}
        />
        <ProFormSelect
          name="status"
          label="状态"
          colProps={{ span: 24 }}
          placeholder="请选择状态"
          options={[
            { label: '开启', value: 0 },
            { label: '关闭', value: 1 }
          ]}
          rules={[{ required: true, message: '请选择状态' }]}
        />
        <ProFormTextArea
          name="remark"
          label="备注"
          colProps={{ span: 24 }}
          placeholder="请输入备注内容"
          fieldProps={{ rows: 3 }}
        />
      </ModalForm>
    </>
  )
}

export default PostManagement
