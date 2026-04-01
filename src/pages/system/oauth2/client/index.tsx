import React, { useRef, useState } from 'react'
import type { MenuProps } from 'antd'
import { Button, Col, Dropdown, Input, message, Modal, Row } from 'antd'
import {
  CopyOutlined,
  DeleteOutlined,
  DoubleRightOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined
} from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { deleteOAuth2Client, getOAuth2Client, getOAuth2ClientPage } from '@/api/system/oAuth2Client'
import SaveOAuth2ClientForm, {
  handleCreateOAuth2Client,
  handleEditOAuth2Client
} from './SaveOAuth2ClientForm'
import { textConst } from '@/locales/zh-CN'
import { handleBatchDelete } from '@/components/BatchDelete'
import { handleDelete } from '@/components/SingleDelete'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'

const App_: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [copyModalVisible, setCopyModalVisible] = useState(false)
  const [copyClientData, setCopyClientData] = useState<{
    clientId: string
    secret: string
  } | null>(null)

  // 列定义
  const columns: ProColumns<API.SystemOAuth2ClientRespVO>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      width: 80,
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入 ID'
      }
    },
    {
      title: '应用名称',
      dataIndex: 'name',
      align: 'center',
      width: 150,
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入应用名称'
      }
    },
    {
      title: '客户端 ID',
      dataIndex: 'clientId',
      align: 'center',
      width: 200,
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '应用描述',
      dataIndex: 'description',
      align: 'center',
      width: 200,
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      width: 80,
      valueType: 'select',
      valueEnum: {
        0: {
          text: '开启',
          status: 'Success'
        },
        1: {
          text: '关闭',
          status: 'Error'
        }
      },
      fieldProps: {
        placeholder: '请输入状态'
      }
    },
    {
      title: '访问令牌有效期',
      dataIndex: 'accessTokenValiditySeconds',
      align: 'center',
      width: 120,
      valueType: 'text',
      hideInSearch: true,
      render: (text) => (text ? `${text}秒` : '-')
    },
    {
      title: '刷新令牌有效期',
      dataIndex: 'refreshTokenValiditySeconds',
      align: 'center',
      width: 120,
      valueType: 'text',
      hideInSearch: true,
      render: (text) => (text ? `${text}秒` : '-')
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
              handleDelete(record, deleteOAuth2Client, () => actionRef.current?.reload())
          },
          {
            key: 'copy',
            icon: <CopyOutlined />,
            label: '复制凭证',
            onClick: () => handleCopyCredentials(record)
          }
        ]
        return (
          <div style={tableActionStyle}>
            <a key="edit" onClick={() => handleEditOAuth2Client(record)}>
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

  // ===== 复制凭证 =====
  const handleCopyCredentials = (record: API.SystemOAuth2ClientRespVO) => {
    setCopyClientData({
      clientId: record.clientId,
      secret: record.secret
    })
    setCopyModalVisible(true)
  }

  // 复制到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.success(textConst.msg.copySuccess)
      })
      .catch(() => {
        message.error(textConst.msg.copyError)
      })
  }

  return (
    <Row gutter={16}>
      <Col span={24}>
        <ProTable<API.SystemOAuth2ClientRespVO>
          columns={columns}
          scroll={{ x: 'max-content' }}
          actionRef={actionRef}
          formRef={formRef}
          form={{ colon: false }}
          cardBordered
          request={async (params: Record<string, any>) => {
            const { current, pageSize, id, name, status, ...rest } = params

            // 如果输入了 ID，则精确查询
            if (id) {
              try {
                const resp = await getOAuth2Client({ id: Number(id) })
                if (resp.code === 0 && resp.data) {
                  return {
                    data: [resp.data],
                    success: true,
                    total: 1
                  }
                }
                return { data: [], success: true, total: 0 }
              } catch {
                return { data: [], success: true, total: 0 }
              }
            }

            // 否则走分页查询
            const resp = await getOAuth2ClientPage({
              pageVO: {
                pageNo: current || 1,
                pageSize: pageSize || 10,
                ...(name ? { name } : {}),
                ...(status !== undefined && status !== '' ? { status: Number(status) } : {})
              },
              ...rest
            })
            return {
              data: resp.data?.list,
              success: true,
              total: resp.data?.total
            }
          }}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys)
          }}
          columnsState={{
            persistenceKey: 'pro-table-oauth2-client',
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
          headerTitle="应用管理"
          toolBarRender={() => [
            <Button
              key="create"
              icon={<PlusOutlined />}
              onClick={() => handleCreateOAuth2Client()}
              type="primary"
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
                  deleteOAuth2Client,
                  () => setSelectedRowKeys([]),
                  () => actionRef.current?.reload()
                )
              }
            >
              {textConst.action.batchDelete}
            </Button>
          ]}
        />
      </Col>

      <SaveOAuth2ClientForm onSuccess={() => actionRef.current?.reload()} />

      {/* ========== 复制凭证弹窗 ========== */}
      <Modal
        title="应用凭证"
        open={copyModalVisible}
        onCancel={() => setCopyModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setCopyModalVisible(false)}>
            {textConst.common.close}
          </Button>
        ]}
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontWeight: 'bold' }}>客户端 ID：</span>
            <Button
              type="link"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(copyClientData?.clientId || '')}
              style={{ padding: 0, marginLeft: 8 }}
            >
              {textConst.action.copy}
            </Button>
          </div>
          <Input value={copyClientData?.clientId} readOnly style={{ marginBottom: 16 }} />

          <div style={{ marginBottom: 8 }}>
            <span style={{ fontWeight: 'bold' }}>客户端密钥：</span>
            <Button
              type="link"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(copyClientData?.secret || '')}
              style={{ padding: 0, marginLeft: 8 }}
            >
              {textConst.action.copy}
            </Button>
          </div>
          <Input.Password value={copyClientData?.secret} readOnly visibilityToggle={false} />
        </div>
        <div
          style={{
            backgroundColor: '#fffbe6',
            border: '1px solid #ffe58f',
            padding: 12,
            borderRadius: 6
          }}
        >
          <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />
          <span style={{ color: '#d46b08' }}>请妥善保管您的客户端密钥，不要泄露给他人</span>
        </div>
      </Modal>
    </Row>
  )
}

export default App_
