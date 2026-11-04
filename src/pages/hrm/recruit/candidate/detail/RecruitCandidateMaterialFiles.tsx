import React from 'react'
import { Button, Empty, Space, Table } from 'antd'
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons'

interface RecruitCandidateMaterialFilesProps {
  candidate: API.HrmRecruitCandidateRespVO
}

const getFileName = (url: string) => {
  if (!url) return ''
  const parts = url.split('/')
  return decodeURIComponent(parts[parts.length - 1] || url)
}

const RecruitCandidateMaterialFiles: React.FC<RecruitCandidateMaterialFilesProps> = ({
  candidate
}) => {
  const urls = candidate.resumeUrls || []

  if (!urls.length) {
    return <Empty description="暂无材料附件" />
  }

  const columns = [
    {
      title: '文件名称',
      dataIndex: 'url',
      render: (url: string) => <span>{getFileName(url)}</span>
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      align: 'center' as const,
      render: (_: any, record: { url: string }) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => window.open(record.url, '_blank')}
          >
            预览
          </Button>
          <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => {
              const link = document.createElement('a')
              link.href = record.url
              link.download = getFileName(record.url)
              link.click()
            }}
          >
            下载
          </Button>
        </Space>
      )
    }
  ]

  const data = urls.map((url, idx) => ({ key: idx, url }))

  return <Table columns={columns} dataSource={data} pagination={false} size="small" />
}

export default RecruitCandidateMaterialFiles
