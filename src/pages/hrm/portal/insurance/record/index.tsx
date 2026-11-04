import React, { useEffect, useState } from 'react'
import { Button, Card, DatePicker, Empty, Space, Table, Tag, Typography } from 'antd'
import dayjs from 'dayjs'
import type { InsuranceRecordVO } from '@/api/hrm/portal/insurance'
import { getInsuranceRecordList } from '@/api/hrm/portal/insurance'
import { formatHrmMoney } from '@/pages/hrm/utils/format'
import { checkHrmPortalAccess } from '../../utils'
import InsuranceRecordDetail from './InsuranceRecordDetail'

const SCHEME_TYPES: Record<number, string> = {
  1: '比例方案',
  2: '固定方案'
}

const HrmPortalInsurancePage: React.FC = () => {
  const [accessible, setAccessible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [records, setRecords] = useState<InsuranceRecordVO[]>([])
  const [year, setYear] = useState<dayjs.Dayjs>(dayjs())

  const [detailVisible, setDetailVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<InsuranceRecordVO>()

  const loadRecords = async (targetYear = year) => {
    setLoading(true)
    try {
      const resp = await getInsuranceRecordList({
        year: targetYear.year()
      })
      setRecords(resp.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkHrmPortalAccess().then((canAccess) => {
      setAccessible(canAccess)
      if (canAccess) {
        loadRecords()
      }
    })
  }, [])

  if (!accessible) return null

  const recordTotal = (row: InsuranceRecordVO) => {
    return (
      (row.personalInsuranceAmount || 0) +
      (row.personalProvidentFundAmount || 0) +
      (row.corporateInsuranceAmount || 0) +
      (row.corporateProvidentFundAmount || 0)
    )
  }

  const columns = [
    {
      title: '所属月份',
      key: 'month',
      width: 120,
      fixed: 'left' as const,
      render: (_: any, row: InsuranceRecordVO) =>
        `${row.year}-${String(row.month).padStart(2, '0')}`
    },
    {
      title: '参保方案',
      dataIndex: 'schemeName',
      key: 'schemeName',
      minWidth: 160,
      render: (name: string, row: InsuranceRecordVO) => (
        <div>
          <div>{name || '-'}</div>
          {row.schemeCity && <div style={{ fontSize: 12, color: '#8c8c8c' }}>{row.schemeCity}</div>}
        </div>
      )
    },
    {
      title: '方案类型',
      dataIndex: 'schemeType',
      key: 'schemeType',
      align: 'center' as const,
      width: 110,
      render: (type: number) => (type ? <Tag color="blue">{SCHEME_TYPES[type] || '-'}</Tag> : '-')
    },
    {
      title: '个人社保',
      dataIndex: 'personalInsuranceAmount',
      key: 'personalInsuranceAmount',
      align: 'right' as const,
      width: 120,
      render: (val: any) => `¥ ${formatHrmMoney(val)}`
    },
    {
      title: '公司社保',
      dataIndex: 'corporateInsuranceAmount',
      key: 'corporateInsuranceAmount',
      align: 'right' as const,
      width: 120,
      render: (val: any) => `¥ ${formatHrmMoney(val)}`
    },
    {
      title: '个人公积金',
      dataIndex: 'personalProvidentFundAmount',
      key: 'personalProvidentFundAmount',
      align: 'right' as const,
      width: 120,
      render: (val: any) => `¥ ${formatHrmMoney(val)}`
    },
    {
      title: '公司公积金',
      dataIndex: 'corporateProvidentFundAmount',
      key: 'corporateProvidentFundAmount',
      align: 'right' as const,
      width: 120,
      render: (val: any) => `¥ ${formatHrmMoney(val)}`
    },
    {
      title: '合计',
      key: 'total',
      align: 'right' as const,
      width: 130,
      render: (_: any, row: InsuranceRecordVO) => (
        <strong style={{ color: '#1890ff' }}>¥ {formatHrmMoney(recordTotal(row))}</strong>
      )
    },
    {
      title: '操作',
      key: 'action',
      align: 'center' as const,
      width: 100,
      fixed: 'right' as const,
      render: (_: any, row: InsuranceRecordVO) => (
        <a
          onClick={() => {
            setCurrentRecord(row)
            setDetailVisible(true)
          }}
        >
          查看详情
        </a>
      )
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card bodyStyle={{ padding: 16 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography.Title level={4} style={{ margin: 0 }}>
            社保管理
          </Typography.Title>

          <DatePicker
            picker="year"
            value={year}
            allowClear={false}
            onChange={(val) => {
              if (val) {
                setYear(val)
                loadRecords(val)
              }
            }}
            style={{ width: 130 }}
          />
        </div>
      </Card>

      <Card bodyStyle={{ padding: 16 }}>
        {records.length > 0 ? (
          <Table
            loading={loading}
            columns={columns}
            dataSource={records}
            rowKey="id"
            pagination={false}
            size="small"
            bordered
            scroll={{ x: 'max-content' }}
          />
        ) : (
          <Empty description="暂无社保数据" />
        )}
      </Card>

      {/* 社保记录详情弹窗 */}
      <InsuranceRecordDetail
        visible={detailVisible}
        setVisible={setDetailVisible}
        record={currentRecord}
      />
    </div>
  )
}

export default HrmPortalInsurancePage
