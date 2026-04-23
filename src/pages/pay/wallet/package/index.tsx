import React, { useRef, useState } from 'react'
import { Button, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import WalletRechargePackageForm from './RechargePackageForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { handleDelete } from '@/components/Delete'
import { getWalletRechargePackagePage, deleteWalletRechargePackage } from '@/api/pay/wallet/package'
import { COMMON_STATUS } from '@/utils/constantsValue'
import { textConst } from '@/locales/zh-CN'

const WalletRechargePackageManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  const columns: ProColumns<API.WalletRechargePackageRespVO>[] = [
    {
      title: '套餐 ID',
      dataIndex: 'id',
      align: 'center',
      width: 180,
      hideInSearch: true
    },
    {
      title: '套餐名称',
      dataIndex: 'name',
      align: 'center',
      width: 180,
      fieldProps: { placeholder: '请输入套餐名称' }
    },
    {
      title: '套餐状态',
      dataIndex: 'status',
      valueType: 'select',
      align: 'center',
      width: 180,
      fieldProps: { placeholder: '请选择套餐状态' },
      valueEnum: COMMON_STATUS
    },

    {
      title: '支付金额',
      dataIndex: 'payPrice',
      align: 'center',
      width: 180,
      hideInSearch: true,
      renderText: (val) => (val ? `￥${(val / 100).toFixed(2)}` : '￥0.00')
    },
    {
      title: '赠送金额',
      dataIndex: 'bonusPrice',
      align: 'center',
      width: 180,
      hideInSearch: true,
      renderText: (val) => (val ? `￥${(val / 100).toFixed(2)}` : '￥0.00')
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      align: 'center',
      width: 180,
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
          <a
            onClick={() => {
              setCurrentId(record.id)
              setFormVisible(true)
            }}
          >
            {textConst.action.update}
          </a>
          <a
            style={deleteTextStyle}
            onClick={() =>
              handleDelete(record, deleteWalletRechargePackage, () => actionRef.current?.reload())
            }
          >
            {textConst.action.delete}
          </a>
        </Space>
      )
    }
  ]

  return (
    <>
      <ProTable<API.WalletRechargePackageRespVO>
        headerTitle="充值套餐"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        search={{ labelWidth: 'auto', span: 6 }}
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
            const res = await getWalletRechargePackagePage(req as any)
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
        toolBarRender={() => [
          <Button
            key="create"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setCurrentId(undefined)
              setFormVisible(true)
            }}
          >
            {textConst.action.create}
          </Button>
        ]}
      />

      <WalletRechargePackageForm
        visible={formVisible}
        setVisible={setFormVisible}
        id={currentId}
        onSuccess={() => {
          setFormVisible(false)
          actionRef.current?.reload()
        }}
      />
    </>
  )
}

export default WalletRechargePackageManagement
