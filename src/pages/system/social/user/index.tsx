import React, { useRef } from 'react'
import { Col, Image, message, Row } from 'antd'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { getSocialUserPage } from '@/api/system/socialUser'
import { textConstants } from '@/locales/zh-CN'

/** 社交平台类型枚举 */
const SOCIAL_TYPE_MAP: Record<number, string> = {
  5: 'Gitee',
  10: '钉钉',
  20: '企业微信',
  30: '微信小程序',
  31: '微信公众平台',
  32: '微信开放平台'
}

const SocialUserPage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)

  const columns: ProColumns<API.SystemSocialUserRespVO>[] = [
    {
      title: '社交平台',
      dataIndex: 'type',
      align: 'center',
      width: 150,
      valueType: 'select',
      order: 4,
      valueEnum: {
        5: { text: 'Gitee' },
        10: { text: '钉钉' },
        20: { text: '企业微信' },
        30: { text: '微信小程序' },
        31: { text: '微信公众平台' },
        32: { text: '微信开放平台' }
      },
      fieldProps: {
        placeholder: '请输入社交平台'
      },
      render: (_text, record) => SOCIAL_TYPE_MAP[record.type] || record.type
    },
    {
      title: '社交 openid',
      dataIndex: 'openid',
      align: 'center',
      width: 250,
      valueType: 'text',
      order: 2,
      fieldProps: {
        placeholder: '请输入社交 openid'
      }
    },
    {
      title: '用户昵称',
      dataIndex: 'nickname',
      align: 'center',
      width: 150,
      valueType: 'text',
      order: 3,
      fieldProps: {
        placeholder: '请输入用户昵称'
      }
    },
    {
      title: '用户头像',
      dataIndex: 'avatar',
      align: 'center',
      width: 100,
      hideInSearch: true,
      render: (_, record) =>
        record.avatar ? (
          <Image src={record.avatar} width={40} height={40} style={{ borderRadius: '50%' }} />
        ) : (
          '-'
        )
    },
    {
      title: textConstants.columns.createTime,
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
      align: 'center',
      width: 180,
      order: 1,
      hideInSearch: true,
      fieldProps: {
        placeholder: ['开始日期', '结束日期']
      },
      render: (_, record) => record.createTime
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      align: 'center',
      width: 180,
      hideInSearch: true
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 100,
      key: 'option',
      render: () => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            <a key="detail" onClick={() => message.info('详情功能尚未实现')}>
              详情
            </a>
          </div>
        )
      }
    }
  ]

  return (
    <Row gutter={16}>
      <Col span={24}>
        <ProTable<API.SystemSocialUserRespVO>
          columns={columns}
          scroll={{ x: 'max-content' }}
          actionRef={actionRef}
          form={{ colon: false }}
          cardBordered
          request={async (params: Record<string, any>) => {
            const { current, pageSize, type, nickname, openid, createTime, ...rest } = params
            const req = {
              pageVO: {
                pageNo: current || 1,
                pageSize: pageSize || 10,
                ...(type !== undefined && type !== '' ? { type: Number(type) } : {}),
                ...(nickname ? { nickname } : {}),
                ...(openid ? { openid } : {}),
                ...(createTime && createTime.length === 2
                  ? { createTime: [createTime[0], createTime[1]] }
                  : {}),
                ...rest
              }
            } as any

            // Handle date range format usually expected by the backend
            if (createTime && createTime.length === 2) {
              req.pageVO['createTime[0]'] = createTime[0] + ' 00:00:00'
              req.pageVO['createTime[1]'] = createTime[1] + ' 23:59:59'
              delete req.pageVO.createTime
            }

            const resp = await getSocialUserPage(req)
            return {
              data: resp.data?.list,
              success: true,
              total: resp.data?.total
            }
          }}
          columnsState={{
            persistenceKey: 'pro-table-social-user',
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
        />
      </Col>
    </Row>
  )
}

export default SocialUserPage
