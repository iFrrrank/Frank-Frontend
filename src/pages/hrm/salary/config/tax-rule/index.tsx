import React, { useEffect, useState } from 'react'
import { Button, Card, Modal, Table, Tag, message } from 'antd'
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { deleteSalaryTaxRule, getSalaryTaxRuleList } from '@/api/hrm/salary/taxRule'
import { textConst } from '@/locales/zh-CN'
import SalaryTaxRuleForm from './SalaryTaxRuleForm'

const TAX_TYPE_MAP: Record<number, string> = {
  1: '工资薪金所得税',
  2: '劳务报酬所得税',
  3: '不计税'
}

const TAX_CYCLE_MAP: Record<number, string> = {
  1: '12月到11月（税款所属期）',
  2: '1月到12月（税款所属期）'
}

const SalaryTaxRulePage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<API.HrmSalaryTaxRuleRespVO[]>([])
  const [formVisible, setFormVisible] = useState(false)
  const [currentId, setCurrentId] = useState<number>()

  const fetchList = async () => {
    setLoading(true)
    try {
      const resp = await getSalaryTaxRuleList()
      setList(resp.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  const handleDelete = (record: API.HrmSalaryTaxRuleRespVO) => {
    Modal.confirm({
      title: textConst.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: `确认要删除计税规则"${record.name}"吗？`,
      okText: textConst.common.ok,
      cancelText: textConst.common.cancel,
      onOk: async () => {
        try {
          await deleteSalaryTaxRule({ id: record.id! })
          message.success(textConst.msg.delSuccess)
          fetchList()
        } catch {
          message.error(textConst.msg.delError)
        }
      }
    })
  }

  const columns = [
    {
      title: '方案名称',
      dataIndex: 'name',
      key: 'name',
      minWidth: 180
    },
    {
      title: '个税类型',
      dataIndex: 'type',
      key: 'type',
      align: 'center' as const,
      width: 140,
      render: (type: number) => TAX_TYPE_MAP[type] || '-'
    },
    {
      title: '计税周期',
      dataIndex: 'cycleType',
      key: 'cycleType',
      minWidth: 260,
      render: (cycleType: number) => (cycleType ? TAX_CYCLE_MAP[cycleType] || '-' : '-')
    },
    {
      title: '是否计税',
      dataIndex: 'taxEnabled',
      key: 'taxEnabled',
      align: 'center' as const,
      width: 100,
      render: (taxEnabled: boolean) => (taxEnabled ? <Tag color="success">是</Tag> : <Tag>否</Tag>)
    },
    {
      title: '起征点',
      dataIndex: 'threshold',
      key: 'threshold',
      align: 'center' as const,
      width: 120,
      render: (threshold: number) => (threshold != null ? `${threshold}元/月` : '-')
    },
    {
      title: '个税结果保留小数位',
      dataIndex: 'decimalScale',
      key: 'decimalScale',
      align: 'center' as const,
      width: 160,
      render: (decimalScale: number) => (decimalScale != null ? `保留 ${decimalScale} 位小数` : '-')
    },
    {
      title: '适用薪资组',
      key: 'usedGroupCount',
      align: 'center' as const,
      minWidth: 160,
      render: (_: any, record: API.HrmSalaryTaxRuleRespVO) =>
        `${record.usedGroupCount ?? 0} 个薪资组正在使用`
    },
    {
      title: textConst.table.action,
      key: 'action',
      align: 'center' as const,
      width: 140,
      render: (_: any, record: API.HrmSalaryTaxRuleRespVO) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          <a
            onClick={() => {
              setCurrentId(record.id)
              setFormVisible(true)
            }}
          >
            {textConst.action.update}
          </a>
          <a style={{ color: '#ff4d4f' }} onClick={() => handleDelete(record)}>
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <Card variant="borderless">
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setCurrentId(undefined)
            setFormVisible(true)
          }}
        >
          新增计税规则
        </Button>
      </div>

      <Table columns={columns} dataSource={list} rowKey="id" loading={loading} pagination={false} />

      <SalaryTaxRuleForm
        visible={formVisible}
        setVisible={setFormVisible}
        id={currentId}
        onSuccess={fetchList}
      />
    </Card>
  )
}

export default SalaryTaxRulePage
