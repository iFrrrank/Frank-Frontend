import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Button, Input, Modal, Space, Table, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import {
  fmsDigestCreateDigest,
  fmsDigestDeleteDigest,
  fmsDigestGetDigestList,
  fmsDigestUpdateDigest
} from '@/api/fms/config/digest'
import HasPermi, { useHasPermi } from '@/directives/permission/HasPermi'
import { deleteTextStyle, tableActionStyle } from '@/styles/common.style'
import { useFmsStore } from '../../../store/fms'

export interface FmsDigestLibraryRef {
  open: (accountSetId: number) => void
}

interface FmsDigestLibraryProps {
  onSelect: (content: string) => void
}

/**
 * 常用摘要库弹窗组件（支持快速新增、编辑、双击带入）
 */
const FmsDigestLibrary = forwardRef<FmsDigestLibraryRef, FmsDigestLibraryProps>(
  ({ onSelect }, ref) => {
    const hasPermi = useHasPermi()
    const fmsStore = useFmsStore()

    const [visible, setVisible] = useState(false)
    const [accountSetId, setAccountSetId] = useState(0)
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [list, setList] = useState<API.FmsDigestRespVO[]>([])
    const [total, setTotal] = useState(0)
    const [pageNo, setPageNo] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [editingId, setEditingId] = useState<number | undefined>()
    const [content, setContent] = useState('')

    const fetchList = async (currentAccountSetId: number, _current = pageNo, _size = pageSize) => {
      if (!currentAccountSetId) return
      setLoading(true)
      try {
        const resp = await fmsDigestGetDigestList({
          accountSetId: currentAccountSetId
        })
        if (resp.code === 0 && resp.data) {
          setList(resp.data || [])
          setTotal((resp.data || []).length)
        }
      } finally {
        setLoading(false)
      }
    }

    useImperativeHandle(ref, () => ({
      open: (id: number) => {
        setAccountSetId(id)
        setPageNo(1)
        setEditingId(undefined)
        setContent('')
        setVisible(true)
        fetchList(id, 1, pageSize)
      }
    }))

    const handleSubmit = async () => {
      const value = content.trim()
      if (!value) {
        message.warning('请输入摘要内容')
        return
      }
      setSubmitting(true)
      try {
        if (editingId) {
          const resp = await fmsDigestUpdateDigest({
            id: editingId,
            accountSetId,
            content: value
          })
          if (resp.code === 0) {
            message.success('修改成功')
          }
        } else {
          const resp = await fmsDigestCreateDigest({
            accountSetId,
            content: value
          })
          if (resp.code === 0) {
            message.success('添加成功')
            setPageNo(1)
          }
        }
        setEditingId(undefined)
        setContent('')
        await fetchList(accountSetId, editingId ? pageNo : 1, pageSize)
      } finally {
        setSubmitting(false)
      }
    }

    const handleDelete = (row: API.FmsDigestRespVO) => {
      Modal.confirm({
        title: '系统提示',
        icon: <ExclamationCircleOutlined />,
        content: '确认删除该摘要吗？',
        onOk: async () => {
          const resp = await fmsDigestDeleteDigest({ accountSetId, id: row.id })
          if (resp.code === 0) {
            message.success('删除成功')
            if (editingId === row.id) {
              setEditingId(undefined)
              setContent('')
            }
            const nextPage = list.length === 1 && pageNo > 1 ? pageNo - 1 : pageNo
            setPageNo(nextPage)
            await fetchList(accountSetId, nextPage, pageSize)
          }
        }
      })
    }

    const handleSelect = (row: API.FmsDigestRespVO) => {
      onSelect(row.content)
      setVisible(false)
    }

    const columns: ColumnsType<API.FmsDigestRespVO> = [
      {
        title: '摘要内容',
        dataIndex: 'content',
        ellipsis: true
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        width: 150,
        render: (_, record) => (
          <div style={tableActionStyle}>
            <a onClick={() => handleSelect(record)}>选择</a>
            {fmsStore.isAccountSetWritable && hasPermi('fms:digest:update') && (
              <a
                onClick={() => {
                  setEditingId(record.id)
                  setContent(record.content)
                }}
              >
                编辑
              </a>
            )}
            {fmsStore.isAccountSetWritable && hasPermi('fms:digest:delete') && (
              <a style={deleteTextStyle} onClick={() => handleDelete(record)}>
                删除
              </a>
            )}
          </div>
        )
      }
    ]

    return (
      <Modal
        title="常用摘要库"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={680}
        destroyOnHidden
      >
        {fmsStore.isAccountSetWritable && (
          <HasPermi value={['fms:digest:create', 'fms:digest:update']}>
            <div style={{ marginBottom: 14 }}>
              <Input.TextArea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                maxLength={500}
                showCount
                placeholder="请输入常用摘要内容"
              />
              <div style={{ marginTop: 8, textAlign: 'right' }}>
                <Space>
                  {editingId && (
                    <Button
                      onClick={() => {
                        setEditingId(undefined)
                        setContent('')
                      }}
                    >
                      取消编辑
                    </Button>
                  )}
                  <Button type="primary" loading={submitting} onClick={handleSubmit}>
                    {editingId ? '保存修改' : '添加摘要'}
                  </Button>
                </Space>
              </div>
            </div>
          </HasPermi>
        )}

        <Table<API.FmsDigestRespVO>
          rowKey="id"
          loading={loading}
          dataSource={list}
          columns={columns}
          bordered
          size="small"
          onRow={(record) => ({
            onDoubleClick: () => handleSelect(record)
          })}
          pagination={{
            current: pageNo,
            pageSize,
            total,
            showSizeChanger: true,
            onChange: (page, size) => {
              setPageNo(page)
              setPageSize(size)
              fetchList(accountSetId, page, size)
            }
          }}
        />
      </Modal>
    )
  }
)

FmsDigestLibrary.displayName = 'FmsDigestLibrary'

export default FmsDigestLibrary

