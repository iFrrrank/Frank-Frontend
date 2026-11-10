import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Button, Input, Modal, Space, Table, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import {
  fmsVoucherTemplateCategoryCreateTemplateCategory,
  fmsVoucherTemplateCategoryDeleteTemplateCategory,
  fmsVoucherTemplateCategoryGetTemplateCategorySimpleList,
  fmsVoucherTemplateCategoryUpdateTemplateCategory
} from '@/api/fms/config/voucherTemplateCategory'
import HasPermi, { useHasPermi } from '@/directives/permission/HasPermi'
import { deleteTextStyle, tableActionStyle } from '@/styles/common.style'

export interface FmsVoucherTemplateCategoryManageRef {
  open: (accountSetId: number) => void
}

interface FmsVoucherTemplateCategoryManageProps {
  onSuccess: () => void
}

/**
 * 凭证模板类别快速维护弹窗
 */
const FmsVoucherTemplateCategoryManage = forwardRef<
  FmsVoucherTemplateCategoryManageRef,
  FmsVoucherTemplateCategoryManageProps
>(({ onSuccess }, ref) => {
  const hasPermi = useHasPermi()
  const [visible, setVisible] = useState(false)
  const [accountSetId, setAccountSetId] = useState(0)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [list, setList] = useState<API.FmsVoucherTemplateCategoryRespVO[]>([])
  const [editingId, setEditingId] = useState<number | undefined>()
  const [name, setName] = useState('')

  const loadList = async (id = accountSetId) => {
    if (!id) return
    setLoading(true)
    try {
      const resp = await fmsVoucherTemplateCategoryGetTemplateCategorySimpleList({
        accountSetId: id
      })
      if (resp.code === 0) {
        setList(resp.data || [])
      }
    } finally {
      setLoading(false)
    }
  }

  useImperativeHandle(ref, () => ({
    open: (id: number) => {
      setAccountSetId(id)
      setEditingId(undefined)
      setName('')
      setVisible(true)
      loadList(id)
    }
  }))

  const handleSubmit = async () => {
    const value = name.trim()
    if (!value) {
      message.warning('类别名称不能为空')
      return
    }
    setSubmitting(true)
    try {
      const resp = editingId
        ? await fmsVoucherTemplateCategoryUpdateTemplateCategory({
            id: editingId,
            accountSetId,
            name: value
          })
        : await fmsVoucherTemplateCategoryCreateTemplateCategory({
            accountSetId,
            name: value
          })
      if (resp.code === 0) {
        message.success(editingId ? '修改成功' : '新增成功')
        setEditingId(undefined)
        setName('')
        await loadList()
        onSuccess()
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = (row: API.FmsVoucherTemplateCategoryRespVO) => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined />,
      content: `确认删除模板类别 "${row.name}" 吗？`,
      onOk: async () => {
        const resp = await fmsVoucherTemplateCategoryDeleteTemplateCategory({
          accountSetId,
          id: row.id
        })
        if (resp.code === 0) {
          message.success('删除成功')
          if (editingId === row.id) {
            setEditingId(undefined)
            setName('')
          }
          await loadList()
          onSuccess()
        }
      }
    })
  }

  const columns: ColumnsType<API.FmsVoucherTemplateCategoryRespVO> = [
    {
      title: '类别名称',
      dataIndex: 'name'
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 140,
      render: (_, record) => (
        <div style={tableActionStyle}>
          {hasPermi('fms:config:voucher-template-category:update') && (
            <a
              onClick={() => {
                setEditingId(record.id)
                setName(record.name)
              }}
            >
              编辑
            </a>
          )}
          {hasPermi('fms:config:voucher-template-category:delete') && (
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
      title="模板类别管理"
      open={visible}
      onCancel={() => setVisible(false)}
      width={560}
      destroyOnHidden
      footer={<Button onClick={() => setVisible(false)}>关闭</Button>}
    >
      <HasPermi
        value={[
          'fms:config:voucher-template-category:create',
          'fms:config:voucher-template-category:update'
        ]}
      >
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            placeholder="请输入模板类别名称"
            onPressEnter={handleSubmit}
          />
          <Space>
            {editingId && (
              <Button
                onClick={() => {
                  setEditingId(undefined)
                  setName('')
                }}
              >
                取消
              </Button>
            )}
            <Button type="primary" loading={submitting} onClick={handleSubmit}>
              {editingId ? '保存修改' : '新增类别'}
            </Button>
          </Space>
        </div>
      </HasPermi>

      <Table<API.FmsVoucherTemplateCategoryRespVO>
        rowKey="id"
        loading={loading}
        dataSource={list}
        columns={columns}
        pagination={false}
        bordered
        size="small"
        scroll={{ y: 280 }}
      />
    </Modal>
  )
})

FmsVoucherTemplateCategoryManage.displayName = 'FmsVoucherTemplateCategoryManage'

export default FmsVoucherTemplateCategoryManage
