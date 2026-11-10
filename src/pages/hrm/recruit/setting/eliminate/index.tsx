import React, { useEffect, useState } from 'react'
import { Button, Card, Input, Space, Table, message } from 'antd'
import { CheckOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { getRecruitEliminateReasonList, saveRecruitEliminateReason } from '@/api/hrm/recruit/config'
import { textConst } from '@/locales/zh-CN'

const RecruitEliminateReasonPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [reasonList, setReasonList] = useState<string[]>([])

  const fetchReasons = async () => {
    setLoading(true)
    try {
      const resp = await getRecruitEliminateReasonList()
      setReasonList(resp.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReasons()
  }, [])

  const handleAddReason = () => {
    if (reasonList.some((reason) => !reason.trim())) {
      message.warning('请先填写新增的淘汰原因')
      return
    }
    setReasonList([...reasonList, ''])
  }

  const handleRemoveReason = (index: number) => {
    const nextList = [...reasonList]
    nextList.splice(index, 1)
    setReasonList(nextList)
  }

  const handleReasonChange = (index: number, val: string) => {
    const nextList = [...reasonList]
    nextList[index] = val
    setReasonList(nextList)
  }

  const handleSave = async () => {
    const reasons = reasonList.map((reason) => reason.trim())
    if (reasons.some((reason) => !reason)) {
      message.warning('淘汰原因不能为空')
      return
    }
    if (new Set(reasons).size !== reasons.length) {
      message.warning('淘汰原因不能重复')
      return
    }

    setSaving(true)
    try {
      await saveRecruitEliminateReason({ reasons })
      message.success(textConst.msg.updateSuccess)
      fetchReasons()
    } catch {
      message.error(textConst.msg.updateError)
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    {
      title: '序号',
      key: 'index',
      width: 80,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => index + 1
    },
    {
      title: '淘汰原因',
      key: 'reason',
      render: (_: any, record: string, index: number) => (
        <Input
          value={record}
          maxLength={255}
          placeholder="请输入淘汰原因"
          onChange={(e) => handleReasonChange(index, e.target.value)}
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveReason(index)}
        >
          {textConst.action.delete}
        </Button>
      )
    }
  ]

  const dataSource = reasonList.map((item, idx) => ({ key: idx, reason: item }))

  return (
    <Card
      title="淘汰原因列表"
      variant="borderless"
      extra={
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddReason}>
            {textConst.action.addNew}
          </Button>
          <Button type="primary" icon={<CheckOutlined />} loading={saving} onClick={handleSave}>
            {textConst.action.save}
          </Button>
        </Space>
      }
    >
      <Table
        loading={loading}
        columns={columns}
        dataSource={reasonList as any}
        pagination={false}
        bordered
        rowKey={(_, index) => String(index)}
      />
    </Card>
  )
}

export default RecruitEliminateReasonPage
