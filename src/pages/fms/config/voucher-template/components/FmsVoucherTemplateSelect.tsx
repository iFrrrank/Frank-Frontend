import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react'
import { Button, Input, Modal, Space, Table } from 'antd'
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { fmsSubjectGetSubjectSimpleList } from '@/api/fms/config/subject'
import { fmsVoucherTemplateGetVoucherTemplateSimpleList } from '@/api/fms/config/voucherTemplate'
import { formatMoney } from '../../../utils/format'
import FmsVoucherTemplateCategorySelect from './FmsVoucherTemplateCategorySelect'

export interface FmsVoucherTemplateSelectRef {
  open: (accountSetId: number) => void
}

interface FmsVoucherTemplateSelectProps {
  onSelect: (template: API.FmsVoucherTemplateRespVO) => void
}

interface FlatTemplateRow {
  rowKey: string
  template: API.FmsVoucherTemplateRespVO
  rowSpan: number
  digest: string
  subjectDisplay: string
  debitAmount?: number
  creditAmount?: number
}

/**
 * 选择凭证模板弹窗（支持按模板跨行展示分录、双击或点击选择套用）
 */
const FmsVoucherTemplateSelect = forwardRef<
  FmsVoucherTemplateSelectRef,
  FmsVoucherTemplateSelectProps
>(({ onSelect }, ref) => {
  const [visible, setVisible] = useState(false)
  const [accountSetId, setAccountSetId] = useState(0)
  const [loading, setLoading] = useState(false)
  const [categoryId, setCategoryId] = useState<number | undefined>()
  const [name, setName] = useState('')
  const [allList, setAllList] = useState<API.FmsVoucherTemplateRespVO[]>([])
  const [subjectMap, setSubjectMap] = useState<Map<number, API.FmsSubjectRespVO>>(
    new Map()
  )

  const fetchList = async (id = accountSetId) => {
    if (!id) return
    setLoading(true)
    try {
      const [tplResp, subResp] = await Promise.all([
        fmsVoucherTemplateGetVoucherTemplateSimpleList({ accountSetId: id }),
        fmsSubjectGetSubjectSimpleList({ accountSetId: String(id) })
      ])
      if (tplResp.code === 0) {
        setAllList(tplResp.data || [])
      }
      if (subResp.code === 0) {
        setSubjectMap(
          new Map((subResp.data || []).map((item) => [item.id, item]))
        )
      }
    } finally {
      setLoading(false)
    }
  }

  useImperativeHandle(ref, () => ({
    open: (id: number) => {
      setAccountSetId(id)
      setCategoryId(undefined)
      setName('')
      setVisible(true)
      fetchList(id)
    }
  }))

  const filteredList = useMemo(() => {
    const kw = name.trim().toLowerCase()
    return allList.filter((item) => {
      if (categoryId !== undefined && item.categoryId !== categoryId) return false
      if (kw && !item.name.toLowerCase().includes(kw)) return false
      return true
    })
  }, [allList, categoryId, name])

  const flatRows = useMemo<FlatTemplateRow[]>(
    () =>
      filteredList.flatMap((template) =>
        (template.entries || []).map((entry, idx) => {
          const subject = subjectMap.get(entry.subjectId)
          const subjectDisplay = subject
            ? `${subject.code} ${subject.name}`
            : String(entry.subjectId || '-')
          return {
            rowKey: `${template.id}-${idx}`,
            template,
            rowSpan: idx === 0 ? template.entries.length : 0,
            digest: entry.digest,
            subjectDisplay,
            debitAmount: entry.debitAmount,
            creditAmount: entry.creditAmount
          }
        })
      ),
    [filteredList, subjectMap]
  )

  const handleSelect = (template: API.FmsVoucherTemplateRespVO) => {
    onSelect(template)
    setVisible(false)
  }

  const columns: ColumnsType<FlatTemplateRow> = [
    {
      title: '模板类别',
      key: 'categoryName',
      align: 'center',
      width: 110,
      onCell: (record) => ({ rowSpan: record.rowSpan }),
      render: (_, record) => record.template.categoryName
    },
    {
      title: '模板名称',
      key: 'name',
      width: 160,
      onCell: (record) => ({ rowSpan: record.rowSpan }),
      render: (_, record) => record.template.name
    },
    {
      title: '摘要',
      dataIndex: 'digest',
      minWidth: 160
    },
    {
      title: '科目',
      dataIndex: 'subjectDisplay',
      minWidth: 220
    },
    {
      title: '借方金额',
      dataIndex: 'debitAmount',
      align: 'right',
      width: 120,
      render: (val) => formatMoney(val)
    },
    {
      title: '贷方金额',
      dataIndex: 'creditAmount',
      align: 'right',
      width: 120,
      render: (val) => formatMoney(val)
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 80,
      onCell: (record) => ({ rowSpan: record.rowSpan }),
      render: (_, record) => (
        <a onClick={() => handleSelect(record.template)}>选择</a>
      )
    }
  ]

  return (
    <Modal
      title="选择凭证模板"
      open={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      width={940}
      destroyOnHidden
    >
      <Space wrap style={{ marginBottom: 14 }}>
        <span>模板类别：</span>
        <FmsVoucherTemplateCategorySelect
          value={categoryId}
          allowClear
          placeholder="全部类别"
          style={{ width: 180 }}
          onChange={(val) => setCategoryId(val)}
        />
        <span>模板名称：</span>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          allowClear
          placeholder="请输入模板名称"
          style={{ width: 200 }}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={() => fetchList(accountSetId)}
        >
          搜索
        </Button>
        <Button
          icon={<ReloadOutlined />}
          onClick={() => {
            setCategoryId(undefined)
            setName('')
          }}
        >
          重置
        </Button>
      </Space>

      <Table<FlatTemplateRow>
        rowKey="rowKey"
        loading={loading}
        dataSource={flatRows}
        columns={columns}
        bordered
        size="small"
        scroll={{ y: 420 }}
        onRow={(record) => ({
          onDoubleClick: () => handleSelect(record.template)
        })}
        pagination={false}
      />
    </Modal>
  )
})

FmsVoucherTemplateSelect.displayName = 'FmsVoucherTemplateSelect'

export default FmsVoucherTemplateSelect
