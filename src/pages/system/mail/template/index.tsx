import React, { useEffect, useRef, useState } from 'react'
import { Button, message, Modal, Space, Typography } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { deleteMailTemplate, getMailTemplatePage } from '@/api/system/mailTemplate'
import SaveMailTemplateForm, {
  handleCreateMailTemplate,
  handleEditMailTemplate
} from './SaveMailTemplateForm'
import SendMailForm, { handleTestMailTemplate } from './SendMailForm'
import { getSimpleMailAccountList } from '@/api/system/mailAccount'
import { handleBatchDelete } from '@/components/BatchDelete'
import { handleDelete } from '@/components/SingleDelete'
import '@wangeditor/editor/dist/css/style.css'
import { textConst } from '@/locales/zh-CN'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'

const MailTemplateConfig: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // ===== 获取邮箱账号下拉列表 =====
  const [accountOptions, setAccountOptions] = useState<
    { label: string; value: number; mailString?: string }[]
  >([])
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const resp = await getSimpleMailAccountList()
        if (resp.code === 0 && resp.data) {
          setAccountOptions(
            resp.data.map((item) => ({
              label: item.mail,
              value: item.id,
              mailString: item.mail
            }))
          )
        }
      } catch (e) {
        console.error('获取邮箱账号列表失败', e)
      }
    }
    fetchAccounts()
  }, [])

  // 辅助函数：根据 accountId 获取 mail 名称
  const getAccountMail = (accountId: number) => {
    const act = accountOptions.find((a) => a.value === accountId)
    return act ? act.mailString : accountId
  }

  // ===== 数据列定义 =====
  const columns: ProColumns<API.SystemMailTemplateRespVO>[] = [
    {
      title: '模板编码',
      dataIndex: 'code',
      align: 'center',
      width: 150,
      fieldProps: {
        placeholder: '请输入模板编码'
      }
    },
    {
      title: '模板名称',
      dataIndex: 'name',
      align: 'center',
      width: 150,
      fieldProps: {
        placeholder: '请输入模板名称'
      }
    },
    {
      title: '模板标题',
      dataIndex: 'title',
      align: 'center',
      width: 150,
      hideInSearch: true
    },
    {
      title: '模板内容',
      dataIndex: 'content',
      align: 'center',
      width: 200,
      hideInSearch: true,
      render: (_, record) =>
        record.content ? (
          <Typography.Text ellipsis={{ tooltip: record.content }} style={{ width: 180 }}>
            {record.content.replace(/<[^>]+>/g, '')}
          </Typography.Text>
        ) : (
          '-'
        )
    },
    {
      title: '邮箱账号',
      dataIndex: 'accountId',
      align: 'center',
      width: 200,
      valueType: 'select',
      fieldProps: {
        placeholder: '请输入邮箱账号',
        options: accountOptions,
        showSearch: true
      },
      render: (_, record) => <span>{getAccountMail(record.accountId)}</span>
    },
    {
      title: '发送人名称',
      dataIndex: 'nickname',
      align: 'center',
      hideInSearch: true,
      width: 150
    },
    {
      title: '开启状态',
      dataIndex: 'status',
      align: 'center',
      width: 120,
      valueType: 'select',
      fieldProps: {
        placeholder: '请输入开启状态'
      },
      valueEnum: {
        0: { text: '开启', status: 'Success' },
        1: { text: '关闭', status: 'Error' }
      }
    },
    {
      title: textConst.columns.createTime,
      dataIndex: 'createTime',
      align: 'center',
      valueType: 'dateRange',
      width: 180,
      fieldProps: {
        placeholder: [textConst.columns.startDate, textConst.columns.endDate]
      },
      render: (_, record) => <span>{record.createTime as any}</span>
    },
    {
      title: textConst.form.operate,
      valueType: 'option',
      align: 'center',
      width: 180,
      key: 'option',
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a key="edit" onClick={() => handleEditMailTemplate(record)}>
            {textConst.action.update}
          </a>
          <a key="test" onClick={() => handleTestMailTemplate(record)}>
            {textConst.action.test}
          </a>
          <a
            key="delete"
            style={deleteTextStyle}
            onClick={() =>
              handleDelete(record, deleteMailTemplate, () => actionRef.current?.reload())
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
      <ProTable<API.SystemMailTemplateRespVO>
        columns={columns}
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        formRef={formRef}
        form={{ colon: false }}
        cardBordered
        request={async (params: Record<string, any>) => {
          const { current, pageSize, code, name, accountId, status, createTime, ...rest } = params

          let beginCreateTime, endCreateTime
          if (createTime && createTime.length === 2) {
            beginCreateTime = createTime[0] + ' 00:00:00'
            endCreateTime = createTime[1] + ' 23:59:59'
          }

          const resp = await getMailTemplatePage({
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...(code ? { code } : {}),
            ...(name ? { name } : {}),
            ...(accountId ? { accountId } : {}),
            ...(status !== undefined && status !== '' ? { status } : {}),
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
            onClick={() => handleCreateMailTemplate()}
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
                deleteMailTemplate,
                () => setSelectedRowKeys([]),
                () => actionRef.current?.reload()
              )
            }
          >
            {textConst.action.batchDelete}
          </Button>
        ]}
      />

      <SaveMailTemplateForm
        onSuccess={() => actionRef.current?.reload()}
        accountOptions={accountOptions}
      />
      <SendMailForm />
    </>
  )
}

export default MailTemplateConfig
