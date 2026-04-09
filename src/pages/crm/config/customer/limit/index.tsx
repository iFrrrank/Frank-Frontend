import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import {
  getCustomerLimitConfigPage,
  deleteCustomerLimitConfig
} from '@/api/crm/customerLimitConfig'
import CustomerLimitConfigForm from './CustomerLimitConfigForm'
import { textConst } from '@/locales/zh-CN'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { handleDelete } from '@/components/Delete'
import { CUSTOMER_LIMIT_CONFIG_TYPE } from '@/utils/constantsValue'

const CustomerLimitConfigManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)
  const [type, setType] = useState<string>('1')

  const handleCreate = () => {
    setCurrentId(undefined)
    setFormVisible(true)
  }

  const handleUpdate = (id: number) => {
    setCurrentId(id)
    setFormVisible(true)
  }

  const columns: ProColumns<API.CrmCustomerLimitConfigRespVO>[] = [
    {
      title: '编号',
      dataIndex: 'id',
      width: 80,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '规则适用人群',
      dataIndex: 'users',
      width: 180,
      align: 'center',
      hideInSearch: true,
      render: (_, record: any) =>
        record.users?.map((u: any) => u.nickname || u.name).join('，') || '-'
    },
    {
      title: '规则适用部门',
      dataIndex: 'depts',
      width: 180,
      align: 'center',
      hideInSearch: true,
      render: (_, record: any) => record.depts?.map((d: any) => d.name).join('，') || '-'
    },
    {
      title: type === '1' ? '拥有客户数上限' : '锁定客户数上限',
      dataIndex: 'maxCount',
      width: 140,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '成交客户是否占用拥有客户数',
      dataIndex: 'dealCountEnabled',
      width: 220,
      align: 'center',
      hideInTable: type !== '1',
      hideInSearch: true,
      render: (_, record) => (record.dealCountEnabled ? '是' : '否')
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 160,
      align: 'center',
      hideInSearch: true
    },
    {
      title: textConst.table.action,
      valueType: 'option',
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a key="update" onClick={() => handleUpdate(record.id as number)}>
            {textConst.action.update}
          </a>
          <a
            key="delete"
            style={deleteTextStyle}
            onClick={() =>
              handleDelete(record, deleteCustomerLimitConfig, () => actionRef.current?.reload())
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
      <ProTable<API.CrmCustomerLimitConfigRespVO>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        search={false}
        toolbar={{
          menu: {
            type: 'tab',
            activeKey: type,
            items: Object.entries(CUSTOMER_LIMIT_CONFIG_TYPE).map(([key, value]) => ({
              key: key,
              label: value.text
            })),
            onChange: (key) => {
              setType(key as string)
              actionRef.current?.setPageInfo?.({ current: 1 })
              actionRef.current?.reload()
            }
          }
        }}
        request={async (params) => {
          const { current, pageSize } = params
          const req = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            type: Number(type)
          }
          const res = await getCustomerLimitConfigPage({ pageVO: req } as any)
          return {
            data: res.data?.list || [],
            success: res.code === 0,
            total: res.data?.total || 0
          }
        }}
        pagination={{ align: 'center', showSizeChanger: true }}
        toolBarRender={() => [
          <Button
            key="refresh"
            icon={<ReloadOutlined />}
            onClick={() => actionRef.current?.reload()}
          >
            {textConst.action.refresh}
          </Button>,
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={handleCreate}>
            {textConst.action.create}
          </Button>
        ]}
      />

      <CustomerLimitConfigForm
        visible={formVisible}
        setVisible={setFormVisible}
        id={currentId}
        type={type}
        onSuccess={() => {
          setFormVisible(false)
          actionRef.current?.reload()
        }}
      />
    </>
  )
}

export default CustomerLimitConfigManagement
