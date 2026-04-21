import React, { useRef, useState } from 'react'
import { message, Space, Popconfirm, Modal, Form, Input } from 'antd'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { tableActionStyle } from '@/styles/common.style'
import {
  getBrokerageWithdrawPage,
  approveBrokerageWithdraw,
  rejectBrokerageWithdraw
} from '@/api/mall/trade/brokerage/withdraw'
import {
  BROKERAGE_WITHDRAW_TYPE,
  BROKERAGE_WITHDRAW_STATUS,
  BANK_TYPE
} from '@/utils/constantsValue'
import { textConst } from '@/locales/zh-CN'

const BrokerageWithdrawManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [rejectModalVisible, setRejectModalVisible] = useState(false)
  const [currentWithdrawId, setCurrentWithdrawId] = useState<number | undefined>(undefined)
  const [rejectForm] = Form.useForm()

  const handleApprove = async (id: number) => {
    try {
      const res = await approveBrokerageWithdraw({ id } as any)
      if (res.code === 0) {
        message.success('提现申请已通过')
        actionRef.current?.reload()
      }
    } catch (error) {
      message.error(textConst.error.operationFail)
    }
  }

  const handleRejectSubmit = async () => {
    try {
      const values = await rejectForm.validateFields()
      const res = await rejectBrokerageWithdraw({
        id: currentWithdrawId,
        auditReason: values.auditReason
      } as any)

      if (res.code === 0) {
        message.success('已驳回该提现申请')
        setRejectModalVisible(false)
        rejectForm.resetFields()
        actionRef.current?.reload()
      }
    } catch (error) {}
  }

  const columns: ProColumns<any>[] = [
    {
      title: '用户编号',
      dataIndex: 'userId',
      hideInTable: true,
      fieldProps: { placeholder: '请输入用户编号' }
    },
    {
      title: '提现类型',
      dataIndex: 'type',
      valueType: 'select',
      hideInTable: true,
      fieldProps: { placeholder: '请选择提现类型' },
      valueEnum: BROKERAGE_WITHDRAW_TYPE
    },
    {
      title: '账号',
      dataIndex: 'accountNo',
      hideInTable: true,
      fieldProps: { placeholder: '请输入账号' }
    },
    {
      title: '真实名字',
      dataIndex: 'name',
      hideInTable: true,
      fieldProps: { placeholder: '请输入真实名字' }
    },
    {
      title: '提现银行',
      dataIndex: 'bankName',
      valueType: 'select',
      hideInTable: true,
      fieldProps: { placeholder: '请选择提现银行' },
      valueEnum: BANK_TYPE
    },
    {
      title: '提现编号',
      dataIndex: 'id',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '用户信息',
      dataIndex: 'user',
      align: 'center',
      width: 120,
      hideInSearch: true,
      render: (_, record) => (
        <div>
          <div>{record.userNickname || '-'}</div>
        </div>
      )
    },
    {
      title: '提现信息',
      dataIndex: 'accountInfo',
      align: 'center',
      width: 120,
      hideInSearch: true,
      fieldProps: {
        style: { textAlign: 'left' }
      },
      render: (_, record) => (
        <div>
          {record.name && <div>姓名：{record.name}</div>}
          {record.accountNo && <div>账号：{record.accountNo}</div>}
          {record.bankName && <div>银行：{record.bankName}</div>}
        </div>
      )
    },
    {
      title: '提现金额',
      dataIndex: 'price',
      align: 'center',
      width: 120,
      hideInSearch: true,
      renderText: (val) => (val ? `￥${(val / 100).toFixed(2)}` : '￥0.00')
    },
    {
      title: '提现方式',
      dataIndex: 'type',
      align: 'center',
      width: 120,
      hideInSearch: true,
      valueEnum: BROKERAGE_WITHDRAW_TYPE
    },
    {
      title: '提现状态',
      dataIndex: 'status',
      valueType: 'select',
      align: 'center',
      width: 120,
      fieldProps: { placeholder: '请选择提现状态' },
      valueEnum: BROKERAGE_WITHDRAW_STATUS
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      align: 'center',
      width: 120,
      fieldProps: { placeholder: ['开始日期', '结束日期'] }
    },
    {
      title: '备注',
      dataIndex: 'auditReason',
      align: 'center',
      width: 120,
      hideInSearch: true,
      ellipsis: true
    },
    {
      title: '操作',
      valueType: 'option',
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (_, record) => {
        if (record.status !== 0) return '-'
        return (
          <Space size="small" style={tableActionStyle}>
            <Popconfirm title="确认要通过该提现申请吗？" onConfirm={() => handleApprove(record.id)}>
              <a style={{ color: '#52c41a' }}>通过</a>
            </Popconfirm>
            <a
              style={{ color: '#ff4d4f' }}
              onClick={() => {
                setCurrentWithdrawId(record.id)
                setRejectModalVisible(true)
              }}
            >
              驳回
            </a>
          </Space>
        )
      }
    }
  ]

  return (
    <>
      <ProTable<any>
        headerTitle="佣金提现"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        search={{ labelWidth: 80, span: 6 }}
        scroll={{ x: 'max-content' }}
        request={async (params) => {
          const { current, pageSize, createTime, ...rest } = params

          const req = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            startTime: createTime?.[0] ? createTime[0] + ' 00:00:00' : undefined,
            endTime: createTime?.[1] ? createTime[1] + ' 23:59:59' : undefined,
            ...rest
          }

          try {
            const res = await getBrokerageWithdrawPage(req as any)
            return {
              data: res.data?.list || [],
              success: res.code === 0,
              total: res.data?.total || 0
            }
          } catch (error) {
            return { data: [], success: false, total: 0 }
          }
        }}
        pagination={{ align: 'center', showSizeChanger: true }}
      />

      <Modal
        title="驳回申请"
        open={rejectModalVisible}
        onOk={handleRejectSubmit}
        onCancel={() => {
          setRejectModalVisible(false)
          rejectForm.resetFields()
        }}
        destroyOnHidden
      >
        <Form form={rejectForm} layout="vertical">
          <Form.Item
            name="auditReason"
            label="驳回原因"
            rules={[{ required: true, message: '请输入驳回原因' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入驳回该提现申请的原因" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default BrokerageWithdrawManagement
