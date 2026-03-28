import React, { useRef, useState } from 'react'
import type { MenuProps } from 'antd'
import { Button, Col, Dropdown, message, Modal, Row, Tag } from 'antd'
import {
  DeleteOutlined,
  DoubleRightOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined
} from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ModalForm, ProFormSelect, ProFormText, ProTable } from '@ant-design/pro-components'
import {
  createSocialClient,
  deleteSocialClient,
  getSocialClient,
  getSocialClientPage,
  updateSocialClient
} from '@/api/system/socialClient'

/** 社交平台类型枚举 */
const SOCIAL_TYPE_MAP: Record<number, string> = {
  5: 'Gitee',
  10: '钉钉',
  20: '企业微信',
  30: '微信小程序',
  31: '微信公众平台',
  32: '微信开放平台'
}

/** 用户类型枚举 */
const USER_TYPE_MAP: Record<number, { text: string; color: string }> = {
  1: { text: '管理员', color: 'blue' },
  2: { text: '会员', color: 'green' }
}

const SocialClientPage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editingClient, setEditingClient] = useState<API.SystemSocialClientRespVO | null>(null)

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
      title: '创建时间',
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
      width: 160,
      key: 'option',
      render: (_text, record) => {
        const moreMenuItems: MenuProps['items'] = [
          {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: '删除',
            onClick: () => handleDelete(record)
          }
        ]
        return (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            <a key="edit" onClick={() => handleEdit(record)}>
              <EditOutlined /> 修改
            </a>
            <Dropdown menu={{ items: moreMenuItems }} placement="bottomRight">
              <a onClick={(e) => e.preventDefault()}>
                <DoubleRightOutlined /> 更多
              </a>
            </Dropdown>
          </div>
        )
      }
    }
  ]

  // ===== 修改 =====
  const handleEdit = async (record: API.SystemSocialClientRespVO) => {
    try {
      const resp = await getSocialClient({ id: record.id })
      if (resp.code === 0 && resp.data) {
        setEditingClient(resp.data)
        setCreateModalVisible(true)
      }
    } catch {
      message.error('获取社交客户端信息失败')
    }
  }

  // ===== 删除 =====
  const handleDelete = (record: API.SystemSocialClientRespVO) => {
    Modal.confirm({
      title: '温馨提示',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除应用"${record.name}"吗？`,
      onOk: async () => {
        try {
          await deleteSocialClient({ id: record.id })
          message.success('删除成功')
          actionRef.current?.reload()
        } catch {
          message.error('删除失败')
        }
      }
    })
  }

  return (
    <Row gutter={16}>
      <Col span={24}>
        <ProTable<API.SystemSocialClientRespVO>
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
          headerTitle="三方应用"
          toolBarRender={() => [
            <Button
              key="create"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingClient(null)
                setCreateModalVisible(true)
              }}
              type="primary"
            >
              新增
            </Button>
          ]}
        />
      </Col>

      {/* ========== 新增/修改社交客户端弹窗 ========== */}
      <ModalForm<API.SystemSocialClientSaveReqVO>
        title={editingClient ? '修改' : '新增'}
        width={600}
        open={createModalVisible}
        onOpenChange={(visible) => {
          setCreateModalVisible(visible)
          if (!visible) {
            setEditingClient(null)
          }
        }}
        initialValues={
          editingClient
            ? {
              id: editingClient.id,
              name: editingClient.name,
              socialType: editingClient.socialType,
              userType: editingClient.userType,
              clientId: editingClient.clientId,
              clientSecret: editingClient.clientSecret,
              agentId: editingClient.agentId,
              status: editingClient.status
            }
            : {
              status: 0
            }
        }
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          bodyStyle: { paddingBottom: 0 }
        }}
        onFinish={async (values) => {
          try {
            let resp: any
            if (editingClient) {
              resp = await updateSocialClient({ ...values, id: editingClient.id })
            } else {
              resp = await createSocialClient(values)
            }
            if (resp.code === 0) {
              message.success(editingClient ? '修改成功' : '创建成功')
              actionRef.current?.reload()
              return true
            } else {
              message.error(resp.msg || (editingClient ? '修改失败' : '创建失败'))
              return false
            }
          } catch {
            message.error(editingClient ? '修改失败' : '创建失败')
            return false
          }
        }}
      >
        <ProFormText
          name="name"
          label="应用名"
          placeholder="请输入应用名"
          rules={[{ required: true, message: '请输入应用名' }]}
        />
        <ProFormSelect
          name="socialType"
          label="社交平台"
          placeholder="请选择社交平台"
          options={[
            { label: 'Gitee', value: 5 },
            { label: '钉钉', value: 10 },
            { label: '企业微信', value: 20 },
            { label: '微信公众平台', value: 31 },
            { label: '微信开放平台', value: 32 },
            { label: '微信小程序', value: 30 }
          ]}
          rules={[{ required: true, message: '请选择社交平台' }]}
        />
        <ProFormSelect
          name="userType"
          label="用户类型"
          placeholder="请选择用户类型"
          options={[
            { label: '会员', value: 2 },
            { label: '管理员', value: 1 }
          ]}
          rules={[{ required: true, message: '请选择用户类型' }]}
        />
        <ProFormText
          name="clientId"
          label="客户端 ID"
          placeholder="请输入客户端 ID,对应各平台的appKey"
          rules={[{ required: true, message: '请输入客户端 ID' }]}
        />
        <ProFormText
          name="clientSecret"
          label="客户端密钥"
          placeholder="请输入客户端密钥,对应各平台的appSecret"
          rules={[{ required: true, message: '请输入客户端密钥' }]}
        />
        <ProFormSelect
          name="status"
          label="状态"
          placeholder="请选择状态"
          options={[
            { label: '开启', value: 0 },
            { label: '关闭', value: 1 }
          ]}
          rules={[{ required: true, message: '请选择状态' }]}
        />
      </ModalForm>
    </Row>
  )
}

export default SocialClientPage
