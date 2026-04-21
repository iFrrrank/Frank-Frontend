import React, { useRef } from 'react'
import { message, Popconfirm, Switch } from 'antd'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import {
  getBrokerageUserPage,
  updateBrokerageEnabled,
  clearBindUser
} from '@/api/mall/trade/brokerage/user'
import { BROKERAGE_QUALIFICATION } from '@/utils/constantsValue'

const BrokerageUserManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)

  const handleEnableChange = async (id: number, enabled: boolean) => {
    try {
      const res = await updateBrokerageEnabled({ id, enabled } as any)
      if (res.code === 0) {
        message.success(`已${enabled ? '开启' : '关闭'}该用户的推广资格`)
        actionRef.current?.reload()
      }
    } catch (error) {
      message.error(textConst.error.operationFail)
    }
  }

  const handleClearBind = async (id: number) => {
    try {
      const res = await clearBindUser({ id } as any)
      if (res.code === 0) {
        message.success('清除上级绑定成功')
        actionRef.current?.reload()
      }
    } catch (error) {
      message.error('操作失败')
    }
  }

  const columns: ProColumns<any>[] = [
    {
      title: '推广员 ID',
      dataIndex: 'bindUserId',
      align: 'center',
      hideInTable: true,
      fieldProps: { placeholder: '请输入推广员 ID' }
    },
    {
      title: '推广资格',
      dataIndex: 'brokerageEnabled',
      valueType: 'select',
      align: 'center',
      hideInTable: true,
      initialValue: 'true',
      fieldProps: { placeholder: '请选择推广资格' },
      valueEnum: BROKERAGE_QUALIFICATION
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInTable: true,
      fieldProps: { placeholder: ['开始日期', '结束日期'] }
    },
    {
      title: '用户编号',
      dataIndex: 'id',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      valueType: 'avatar',
      align: 'center',
      width: 80,
      hideInSearch: true
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      align: 'center',
      width: 80,
      hideInSearch: true
    },
    {
      title: '推广人数',
      dataIndex: 'brokerageUserCount',
      align: 'center',
      width: 80,
      hideInSearch: true
    },
    {
      title: '推广订单数量',
      dataIndex: 'brokerageOrderCount',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '推广订单金额',
      dataIndex: 'brokerageOrderPrice',
      align: 'center',
      width: 100,
      hideInSearch: true,
      renderText: (val) => (val ? `￥${(val / 100).toFixed(2)}` : '￥0.00')
    },
    {
      title: '已提现金额',
      dataIndex: 'withdrawPrice',
      align: 'center',
      width: 100,
      hideInSearch: true,
      renderText: (val) => (val ? `￥${(val / 100).toFixed(2)}` : '￥0.00')
    },
    {
      title: '已提现次数',
      dataIndex: 'withdrawCount',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '未提现金额',
      dataIndex: 'price',
      align: 'center',
      width: 100,
      hideInSearch: true,
      renderText: (val) => (val ? `￥${(val / 100).toFixed(2)}` : '￥0.00')
    },
    {
      title: '冻结中佣金',
      dataIndex: 'frozenPrice',
      align: 'center',
      width: 100,
      hideInSearch: true,
      renderText: (val) => (val ? `￥${(val / 100).toFixed(2)}` : '￥0.00')
    },
    {
      title: '推广资格',
      dataIndex: 'brokerageEnabled',
      align: 'center',
      width: 80,
      hideInSearch: true,
      render: (_, record) => (
        <Switch
          checked={record.brokerageEnabled}
          checkedChildren="有"
          unCheckedChildren="无"
          onChange={(checked) => handleEnableChange(record.id, checked)}
        />
      )
    },
    {
      title: '成为推广员时间',
      dataIndex: 'brokerageTime',
      valueType: 'dateTime',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '上级推广员编号',
      dataIndex: 'bindUserId',
      align: 'center',
      width: 100,
      hideInSearch: true,
      renderText: (val) => val || '-'
    },
    {
      title: '推广员绑定时间',
      dataIndex: 'bindUserTime',
      valueType: 'dateTime',
      align: 'center',
      width: 100,
      hideInSearch: true,
      renderText: (val) => val || '-'
    },
    {
      title: textConst.table.action,
      valueType: 'option',
      width: 160,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a onClick={() => message.info('跳转推广订单页')}>订单</a>
          <a onClick={() => message.info('跳转下线人员页')}>下线</a>
          <a onClick={() => message.info('打开修改上级弹窗')}>修改上级</a>
          {record.bindUserId && (
            <Popconfirm
              title="确定要清除该用户的上级绑定吗？"
              onConfirm={() => handleClearBind(record.id)}
            >
              <a style={deleteTextStyle}>清除上级</a>
            </Popconfirm>
          )}
        </div>
      )
    }
  ]

  return (
    <ProTable<any>
      headerTitle="分销用户列表"
      actionRef={actionRef}
      rowKey="id"
      form={{ colon: false }}
      columns={columns}
      search={{ labelWidth: 'auto', span: 6 }}
      scroll={{ x: 'max-content' }}
      request={async (params) => {
        const { current, pageSize, createTime, brokerageEnabled, ...rest } = params
        const req = {
          pageNo: current || 1,
          pageSize: pageSize || 10,
          startTime: createTime?.[0] ? createTime[0] + ' 00:00:00' : undefined,
          endTime: createTime?.[1] ? createTime[1] + ' 23:59:59' : undefined,
          brokerageEnabled:
            brokerageEnabled !== undefined ? brokerageEnabled === 'true' : undefined,
          ...rest
        }

        try {
          const res = await getBrokerageUserPage(req as any)
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
  )
}

export default BrokerageUserManagement
