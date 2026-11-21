import React from 'react'
import { ProColumns, ProTable } from '@ant-design/pro-components'
import { getCustomerOperateLog } from '@/api/crm/operateLog'

interface OperateLogPanelProps {
  bizId: number
}

// 操作日志面板：客户详情页使用（接口按客户维度记录）
const OperateLogPanel: React.FC<OperateLogPanelProps> = ({ bizId }) => {
  const columns: ProColumns<any>[] = [
    {
      title: '操作人',
      dataIndex: 'userName',
      align: 'center',
      width: 120,
      render: (_, record) => <span>{record.userName || record.creatorName || '-'}</span>
    },
    {
      title: '操作类型',
      dataIndex: 'type',
      align: 'center',
      width: 140,
      render: (_, record) => <span>{record.typeName || record.type || '-'}</span>
    },
    {
      title: '操作内容',
      dataIndex: 'action',
      ellipsis: true,
      render: (_, record) => <span>{record.action || record.content || '-'}</span>
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 170
    }
  ]

  return (
    <ProTable<any>
      rowKey="id"
      columns={columns}
      search={false}
      options={false}
      request={async (params) => {
        const resp = await getCustomerOperateLog({
          pageNo: params.current || 1,
          pageSize: params.pageSize || 10,
          bizId
        } as any)
        return {
          data: resp.data?.list || [],
          success: true,
          total: resp.data?.total || 0
        }
      }}
      pagination={{ align: 'center', showSizeChanger: true }}
    />
  )
}

export default OperateLogPanel
