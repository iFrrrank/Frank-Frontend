import React, { useRef, useState } from 'react'
import { Button, message, Typography } from 'antd'
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { deleteFile, deleteFileList, getFilePage, uploadFile } from '@/api/infra/fileList'
import { textConst } from '@/locales/zh-CN'
import { handleBatchDelete, handleDelete } from '@/components/Delete'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import ImportModal from '@/components/Import'
import { formatFileSize } from '@/utils/file'

const FileListPage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [importVisible, setImportVisible] = useState<boolean>(false)

  // 复制链接
  const handleCopyLink = (url?: string) => {
    if (!url) {
      message.warning('文件链接为空')
      return
    }
    navigator.clipboard
      .writeText(url)
      .then(() => message.success(textConst.msg.copySuccess))
      .catch(() => message.error(textConst.msg.copyError))
  }

  const columns: ProColumns<API.InfraFileRespVO>[] = [
    {
      title: '文件路径',
      dataIndex: 'path',
      align: 'center',
      fieldProps: { placeholder: '请输入文件路径' },
      render: (_, record) => (
        <Typography.Text
          ellipsis={{ tooltip: record.path }}
          style={{ width: 200, display: 'inline-block' }}
        >
          {record.path}
        </Typography.Text>
      )
    },
    {
      title: '文件类型',
      dataIndex: 'type',
      align: 'center',
      fieldProps: { placeholder: '请输入文件类型' },
      hideInTable: true
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
      title: '文件名',
      dataIndex: 'name',
      align: 'center',
      hideInSearch: true,
      render: (_, record) => (
        <Typography.Text
          ellipsis={{ tooltip: record.name }}
          style={{ width: 180, display: 'inline-block' }}
        >
          {record.name}
        </Typography.Text>
      )
    },
    {
      title: '文件路径',
      dataIndex: 'path',
      align: 'center',
      hideInSearch: true,
      render: (_, record) => (
        <Typography.Text
          ellipsis={{ tooltip: record.path }}
          style={{ width: 200, display: 'inline-block' }}
        >
          {record.path}
        </Typography.Text>
      )
    },
    {
      title: 'URL',
      dataIndex: 'url',
      align: 'center',
      hideInSearch: true,
      render: (_, record) => (
        <Typography.Text
          ellipsis={{ tooltip: record.url }}
          style={{ width: 220, display: 'inline-block' }}
        >
          {record.url}
        </Typography.Text>
      )
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      align: 'center',
      hideInSearch: true,
      render: (_, record) => <span>{formatFileSize(record.size)}</span>
    },
    {
      title: '文件类型',
      dataIndex: 'type',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '文件内容',
      dataIndex: 'url',
      align: 'center',
      hideInSearch: true,
      width: 80,
      render: (_, record) => {
        if (record.type?.startsWith('image/')) {
          return (
            <a href={record.url} target="_blank" rel="noopener noreferrer">
              <img
                src={record.url}
                alt={record.name}
                style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = 'none'
                  ;(e.target as HTMLImageElement).parentElement!.textContent = '加载失败'
                }}
              />
            </a>
          )
        }
        return <span style={{ color: '#999' }}>加载失败</span>
      }
    },
    {
      title: '上传时间',
      dataIndex: 'createTime',
      align: 'center',
      hideInSearch: true,
      render: (_, record) => <span>{record.createTime}</span>
    },
    {
      title: textConst.form.operate,
      valueType: 'option',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a key="copy" onClick={() => handleCopyLink(record.url)} style={{ color: '#1677ff' }}>
            {textConst.action.copyLink}
          </a>
          <a
            key="delete"
            style={deleteTextStyle}
            onClick={() => handleDelete(record, deleteFile, () => actionRef.current?.reload())}
          >
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<API.InfraFileRespVO>
        headerTitle="文件列表"
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
            const resp = await getFilePage({
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
            console.error('获取文件列表失败', e)
            message.error('获取数据失败')
            return { data: [], success: false, total: 0 }
          }
        }}
        rowKey="id"
        search={{ labelWidth: 'auto', span: 6 }}
        options={false}
        pagination={{ align: 'center', showSizeChanger: true }}
        toolBarRender={() => [
          <Button
            key="upload"
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => setImportVisible(true)}
          >
            {textConst.action.uploadFile}
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
                deleteFileList,
                () => setSelectedRowKeys([]),
                () => actionRef.current?.reloadAndRest?.()
              )
            }
          >
            {textConst.action.batchDelete}
          </Button>
        ]}
      />

      <ImportModal
        title="上传文件"
        open={importVisible}
        accept=".jpg,.png,.gif"
        onCancel={() => setImportVisible(false)}
        onSuccess={() => {
          setImportVisible(false)
          // 导入成功后刷新表格
          actionRef.current?.reload()
        }}
        importApi={uploadFile}
        draggerHint="仅允许导入 jpg、png、gif 格式文件"
      />
    </>
  )
}

export default FileListPage
