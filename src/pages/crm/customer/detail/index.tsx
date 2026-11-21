import React, { useEffect, useState } from 'react'
import { Button, Descriptions, Form, message, Modal, Select, Table, Tag } from 'antd'
import { useSearchParams } from '@umijs/max'
import { getCustomer } from '@/api/crm/customer'
import {
  createPermission,
  deletePermission,
  getPermissionList
} from '@/api/crm/dataPermission'
import { getSimpleUserList } from '@/api/system/user'
import DetailShell from '../../components/DetailShell'
import FollowUpPanel, { CRM_BIZ_TYPE } from '../../components/FollowUpPanel'
import OperateLogPanel from '../../components/OperateLogPanel'
import {
  RelatedBusinessTable,
  RelatedContactTable,
  RelatedContractTable,
  RelatedReceivablePlanTable,
  RelatedReceivableTable
} from '../../components/RelatedTables'
import { CUSTOMER_LEVEL, CUSTOMER_SOURCE, INDUSTRY_LIST } from '@/utils/constantsValue'
import { textConst } from '@/locales/zh-CN'

// 权限级别：1 负责人，2 只读，3 读写
const PERMISSION_LEVEL_OPTIONS = [
  { label: '负责人', value: 1 },
  { label: '只读', value: 2 },
  { label: '读写', value: 3 }
]

const dictText = (map: Record<string, any>, value: any) =>
  (map[value] as any)?.text || '-'

// 团队成员 Tab：客户的数据权限（负责人 + 协作人）
const TeamPanel: React.FC<{ customerId: number }> = ({ customerId }) => {
  const [members, setMembers] = useState<any[]>([])
  const [addVisible, setAddVisible] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [form] = Form.useForm()

  const load = async () => {
    const resp = await getPermissionList({ bizType: CRM_BIZ_TYPE.CUSTOMER, bizId: customerId } as any)
    if (resp.code === 0) {
      setMembers(resp.data || [])
    }
  }

  useEffect(() => {
    load()
    getSimpleUserList().then((resp) => {
      setUsers(
        (resp.data as any[])?.map((u: any) => ({ label: u.nickname, value: u.id })) || []
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId])

  const handleRemove = (record: any) => {
    Modal.confirm({
      title: '确认移除',
      content: `确定要移除成员「${record.userName || record.userId}」吗？`,
      okText: '移除',
      cancelText: '取消',
      onOk: async () => {
        const resp = await deletePermission({ ids: [record.id] } as any)
        if (resp.code === 0) {
          message.success('移除成功')
          load()
        }
      }
    })
  }

  return (
    <>
      <div style={{ marginBottom: 12, textAlign: 'right' }}>
        <Button type="primary" onClick={() => setAddVisible(true)}>
          添加成员
        </Button>
      </div>
      <Table
        rowKey="id"
        dataSource={members}
        pagination={false}
        columns={[
          {
            title: '成员',
            dataIndex: 'userName',
            render: (_, r: any) => r.userName || r.nickname || r.userId
          },
          {
            title: '权限级别',
            dataIndex: 'level',
            align: 'center',
            render: (_, r: any) =>
              PERMISSION_LEVEL_OPTIONS.find((o) => o.value === r.level)?.label || r.level
          },
          {
            title: '操作',
            align: 'center',
            width: 90,
            render: (_, r: any) =>
              r.level === 1 ? (
                <Tag color="blue">负责人</Tag>
              ) : (
                <a style={{ color: '#ff4d4f' }} onClick={() => handleRemove(r)}>
                  移除
                </a>
              )
          }
        ]}
      />
      <Modal
        title="添加成员"
        open={addVisible}
        onCancel={() => setAddVisible(false)}
        onOk={async () => {
          const values = await form.validateFields()
          const resp = await createPermission({
            bizType: CRM_BIZ_TYPE.CUSTOMER,
            bizId: customerId,
            userId: values.userId,
            level: values.level
          } as any)
          if (resp.code === 0) {
            message.success(textConst.msg.createSuccess)
            setAddVisible(false)
            form.resetFields()
            load()
          } else {
            message.error(resp.msg || textConst.error.operationFail)
          }
        }}
      >
        <Form form={form} layout="horizontal" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
          <Form.Item name="userId" label="成员" rules={[{ required: true, message: '请选择成员' }]}>
            <Select options={users} placeholder="请选择成员" showSearch optionFilterProp="label" />
          </Form.Item>
          <Form.Item
            name="level"
            label="权限级别"
            rules={[{ required: true, message: '请选择权限级别' }]}
            initialValue={3}
          >
            <Select
              options={PERMISSION_LEVEL_OPTIONS.filter((o) => o.value !== 1)}
              placeholder="请选择权限级别"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

// 客户详情：基本信息、跟进记录、关联业务数据、团队成员与操作日志
const CustomerDetail: React.FC = () => {
  const [searchParams] = useSearchParams()
  const id = Number(searchParams.get('id'))
  const [loading, setLoading] = useState(true)
  const [customer, setCustomer] = useState<any>()

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setLoading(false)
        return
      }
      const resp = await getCustomer({ id } as any)
      if (resp.code === 0) {
        setCustomer(resp.data)
      }
      setLoading(false)
    }
    load()
  }, [id])

  const info = (
    <Descriptions column={2} bordered size="small">
      <Descriptions.Item label="客户名称">{customer?.name || '-'}</Descriptions.Item>
      <Descriptions.Item label="负责人">{customer?.ownerUserName || '-'}</Descriptions.Item>
      <Descriptions.Item label="客户等级">
        {dictText(CUSTOMER_LEVEL as any, customer?.level)}
      </Descriptions.Item>
      <Descriptions.Item label="客户来源">
        {dictText(CUSTOMER_SOURCE as any, customer?.source)}
      </Descriptions.Item>
      <Descriptions.Item label="所属行业">
        {dictText(INDUSTRY_LIST as any, customer?.industryId)}
      </Descriptions.Item>
      <Descriptions.Item label="成交状态">
        {customer?.dealStatus ? <Tag color="green">已成交</Tag> : <Tag>未成交</Tag>}
      </Descriptions.Item>
      <Descriptions.Item label="锁定状态">
        {customer?.lockStatus ? <Tag color="red">已锁定</Tag> : '未锁定'}
      </Descriptions.Item>
      <Descriptions.Item label="跟进状态">
        {customer?.followUpStatus ? '已跟进' : '待跟进'}
      </Descriptions.Item>
      <Descriptions.Item label="手机">{customer?.mobile || '-'}</Descriptions.Item>
      <Descriptions.Item label="电话">{customer?.telephone || '-'}</Descriptions.Item>
      <Descriptions.Item label="QQ">{customer?.qq || '-'}</Descriptions.Item>
      <Descriptions.Item label="微信">{customer?.wechat || '-'}</Descriptions.Item>
      <Descriptions.Item label="邮箱" span={2}>
        {customer?.email || '-'}
      </Descriptions.Item>
      <Descriptions.Item label="所在地区">{customer?.areaName || '-'}</Descriptions.Item>
      <Descriptions.Item label="详细地址">{customer?.detailAddress || '-'}</Descriptions.Item>
      <Descriptions.Item label="最后跟进时间">
        {customer?.contactLastTime || '-'}
      </Descriptions.Item>
      <Descriptions.Item label="下次联系时间">
        {customer?.contactNextTime || '-'}
      </Descriptions.Item>
      <Descriptions.Item label="备注" span={2}>
        {customer?.remark || '-'}
      </Descriptions.Item>
      <Descriptions.Item label="创建时间">{customer?.createTime || '-'}</Descriptions.Item>
    </Descriptions>
  )

  return (
    <DetailShell
      title={customer?.name || '客户详情'}
      loading={loading}
      tabItems={[
        { key: 'info', label: '详细信息', children: info },
        {
          key: 'followup',
          label: '跟进记录',
          children: <FollowUpPanel bizType={CRM_BIZ_TYPE.CUSTOMER} bizId={id} />
        },
        {
          key: 'contact',
          label: '联系人',
          children: <RelatedContactTable customerId={id} />
        },
        {
          key: 'business',
          label: '商机',
          children: <RelatedBusinessTable customerId={id} />
        },
        {
          key: 'contract',
          label: '合同',
          children: <RelatedContractTable customerId={id} />
        },
        {
          key: 'plan',
          label: '回款计划',
          children: <RelatedReceivablePlanTable customerId={id} />
        },
        {
          key: 'receivable',
          label: '回款',
          children: <RelatedReceivableTable customerId={id} />
        },
        { key: 'team', label: '团队成员', children: <TeamPanel customerId={id} /> },
        { key: 'log', label: '操作日志', children: <OperateLogPanel bizId={id} /> }
      ]}
    />
  )
}

export default CustomerDetail
