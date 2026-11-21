import React, { useRef, useState } from 'react'
import { Button, message, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ModalForm, ProFormSelect, ProTable } from '@ant-design/pro-components'
import { history } from '@umijs/max'
import { createDemoOrder, getDemoOrderPage, refundDemoOrder } from '@/api/pay/demo/order'
import { textConst } from '@/locales/zh-CN'
import { tableActionStyle } from '@/styles/common.style'

// 示例商品（固定演示数据，价格单位：分）
const DEMO_SPUS = [
  { id: 1, name: '华为手机', price: 1 },
  { id: 2, name: '小米电视', price: 10 },
  { id: 3, name: '苹果手表', price: 100 },
  { id: 4, name: '华硕笔记本', price: 1000 },
  { id: 5, name: '蔚来汽车', price: 200000 }
]

// 金额（分）转元展示
const fenToYuan = (price?: number) => `￥${((price || 0) / 100).toFixed(2)}`

const DemoOrder: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const [createVisible, setCreateVisible] = useState(false)

  // ===== 支付：跳转收银台，带支付单号与回跳地址 =====
  const handlePay = (record: API.PayDemoOrderRespVO) => {
    history.push(
      `/pay/cashier?id=${record.payOrderId}&returnUrl=${encodeURIComponent(
        '/pay/demo/order?id=' + record.id
      )}`
    )
  }

  // ===== 退款：二次确认后调用退款接口 =====
  const handleRefund = (record: API.PayDemoOrderRespVO) => {
    Modal.confirm({
      title: '提示',
      content: `是否确认退款编号为"${record.id}"的示例订单？`,
      okText: textConst.common.ok,
      cancelText: textConst.common.cancel,
      onOk: async () => {
        const resp = await refundDemoOrder({ id: record.id })
        if (resp.code === 0) {
          message.success('发起退款成功')
          actionRef.current?.reload()
        } else {
          message.error(resp.msg || '退款失败')
        }
      }
    })
  }

  const columns: ProColumns<API.PayDemoOrderRespVO>[] = [
    {
      title: '订单编号',
      dataIndex: 'id',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '用户编号',
      dataIndex: 'userId',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '商品名字',
      dataIndex: 'spuName',
      align: 'center',
      width: 140,
      hideInSearch: true
    },
    {
      title: '支付价格',
      dataIndex: 'price',
      align: 'center',
      width: 110,
      hideInSearch: true,
      render: (_, record) => <span>{fenToYuan(record.price)}</span>
    },
    {
      title: '退款金额',
      dataIndex: 'refundPrice',
      align: 'center',
      width: 110,
      hideInSearch: true,
      render: (_, record) => <span>{fenToYuan(record.refundPrice)}</span>
    },
    {
      title: '支付单号',
      dataIndex: 'payOrderId',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '是否支付',
      dataIndex: 'payStatus',
      align: 'center',
      width: 100,
      hideInSearch: true,
      valueEnum: {
        true: { text: '已支付', status: 'Success' },
        false: { text: '未支付', status: 'Error' }
      }
    },
    {
      title: '支付时间',
      dataIndex: 'payTime',
      align: 'center',
      width: 180,
      hideInSearch: true,
      render: (_, record) => <span>{record.payTime || '-'}</span>
    },
    {
      title: '退款时间',
      dataIndex: 'refundTime',
      align: 'center',
      width: 180,
      hideInSearch: true,
      render: (_, record) => <span>{record.refundTime || '-'}</span>
    },
    {
      title: textConst.columns.createTime,
      dataIndex: 'createTime',
      align: 'center',
      width: 180,
      hideInSearch: true,
      render: (_, record) => <span>{record.createTime as any}</span>
    },
    {
      title: textConst.form.operate,
      valueType: 'option',
      align: 'center',
      width: 140,
      key: 'option',
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          {/* 未支付可去支付；已支付且未退款可发起退款 */}
          {!record.payStatus && (
            <a key="pay" onClick={() => handlePay(record)}>
              支付
            </a>
          )}
          {record.payStatus && !record.refundPrice && (
            <a key="refund" onClick={() => handleRefund(record)}>
              退款
            </a>
          )}
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<API.PayDemoOrderRespVO>
        headerTitle="示例订单"
        columns={columns}
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        formRef={formRef}
        form={{ colon: false }}
        cardBordered
        request={async (params: Record<string, any>) => {
          const resp = await getDemoOrderPage({
            pageNo: params.current || 1,
            pageSize: params.pageSize || 10
          })
          return {
            data: resp.data?.list || [],
            success: true,
            total: resp.data?.total || 0
          }
        }}
        rowKey="id"
        search={false}
        options={false}
        pagination={{
          align: 'center',
          showSizeChanger: true
        }}
        toolBarRender={() => [
          <Button
            key="create"
            icon={<PlusOutlined />}
            onClick={() => setCreateVisible(true)}
            type="primary"
          >
            {textConst.action.create}
          </Button>
        ]}
      />

      {/* 发起订单弹窗：从示例商品中选一个下单 */}
      <ModalForm<{ spuId: number }>
        title="发起订单"
        width={480}
        open={createVisible}
        onOpenChange={setCreateVisible}
        layout="horizontal"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        colon={false}
        modalProps={{ destroyOnHidden: true }}
        onFinish={async (values) => {
          try {
            const resp = await createDemoOrder({ spuId: values.spuId })
            if (resp.code === 0) {
              message.success(textConst.msg.createSuccess)
              actionRef.current?.reload()
              return true
            }
            message.error(resp.msg || textConst.msg.createError)
            return false
          } catch {
            message.error(textConst.msg.createError)
            return false
          }
        }}
      >
        <ProFormSelect
          name="spuId"
          label="商品"
          placeholder="请选择下单商品"
          options={DEMO_SPUS.map((item) => ({
            label: `${item.name}（${fenToYuan(item.price)}）`,
            value: item.id
          }))}
          rules={[{ required: true, message: '下单商品不能为空' }]}
        />
      </ModalForm>
    </>
  )
}

export default DemoOrder
