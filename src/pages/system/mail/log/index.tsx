import React, { useEffect, useRef, useState } from 'react'
import { App, Badge, Button, Descriptions, Modal, Tag, Typography } from 'antd'
import {
  type ActionType,
  type ProColumns,
  type ProFormInstance,
  ProTable
} from '@ant-design/pro-components'
import { getSimpleMailAccountList } from '@/api/system/mailAccount'
import { textConst } from '@/locales/zh-CN'
import { getMailLog, getMailLogPage } from '@/api/system/mailLog'

const MailLog: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [detailData, setDetailData] = useState<API.SystemMailLogRespVO | null>(null)

  const { message } = App.useApp()

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

  const getAccountMail = (accountId: number) => {
    const act = accountOptions.find((a) => a.value === accountId)
    return act ? act.mailString : accountId
  }

  // 发送状态枚举
  const sendStatusEnum = {
    0: { text: '初始化', status: 'Default' },
    10: { text: '成功', status: 'Success' },
    20: { text: '失败', status: 'Error' },
    30: { text: '忽略', status: 'Warning' }
  }

  // 用户类型枚举
  const userTypeEnum = {
    1: { text: '管理员' },
    2: { text: '会员' }
  }

  // ===== 列定义 =====
  const columns: ProColumns<API.SystemMailLogRespVO>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      width: 80,
      hideInSearch: true
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      align: 'center',
      width: 180,
      valueType: 'dateRange',
      render: (_, record) => <span>{record.sendTime as any}</span>,
      fieldProps: {
        placeholder: ['开始时间', '结束时间']
      },
      order: 1
    },
    {
      title: '接收用户',
      dataIndex: 'userId', // 组合显示 userId 和 userType
      align: 'center',
      width: 150,
      render: (_, record) => (
        <span>
          {record.userId ? (
            <>
              {record.userId}
              <Tag style={{ marginLeft: 8 }}>
                {userTypeEnum[record.userType as unknown as keyof typeof userTypeEnum]?.text ||
                  record.userType}
              </Tag>
            </>
          ) : (
            '-'
          )}
        </span>
      ),
      hideInSearch: true
    },
    {
      title: '用户编号',
      dataIndex: 'userId',
      hideInTable: true,
      fieldProps: {
        placeholder: '请输入用户编号'
      },
      order: 3
    },
    {
      title: '用户类型',
      dataIndex: 'userType',
      hideInTable: true,
      valueType: 'select',
      valueEnum: userTypeEnum,
      fieldProps: {
        placeholder: '请输入用户类型'
      },
      order: 2
    },
    {
      title: '接收邮箱',
      dataIndex: 'toMail',
      align: 'center',
      width: 180,
      fieldProps: {
        placeholder: '请输入接收邮箱'
      },
      order: 7 // 对应图中顺序 第一排左
    },
    {
      title: '接收信息',
      dataIndex: 'toMail',
      hideInSearch: true,
      align: 'center',
      width: 200,
      render: (_, record) => <span>{record.toMail}</span>
    },
    {
      title: '邮件标题',
      dataIndex: 'templateTitle',
      align: 'center',
      width: 200,
      hideInSearch: true,
      ellipsis: true
    },
    {
      title: '模板编号',
      dataIndex: 'templateCode',
      hideInTable: true,
      fieldProps: {
        placeholder: '请输入模板编号'
      },
      order: 5 // 第一排右
    },
    {
      title: '发送状态',
      dataIndex: 'sendStatus',
      align: 'center',
      width: 120,
      valueType: 'select',
      valueEnum: sendStatusEnum,
      fieldProps: {
        placeholder: '请输入发送状态'
      },
      order: 4 // 第二排左
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
      render: (_, record) => <span>{getAccountMail(record.accountId)}</span>,
      order: 6 // 第一排中
    },
    {
      title: textConst.form.operate,
      valueType: 'option',
      align: 'center',
      width: 80,
      key: 'option',
      fixed: 'right',
      render: (_, record) => (
        <a key="view" onClick={() => handleView(record)}>
          {textConst.action.detail}
        </a>
      )
    }
  ]

  // ===== 查看详情 =====
  const handleView = async (record: API.SystemMailLogRespVO) => {
    try {
      const resp = await getMailLog({ id: record.id })
      if (resp.code === 0 && resp.data) {
        setDetailData(resp.data)
        setDetailModalVisible(true)
      }
    } catch {
      message.error('获取详情失败')
    }
  }

  return (
    <>
      <ProTable<API.SystemMailLogRespVO>
        headerTitle="邮件日志"
        columns={columns}
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        formRef={formRef}
        form={{ colon: false }}
        cardBordered
        request={async (params: Record<string, any>) => {
          const { current, pageSize, sendTime, ...rest } = params

          let beginSendTime, endSendTime
          if (sendTime && sendTime.length === 2) {
            beginSendTime = sendTime[0] + ' 00:00:00'
            endSendTime = sendTime[1] + ' 23:59:59'
          }

          const resp = await getMailLogPage({
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...(beginSendTime ? { beginSendTime } : {}),
            ...(endSendTime ? { endSendTime } : {}),
            ...rest
          } as any)

          return {
            data: resp.data?.list || [],
            success: true,
            total: resp.data?.total || 0
          }
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false,
          optionRender: (searchConfig, formProps, dom) => [...dom.reverse()]
        }}
        options={false}
        pagination={{
          align: 'center',
          showSizeChanger: true
        }}
      />

      <Modal
        title="详情"
        width={800}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {detailData && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="日志编号" span={1}>
              {detailData.id}
            </Descriptions.Item>
            <Descriptions.Item label="发送时间" span={1}>
              {detailData.sendTime}
            </Descriptions.Item>
            <Descriptions.Item label="用户编号" span={1}>
              {detailData.userId || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="用户类型" span={1}>
              {userTypeEnum[detailData.userType as unknown as keyof typeof userTypeEnum]?.text ||
                detailData.userType ||
                '-'}
            </Descriptions.Item>
            <Descriptions.Item label="接收邮箱" span={1}>
              {detailData.toMail}
            </Descriptions.Item>
            <Descriptions.Item label="邮箱账号" span={1}>
              {getAccountMail(detailData.accountId)}
            </Descriptions.Item>
            <Descriptions.Item label="发送邮箱" span={1}>
              {detailData.fromMail}
            </Descriptions.Item>
            <Descriptions.Item label="模板编号" span={1}>
              {detailData.templateCode}
            </Descriptions.Item>
            <Descriptions.Item label="模板发送人" span={1}>
              {detailData.templateNickname || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="邮件标题" span={1}>
              {detailData.templateTitle}
            </Descriptions.Item>
            <Descriptions.Item label="邮件参数" span={2}>
              {JSON.stringify(detailData.templateParams)}
            </Descriptions.Item>
            <Descriptions.Item label="邮件内容" span={2}>
              <div dangerouslySetInnerHTML={{ __html: detailData.templateContent }} />
            </Descriptions.Item>
            <Descriptions.Item label="发送状态" span={1}>
              <Badge
                status={
                  sendStatusEnum[detailData.sendStatus as unknown as keyof typeof sendStatusEnum]
                    ?.status as any
                }
                text={
                  sendStatusEnum[detailData.sendStatus as unknown as keyof typeof sendStatusEnum]
                    ?.text
                }
              />
            </Descriptions.Item>
            <Descriptions.Item label="消息 ID" span={1}>
              {detailData.sendMessageId || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="发送异常" span={2}>
              {detailData.sendException ? (
                <Typography.Text type="danger">{detailData.sendException}</Typography.Text>
              ) : (
                '-'
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  )
}

export default MailLog
