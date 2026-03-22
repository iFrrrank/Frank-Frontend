import React, { useEffect, useRef, useState } from 'react'
import { Badge, Button, message, Modal, Space, Typography } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ModalForm, ProFormText, ProFormSelect, ProFormRadio, ProTable, ProFormTextArea, ProForm } from '@ant-design/pro-components'
import {
  createMailTemplate,
  deleteMailTemplate,
  getMailTemplatePage,
  updateMailTemplate,
  sendMail
} from '@/api/system/mailTemplate'
import { getSimpleMailAccountList } from '@/api/system/mailAccount'

// WangEditor imports
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'

// 富文本修改器组件
const RichEditor = ({ value, onChange, readonly = false, height = 'auto' }: { value?: string; onChange?: (val: string) => void; readonly?: boolean; height?: string | number }) => {
  const [editor, setEditor] = useState<IDomEditor | null>(null)

  const toolbarConfig: Partial<IToolbarConfig> = {}
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
    readOnly: readonly,
  }

  // 及时销毁 editor
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  return (
    <div style={{ border: '1px solid #e8e8e8', zIndex: 100 }}>
      {!readonly && (
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #e8e8e8' }}
        />
      )}
      <Editor
        defaultConfig={editorConfig}
        value={value}
        onCreated={setEditor}
        onChange={(editor: IDomEditor) => onChange && onChange(editor.getHtml())}
        mode="default"
        style={{ height, minHeight: '120px', overflowY: 'hidden' }}
      />
    </div>
  )
}

const MailTemplateConfig: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  // 模态框状态
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editingMailTemplate, setEditingMailTemplate] = useState<API.SystemMailTemplateRespVO | null>(null)

  const [testModalVisible, setTestModalVisible] = useState(false)
  const [testingTemplate, setTestingTemplate] = useState<API.SystemMailTemplateRespVO | null>(null)

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // ===== 获取邮箱账号下拉列表 =====
  const [accountOptions, setAccountOptions] = useState<{ label: string; value: number; mailString?: string }[]>([])
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
      render: (_, record) => (
        record.content ? (
          <Typography.Text ellipsis={{ tooltip: record.content }} style={{ width: 180 }}>
            {record.content.replace(/<[^>]+>/g, '')}
          </Typography.Text>
        ) : '-'
      )
    },
    {
      title: '邮箱账号',
      dataIndex: 'accountId',
      align: 'center',
      width: 200,
      valueType: 'select',
      fieldProps: {
        placeholder: '请选择邮箱账号',
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
        placeholder: '请选择开启状态'
      },
      valueEnum: {
        0: { text: '开启', status: 'Processing' }, // ProTable success uses processing blue badge/tag
        1: { text: '关闭', status: 'Default' }
      },
      render: (_, record) => (
        <Badge
          status={record.status === 0 ? 'processing' : 'default'}
          text={record.status === 0 ? '开启' : '关闭'}
        />
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      valueType: 'dateRange',
      width: 180,
      fieldProps: {
        placeholder: ['开始日期', '结束日期']
      },
      render: (_, record) => <span>{record.createTime as any}</span>
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 180,
      key: 'option',
      fixed: 'right',
      render: (_, record) => (
        <Space size={12}>
          <a key="edit" onClick={() => handleEdit(record)}>
            修改
          </a>
          <a key="test" onClick={() => handleTest(record)}>
            测试
          </a>
          <a key="delete" onClick={() => handleDelete(record)} style={{ color: '#ff4d4f' }}>
            删除
          </a>
        </Space>
      )
    }
  ]

  // ===== 修改操作 =====
  const handleEdit = (record: API.SystemMailTemplateRespVO) => {
    setEditingMailTemplate(record)
    setCreateModalVisible(true)
  }

  // ===== 测试操作 =====
  const handleTest = (record: API.SystemMailTemplateRespVO) => {
    setTestingTemplate(record)
    setTestModalVisible(true)
  }

  // ===== 单个删除 =====
  const handleDelete = (record: API.SystemMailTemplateRespVO) => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: `是否确认删除编号为"${record.id}"的邮件模板数据项?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteMailTemplate({ id: record.id! })
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
      content: `是否确认删除选中的 ${selectedRowKeys.length} 个邮件模板数据项?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          // 当前接口似乎仅支持单删，使用 Promise.all 并行调用
          await Promise.all(selectedRowKeys.map((id) => deleteMailTemplate({ id: Number(id) })))
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
            onClick={() => {
              setEditingMailTemplate(null)
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

      <ModalForm<API.SystemMailTemplateSaveReqVO>
        title={editingMailTemplate ? '修改' : '新增'}
        width={800}
        open={createModalVisible}
        onOpenChange={(visible) => {
          setCreateModalVisible(visible)
          if (!visible) {
            setEditingMailTemplate(null)
          }
        }}
        initialValues={
          editingMailTemplate
            ? { ...editingMailTemplate }
            : {
              status: 0 // 默认开启
            }
        }
        layout="horizontal"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        colon={false}
        modalProps={{
          destroyOnClose: true,
          maskClosable: false
        }}
        onFinish={async (values) => {
          try {
            let resp
            if (editingMailTemplate) {
              resp = await updateMailTemplate({ ...values, id: editingMailTemplate.id })
            } else {
              resp = await createMailTemplate(values)
            }

            if (resp.code === 0) {
              message.success(editingMailTemplate ? '修改成功' : '新增成功')
              actionRef.current?.reload()
              return true
            } else {
              message.error(resp.msg || (editingMailTemplate ? '修改失败' : '新增失败'))
              return false
            }
          } catch {
            message.error(editingMailTemplate ? '修改失败' : '新增失败')
            return false
          }
        }}
      >
        <ProFormSelect
          name="accountId"
          label="邮箱账号"
          placeholder="请选择邮箱账号"
          rules={[{ required: true, message: '请选择邮箱账号' }]}
          options={accountOptions}
          showSearch
        />
        <ProFormText
          name="code"
          label="模板编码"
          placeholder="请输入模板编码"
          rules={[{ required: true, message: '请输入模板编码' }]}
        />
        <ProFormText
          name="name"
          label="模板名称"
          placeholder="请输入模板名称"
          rules={[{ required: true, message: '请输入模板名称' }]}
        />
        <ProFormText
          name="nickname"
          label="发送人名称"
          placeholder="请输入发送人名称"
        />
        <ProFormText
          name="title"
          label="模板标题"
          placeholder="请输入模板标题"
          rules={[{ required: true, message: '请输入模板标题' }]}
        />
        <ProForm.Item
          name="content"
          label="模板内容"
          rules={[{ required: true, message: '请输入模板内容' }]}
          wrapperCol={{ span: 20 }}
        >
          <RichEditor />
        </ProForm.Item>
        <ProFormRadio.Group
          name="status"
          label="开启状态"
          rules={[{ required: true, message: '请选择开启状态' }]}
          options={[
            { label: '开启', value: 0 },
            { label: '关闭', value: 1 }
          ]}
        />
        <ProFormTextArea
          name="remark"
          label="备注"
          placeholder="请输入备注"
        />
      </ModalForm>

      {/* 测试模板的弹窗*/}
      <ModalForm<{ mail: string; ccMail?: string; bccMail?: string }>
        title="测试"
        width={800}
        open={testModalVisible}
        onOpenChange={(visible) => {
          setTestModalVisible(visible)
          if (!visible) {
            setTestingTemplate(null)
          }
        }}
        initialValues={{}}
        layout="horizontal"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        colon={false}
        modalProps={{
          destroyOnClose: true,
          maskClosable: false
        }}
        onFinish={async (values) => {
          if (!testingTemplate) return false
          try {
            // 目前 API 只发送 mail 字段，可以根据需要扩充
            const reqVO: API.SystemMailTemplateSendReqVO = {
              mail: values.mail,
              templateCode: testingTemplate.code,
              templateParams: {} // 可以根据需要让用户填参，此图里并没有参数表单，只填入基础占位
            }
            const resp = await sendMail(reqVO)

            if (resp.code === 0) {
              message.success('测试邮件发送成功')
              return true
            } else {
              message.error(resp.msg || '测试邮件发送失败')
              return false
            }
          } catch {
            message.error('测试邮件发送失败')
            return false
          }
        }}
      >
        <ProForm.Item label="模板内容" wrapperCol={{ span: 20 }}>
          <RichEditor value={testingTemplate?.content} readonly={true} />
        </ProForm.Item>
        <ProFormTextArea
          name="mail"
          label="收件邮箱"
          placeholder="请输入收件邮箱，多个邮箱用回车分隔"
          rules={[{ required: true, message: '请输入收件邮箱' }]}
          fieldProps={{ rows: 2 }}
        />
        <ProFormTextArea
          name="ccMail"
          label="抄送邮箱"
          placeholder="请输入抄送邮箱，多个邮箱用回车分隔"
          fieldProps={{ rows: 2 }}
        />
        <ProFormTextArea
          name="bccMail"
          label="密送邮箱"
          placeholder="请输入密送邮箱，多个邮箱用回车分隔"
          fieldProps={{ rows: 2 }}
        />
      </ModalForm>
    </>
  )
}

export default MailTemplateConfig
