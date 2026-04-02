import React, { useRef, useState } from 'react'
import { Badge, Button } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { deleteMailAccount, getMailAccountPage } from '@/api/system/mailAccount'
import { handleBatchDelete, handleDelete } from '@/components/Delete'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'

import SaveMailAccountForm, {
  handleCreateMailAccount,
  handleEditMailAccount
} from './SaveMailAccountForm'
import { textConst } from '@/locales/zh-CN'

const MailAccountConfig: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // ===== 数据列定义 =====
  const columns: ProColumns<API.SystemMailAccountRespVO>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      hideInSearch: true,
      width: 70
    },
    {
      title: '邮箱',
      dataIndex: 'mail',
      align: 'center',
      width: 200,
      fieldProps: {
        placeholder: '请输入邮箱'
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
      align: 'center',
      width: 150,
      fieldProps: {
        placeholder: '请输入用户名'
      }
    },
    {
      title: 'SMTP 服务器域名',
      dataIndex: 'host',
      align: 'center',
      hideInSearch: true,
      width: 150
    },
    {
      title: 'SMTP 服务器端口',
      dataIndex: 'port',
      align: 'center',
      hideInSearch: true,
      width: 150
    },
    {
      title: '是否开启 SSL',
      dataIndex: 'sslEnable',
      align: 'center',
      hideInSearch: true,
      width: 130,
      render: (_, record) => (
        <Badge
          status={record.sslEnable ? 'success' : 'error'}
          text={record.sslEnable ? '是' : '否'}
        />
      )
    },
    {
      title: '是否开启 STARTTLS',
      dataIndex: 'starttlsEnable',
      align: 'center',
      hideInSearch: true,
      width: 160,
      render: (_, record) => (
        <Badge
          status={record.starttlsEnable ? 'success' : 'error'}
          text={record.starttlsEnable ? '是' : '否'}
        />
      )
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
      width: 150,
      key: 'option',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a key="edit" onClick={() => handleEditMailAccount(record)}>
            {textConst.action.update}
          </a>
          <a
            key="delete"
            onClick={() =>
              handleDelete(record, deleteMailAccount, () => actionRef.current?.reload())
            }
            style={deleteTextStyle}
          >
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<API.SystemMailAccountRespVO>
        headerTitle="邮件账号"
        columns={columns}
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        formRef={formRef}
        form={{ colon: false }}
        cardBordered
        request={async (params: Record<string, any>) => {
          const { current, pageSize, mail, username, createTime, ...rest } = params

          let beginCreateTime, endCreateTime
          if (createTime && createTime.length === 2) {
            beginCreateTime = createTime[0] + ' 00:00:00'
            endCreateTime = createTime[1] + ' 23:59:59'
          }

          const resp = await getMailAccountPage({
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...(mail ? { mail } : {}),
            ...(username ? { username } : {}),
            ...(beginCreateTime ? { beginCreateTime } : {}),
            ...(endCreateTime ? { endCreateTime } : {}),
            ...rest
          } as any)

          return {
            data: resp.data?.list || [],
            success: true,
            total: resp.data?.total || 0
          }
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys)
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false
        }}
        options={false}
        pagination={{
          align: 'center',
          showSizeChanger: true
        }}
        toolBarRender={() => [
          <Button
            key="create"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => handleCreateMailAccount()}
          >
            {textConst.action.create}
          </Button>,
          <Button
            key="batchDelete"
            icon={<DeleteOutlined />}
            danger
            type="primary"
            disabled={selectedRowKeys.length === 0}
            onClick={() =>
              handleBatchDelete(
                selectedRowKeys,
                deleteMailAccount,
                () => setSelectedRowKeys([]),
                () => actionRef.current?.reload()
              )
            }
          >
            {textConst.action.batchDelete}
          </Button>
        ]}
      />

      <SaveMailAccountForm onSuccess={() => actionRef.current?.reload()} />
    </>
  )
}

export default MailAccountConfig
