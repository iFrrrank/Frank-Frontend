import React, { useRef, useState } from 'react'
import { Button, message, Modal, Space, Typography } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import {
  deleteDataSourceConfig,
  deleteDataSourceConfigList,
  getDataSourceConfigList
} from '@/api/infra/dataSourceConfig'
import DataSourceConfigForm from './DataSourceConfigForm'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/SingleDelete'
import { handleBatchDelete } from '@/components/BatchDelete'

const DataSourceConfigPage: React.FC = () => {
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

  const columns: ProColumns<API.InfraDataSourceConfigRespVO>[] = [
    {
      title: '主键 ID',
      dataIndex: 'id',
      align: 'center'
    },
    {
      title: '数据源名称',
      dataIndex: 'name',
      align: 'center'
    },
    {
      title: '数据源连接',
      dataIndex: 'url',
      align: 'center',
      render: (_, record) => (
        <Typography.Text
          ellipsis={{ tooltip: record.url }}
          style={{ width: 300, display: 'inline-block' }}
        >
          {record.url}
        </Typography.Text>
      )
    },
    {
      title: '用户名',
      dataIndex: 'username',
      align: 'center'
    },
    {
      title: textConst.columns.createTime,
      dataIndex: 'createTime',
      align: 'center',
      render: (_, record) => <span>{record.createTime}</span>
    },
    {
      title: textConst.form.operate,
      valueType: 'option',
      align: 'center',
      width: 120,
      render: (_, record) => (
        <Space size={12}>
          <a key="edit" onClick={() => handleUpdate(record.id)} style={{ color: '#1677ff' }}>
            {textConst.action.update}
          </a>
          <a
            key="delete"
            onClick={() =>
              handleDelete(record, deleteDataSourceConfig, () => actionRef.current?.reload())
            }
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
      <ProTable<API.InfraDataSourceConfigRespVO>
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys
        }}
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async () => {
          try {
            const resp = await getDataSourceConfigList()
            return {
              data: resp.data || [],
              success: true,
              total: resp.data?.length || 0
            }
          } catch (e) {
            console.error('获取数据源配置列表失败', e)
            message.error('获取数据失败')
            return { data: [], success: false, total: 0 }
          }
        }}
        rowKey="id"
        search={false}
        options={false}
        pagination={false}
        headerTitle={false}
        toolBarRender={() => [
          <Button key="create" type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            {textConst.action.create}
          </Button>,
          <Button
            key="delete"
            danger
            type="primary"
            icon={<DeleteOutlined />}
            disabled={selectedRowKeys.length === 0}
            onClick={() =>
              handleBatchDelete(
                selectedRowKeys,
                deleteDataSourceConfigList,
                () => setSelectedRowKeys([]),
                () => actionRef.current?.reload()
              )
            }
          >
            {textConst.action.batchDelete}
          </Button>
        ]}
      />

      {formVisible && (
        <DataSourceConfigForm
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

export default DataSourceConfigPage
