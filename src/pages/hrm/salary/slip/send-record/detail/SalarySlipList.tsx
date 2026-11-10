import React, { useRef, useState } from 'react'
import { Button, Input, Modal, Space, Tag, message } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { getSalarySlipPage, updateSalarySlipRemark } from '@/api/hrm/salary/slip'
import { useBatchOperation } from '@/pages/hrm/utils/batch'
import { formatHrmMoney } from '@/pages/hrm/utils/format'
import { formatDateTime } from '@/pages/hrm/recruit/format'
import DeptSelect from '@/pages/hrm/employee/components/DeptSelect'
import SalarySlipDetail from './SalarySlipDetail'

interface SalarySlipListProps {
  sendRecordId: number
}

const SalarySlipList: React.FC<SalarySlipListProps> = ({ sendRecordId }) => {
  const actionRef = useRef<ActionType>(undefined)
  const { executeBatch } = useBatchOperation()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [selectedRows, setSelectedRows] = useState<API.HrmSalarySlipRespVO[]>([])

  // 查看单条工资条明细
  const [detailVisible, setDetailVisible] = useState(false)
  const [currentSlipId, setCurrentSlipId] = useState<number>()

  // 批量编辑备注弹窗
  const [remarkModalVisible, setRemarkModalVisible] = useState(false)
  const [batchRemarkValue, setBatchRemarkValue] = useState('')
  const [remarkLoading, setRemarkLoading] = useState(false)

  const reload = () => {
    actionRef.current?.reload()
    setSelectedRowKeys([])
    setSelectedRows([])
  }

  // 清除备注
  const handleClearRemark = () => {
    Modal.confirm({
      title: '确认清除备注',
      content: `确定清除选中的 ${selectedRows.length} 条工资条备注吗？`,
      onOk: async () => {
        const requests = selectedRows
          .filter((item) => item.id !== undefined)
          .map((item) => updateSalarySlipRemark({ id: item.id!, remark: '' }))
        const success = await executeBatch(requests)
        if (success) {
          reload()
        }
      }
    })
  }

  // 提交批量备注
  const handleBatchRemarkSubmit = async () => {
    if (batchRemarkValue.length > 500) {
      message.warning('备注不能超过 500 个字符')
      return
    }

    setRemarkLoading(true)
    try {
      const requests = selectedRows
        .filter((item) => item.id !== undefined)
        .map((item) =>
          updateSalarySlipRemark({
            id: item.id!,
            remark: batchRemarkValue
          })
        )
      const success = await executeBatch(requests)
      if (success) {
        setRemarkModalVisible(false)
        reload()
      }
    } finally {
      setRemarkLoading(false)
    }
  }

  const columns: ProColumns<API.HrmSalarySlipRespVO>[] = [
    {
      title: '员工',
      dataIndex: 'search',
      hideInTable: true,
      fieldProps: {
        placeholder: '请输入员工姓名或工号'
      }
    },
    {
      title: '员工姓名',
      dataIndex: 'employeeName',
      align: 'center',
      minWidth: 120,
      search: false,
      render: (_, record) => record.employeeName || '-'
    },
    {
      title: '工号',
      dataIndex: 'jobNumber',
      align: 'center',
      width: 110,
      search: false,
      render: (_, record) => record.jobNumber || '-'
    },
    {
      title: '部门',
      dataIndex: 'deptId',
      align: 'center',
      width: 140,
      renderFormItem: () => <DeptSelect placeholder="请选择部门" />,
      render: (_, record) => record.deptName || '-'
    },
    {
      title: '岗位',
      dataIndex: 'postName',
      align: 'center',
      width: 140,
      search: false,
      render: (_, record) => record.postName || '-'
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      align: 'center',
      width: 130,
      search: false,
      render: (_, record) => record.mobile || '-'
    },
    {
      title: '查看状态',
      dataIndex: 'readStatus',
      align: 'center',
      width: 110,
      valueType: 'select',
      valueEnum: {
        0: { text: '未查看', status: 'Default' },
        1: { text: '已查看', status: 'Success' }
      },
      render: (_, record) =>
        record.readStatus === 1 ? (
          <Tag color="success">已查看</Tag>
        ) : (
          <Tag color="default">未查看</Tag>
        )
    },
    {
      title: '实发工资',
      dataIndex: 'realPaySalary',
      align: 'right',
      width: 130,
      search: false,
      render: (_, record) => formatHrmMoney(record.realPaySalary)
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      minWidth: 160,
      render: (_, record) => record.remark || '-'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 170,
      search: false,
      render: (_, record) => formatDateTime(record.createTime)
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: (_, record) => [
        <a
          key="detail"
          onClick={() => {
            setCurrentSlipId(record.id)
            setDetailVisible(true)
          }}
        >
          查看明细
        </a>
      ]
    }
  ]

  return (
    <>
      <ProTable<API.HrmSalarySlipRespVO>
        headerTitle="工资条明细列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false
        }}
        params={{ sendRecordId }}
        request={async (params) => {
          const { current, pageSize, ...rest } = params
          const resp = await getSalarySlipPage({
            pageNo: current,
            pageSize,
            sendRecordId,
            ...rest
          } as any)
          return {
            data: resp.data?.list || [],
            total: resp.data?.total || 0,
            success: true
          }
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys, rows) => {
            setSelectedRowKeys(keys)
            setSelectedRows(rows)
          }
        }}
        tableAlertOptionRender={() => (
          <Space size="middle">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setBatchRemarkValue('')
                setRemarkModalVisible(true)
              }}
            >
              编辑备注
            </Button>
            <Button danger size="small" icon={<DeleteOutlined />} onClick={handleClearRemark}>
              清除备注
            </Button>
          </Space>
        )}
        columns={columns}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true
        }}
      />

      {/* 工资条单项明细预览 */}
      <SalarySlipDetail visible={detailVisible} setVisible={setDetailVisible} id={currentSlipId} />

      {/* 批量编辑备注弹窗 */}
      <Modal
        title="编辑备注"
        open={remarkModalVisible}
        onOk={handleBatchRemarkSubmit}
        onCancel={() => setRemarkModalVisible(false)}
        confirmLoading={remarkLoading}
        destroyOnClose
      >
        <div style={{ marginBottom: 12 }}>
          为选中的 {selectedRows.length} 条工资条批量设置备注：
        </div>
        <Input.TextArea
          rows={4}
          maxLength={500}
          showCount
          placeholder="请输入备注内容"
          value={batchRemarkValue}
          onChange={(e) => setBatchRemarkValue(e.target.value)}
        />
      </Modal>
    </>
  )
}

export default SalarySlipList
