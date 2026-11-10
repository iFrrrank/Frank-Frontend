import React, { useRef, useState } from 'react'
import { Button, Card, Modal, message } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined
} from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { deleteSalaryGroup, getSalaryGroupPage } from '@/api/hrm/salary/group'
import { textConst } from '@/locales/zh-CN'
import { formatSalaryGroupScope } from '@/pages/hrm/utils/format'
import SalaryGroupForm from './SalaryGroupForm'

const SalaryGroupPage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState(false)
  const [currentId, setCurrentId] = useState<number>()

  const reload = () => actionRef.current?.reload()

  const handleDelete = (record: API.HrmSalaryGroupRespVO) => {
    Modal.confirm({
      title: textConst.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: `确认要删除薪资组"${record.name}"吗？`,
      okText: textConst.common.ok,
      cancelText: textConst.common.cancel,
      onOk: async () => {
        try {
          await deleteSalaryGroup({ id: record.id! })
          message.success(textConst.msg.delSuccess)
          reload()
        } catch {
          message.error(textConst.msg.delError)
        }
      }
    })
  }

  const columns: ProColumns<API.HrmSalaryGroupRespVO>[] = [
    {
      title: '薪资组名称',
      dataIndex: 'name',
      align: 'center',
      minWidth: 150,
      ellipsis: true
    },
    {
      title: '计薪标准',
      dataIndex: 'salaryStandard',
      align: 'center',
      width: 120,
      render: (_, record) => `${record.salaryStandard ?? 0} 天/月`
    },
    {
      title: '计税规则',
      dataIndex: 'taxRuleName',
      align: 'center',
      minWidth: 150,
      ellipsis: true
    },
    {
      title: '调薪规则',
      dataIndex: 'changeRule',
      align: 'center',
      minWidth: 220,
      ellipsis: true
    },
    {
      title: '适用范围',
      align: 'center',
      minWidth: 200,
      render: (_, record) => formatSalaryGroupScope(record)
    },
    {
      title: textConst.table.action,
      valueType: 'option',
      align: 'center',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          <a
            onClick={() => {
              setCurrentId(record.id)
              setFormVisible(true)
            }}
          >
            <EditOutlined /> {textConst.action.update}
          </a>
          <a style={{ color: '#ff4d4f' }} onClick={() => handleDelete(record)}>
            <DeleteOutlined /> {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <Card variant="borderless">
      <ProTable<API.HrmSalaryGroupRespVO>
        headerTitle="薪资组列表"
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        search={false}
        options={false}
        scroll={{ x: 'max-content' }}
        pagination={{ align: 'center', showSizeChanger: true }}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentId(undefined)
              setFormVisible(true)
            }}
          >
            新增薪资组
          </Button>
        ]}
        request={async (params) => {
          const { current, pageSize } = params
          try {
            const resp = await getSalaryGroupPage({
              reqVO: {
                pageNo: current || 1,
                pageSize: pageSize || 10
              }
            } as any)
            return {
              data: resp.data?.list || [],
              success: resp.code === 0,
              total: resp.data?.total || 0
            }
          } catch {
            return { data: [], success: false, total: 0 }
          }
        }}
      />

      <SalaryGroupForm
        visible={formVisible}
        setVisible={setFormVisible}
        id={currentId}
        onSuccess={reload}
      />
    </Card>
  )
}

export default SalaryGroupPage
