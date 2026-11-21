import React, { useRef, useState } from 'react'
import { Button, Image, message, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import PointActivityForm from './PointActivityForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'
import {
  closePointActivity,
  deletePointActivity,
  getPointActivityPage
} from '@/api/mall/promotion/point/activity'
import { COMMON_STATUS } from '@/utils/constantsValue'

// 金额（分）转元展示
const fenToYuan = (price?: number) => `￥${((price || 0) / 100).toFixed(2)}`

// 积分商城活动列表：一个活动绑定一个商品，按 SKU 配置兑换积分与金额
const PointActivityManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  // 关闭活动（开启状态才可关闭）
  const handleClose = (record: any) => {
    Modal.confirm({
      title: '确认关闭',
      content: `确定要关闭积分活动「${record.spuName || record.id}」吗？关闭后买家将无法兑换。`,
      okText: '关闭活动',
      cancelText: '取消',
      onOk: async () => {
        const resp = await closePointActivity({ id: record.id })
        if (resp.code === 0) {
          message.success('关闭成功')
          actionRef.current?.reload()
        } else {
          message.error(resp.msg || textConst.error.operationFail)
        }
      }
    })
  }

  const columns: ProColumns<any>[] = [
    {
      title: '活动编号',
      dataIndex: 'id',
      align: 'center',
      width: 90,
      hideInSearch: true
    },
    {
      title: '商品信息',
      dataIndex: 'spuName',
      align: 'center',
      width: 220,
      fieldProps: { placeholder: '请输入商品名称' },
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Image src={record.picUrl} width={40} height={40} preview={false} />
          <span style={{ textAlign: 'left' }}>{record.spuName}</span>
        </div>
      )
    },
    {
      title: '市场价',
      dataIndex: 'marketPrice',
      align: 'center',
      width: 100,
      hideInSearch: true,
      render: (_, record) => fenToYuan(record.marketPrice)
    },
    {
      title: '兑换积分',
      dataIndex: 'point',
      align: 'center',
      width: 90,
      hideInSearch: true
    },
    {
      title: '兑换金额',
      dataIndex: 'price',
      align: 'center',
      width: 100,
      hideInSearch: true,
      render: (_, record) => fenToYuan(record.price)
    },
    {
      title: '活动库存',
      dataIndex: 'stock',
      align: 'center',
      width: 90,
      hideInSearch: true
    },
    {
      title: '总库存',
      dataIndex: 'totalStock',
      align: 'center',
      width: 90,
      hideInSearch: true
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      valueType: 'select',
      fieldProps: { placeholder: '请选择活动状态' },
      valueEnum: COMMON_STATUS
    },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      width: 70,
      hideInSearch: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      align: 'center',
      width: 170,
      fieldProps: { placeholder: ['开始日期', '结束日期'] },
      render: (_, record) => <span>{record.createTime as any}</span>
    },
    {
      title: textConst.table.action,
      valueType: 'option',
      width: 170,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a
            onClick={() => {
              setCurrentId(record.id)
              setFormVisible(true)
            }}
          >
            {textConst.action.update}
          </a>
          {record.status === 0 && <a onClick={() => handleClose(record)}>关闭</a>}
          <a
            style={deleteTextStyle}
            onClick={() =>
              handleDelete(record, deletePointActivity, () => actionRef.current?.reload())
            }
          >
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<any>
        headerTitle="积分商城活动"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        search={{
          labelWidth: 'auto',
          span: 6
        }}
        request={async (params: Record<string, any>) => {
          const { current, pageSize, createTime, ...rest } = params
          const queryParams: Record<string, any> = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...rest
          }
          if (Array.isArray(createTime) && createTime.length === 2) {
            queryParams.createTime = [
              `${createTime[0]} 00:00:00`,
              `${createTime[1]} 23:59:59`
            ]
          }
          const resp = await getPointActivityPage(queryParams as any)
          return {
            data: resp.data?.list || [],
            success: true,
            total: resp.data?.total || 0
          }
        }}
        scroll={{ x: 'max-content' }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            onClick={() => {
              setCurrentId(undefined)
              setFormVisible(true)
            }}
          >
            <PlusOutlined /> {textConst.action.create}
          </Button>
        ]}
        pagination={{
          align: 'center',
          showSizeChanger: true
        }}
      />

      <PointActivityForm
        visible={formVisible}
        setVisible={setFormVisible}
        onSuccess={() => {
          setFormVisible(false)
          setCurrentId(undefined)
          actionRef.current?.reload()
        }}
        id={currentId}
      />
    </>
  )
}

export default PointActivityManagement
