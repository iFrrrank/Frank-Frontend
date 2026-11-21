import React, { useRef, useState } from 'react'
import { Badge, Button, Descriptions, Drawer, message, Tag, Typography } from 'antd'
import { CheckOutlined, CheckCircleOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import {
  getMyMyNotifyMessagePage,
  getNotifyMessage,
  updateAllNotifyMessageRead,
  updateNotifyMessageRead
} from '@/api/system/notifyMessage'
import { textConst } from '@/locales/zh-CN'
import { tableActionStyle } from '@/styles/common.style'

// 我的站内信：只查当前登录人的消息（my-page 接口），查看详情时自动标记已读
const MyNotifyMessage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false)
  const [detailData, setDetailData] = useState<API.SystemNotifyMessageRespVO | null>(null)

  // 模版类型枚举（与站内信管理页保持一致）
  const templateTypeEnum: Record<number, { text: string; color: string }> = {
    1: { text: '系统消息', color: 'green' },
    2: { text: '业务消息', color: 'orange' },
    3: { text: '会议消息', color: 'purple' }
  }

  // ===== 查看详情：未读消息打开详情时，自动标记为已读（与 yudao 行为一致） =====
  const handleView = async (record: API.SystemNotifyMessageRespVO) => {
    try {
      const resp = await getNotifyMessage({ id: record.id })
      if (resp.code === 0 && resp.data) {
        setDetailData(resp.data)
        setDetailsDrawerVisible(true)
      }
    } catch {
      setDetailData(record)
      setDetailsDrawerVisible(true)
    }
    if (!record.readStatus) {
      try {
        await updateNotifyMessageRead({ ids: [record.id] } as any)
        actionRef.current?.reload()
      } catch {
        // 标记已读失败不影响详情查看
      }
    }
  }

  // ===== 批量标记已读 =====
  const handleBatchRead = async () => {
    if (selectedRowKeys.length === 0) {
      return
    }
    try {
      const resp = await updateNotifyMessageRead({ ids: selectedRowKeys as number[] } as any)
      if (resp.code === 0) {
        message.success('标记已读成功')
        setSelectedRowKeys([])
        actionRef.current?.reload()
      } else {
        message.error(resp.msg || '标记已读失败')
      }
    } catch {
      message.error('标记已读失败')
    }
  }

  // ===== 一键已读（全部） =====
  const handleAllRead = async () => {
    try {
      const resp = await updateAllNotifyMessageRead()
      if (resp.code === 0) {
        message.success('全部标记已读成功')
        setSelectedRowKeys([])
        actionRef.current?.reload()
      } else {
        message.error(resp.msg || '标记已读失败')
      }
    } catch {
      message.error('标记已读失败')
    }
  }

  // ===== 列定义 =====
  const columns: ProColumns<API.SystemNotifyMessageRespVO>[] = [
    {
      title: '发送人',
      dataIndex: 'templateNickname',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '发送时间',
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
      title: '类型',
      dataIndex: 'templateType',
      align: 'center',
      width: 120,
      valueType: 'select',
      fieldProps: {
        placeholder: '请选择类型'
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
      title: '发送内容',
      dataIndex: 'templateContent',
      align: 'center',
      width: 300,
      hideInSearch: true,
      render: (_, record) =>
        record.templateContent ? (
          <Typography.Text
            style={{ width: 280, margin: 0 }}
            ellipsis={{ tooltip: record.templateContent }}
          >
            {record.templateContent}
          </Typography.Text>
        ) : (
          <span>-</span>
        )
    },
    {
      title: '是否已读',
      dataIndex: 'readStatus',
      align: 'center',
      width: 100,
      valueType: 'select',
      fieldProps: {
        placeholder: '请选择是否已读'
      },
      valueEnum: {
        true: { text: '已读' },
        false: { text: '未读' }
      },
      render: (_, record) => (
        <Badge
          status={record.readStatus ? 'success' : 'error'}
          text={record.readStatus ? '是' : '否'}
        />
      ),
      order: 2
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
      title: textConst.form.operate,
      valueType: 'option',
      align: 'center',
      width: 80,
      key: 'option',
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a key="view" onClick={() => handleView(record)}>
            {textConst.action.detail}
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<API.SystemNotifyMessageRespVO>
        headerTitle="我的站内信"
        columns={columns}
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        formRef={formRef}
        form={{ colon: false }}
        cardBordered
        request={async (params: Record<string, any>) => {
          const { current, pageSize, templateType, readStatus, createTime, ...rest } = params
          let beginTime, endTime
          if (createTime && createTime.length === 2) {
            beginTime = createTime[0] + ' 00:00:00'
            endTime = createTime[1] + ' 23:59:59'
          }
          const resp = await getMyMyNotifyMessagePage({
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...(templateType !== undefined && templateType !== ''
              ? { templateType: Number(templateType) }
              : {}),
            ...(readStatus !== undefined && readStatus !== ''
              ? { readStatus: readStatus === 'true' || readStatus === true }
              : {}),
            ...(beginTime ? { beginTime } : {}),
            ...(endTime ? { endTime } : {}),
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
          onChange: (keys: React.Key[]) => setSelectedRowKeys(keys)
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          span: 6,
          defaultCollapsed: false
        }}
        options={false}
        pagination={{
          align: 'center',
          showSizeChanger: true
        }}
        toolBarRender={() => [
          <Button
            key="batchRead"
            icon={<CheckOutlined />}
            disabled={selectedRowKeys.length === 0}
            onClick={handleBatchRead}
          >
            标记已读
          </Button>,
          <Button key="allRead" type="primary" icon={<CheckCircleOutlined />} onClick={handleAllRead}>
            一键已读
          </Button>
        ]}
      />

      {/* 详情抽屉 */}
      <Drawer
        title="消息详情"
        placement="right"
        onClose={() => {
          setDetailsDrawerVisible(false)
          setDetailData(null)
        }}
        open={detailsDrawerVisible}
        width={400}
      >
        {detailData && (
          <Descriptions
            column={1}
            colon={false}
            labelStyle={{
              width: '80px',
              display: 'flex',
              justifyContent: 'flex-end',
              fontWeight: 'bold',
              color: 'black'
            }}
            contentStyle={{ paddingLeft: '15px' }}
          >
            <Descriptions.Item label="发送人">{detailData.templateNickname}</Descriptions.Item>
            <Descriptions.Item label="发送时间">{detailData.createTime as any}</Descriptions.Item>
            <Descriptions.Item label="类型">
              {(() => {
                const t = templateTypeEnum[detailData.templateType]
                return t ? <Tag color={t.color}>{t.text}</Tag> : detailData.templateType
              })()}
            </Descriptions.Item>
            <Descriptions.Item label="发送内容">{detailData.templateContent}</Descriptions.Item>
            <Descriptions.Item label="是否已读">
              <Badge
                status={detailData.readStatus ? 'success' : 'error'}
                text={detailData.readStatus ? '是' : '否'}
              />
            </Descriptions.Item>
            <Descriptions.Item label="阅读时间">{detailData.readTime || '-'}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </>
  )
}

export default MyNotifyMessage
