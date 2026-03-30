import React, { useRef, useState } from 'react'
import { Button, message, Modal, Space, Tag } from 'antd'
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import {
  deleteFileConfig,
  deleteFileConfigList,
  getFileConfigPage,
  testFileConfig,
  updateFileConfigMaster
} from '@/api/infra/fileConfig'
import FileConfigForm, { STORAGE_OPTIONS } from './FileConfigForm'

const FileConfigPage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
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

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '确认删除该数据？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteFileConfig({ id })
          message.success('删除成功')
          actionRef.current?.reload()
        } catch {
          message.error('删除失败')
        }
      }
    })
  }

  const handleDeleteBatch = () => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '是否删除所选中数据？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteFileConfigList({ ids: selectedRowKeys as number[] })
          message.success('删除成功')
          setSelectedRowKeys([])
          actionRef.current?.reloadAndRest?.()
        } catch {
          message.error('删除失败')
        }
      }
    })
  }

  const handleMaster = (id: number) => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: `是否确认修改配置 ID 为 ${id} 的数据项为主配置？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await updateFileConfigMaster({ id })
          message.success('操作成功')
          actionRef.current?.reload()
        } catch {
          message.error('操作失败')
        }
      }
    })
  }

  const handleTest = async (id: number) => {
    try {
      const resp = await testFileConfig({ id })
      if (resp && resp.data) {
        Modal.confirm({
          title: '测试上传成功',
          content: '是否要访问该文件？',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            window.open(resp.data, '_blank')
          }
        })
      }
    } catch {
      message.error('测试失败')
    }
  }

  const columns: ProColumns<API.InfraFileConfigRespVO>[] = [
    {
      title: '配置 ID',
      dataIndex: 'id',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '配置名称',
      dataIndex: 'name',
      align: 'center',
      fieldProps: { placeholder: '请输入配置名称' }
    },
    {
      title: '存储器',
      dataIndex: 'storage',
      align: 'center',
      valueType: 'select',
      valueEnum: STORAGE_OPTIONS.reduce(
        (acc, cur) => {
          let color = 'default'
          switch (cur.value) {
            case 10:
              color = 'processing'
              break
            case 11:
              color = 'warning'
              break
            case 12:
              color = 'error'
              break
            case 20:
              color = 'success' // or blue since image shows blue tag for S3
              break
          }
          acc[cur.value] = { text: cur.label, status: cur.value === 20 ? 'Processing' : color }
          return acc
        },
        {} as Record<string, any>
      ),
      fieldProps: { placeholder: '请选择存储器' }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '主配置',
      dataIndex: 'master',
      align: 'center',
      hideInSearch: true,
      render: (_, record) => {
        return record.master ? <Tag color="red">是</Tag> : <Tag color="default">否</Tag>
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      valueType: 'dateRange',
      hideInTable: true,
      fieldProps: { placeholder: ['开始日期', '结束日期'] }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      hideInSearch: true,
      render: (_, record) => <span>{record.createTime}</span>
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 240,
      render: (_, record) => (
        <Space size={12}>
          <a onClick={() => handleUpdate(record.id)}>编辑</a>
          <Button
            type="link"
            disabled={record.master}
            onClick={() => handleMaster(record.id)}
            style={{ padding: 0 }}
          >
            主配置
          </Button>
          <a onClick={() => handleTest(record.id)}>测试</a>
          <a onClick={() => handleDelete(record.id)} style={{ color: '#ff4d4f' }}>
            删除
          </a>
        </Space>
      )
    }
  ]

  return (
    <>
      <ProTable<API.InfraFileConfigRespVO>
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys
        }}
        columns={columns}
        actionRef={actionRef}
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
            const resp = await getFileConfigPage({
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
            console.error(e)
            return { data: [], success: false, total: 0 }
          }
        }}
        rowKey="id"
        search={{ labelWidth: 'auto', defaultCollapsed: false }}
        options={{ reload: true, setting: true, density: true }}
        pagination={{ align: 'center', showSizeChanger: true }}
        headerTitle={false}
        toolBarRender={() => [
          <Button key="create" type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新增
          </Button>,
          <Button
            key="delete"
            danger
            icon={<DeleteOutlined />}
            disabled={selectedRowKeys.length === 0}
            onClick={handleDeleteBatch}
            style={{ color: '#ff4d4f', borderColor: '#ff4d4f', background: '#fff1f0' }}
          >
            批量删除
          </Button>
        ]}
      />

      {formVisible && (
        <FileConfigForm
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

export default FileConfigPage
