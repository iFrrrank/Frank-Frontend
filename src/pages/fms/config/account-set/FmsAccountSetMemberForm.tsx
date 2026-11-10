import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Form, Modal, Select, Table, Tag, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import {
  fmsAccountUserGetAccountUserList,
  fmsAccountUserUpdateAccountUserList
} from '@/api/fms/config/accountUser'
import { getSimpleUserList } from '@/api/system/user'
import { deleteTextStyle } from '@/styles/common.style'
import { CommonStatusEnum } from '@/utils/constants'
import { FMS_ACCOUNT_USER_LEVEL, FMS_ACCOUNT_USER_LEVEL_OPTIONS } from '../../utils/constants'

interface FmsAccountSetMemberFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  accountSet?: API.FmsAccountSetRespVO
  onSuccess: () => void
}

/**
 * 账套授权弹窗（批量维护账套成员及权限级别）
 */
const FmsAccountSetMemberForm: React.FC<FmsAccountSetMemberFormProps> = ({
  visible,
  setVisible,
  accountSet,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false)
  const [memberList, setMemberList] = useState<API.FmsAccountUserRespVO[]>([])
  const [allUsers, setAllUsers] = useState<API.UserSimpleBaseVO[]>([])
  const [addVisible, setAddVisible] = useState(false)
  const [addForm] = Form.useForm()

  const loadMembers = useCallback(async () => {
    if (!accountSet?.id) return
    setLoading(true)
    try {
      const resp = await fmsAccountUserGetAccountUserList({ accountSetId: accountSet.id })
      if (resp.code === 0) {
        setMemberList(resp.data || [])
      }
    } finally {
      setLoading(false)
    }
  }, [accountSet?.id])

  useEffect(() => {
    if (!visible || !accountSet?.id) return
    loadMembers()
    getSimpleUserList().then((resp) => {
      if (resp.code === 0) {
        setAllUsers(resp.data || [])
      }
    })
  }, [visible, accountSet?.id, loadMembers])

  const memberUserIds = useMemo(() => memberList.map((m) => m.userId), [memberList])

  /** 保存账套成员及其权限级别 */
  const handleSave = async () => {
    if (!accountSet?.id) return
    setLoading(true)
    try {
      const resp = await fmsAccountUserUpdateAccountUserList({
        accountSetId: accountSet.id,
        members: memberList.map((member) => ({
          userId: member.userId,
          level: member.level
        }))
      })
      if (resp.code === 0) {
        message.success('账套授权已保存')
        setVisible(false)
        onSuccess()
      }
    } finally {
      setLoading(false)
    }
  }

  /** 添加成员到列表 */
  const handleAddSubmit = async () => {
    try {
      const values = await addForm.validateFields()
      const userIds: number[] = values.userIds || []
      const level: number = values.level
      const selectedUsers = allUsers.filter((u) => u.id && userIds.includes(u.id))
      setMemberList((prev) => [
        ...prev,
        ...selectedUsers.map((user) => ({
          userId: user.id!,
          nickname: user.nickname,
          deptName: (user as any).deptName,
          status: CommonStatusEnum.ENABLE.status,
          defaultStatus: false,
          founder: false,
          level
        }))
      ])
      setAddVisible(false)
    } catch {
      // 校验失败
    }
  }

  const columns: ColumnsType<API.FmsAccountUserRespVO> = [
    {
      title: '序号',
      key: 'index',
      width: 70,
      align: 'center',
      render: (_, __, idx) => idx + 1
    },
    {
      title: '姓名',
      dataIndex: 'nickname',
      minWidth: 140,
      render: (_, record) => (
        <>
          <span>{record.nickname || `用户 #${record.userId}`}</span>
          {record.founder && (
            <Tag color="success" style={{ marginLeft: 6 }}>
              创建人
            </Tag>
          )}
        </>
      )
    },
    {
      title: '部门',
      dataIndex: 'deptName',
      minWidth: 140,
      render: (val) => val || '-'
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
      width: 140,
      render: (val) => val || '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      align: 'center',
      render: (val) => (
        <Tag color={val === CommonStatusEnum.ENABLE.status ? 'success' : 'default'}>
          {val === CommonStatusEnum.ENABLE.status ? '开启' : '关闭'}
        </Tag>
      )
    },
    {
      title: '权限级别',
      dataIndex: 'level',
      width: 140,
      align: 'center',
      render: (_, record) =>
        record.founder ? (
          <Tag color="blue">
            {FMS_ACCOUNT_USER_LEVEL_OPTIONS.find((item) => item.value === record.level)?.label ||
              '主管'}
          </Tag>
        ) : (
          <Select
            value={record.level}
            options={FMS_ACCOUNT_USER_LEVEL_OPTIONS}
            style={{ width: 105 }}
            onChange={(nextLevel) => {
              setMemberList((prev) =>
                prev.map((item) =>
                  item.userId === record.userId ? { ...item, level: nextLevel } : item
                )
              )
            }}
          />
        )
    },
    {
      title: '操作',
      key: 'action',
      width: 90,
      align: 'center',
      fixed: 'right',
      render: (_, record, index) => (
        <a
          style={record.founder ? { color: '#d9d9d9', cursor: 'not-allowed' } : deleteTextStyle}
          onClick={() => {
            if (record.founder) return
            setMemberList((prev) => prev.filter((_, idx) => idx !== index))
          }}
        >
          移出
        </a>
      )
    }
  ]

  return (
    <>
      <Modal
        title="账套授权"
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={handleSave}
        confirmLoading={loading}
        width={820}
        destroyOnHidden
      >
        <Alert
          type="info"
          showIcon
          message="查看者可以查看账套数据，会计可以维护账套数据，主管可以管理账套及成员"
        />

        <div
          style={{
            marginTop: 16,
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <span style={{ color: 'rgba(0,0,0,0.45)' }}>账套名称：</span>
            <span style={{ fontWeight: 600 }}>{accountSet?.companyName}</span>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              addForm.resetFields()
              addForm.setFieldsValue({ level: FMS_ACCOUNT_USER_LEVEL.READ })
              setAddVisible(true)
            }}
          >
            添加成员
          </Button>
        </div>

        <Table<API.FmsAccountUserRespVO>
          rowKey="userId"
          loading={loading}
          dataSource={memberList}
          columns={columns}
          pagination={false}
          bordered
          size="middle"
          scroll={{ y: 400 }}
        />
      </Modal>

      <Modal
        title="添加成员"
        open={addVisible}
        onCancel={() => setAddVisible(false)}
        onOk={handleAddSubmit}
        width={520}
        destroyOnHidden
      >
        <Form
          form={addForm}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 18 }}
          colon={false}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="userIds"
            label="选择用户"
            rules={[{ required: true, message: '请选择需要添加的用户' }]}
          >
            <Select
              mode="multiple"
              showSearch
              optionFilterProp="label"
              placeholder="请选择需要加入账套的用户"
              options={allUsers.map((u) => ({
                label: `${u.nickname}${(u as any).deptName ? `（${(u as any).deptName}）` : ''}`,
                value: u.id,
                disabled: u.id ? memberUserIds.includes(u.id) : false
              }))}
            />
          </Form.Item>
          <Form.Item
            name="level"
            label="权限级别"
            rules={[{ required: true, message: '请选择权限级别' }]}
          >
            <Select options={FMS_ACCOUNT_USER_LEVEL_OPTIONS} placeholder="请选择权限级别" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default FmsAccountSetMemberForm
