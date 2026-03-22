import React, { useRef, useState } from 'react'
import { Badge, Button, message, Modal, Tag } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ModalForm, ProFormDigit, ProFormRadio, ProFormText, ProTable } from '@ant-design/pro-components'
import {
  createMailAccount,
  deleteMailAccount,
  getMailAccountPage,
  updateMailAccount
} from '@/api/system/mailAccount'

const MailAccountConfig: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editingMailAccount, setEditingMailAccount] = useState<API.SystemMailAccountRespVO | null>(null)
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
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 180,
      hideInSearch: true,
      render: (_, record) => <span>{record.createTime as any}</span>
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 150,
      key: 'option',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <a key="edit" onClick={() => handleEdit(record)}>
            修改
          </a>
          <a key="delete" onClick={() => handleDelete(record)} style={{ color: '#ff4d4f' }}>
            删除
          </a>
        </div>
      )
    }
  ]

  // ===== 修改操作 =====
  const handleEdit = (record: API.SystemMailAccountRespVO) => {
    setEditingMailAccount(record)
    setCreateModalVisible(true)
  }

  // ===== 单个删除 =====
  const handleDelete = (record: API.SystemMailAccountRespVO) => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: `是否确认删除 ID 为"${record.id}"的邮箱账号数据项?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteMailAccount({ id: record.id! })
          message.success('删除成功')
          actionRef.current?.reload()
        } catch {
          message.error('删除失败')
        }
      }
    })
  }

  // ===== 批量删除 =====
  const handleBatchDelete = () => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: `是否确认删除选中的 ${selectedRowKeys.length} 个邮箱账号数据项?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          // 在实际项目中建议提供后台批量接口，由于这里的 API 中暂时只有单删，通过循环并行发送请求
          await Promise.all(selectedRowKeys.map((id) => deleteMailAccount({ id: Number(id) })))
          message.success('批量删除成功')
          setSelectedRowKeys([])
          actionRef.current?.reload()
        } catch {
          message.error('批量删除失败')
        }
      }
    })
  }

  return (
    <>
      <ProTable<API.SystemMailAccountRespVO>
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
        headerTitle={false}
        toolBarRender={() => [
          <Button
            key="create"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setEditingMailAccount(null)
              setCreateModalVisible(true)
            }}
          >
            新增
          </Button>,
          <Button
            key="batchDelete"
            icon={<DeleteOutlined />}
            danger
            disabled={selectedRowKeys.length === 0}
            style={
              selectedRowKeys.length > 0
                ? { color: '#ff4d4f', borderColor: '#ffccc7', background: '#fff2f0' }
                : { color: '#ffccc7', borderColor: '#ffe6e6', background: '#fffaf0' }
            }
            onClick={handleBatchDelete}
          >
            批量删除
          </Button>
        ]}
      />

      <ModalForm<API.SystemMailAccountSaveReqVO>
        title={editingMailAccount ? '修改' : '新建'}
        width={600}
        open={createModalVisible}
        onOpenChange={(visible) => {
          setCreateModalVisible(visible)
          if (!visible) {
            setEditingMailAccount(null)
          }
        }}
        initialValues={
          editingMailAccount
            ? { ...editingMailAccount }
            : {
              sslEnable: true,
              starttlsEnable: false
            }
        }
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        modalProps={{
          destroyOnClose: true,
          maskClosable: false
        }}
        onFinish={async (values) => {
          try {
            let resp
            if (editingMailAccount) {
              resp = await updateMailAccount({ ...values, id: editingMailAccount.id })
            } else {
              resp = await createMailAccount(values)
            }

            if (resp.code === 0) {
              message.success(editingMailAccount ? '修改成功' : '新增成功')
              actionRef.current?.reload()
              return true
            } else {
              message.error(resp.msg || (editingMailAccount ? '修改失败' : '新增失败'))
              return false
            }
          } catch {
            message.error(editingMailAccount ? '修改失败' : '新增失败')
            return false
          }
        }}
      >
        <ProFormText
          name="mail"
          label="邮箱"
          placeholder="请输入邮箱"
          rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入正确的邮箱格式' }]}
        />
        <ProFormText
          name="username"
          label="用户名"
          placeholder="请输入用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        />
        <ProFormText.Password
          name="password"
          label="密码"
          placeholder="请输入密码"
          rules={[{ required: true, message: '请输入密码' }]}
        />
        <ProFormText
          name="host"
          label="SMTP 服务器域名"
          placeholder="请输入 SMTP 服务器域名"
          rules={[{ required: true, message: '请输入 SMTP 服务器域名' }]}
        />
        <ProFormDigit
          name="port"
          label="SMTP 服务器端口"
          placeholder="请输入 SMTP 服务器端口"
          rules={[{ required: true, message: '请输入 SMTP 服务器端口' }]}
          fieldProps={{
            precision: 0
          }}
        />
        <ProFormRadio.Group
          name="sslEnable"
          label="是否开启 SSL"
          options={[
            { label: '是', value: true },
            { label: '否', value: false }
          ]}
        />
        <ProFormRadio.Group
          name="starttlsEnable"
          label="是否开启 STARTTLS"
          options={[
            { label: '是', value: true },
            { label: '否', value: false }
          ]}
        />
      </ModalForm>
    </>
  )
}

export default MailAccountConfig
