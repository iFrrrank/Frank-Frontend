import React, { useEffect, useState } from 'react'
import { Descriptions, Modal, Table, Tag } from 'antd'
import type { InsuranceRecordVO, InsuranceSchemeProjectVO } from '@/api/hrm/portal/insurance'
import { getInsuranceRecord } from '@/api/hrm/portal/insurance'
import { formatHrmMoney, formatHrmRate } from '@/pages/hrm/utils/format'

interface InsuranceRecordDetailProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  record?: InsuranceRecordVO
}

const SCHEME_TYPES: Record<number, string> = {
  1: '比例方案',
  2: '固定方案'
}

const InsuranceRecordDetail: React.FC<InsuranceRecordDetailProps> = ({
  visible,
  setVisible,
  record: initialRecord
}) => {
  const [loading, setLoading] = useState(false)
  const [record, setRecord] = useState<InsuranceRecordVO>()

  useEffect(() => {
    if (!visible || !initialRecord?.id) {
      setRecord(undefined)
      return
    }

    setRecord({ ...initialRecord, projects: [] })
    setLoading(true)
    getInsuranceRecord(initialRecord.id)
      .then((resp) => {
        setRecord(resp.data)
      })
      .finally(() => setLoading(false))
  }, [visible, initialRecord])

  const personalTotal =
    (record?.personalInsuranceAmount || 0) + (record?.personalProvidentFundAmount || 0)
  const corporateTotal =
    (record?.corporateInsuranceAmount || 0) + (record?.corporateProvidentFundAmount || 0)
  const isProportion = record?.schemeType === 1

  const columns = [
    {
      title: '缴纳项目',
      dataIndex: 'name',
      key: 'name',
      minWidth: 140
    },
    {
      title: '缴纳基数',
      dataIndex: 'baseAmount',
      key: 'baseAmount',
      align: 'right' as const,
      width: 120,
      render: (val: any) => `¥ ${formatHrmMoney(val)}`
    },
    ...(isProportion
      ? [
          {
            title: '个人比例',
            dataIndex: 'personalRate',
            key: 'personalRate',
            align: 'right' as const,
            width: 100,
            render: (val: any) => formatHrmRate(val)
          }
        ]
      : []),
    {
      title: '个人金额',
      dataIndex: 'personalAmount',
      key: 'personalAmount',
      align: 'right' as const,
      width: 120,
      render: (val: any) => `¥ ${formatHrmMoney(val)}`
    },
    ...(isProportion
      ? [
          {
            title: '公司比例',
            dataIndex: 'corporateRate',
            key: 'corporateRate',
            align: 'right' as const,
            width: 100,
            render: (val: any) => formatHrmRate(val)
          }
        ]
      : []),
    {
      title: '公司金额',
      dataIndex: 'corporateAmount',
      key: 'corporateAmount',
      align: 'right' as const,
      width: 120,
      render: (val: any) => `¥ ${formatHrmMoney(val)}`
    },
    {
      title: '合计',
      key: 'totalAmount',
      align: 'right' as const,
      width: 130,
      render: (_: any, row: InsuranceSchemeProjectVO) =>
        `¥ ${formatHrmMoney((row.personalAmount || 0) + (row.corporateAmount || 0))}`
    }
  ]

  const projects = record?.projects || []
  const totalPersonalAmount = projects.reduce((sum, p) => sum + (p.personalAmount || 0), 0)
  const totalCorporateAmount = projects.reduce((sum, p) => sum + (p.corporateAmount || 0), 0)

  return (
    <Modal
      title={`${record?.month || ''} 月社保表详情`}
      open={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      width={1000}
      destroyOnClose
    >
      <Descriptions bordered size="small" column={2} style={{ marginBottom: 16 }}>
        <Descriptions.Item label="参保方案">{record?.schemeName || '-'}</Descriptions.Item>
        <Descriptions.Item label="方案类型">
          {record?.schemeType ? (
            <Tag color="blue">{SCHEME_TYPES[record.schemeType] || '-'}</Tag>
          ) : (
            '-'
          )}
        </Descriptions.Item>
        <Descriptions.Item label="个人缴纳">¥ {formatHrmMoney(personalTotal)}</Descriptions.Item>
        <Descriptions.Item label="公司缴纳">¥ {formatHrmMoney(corporateTotal)}</Descriptions.Item>
        <Descriptions.Item label="本月合计" span={2}>
          <strong style={{ color: '#1890ff', fontSize: 16 }}>
            ¥ {formatHrmMoney(personalTotal + corporateTotal)}
          </strong>
        </Descriptions.Item>
      </Descriptions>

      <Table
        loading={loading}
        columns={columns}
        dataSource={projects}
        rowKey="schemeProjectId"
        pagination={false}
        size="small"
        bordered
        summary={() => {
          if (!projects.length) return null
          return (
            <Table.Summary fixed>
              <Table.Summary.Row style={{ backgroundColor: '#fafafa', fontWeight: 600 }}>
                <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>-</Table.Summary.Cell>
                {isProportion && <Table.Summary.Cell index={2}>-</Table.Summary.Cell>}
                <Table.Summary.Cell index={isProportion ? 3 : 2} align="right">
                  ¥ {formatHrmMoney(totalPersonalAmount)}
                </Table.Summary.Cell>
                {isProportion && <Table.Summary.Cell index={4}>-</Table.Summary.Cell>}
                <Table.Summary.Cell index={isProportion ? 5 : 3} align="right">
                  ¥ {formatHrmMoney(totalCorporateAmount)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={isProportion ? 6 : 4} align="right">
                  ¥ {formatHrmMoney(totalPersonalAmount + totalCorporateAmount)}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )
        }}
      />
    </Modal>
  )
}

export default InsuranceRecordDetail
