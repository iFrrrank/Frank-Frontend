import React, { useRef, useState } from 'react'
import type { UploadFile } from 'antd'
import { Button, message, Modal, Space, Typography, Upload } from 'antd'
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  InboxOutlined,
  UploadOutlined
} from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { deleteFile, deleteFileList, getFilePage, uploadFile } from '@/api/infra/fileList'
import { textConstants } from '@/locales/zh-CN'

const { Dragger } = Upload

/** 允许的文件类型 */
const ACCEPT_TYPES = ['image/jpeg', 'image/png', 'image/gif']
const ACCEPT_EXTENSIONS = '.jpg,.jpeg,.png,.gif'
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

/** 格式化文件大小 */
const formatFileSize = (bytes?: number): string => {
  if (bytes === undefined || bytes === null) return '-'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

const FileListPage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [uploadModalVisible, setUploadModalVisible] = useState(false)
  const [uploadFileList, setUploadFileList] = useState<UploadFile[]>([])
  const [uploading, setUploading] = useState(false)

  /** 复制链接 */
  const handleCopyLink = (url?: string) => {
    if (!url) {
      message.warning('文件链接为空')
      return
    }
    navigator.clipboard
      .writeText(url)
      .then(() => message.success('链接已复制到剪贴板'))
      .catch(() => message.error(textConstants.msg.copyError))
  }

  /** 删除单条 */
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: textConstants.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '确认删除该文件？',
      okText: textConstants.common.ok,
      cancelText: textConstants.common.cancel,
      onOk: async () => {
        try {
          await deleteFile({ id })
          message.success(textConstants.msg.delSuccess)
          actionRef.current?.reload()
        } catch {
          message.error(textConstants.msg.delError)
        }
      }
    })
  }

  /** 批量删除 */
  const handleDeleteBatch = () => {
    Modal.confirm({
      title: textConstants.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '是否删除所选中的文件？',
      okText: textConstants.common.ok,
      cancelText: textConstants.common.cancel,
      onOk: async () => {
        try {
          await deleteFileList({ ids: selectedRowKeys as number[] })
          message.success(textConstants.msg.delSuccess)
          setSelectedRowKeys([])
          actionRef.current?.reloadAndRest?.()
        } catch {
          message.error(textConstants.msg.delError)
        }
      }
    })
  }

  /** 打开上传弹窗 */
  const handleOpenUpload = () => {
    setUploadFileList([])
    setUploadModalVisible(true)
  }

  /** 确认上传 */
  const handleUploadConfirm = async () => {
    if (uploadFileList.length === 0) {
      message.warning('请先选择文件')
      return
    }
    const file = uploadFileList[0]?.originFileObj
    if (!file) {
      message.warning('请先选择文件')
      return
    }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      await uploadFile(formData as any)
      message.success('上传成功')
      setUploadModalVisible(false)
      setUploadFileList([])
      actionRef.current?.reload()
    } catch {
      message.error('上传失败')
    } finally {
      setUploading(false)
    }
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
      title: textConstants.columns.createTime,
      dataIndex: 'createTime',
      align: 'center',
      valueType: 'dateRange',
      hideInTable: true,
      fieldProps: { placeholder: ['开始日期', '结束日期'] }
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
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size={12}>
          <a key="copy" onClick={() => handleCopyLink(record.url)} style={{ color: '#1677ff' }}>
            复制链接
          </a>
          <a key="delete" onClick={() => handleDelete(record.id)} style={{ color: '#ff4d4f' }}>
            删除
          </a>
        </Space>
      )
    }
  ]

  return (
    <>
      <ProTable<API.InfraFileRespVO>
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
        search={{ labelWidth: 'auto' }}
        options={false}
        pagination={{ align: 'center', showSizeChanger: true }}
        headerTitle={false}
        toolBarRender={() => [
          <Button key="upload" type="primary" icon={<UploadOutlined />} onClick={handleOpenUpload}>
            上传文件
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

      {/* 上传文件弹窗 */}
      <Modal
        title="上传文件"
        open={uploadModalVisible}
        onOk={handleUploadConfirm}
        onCancel={() => {
          setUploadModalVisible(false)
          setUploadFileList([])
        }}
        okText="确 定"
        cancelText="取 消"
        confirmLoading={uploading}
        width={600}
      >
        <Dragger
          accept={ACCEPT_EXTENSIONS}
          maxCount={1}
          fileList={uploadFileList}
          beforeUpload={(file) => {
            // 校验文件类型
            if (!ACCEPT_TYPES.includes(file.type)) {
              message.error('仅允许上传 jpg、png、gif 格式文件！')
              return Upload.LIST_IGNORE
            }
            // 校验文件大小
            if (file.size > MAX_FILE_SIZE) {
              message.error('文件大小不能超过 2MB！')
              return Upload.LIST_IGNORE
            }
            return false // 阻止自动上传
          }}
          onChange={({ fileList }) => setUploadFileList(fileList)}
          onRemove={() => setUploadFileList([])}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            将文件拖到此处，或 <a>点击上传</a>
          </p>
        </Dragger>
        <div style={{ color: '#ff4d4f', marginTop: 8, fontSize: 13 }}>
          提示：仅允许导入 jpg、png、gif 格式文件！
        </div>
      </Modal>
    </>
  )
}

export default FileListPage
