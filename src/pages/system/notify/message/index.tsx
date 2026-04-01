import React, { useRef, useState } from 'react'
import { Badge, Button, Descriptions, Modal, Tag, Typography } from 'antd'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { getNotifyMessage, getNotifyMessagePage } from '@/api/system/notifyMessage'
import { textConst } from '@/locales/zh-CN'

const NotifyMessage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [detailData, setDetailData] = useState<API.SystemNotifyMessageRespVO | null>(null)

  // 用户类型枚举
  const userTypeEnum: Record<number, { text: string; color: string }> = {
    1: { text: '管理员', color: 'blue' },
    2: { text: '会员', color: 'cyan' }
  }

  // 模版类型枚举
  const templateTypeEnum: Record<number, { text: string; color: string }> = {
    1: { text: '系统消息', color: 'green' },
    2: { text: '业务消息', color: 'orange' },
    3: { text: '会议消息', color: 'purple' }
  }

  // ===== 列定义 =====
  const columns: ProColumns<API.SystemNotifyMessageRespVO>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      width: 70,
      hideInSearch: true
    },
    {
      title: '用户类型',
      dataIndex: 'userType',
      align: 'center',
      width: 100,
      valueType: 'select',
      fieldProps: {
        placeholder: '请输入用户类型'
      },
      valueEnum: {
        1: { text: '管理员' },
        2: { text: '会员' }
      },
      render: (_, record) => {
        const conf = userTypeEnum[record.userType as unknown as number]
        return conf ? <Tag color={conf.color}>{conf.text}</Tag> : <span>{record.userType}</span>
      },
      order: 3
    },
    {
      title: '用户 ID',
      dataIndex: 'userId',
      align: 'center',
      width: 100,
      fieldProps: {
        placeholder: '请输入用户 ID'
      },
      order: 4
    },
    {
      title: '模板编码',
      dataIndex: 'templateCode',
      align: 'center',
      width: 180,
      fieldProps: {
        placeholder: '请输入模板编码'
      },
      order: 2
    },
    {
      title: '发送人名称',
      dataIndex: 'templateNickname',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '模版内容',
      dataIndex: 'templateContent',
      align: 'center',
      width: 250,
      hideInSearch: true,
      render: (_, record) =>
        record.templateContent ? (
          <Typography.Text
            style={{ width: 220, margin: 0 }}
            ellipsis={{ tooltip: record.templateContent }}
          >
            {record.templateContent}
          </Typography.Text>
        ) : (
          <span>-</span>
        )
    },
    {
      title: '模版参数',
      dataIndex: 'templateParams',
      align: 'center',
      width: 120,
      hideInSearch: true,
      render: (_, record) =>
        record.templateParams && Object.keys(record.templateParams).length > 0 ? (
          <Typography.Text
            style={{ width: 100, margin: 0 }}
            ellipsis={{ tooltip: JSON.stringify(record.templateParams) }}
          >
            {JSON.stringify(record.templateParams)}
          </Typography.Text>
        ) : (
          <span>-</span>
        )
    },
    {
      title: '模版类型',
      dataIndex: 'templateType',
      align: 'center',
      width: 120,
      valueType: 'select',
      fieldProps: {
        placeholder: '请输入模版类型'
      },
      valueEnum: {
        1: { text: '系统消息' },
        2: { text: '业务消息' },
        3: { text: '会议消息' }
      },
      render: (_, record) => {
        const conf = templateTypeEnum[record.templateType]
        return conf ? <Tag color={conf.color}>{conf.text}</Tag> : <span>{record.templateType}</span>
      },
      order: 1
    },
    {
      title: '是否已读',
      dataIndex: 'readStatus',
      align: 'center',
      width: 90,
      hideInSearch: true,
      render: (_, record) => (
        <Badge
          status={record.readStatus ? 'success' : 'error'}
          text={record.readStatus ? '是' : '否'}
        />
      )
    },
    {
      title: '阅读时间',
      dataIndex: 'readTime',
      align: 'center',
      width: 180,
      hideInSearch: true,
      render: (_, record) => <span>{record.readTime || '-'}</span>
    },
    {
      title: textConst.columns.createTime,
      dataIndex: 'createTime',
      align: 'center',
      width: 180,
      valueType: 'dateRange',
      render: (_, record) => <span>{record.createTime as any}</span>,
      fieldProps: {
        placeholder: [textConst.columns.startDate, textConst.columns.endDate]
      },
      order: 0
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
  const handleView = async (record: API.SystemNotifyMessageRespVO) => {
    try {
      const resp = await getNotifyMessage({ id: record.id })
      if (resp.code === 0 && resp.data) {
        setDetailData(resp.data)
        setDetailModalVisible(true)
      }
    } catch {
      setDetailData(record)
      setDetailModalVisible(true)
    }
  }

  return (
    <>
      <ProTable<API.SystemNotifyMessageRespVO>
        headerTitle="站内信消息"
        columns={columns}
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        formRef={formRef}
        form={{ colon: false }}
        cardBordered
        request={async (params: Record<string, any>) => {
          const {
            current,
            pageSize,
            userId,
            userType,
            templateCode,
            templateType,
            createTime,
            ...rest
          } = params

          let beginCreateTime, endCreateTime
          if (createTime && createTime.length === 2) {
            beginCreateTime = createTime[0] + ' 00:00:00'
            endCreateTime = createTime[1] + ' 23:59:59'
          }

          const resp = await getNotifyMessagePage({
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...(userId ? { userId: Number(userId) } : {}),
            ...(userType !== undefined && userType !== '' ? { userType: Number(userType) } : {}),
            ...(templateCode ? { templateCode } : {}),
            ...(templateType !== undefined && templateType !== ''
              ? { templateType: Number(templateType) }
              : {}),
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

      {/* 详情弹窗 */}
      <Modal
        title="详情"
        width={700}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {detailData && (
          <Descriptions
            bordered
            column={1}
            size="small"
            labelStyle={{ width: 120, background: '#fafafa' }}
          >
            <Descriptions.Item label="ID">{detailData.id}</Descriptions.Item>
            <Descriptions.Item label="用户类型">
              {(() => {
                const t = userTypeEnum[detailData.userType as unknown as number]
                return t ? <Tag color={t.color}>{t.text}</Tag> : detailData.userType
              })()}
            </Descriptions.Item>
            <Descriptions.Item label="用户 ID">{detailData.userId}</Descriptions.Item>
            <Descriptions.Item label="模版 ID">{detailData.templateId}</Descriptions.Item>
            <Descriptions.Item label="模板编码">{detailData.templateCode}</Descriptions.Item>
            <Descriptions.Item label="发送人名称">{detailData.templateNickname}</Descriptions.Item>
            <Descriptions.Item label="模版内容">{detailData.templateContent}</Descriptions.Item>
            <Descriptions.Item label="模版参数">
              {detailData.templateParams && Object.keys(detailData.templateParams).length > 0
                ? JSON.stringify(detailData.templateParams)
                : ''}
            </Descriptions.Item>
            <Descriptions.Item label="模版类型">
              {(() => {
                const t = templateTypeEnum[detailData.templateType]
                return t ? <Tag color={t.color}>{t.text}</Tag> : detailData.templateType
              })()}
            </Descriptions.Item>
            <Descriptions.Item label="是否已读">
              <Badge
                status={detailData.readStatus ? 'success' : 'error'}
                text={detailData.readStatus ? '是' : '否'}
              />
            </Descriptions.Item>
            <Descriptions.Item label="阅读时间">{detailData.readTime || ''}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{detailData.createTime as any}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  )
}

export default NotifyMessage
