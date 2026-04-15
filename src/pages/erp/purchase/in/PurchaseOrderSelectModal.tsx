import React, { useRef, useState } from 'react'
import { Modal, message } from 'antd'
import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components'
import { getPurchaseOrderPage } from '@/api/erp/purchase/order'
import { emptyTextStyle } from '@/styles/common.style'

interface PurchaseOrderSelectModalProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSelect: (record: any) => void
}

const PurchaseOrderSelectModal: React.FC<PurchaseOrderSelectModalProps> = ({
  visible,
  setVisible,
  onSelect
}) => {
  const actionRef = useRef<ActionType>(undefined)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)

  const columns: ProColumns<any>[] = [
    {
      title: '订单号',
      dataIndex: 'no',
      width: 110,
      align: 'center',
      fieldProps: { placeholder: '请输入订单号' }
    },
    {
      title: '产品',
      dataIndex: 'productId',
      align: 'center',
      hideInTable: true,
      fieldProps: { placeholder: '请选择产品' },
      valueType: 'select'
    },
    { title: '供应商', dataIndex: 'supplierName', width: 110, align: 'center', hideInSearch: true },
    {
      title: '产品信息',
      dataIndex: 'productNames',
      align: 'center',
      width: 130,
      hideInSearch: true,
      ellipsis: true
    },
    { title: '创建人', dataIndex: 'creatorName', align: 'center', width: 110, hideInSearch: true },
    { title: '总数量', dataIndex: 'totalCount', align: 'center', width: 110, hideInSearch: true },
    { title: '入库数量', dataIndex: 'inCount', align: 'center', width: 110, hideInSearch: true },
    {
      title: '金额合计',
      dataIndex: 'totalPrice',
      width: 110,
      align: 'center',
      valueType: 'money',
      hideInSearch: true
    },
    {
      title: '含税金额',
      dataIndex: 'taxTotalPrice',
      width: 110,
      align: 'center',
      valueType: 'money',
      hideInSearch: true
    }
  ]

  const handleOk = () => {
    if (!selectedRecord) {
      message.warning('请选择一条采购订单')
      return
    }
    onSelect(selectedRecord)
    setVisible(false)
  }

  return (
    <Modal
      title="选择采购订单（仅展示可入库）"
      width={1000}
      open={visible}
      onCancel={() => setVisible(false)}
      onOk={handleOk}
      destroyOnHidden
    >
      <ProTable<any>
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 900, y: 400 }}
        columns={columns}
        form={{ colon: false }}
        search={{
          labelWidth: 'auto',
          span: 6
        }}
        options={false}
        rowSelection={{
          type: 'radio',
          onChange: (_, selectedRows) => {
            setSelectedRecord(selectedRows[0])
          }
        }}
        request={async (params) => {
          const { current, pageSize, orderTime, ...rest } = params
          const req = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            startTime: orderTime?.[0] ? orderTime[0] + ' 00:00:00' : undefined,
            endTime: orderTime?.[1] ? orderTime[1] + ' 23:59:59' : undefined,
            ...rest
          }
          const res = await getPurchaseOrderPage({ pageReqVO: req } as any)
          return {
            data: res.data?.list || [],
            success: res.code === 0,
            total: res.data?.total || 0
          }
        }}
        pagination={{ defaultPageSize: 10 }}
        locale={{
          emptyText: <div style={emptyTextStyle}>暂无数据</div>
        }}
      />
    </Modal>
  )
}

export default PurchaseOrderSelectModal
