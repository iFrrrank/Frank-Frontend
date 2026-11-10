import React, { useEffect, useState } from 'react'
import { Button, Card, Modal, Space, Table, Tag, message } from 'antd'
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import {
  deleteSalaryChangeTemplate,
  getSalaryChangeTemplateList
} from '@/api/hrm/salary/changeTemplate'
import { textConst } from '@/locales/zh-CN'
import { formatDateTime } from '@/pages/hrm/recruit/format'
import SalaryChangeTemplateForm from './SalaryChangeTemplateForm'

const SalaryChangeTemplatePage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<API.HrmSalaryChangeTemplateRespVO[]>([])
  const [formVisible, setFormVisible] = useState(false)
  const [currentId, setCurrentId] = useState<number>()

  const fetchList = async () => {
    setLoading(true)
    try {
      const resp = await getSalaryChangeTemplateList()
      setList(resp.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  const handleDelete = (record: API.HrmSalaryChangeTemplateRespVO) => {
    Modal.confirm({
      title: textConst.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: `确认要删除调薪模板"${record.name}"吗？`,
      okText: textConst.common.ok,
      cancelText: textConst.common.cancel,
      onOk: async () => {
        try {
          await deleteSalaryChangeTemplate({ id: record.id! })
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
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
      minWidth: 180
    },
    {
      title: '默认模板',
      dataIndex: 'defaultStatus',
      key: 'defaultStatus',
      align: 'center' as const,
      width: 100,
      render: (status: boolean) => (status ? <Tag color="success">是</Tag> : <Tag>否</Tag>)
    },
    {
      title: '调薪项',
      key: 'options',
      minWidth: 260,
      render: (_: any, record: API.HrmSalaryChangeTemplateRespVO) => (
        <Space wrap>
          {(record.options || []).map((item) => (
            <Tag color="blue" key={item.code}>
              {item.name}
            </Tag>
          ))}
        </Space>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center' as const,
      width: 180,
      render: (time: any) => formatDateTime(time)
    },
    {
      title: textConst.table.action,
      key: 'action',
      align: 'center' as const,
      width: 160,
      render: (_: any, record: API.HrmSalaryChangeTemplateRespVO) => (
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
          新增调薪模板
        </Button>
      </div>

      <Table columns={columns} dataSource={list} rowKey="id" loading={loading} pagination={false} />

      <SalaryChangeTemplateForm
        visible={formVisible}
        setVisible={setFormVisible}
        id={currentId}
        onSuccess={fetchList}
      />
    </Card>
  )
}

export default SalaryChangeTemplatePage
