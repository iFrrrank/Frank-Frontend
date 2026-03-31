import React, { useRef } from 'react'
import { message, Modal, Tag } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { deleteAccessToken, getAccessTokenPage } from '@/api/system/oAuth2Token'
import { textConstants } from '@/locales/zh-CN'

/** 用户类型枚举 */
const USER_TYPE_MAP: Record<number, { text: string; color: string }> = {
  1: { text: '管理员', color: 'blue' },
  2: { text: '会员', color: 'green' }
}

const TokenPage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)

  // ===== 强退（删除令牌） =====
  const handleForceLogout = (record: API.SystemOAuth2AccessTokenRespVO) => {
    Modal.confirm({
      title: textConstants.msg.reminder,
      icon: <ExclamationCircleOutlined />,
      content: `确定要强退用户 ID 为 ${record.userId} 的令牌吗？`,
      onOk: async () => {
        try {
          await deleteAccessToken({ accessToken: record.accessToken })
          message.success('强退成功')
          actionRef.current?.reload()
        } catch {
          message.error('强退失败')
        }
      }
    })
  }

  // 列定义
  const columns: ProColumns<API.SystemOAuth2AccessTokenRespVO>[] = [
    {
      title: '访问令牌',
      dataIndex: 'accessToken',
      align: 'center',
      width: 260,
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true
    },
    {
      title: '刷新令牌',
      dataIndex: 'refreshToken',
      align: 'center',
      width: 260,
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true
    },
    {
      title: '用户 ID',
      dataIndex: 'userId',
      align: 'center',
      width: 100,
      valueType: 'text',
      fieldProps: {
        placeholder: `${textConstants.common.inputText}用户 ID`
      }
    },
    {
      title: '用户类型',
      dataIndex: 'userType',
      align: 'center',
      width: 100,
      valueType: 'select',
      valueEnum: {
        1: { text: '管理员' },
        2: { text: '会员' }
      },
      fieldProps: {
        placeholder: `${textConstants.common.inputText}用户类型`
      },
      render: (_text, record) => {
        const item = USER_TYPE_MAP[record.userType]
        return item ? <Tag color={item.color}>{item.text}</Tag> : record.userType
      }
    },
    {
      title: '客户端 ID',
      dataIndex: 'clientId',
      align: 'center',
      width: 120,
      valueType: 'text',
      hideInTable: true,
      fieldProps: {
        placeholder: `${textConstants.common.inputText}客户端 ID`
      }
    },
    {
      title: '过期时间',
      dataIndex: 'expiresTime',
      valueType: 'dateTime',
      align: 'center',
      width: 180,
      hideInSearch: true
    },
    {
      title: textConstants.columns.createTime,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      align: 'center',
      width: 180,
      hideInSearch: true
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 80,
      key: 'option',
      render: (_text, record) => (
        <a key="forceLogout" onClick={() => handleForceLogout(record)} style={{ color: 'red' }}>
          强退
        </a>
      )
    }
  ]

  return (
    <ProTable<API.SystemOAuth2AccessTokenRespVO>
      columns={columns}
      scroll={{ x: 'max-content' }}
      actionRef={actionRef}
      form={{ colon: false }}
      cardBordered
      request={async (params: Record<string, any>) => {
        const { current, pageSize, userId, userType, clientId } = params
        const resp = await getAccessTokenPage({
          reqVO: {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...(userId ? { userId: Number(userId) } : {}),
            ...(userType !== undefined && userType !== '' ? { userType: Number(userType) } : {}),
            ...(clientId ? { clientId } : {})
          } as API.SystemOAuth2AccessTokenPageReqVO
        })
        return {
          data: resp.data?.list,
          success: true,
          total: resp.data?.total
        }
      }}
      columnsState={{
        persistenceKey: 'pro-table-oauth2-token',
        persistenceType: 'localStorage',
        defaultValue: {
          option: { fixed: 'right', disable: true }
        }
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto'
      }}
      options={{
        setting: {
          listsHeight: 400
        }
      }}
      pagination={{
        align: 'center',
        showSizeChanger: true
      }}
      dateFormatter="string"
      headerTitle="令牌管理"
    />
  )
}

export default TokenPage
