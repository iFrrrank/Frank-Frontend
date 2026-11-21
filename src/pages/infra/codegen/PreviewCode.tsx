import React, { useEffect, useState } from 'react'
import { Drawer, Empty, Tabs } from 'antd'
import { previewCodegen } from '@/api/infra/codegen'

interface PreviewCodeProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  tableId?: number
  tableName?: string
}

// 代码预览：按文件路径分标签展示生成的代码内容
const PreviewCode: React.FC<PreviewCodeProps> = ({ visible, setVisible, tableId, tableName }) => {
  const [files, setFiles] = useState<API.InfraCodegenPreviewVO[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!visible || tableId === undefined) return
    setLoading(true)
    previewCodegen({ tableId })
      .then((resp) => {
        if (resp.code === 0) setFiles(resp.data || [])
      })
      .finally(() => setLoading(false))
  }, [visible, tableId])

  return (
    <Drawer
      title={`代码预览${tableName ? ` - ${tableName}` : ''}`}
      open={visible}
      onClose={() => setVisible(false)}
      width={980}
      destroyOnHidden
    >
      {files.length === 0 && !loading ? (
        <Empty description="暂无生成代码" />
      ) : (
        <Tabs
          tabPosition="left"
          style={{ maxHeight: '100%' }}
          items={files.map((file, index) => ({
            key: String(index),
            label: <span title={file.filePath}>{(file.filePath || '').split('/').pop()}</span>,
            children: (
              <div>
                <div style={{ color: '#8c8c8c', marginBottom: 8 }}>{file.filePath}</div>
                <pre
                  style={{
                    background: '#f6f8fa',
                    padding: 12,
                    overflow: 'auto',
                    maxHeight: 'calc(100vh - 220px)',
                    fontSize: 12
                  }}
                >
                  {file.code}
                </pre>
              </div>
            )
          }))}
        />
      )}
    </Drawer>
  )
}

export default PreviewCode
