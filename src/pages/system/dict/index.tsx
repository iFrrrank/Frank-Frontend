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
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
  ProTable
} from '@ant-design/pro-components'
import { history } from '@umijs/max'
import {
  createDictType,
  deleteDictType,
  export2,
  pageDictTypes,
  updateDictType
} from '@/api/system/dictType'

const DictTypeConfig: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editingDictType, setEditingDictType] = useState<API.SystemDictTypeRespVO | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // ===== 数据列定义 =====
  const columns: ProColumns<API.SystemDictTypeRespVO>[] = [
    {
      title: '字典ID',
      dataIndex: 'id',
      align: 'center',
      hideInSearch: true,
      width: 80
    },
    {
      title: '字典名称',
      dataIndex: 'name',
      align: 'center',
      width: 160,
      fieldProps: {
        placeholder: '请输入字典名称'
      }
    },
    {
      title: '字典类型',
      dataIndex: 'type',
      align: 'center',
      width: 200,
      fieldProps: {
        placeholder: '请输入字典类型'
      }
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
        placeholder: '请选择字典状态'
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      width: 180,
      hideInSearch: true,
      ellipsis: true
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
      width: 180,
      key: 'option',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <a key="edit" onClick={() => handleEdit(record)}>
            修改
          </a>
          <a key="data" onClick={() => handleData(record)}>
            数据
          </a>
          <a key="delete" style={{ color: '#ff4d4f' }} onClick={() => handleDelete(record)}>
            删除
          </a>
        </div>
      )
    }
  ]

  // ===== 删除字典类型 =====
  const handleDelete = (record: API.SystemDictTypeRespVO) => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '是否确认删除选中数据？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteDictType({ id: record.id })
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
      content: '是否确认删除选中数据?',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await Promise.all(selectedRowKeys.map((id) => deleteDictType({ id: Number(id) })))
          message.success('批量删除成功')
          setSelectedRowKeys([])
          actionRef.current?.reload()
        } catch {
          message.error('批量删除失败')
        }
      }
    })
  }

  // ===== 导出字典类型 =====
  const handleExport = () => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '确认导出所有字典类型数据项?',
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
          const resp = await export2(formValues as any)
          if (!resp) return
          // 处理为 Blob 下载
          const blob = new Blob([resp as any], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = '字典类型数据.xlsx'
          link.click()
          window.URL.revokeObjectURL(url)
          message.success('导出成功')
        } catch {
          message.error('导出失败')
        }
      }
    })
  }

  // ===== 修改 =====
  const handleEdit = (record: API.SystemDictTypeRespVO) => {
    setEditingDictType(record)
    setCreateModalVisible(true)
  }

  // ===== 字典数据维护页 =====
  const handleData = (record: API.SystemDictTypeRespVO) => {
    history.push(`/system/dict/data/${record.type}`)
  }

  return (
    <>
      <ProTable<API.SystemDictTypeRespVO>
        columns={columns}
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        formRef={formRef}
        cardBordered
        request={async (params: Record<string, any>) => {
          const { current, pageSize, name, type, status, createTime, ...rest } = params
          let beginTime, endTime
          if (createTime && createTime.length === 2) {
            beginTime = createTime[0] + ' 00:00:00'
            endTime = createTime[1] + ' 23:59:59'
          }
          const resp = await pageDictTypes({
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...(name ? { name } : {}),
            ...(type ? { type } : {}),
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
              setEditingDictType(null)
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

      {/* ========== 新增/修改弹窗 ========== */}
      <ModalForm<API.SystemDictTypeSaveReqVO>
        title={editingDictType ? '修改' : '新增'}
        width={600}
        open={createModalVisible}
        onOpenChange={(visible) => {
          setCreateModalVisible(visible)
          if (!visible) {
            setEditingDictType(null)
          }
        }}
        initialValues={
          editingDictType
            ? {
              ...editingDictType
            }
            : { status: 0 }
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
            if (editingDictType) {
              resp = await updateDictType({ ...values, id: editingDictType.id } as any)
            } else {
              resp = await createDictType(values as any)
            }
            if (resp.code === 0) {
              message.success(editingDictType ? '修改成功' : '创建成功')
              actionRef.current?.reload()
              return true
            } else {
              message.error(resp.msg || (editingDictType ? '修改失败' : '创建失败'))
              return false
            }
          } catch {
            message.error(editingDictType ? '修改失败' : '创建失败')
            return false
          }
        }}
      >
        <ProFormText
          name="name"
          label="字典名称"
          colProps={{ span: 24 }}
          placeholder="请输入字典名称"
          rules={[{ required: true, message: '请输入字典名称' }]}
        />
        <ProFormText
          name="type"
          label="字典类型"
          colProps={{ span: 24 }}
          placeholder="请输入字典类型"
          rules={[
            { required: true, message: '请输入字典类型' },
            { pattern: /^[a-z_0-9]+$/, message: '字典类型必须以小写字母、数字或下划线组成' } // 根据常见业务规则加入正则表达式体验更佳
          ]}
        />
        <ProFormRadio.Group
          name="status"
          label="状态"
          colProps={{ span: 24 }}
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

export default DictTypeConfig
