import React, { useRef, useState } from 'react'
import { Button, message, Modal, Space, Tag } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import {
  deleteFileConfig,
  deleteFileConfigList,
  getFileConfigPage,
  testFileConfig,
  updateFileConfigMaster
} from '@/api/infra/fileConfig'
import { textConst } from '@/locales/zh-CN'
import FileConfigForm, { STORAGE_OPTIONS } from '@/pages/infra/file/config/FileConfigForm'
import { handleBatchDelete, handleDelete } from '@/components/Delete'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'

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

  const handleMaster = (id: number) => {
    Modal.confirm({
      title: textConst.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: `是否确认修改配置 ID 为 ${id} 的数据项为主配置？`,
      okText: textConst.common.ok,
      cancelText: textConst.common.cancel,
      onOk: async () => {
        try {
          await updateFileConfigMaster({ id })
          message.success('操作成功')
          actionRef.current?.reload()
        } catch {
          message.error(textConst.error.operationFail)
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
          okText: textConst.common.ok,
          cancelText: textConst.common.cancel,
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
      fieldProps: { placeholder: '请输入存储器' }
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
      title: textConst.columns.createTime,
      dataIndex: 'createTime',
      align: 'center',
      valueType: 'dateRange',
      hideInTable: true,
      fieldProps: { placeholder: [textConst.columns.startDate, textConst.columns.endDate] }
    },
    {
      title: textConst.columns.createTime,
      dataIndex: 'createTime',
      align: 'center',
      hideInSearch: true,
      render: (_, record) => <span>{record.createTime}</span>
    },
    {
      title: textConst.form.operate,
      valueType: 'option',
      align: 'center',
      width: 240,
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a onClick={() => handleUpdate(record.id)}>{textConst.action.update}</a>
          <Button
            type="link"
            disabled={record.master}
            onClick={() => handleMaster(record.id)}
            style={{ padding: 0 }}
          >
            主配置
          </Button>
          <a onClick={() => handleTest(record.id)}>{textConst.action.test}</a>
          <a
            onClick={() =>
              handleDelete(record, deleteFileConfig, () => actionRef.current?.reload())
            }
            style={deleteTextStyle}
          >
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<API.InfraFileConfigRespVO>
        headerTitle="文件配置"
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
        search={{ labelWidth: 'auto', span: 6, defaultCollapsed: false }}
        options={{ reload: true, setting: true, density: true }}
        pagination={{ align: 'center', showSizeChanger: true }}
        toolBarRender={() => [
          <Button key="create" type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            {textConst.action.create}
          </Button>,
          <Button
            key="batchDelete"
            danger
            type="primary"
            icon={<DeleteOutlined />}
            disabled={selectedRowKeys.length === 0}
            onClick={() =>
              handleBatchDelete(
                selectedRowKeys,
                deleteFileConfigList,
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
