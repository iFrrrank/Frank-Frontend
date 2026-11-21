import React, { useRef, useState } from 'react'
import { Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormTextArea,
  ProTable
} from '@ant-design/pro-components'
import {
  createFollowUpRecord,
  deleteFollowUpRecord,
  getFollowUpRecordPage
} from '@/api/crm/followup'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'

// CRM 业务类型（与后端 CrmBizTypeEnum 对应）
export const CRM_BIZ_TYPE = {
  CLUE: 1,
  CUSTOMER: 2,
  CONTACT: 3,
  BUSINESS: 4,
  CONTRACT: 5,
  PRODUCT: 6,
  RECEIVABLE: 7,
  RECEIVABLE_PLAN: 8
}

// 跟进类型选项（字典 crm_follow_up_type）
export const FOLLOW_UP_TYPE_OPTIONS = [
  { label: '打电话', value: 1 },
  { label: '发邮件', value: 2 },
  { label: '发短信', value: 3 },
  { label: '微信沟通', value: 4 },
  { label: '上门拜访', value: 5 },
  { label: '其他', value: 6 }
]

export const followUpTypeText = (type?: number) =>
  FOLLOW_UP_TYPE_OPTIONS.find((o) => o.value === type)?.label || '-'

interface FollowUpPanelProps {
  bizType: number
  bizId: number
}

// 跟进记录面板：详情页共用，支持新增/删除跟进记录
const FollowUpPanel: React.FC<FollowUpPanelProps> = ({ bizType, bizId }) => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState(false)

  const columns: ProColumns<any>[] = [
    {
      title: '跟进类型',
      dataIndex: 'type',
      align: 'center',
      width: 110,
      render: (_, record) => followUpTypeText(record.type)
    },
    {
      title: '跟进内容',
      dataIndex: 'content',
      ellipsis: true
    },
    {
      title: '下次联系时间',
      dataIndex: 'nextTime',
      align: 'center',
      width: 170,
      render: (_, record) => <span>{record.nextTime || '-'}</span>
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      align: 'center',
      width: 110,
      render: (_, record) => <span>{record.creatorName || record.creator || '-'}</span>
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 170
    },
    {
      title: textConst.table.action,
      valueType: 'option',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a
            style={deleteTextStyle}
            onClick={() =>
              handleDelete(record, deleteFollowUpRecord, () => actionRef.current?.reload())
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
      <ProTable<any>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        search={false}
        options={false}
        request={async (params) => {
          const resp = await getFollowUpRecordPage({
            pageNo: params.current || 1,
            pageSize: params.pageSize || 10,
            bizType,
            bizId
          } as any)
          return {
            data: resp.data?.list || [],
            success: true,
            total: resp.data?.total || 0
          }
        }}
        toolBarRender={() => [
          <Button type="primary" key="create" onClick={() => setFormVisible(true)}>
            <PlusOutlined /> 写跟进
          </Button>
        ]}
        pagination={{ align: 'center', showSizeChanger: true }}
      />

      <ModalForm
        title="写跟进"
        open={formVisible}
        onOpenChange={setFormVisible}
        width={560}
        layout="horizontal"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        onFinish={async (values) => {
          try {
            await createFollowUpRecord({ bizType, bizId, ...values } as any)
            message.success(textConst.msg.createSuccess)
            actionRef.current?.reload()
            return true
          } catch {
            message.error(textConst.error.operationFail)
            return false
          }
        }}
      >
        <ProFormSelect
          name="type"
          label="跟进类型"
          rules={[{ required: true, message: '请选择跟进类型' }]}
          options={FOLLOW_UP_TYPE_OPTIONS}
          placeholder="请选择跟进类型"
        />
        <ProFormTextArea
          name="content"
          label="跟进内容"
          rules={[{ required: true, message: '请输入跟进内容' }]}
          placeholder="请输入跟进内容"
          fieldProps={{ rows: 4 }}
        />
        <ProFormDateTimePicker
          name="nextTime"
          label="下次联系时间"
          placeholder="请选择下次联系时间"
          fieldProps={{ style: { width: '100%' } }}
        />
      </ModalForm>
    </>
  )
}

export default FollowUpPanel
