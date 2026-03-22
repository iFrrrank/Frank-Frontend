import React, { useEffect, useMemo, useState } from 'react'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { message } from 'antd'

export interface EditorProps {
  id?: string
  height?: string | number
  editorConfig?: Partial<IEditorConfig>
  readonly?: boolean
  value?: string
  onChange?: (val: string) => void
  disabled?: boolean
}

const WangEditor: React.FC<EditorProps> = ({
  id = 'wangeditor-1',
  height = '200px',
  editorConfig: customConfig = {},
  readonly = false,
  value = '',
  onChange,
  disabled = false
}) => {
  // 编辑器实例
  const [editor, setEditor] = useState<IDomEditor | null>(null)

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {}

  // 编辑器配置
  const editorConfig = useMemo((): Partial<IEditorConfig> => {
    const accessToken = localStorage.getItem('accessToken')
    const uploadUrl = 'http://localhost:9001/admin-api/infra/file/upload'

    return {
      placeholder: '请输入内容...',
      readOnly: readonly || disabled,
      autoFocus: false,
      scroll: true,
      MENU_CONF: {
        uploadImage: {
          server: uploadUrl,
          maxFileSize: 5 * 1024 * 1024,
          maxNumberOfFiles: 10,
          allowedFileTypes: ['image/*'],
          headers: {
            Authorization: 'Bearer ' + accessToken
          },
          timeout: 15 * 1000,
          fieldName: 'file',
          customInsert(res: any, insertFn: any) {
            if (res.code === 0) {
              insertFn(res.data, 'image', res.data)
            } else {
              message.error(res.msg || '上传失败')
            }
          }
        },
        uploadVideo: {
          server: uploadUrl,
          maxFileSize: 10 * 1024 * 1024,
          maxNumberOfFiles: 10,
          allowedFileTypes: ['video/*'],
          headers: {
            Authorization: 'Bearer ' + accessToken
          },
          timeout: 15 * 1000,
          fieldName: 'file',
          customInsert(res: any, insertFn: any) {
            if (res.code === 0) {
              insertFn(res.data, 'video', res.data)
            } else {
              message.error(res.msg || '上传失败')
            }
          }
        }
      },
      ...customConfig
    }
  }, [readonly, disabled, customConfig])

  // 及时销毁编辑器
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  const editorStyle = {
    height: typeof height === 'number' ? `${height}px` : height,
    overflowY: 'hidden' as const
  }

  return (
    <div className="wangeditor-container">
      <style>
        {`
          .wangeditor-container { 
            border: 1px solid #d9d9d9; 
            z-index: 100; 
          }
          .wangeditor-container .w-e-toolbar { border-bottom: 1px solid #d9d9d9 !important; }
          .wangeditor-container .w-e-text-container { border-top: none !important; }
        `}
      </style>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{ borderBottom: '1px solid #d9d9d9' }}
      />
      <Editor
        defaultConfig={editorConfig}
        value={value}
        onCreated={setEditor}
        onChange={(editor) => onChange?.(editor.getHtml())}
        mode="default"
        style={editorStyle}
      />
    </div>
  )
}

export default WangEditor

