import React, { useRef, useState } from 'react'
import { Button, Modal, Switch, Tag, message } from 'antd'
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { getRecruitChannelPage, updateRecruitChannelStatus } from '@/api/hrm/recruit/channel'
import { CommonStatusEnum } from '@/utils/constants'
import { COMMON_STATUS } from '@/utils/constantsValue'
import { textConst } from '@/locales/zh-CN'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { formatDateTime } from '../format'
import ChannelForm from './ChannelForm'
import ChannelDeleteForm from './ChannelDeleteForm'

const RecruitChannelPage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false)
  const [deleteChannel, setDeleteChannel] = useState<API.HrmRecruitChannelRespVO | undefined>(
    undefined
  )

  const reload = () => actionRef.current?.reload()

  // 启用 / 停用渠道前二次确认，取消则不发起请求，列表保持原状态
  const handleStatusChange = (record: API.HrmRecruitChannelRespVO, checked: boolean) => {
    const status = checked ? CommonStatusEnum.ENABLE.status : CommonStatusEnum.DISABLE.status
    const text = checked ? '启用' : '停用'
    Modal.confirm({
      title: textConst.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: `确认要${text}招聘渠道"${record.name}"吗？`,
      okText: textConst.common.ok,
      cancelText: textConst.common.cancel,
      onOk: async () => {
        try {
          await updateRecruitChannelStatus({ id: record.id, status })
          message.success(textConst.msg.updateSuccess)
          reload()
        } catch {
          message.error(textConst.msg.updateError)
        }
      }
    })
  }

  const columns: ProColumns<API.HrmRecruitChannelRespVO>[] = [
    {
      title: '渠道编号',
      dataIndex: 'id',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '渠道名称',
      dataIndex: 'name',
      align: 'center',
      minWidth: 160,
      fieldProps: { placeholder: '请输入渠道名称' }
    },
    {
      title: '系统内置',
      dataIndex: 'systemFlag',
      align: 'center',
      width: 100,
      hideInSearch: true,
      render: (_, record) => (
        <Tag color={record.systemFlag ? 'success' : 'default'}>
          {record.systemFlag ? '是' : '否'}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      valueType: 'select',
      valueEnum: COMMON_STATUS,
      fieldProps: { placeholder: '请选择状态' },
      render: (_, record) => (
        <Switch
          checked={record.status === CommonStatusEnum.ENABLE.status}
          onChange={(checked) => handleStatusChange(record, checked)}
        />
      )
    },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      width: 90,
      hideInSearch: true
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      width: 180,
      ellipsis: true,
      hideInSearch: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 180,
      hideInSearch: true,
      render: (_, record) => formatDateTime(record.createTime)
    },
    {
      title: textConst.table.action,
      valueType: 'option',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a
            key="edit"
            onClick={() => {
              setCurrentId(record.id)
              setFormVisible(true)
            }}
          >
            编辑
          </a>
          {/* 系统内置渠道不允许删除 */}
          {!record.systemFlag && (
            <a
              key="delete"
              style={deleteTextStyle}
              onClick={() => {
                setDeleteChannel(record)
                setDeleteVisible(true)
              }}
            >
              {textConst.action.delete}
            </a>
          )}
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<API.HrmRecruitChannelRespVO>
        headerTitle="招聘渠道"
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        cardBordered
        form={{ colon: false }}
        search={{ labelWidth: 'auto', defaultCollapsed: false }}
        options={false}
        scroll={{ x: 'max-content' }}
        pagination={{ align: 'center', showSizeChanger: true }}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentId(undefined)
              setFormVisible(true)
            }}
          >
            新增
          </Button>
        ]}
        request={async (params) => {
          const { current, pageSize, name, status } = params
          try {
            const resp = await getRecruitChannelPage({
              pageReqVO: {
                pageNo: current || 1,
                pageSize: pageSize || 10,
                ...(name ? { name } : {}),
                ...(status !== undefined && status !== '' ? { status: Number(status) } : {})
              }
            } as API.getRecruitChannelPageParams)
            return {
              data: resp.data?.list || [],
              success: resp.code === 0,
              total: resp.data?.total || 0
            }
          } catch {
            return { data: [], success: false, total: 0 }
          }
        }}
      />

      <ChannelForm
        visible={formVisible}
        setVisible={setFormVisible}
        id={currentId}
        onSuccess={() => {
          setFormVisible(false)
          reload()
        }}
      />

      <ChannelDeleteForm
        visible={deleteVisible}
        setVisible={setDeleteVisible}
        channel={deleteChannel}
        onSuccess={() => {
          setDeleteVisible(false)
          reload()
        }}
      />
    </>
  )
}

export default RecruitChannelPage
