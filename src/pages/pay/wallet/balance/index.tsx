import React, { useRef, useState } from 'react'
import { message, Space, Form } from 'antd'
import {
  ActionType,
  ProColumns,
  ProTable,
  ModalForm,
  ProFormDigit,
  ProFormRadio
} from '@ant-design/pro-components'
import { tableActionStyle } from '@/styles/common.style'
import { getWalletPage, updateWalletBalance } from '@/api/pay/wallet/balance'
import { USER_TYPE } from '@/utils/constantsValue'

const WalletManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [balanceModalVisible, setBalanceModalVisible] = useState(false)
  const [currentWallet, setCurrentWallet] = useState<any>(null)
  const [form] = Form.useForm()

  const handleUpdateBalance = async (values: any) => {
    try {
      const submitData = {
        id: currentWallet.id,
        // balance: Math.round(values.balance * 100),
        ...values
      }

      const res = await updateWalletBalance(submitData as any)
      if (res.code === 0) {
        message.success('修改余额成功')
        setBalanceModalVisible(false)
        actionRef.current?.reload()
        return true
      }
      return false
    } catch (error) {
      message.error('修改余额失败')
      return false
    }
  }

  const columns: ProColumns<any>[] = [
    {
      title: '编号',
      dataIndex: 'id',
      align: 'center',
      width: 150,
      hideInSearch: true
    },
    {
      title: '用户编号',
      dataIndex: 'userId',
      align: 'center',
      width: 150,
      fieldProps: { placeholder: '请输入用户编号' }
    },
    {
      title: '用户类型',
      dataIndex: 'userType',
      valueType: 'select',
      valueEnum: USER_TYPE,
      align: 'center',
      width: 150,
      fieldProps: { placeholder: '请选择用户类型' }
    },
    {
      title: '余额',
      dataIndex: 'balance',
      align: 'center',
      width: 150,
      hideInSearch: true,
      renderText: (val) => (val ? `￥${(val / 100).toFixed(2)}` : '￥0.00')
    },
    {
      title: '累计支出',
      dataIndex: 'totalExpense',
      align: 'center',
      width: 150,
      hideInSearch: true,
      renderText: (val) => (val ? `￥${(val / 100).toFixed(2)}` : '￥0.00')
    },
    {
      title: '累计充值',
      dataIndex: 'totalRecharge',
      align: 'center',
      width: 150,
      hideInSearch: true,
      renderText: (val) => (val ? `￥${(val / 100).toFixed(2)}` : '￥0.00')
    },
    {
      title: '冻结金额',
      dataIndex: 'freezePrice',
      align: 'center',
      width: 150,
      hideInSearch: true,
      renderText: (val) => (val ? `￥${(val / 100).toFixed(2)}` : '￥0.00')
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      align: 'center',
      width: 150,
      fieldProps: { placeholder: ['开始日期', '结束日期'] }
    },

    {
      title: '操作',
      valueType: 'option',
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" style={tableActionStyle}>
          <a onClick={() => message.info('跳转查看钱包明细')}>明细</a>
          <a
            onClick={() => {
              setCurrentWallet(record)
              setBalanceModalVisible(true)
            }}
          >
            修改余额
          </a>
        </Space>
      )
    }
  ]

  return (
    <>
      <ProTable<any>
        headerTitle="钱包余额"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        search={{ labelWidth: 'auto', span: 6 }}
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
            const res = await getWalletPage(req as any)
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

      <ModalForm
        title="修改钱包余额"
        open={balanceModalVisible}
        form={form}
        width={500}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        modalProps={{ destroyOnClose: true }}
        onOpenChange={(val) => {
          setBalanceModalVisible(val)
          if (!val) form.resetFields()
        }}
        onFinish={handleUpdateBalance}
      >
        <ProFormRadio.Group
          name="type"
          label="变动类型"
          rules={[{ required: true, message: '请选择变动类型' }]}
          initialValue={1}
          options={[
            { label: '增加', value: 1 },
            { label: '减少', value: 2 }
          ]}
        />
        <ProFormDigit
          name="balance"
          label="变动金额"
          placeholder="请输入变动金额"
          rules={[{ required: true, message: '请输入变动金额' }]}
          fieldProps={{ min: 0.01, precision: 2, addonAfter: '元' }}
        />
      </ModalForm>
    </>
  )
}

export default WalletManagement
