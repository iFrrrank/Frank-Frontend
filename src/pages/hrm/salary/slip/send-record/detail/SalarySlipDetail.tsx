import React, { useEffect, useState } from 'react'
import { Modal, Table, Typography } from 'antd'
import { getSalarySlip } from '@/api/hrm/salary/slip'
import { formatHrmMoney } from '@/pages/hrm/utils/format'

interface SalarySlipDetailProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  id?: number
}

const SalarySlipDetail: React.FC<SalarySlipDetailProps> = ({ visible, setVisible, id }) => {
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState<API.HrmSalarySlipRespVO>()

  useEffect(() => {
    if (!visible || !id) {
      setDetail(undefined)
      return
    }

    setLoading(true)
    getSalarySlip({ id })
      .then((resp) => {
        setDetail(resp.data)
      })
      .finally(() => setLoading(false))
  }, [visible, id])

  const columns = [
    {
      title: '项目',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => text || '-'
    },
    {
      title: '金额',
      dataIndex: 'value',
      key: 'value',
      align: 'right' as const,
      width: 160,
      render: (val: any, record: API.HrmSalarySlipOptionRespVO) => {
        if (record.children && record.children.length > 0) {
          return '-'
        }
        return formatHrmMoney(val)
      }
    }
  ]

  return (
    <Modal
      title="工资条明细"
      open={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      width={600}
      destroyOnClose
    >
      <div style={{ minHeight: 300, textAlign: 'center', marginBottom: 16 }}>
        <Typography.Title level={2} style={{ margin: '8px 0 4px' }}>
          {formatHrmMoney(detail?.realPaySalary)}
        </Typography.Title>
        <Typography.Text type="secondary">实发金额（元）</Typography.Text>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={detail?.options || []}
        rowKey={(record, index) =>
          record.code ? `opt-${record.code}` : `cat-${record.sort || index}`
        }
        pagination={false}
        size="small"
        bordered
        defaultExpandAllRows
      />
    </Modal>
  )
}

export default SalarySlipDetail
