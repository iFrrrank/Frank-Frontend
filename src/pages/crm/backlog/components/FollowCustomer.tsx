import React, { useRef } from 'react'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { getCustomerPage } from '@/api/crm/customer'
import { FOLLOW_STATUS } from '@/utils/constantsValue'

const FollowCustomer: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)

  const columns: ProColumns<API.CrmCustomerRespVO>[] = [
    {
      title: '状态',
      dataIndex: 'followUpStatus',
      hideInTable: true,
      valueType: 'select',
      valueEnum: FOLLOW_STATUS,
      align: 'center',
      fieldProps: {
        placeholder: "请选择状态"
      }
    },
    {
      title: '客户名称',
      dataIndex: 'name',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '客户来源',
      dataIndex: 'source',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '手机',
      dataIndex: 'mobile',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '电话',
      dataIndex: 'telephone',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '电子电子邮箱',
      dataIndex: 'email',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '客户级别',
      dataIndex: 'level',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '客户行业',
      dataIndex: 'industryId',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '下次联系时间',
      dataIndex: 'contactNextTime',
      valueType: 'dateTime',
      hideInSearch: true,
      align: 'center'
    }
  ]

  return (
    <ProTable<API.CrmCustomerRespVO>
      columns={columns}
      actionRef={actionRef}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      form={{ colon: false }}
      options={false}
      headerTitle="分配给我的客户"
      request={async (params) => {
        const { current, pageSize, followUpStatus, ...rest } = params
        const req = {
          pageNo: current || 1,
          pageSize: pageSize || 10,
          followUpStatus: followUpStatus === 'true' ? true : followUpStatus === 'false' ? false : undefined,
          sceneType: 1, // '我负责的'
          pool: false,
          ...rest
        }
        const res = await getCustomerPage({ pageVO: req })
        return {
          data: res.data?.list || [],
          success: res.code === 0,
          total: res.data?.total || 0,
        }
      }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
      }}
    />
  )
}

export default FollowCustomer
