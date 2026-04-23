import React, { useRef } from 'react'
import { Button, Col, Dropdown, MenuProps, Row, Tag } from 'antd'
import { DeleteOutlined, DoubleRightOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProFormInstance, ProTable } from '@ant-design/pro-components'
import { deleteSocialClient, getSocialClientPage } from '@/api/system/socialClient'
import SaveSocialClientForm, {
  handleCreateSocialClient,
  handleEditSocialClient
} from './SaveSocialClientForm'
import { textConst } from '@/locales/zh-CN'
import { handleBatchDelete, handleDelete } from '@/components/Delete'
import { tableActionStyle } from '@/styles/common.style'

// 社交平台类型枚举
const SOCIAL_TYPE_MAP: Record<number, string> = {
  5: 'Gitee',
  10: '钉钉',
  20: '企业微信',
  30: '微信小程序',
  31: '微信公众平台',
  32: '微信开放平台'
}

// 用户类型枚举
const USER_TYPE_MAP: Record<number, { text: string; color: string }> = {
  1: { text: '管理员', color: 'blue' },
  2: { text: '会员', color: 'green' }
}

const SocialClientPage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  // 列定义
  const columns: ProColumns<API.SystemSocialClientRespVO>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      width: 80,
      hideInSearch: true
    },
    {
      title: '应用名',
      dataIndex: 'name',
      align: 'center',
      width: 150,
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入应用名'
      }
    },
    {
      title: '社交平台',
      dataIndex: 'socialType',
      align: 'center',
      width: 180,
      valueType: 'select',
      valueEnum: {
        5: { text: 'Gitee' },
        10: { text: '钉钉' },
        20: { text: '企业微信' },
        30: { text: '微信小程序' },
        31: { text: '微信公众平台' },
        32: { text: '微信开放平台' }
      },
      fieldProps: {
        placeholder: '请选择社交平台'
      },
      render: (_text, record) => SOCIAL_TYPE_MAP[record.socialType] || record.socialType
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
        placeholder: '请选择用户类型'
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
      width: 200,
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入客户端 ID'
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 80,
      valueType: 'select',
      valueEnum: {
        0: { text: '开启', status: 'Success' },
        1: { text: '关闭', status: 'Error' }
      },
      fieldProps: {
        placeholder: '请选择状态'
      }
    },
    {
      title: textConst.columns.createTime,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      align: 'center',
      width: 180,
      hideInSearch: true
    },
    {
      title: textConst.form.operate,
      valueType: 'option',
      align: 'center',
      width: 160,
      key: 'option',
      render: (_text, record) => {
        const moreMenuItems: MenuProps['items'] = [
          {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: textConst.action.delete,
            onClick: () =>
              handleDelete(record, deleteSocialClient, () => actionRef.current?.reload())
          }
        ]
        return (
          <div style={tableActionStyle}>
            <a key="edit" onClick={() => handleEditSocialClient(record)}>
              <EditOutlined /> {textConst.action.update}
            </a>
            <Dropdown menu={{ items: moreMenuItems }} placement="bottomRight">
              <a onClick={(e) => e.preventDefault()}>
                <DoubleRightOutlined /> {textConst.action.more}
              </a>
            </Dropdown>
          </div>
        )
      }
    }
  ]

  return (
    <Row gutter={16}>
      <Col span={24}>
        <ProTable<API.SystemSocialClientRespVO>
          headerTitle="三方应用"
          columns={columns}
          scroll={{ x: 'max-content' }}
          actionRef={actionRef}
          formRef={formRef}
          form={{ colon: false }}
          cardBordered
          request={async (params: Record<string, any>) => {
            const { current, pageSize, name, socialType, userType, clientId, status, ...rest } =
              params
            const resp = await getSocialClientPage({
              pageVO: {
                pageNo: current || 1,
                pageSize: pageSize || 10,
                ...(name ? { name } : {}),
                ...(socialType !== undefined && socialType !== ''
                  ? { socialType: Number(socialType) }
                  : {}),
                ...(userType !== undefined && userType !== ''
                  ? { userType: Number(userType) }
                  : {}),
                ...(clientId ? { clientId } : {}),
                ...(status !== undefined && status !== '' ? { status: Number(status) } : {}),
                ...rest
              }
            })
            return {
              data: resp.data?.list,
              success: true,
              total: resp.data?.total
            }
          }}
          columnsState={{
            persistenceKey: 'pro-table-social-client',
            persistenceType: 'localStorage',
            defaultValue: {
              option: { fixed: 'right', disable: true }
            }
          }}
          rowKey="id"
          search={{
            labelWidth: 'auto',
            span: 6
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
          toolBarRender={() => [
            <Button
              key="create"
              icon={<PlusOutlined />}
              onClick={() => handleCreateSocialClient()}
              type="primary"
            >
              {textConst.action.create}
            </Button>
          ]}
        />
      </Col>

      <SaveSocialClientForm onSuccess={() => actionRef.current?.reload()} />
    </Row>
  )
}

export default SocialClientPage
