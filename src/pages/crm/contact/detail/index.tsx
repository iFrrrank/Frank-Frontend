import React, { useEffect, useState } from 'react'
import { Descriptions, Tag } from 'antd'
import { useSearchParams } from '@umijs/max'
import { getContact } from '@/api/crm/contact'
import DetailShell from '../../components/DetailShell'
import FollowUpPanel, { CRM_BIZ_TYPE } from '../../components/FollowUpPanel'

// 联系人详情：基本信息与跟进记录
const ContactDetail: React.FC = () => {
  const [searchParams] = useSearchParams()
  const id = Number(searchParams.get('id'))
  const [loading, setLoading] = useState(true)
  const [contact, setContact] = useState<any>()

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setLoading(false)
        return
      }
      const resp = await getContact({ id } as any)
      if (resp.code === 0) {
        setContact(resp.data)
      }
      setLoading(false)
    }
    load()
  }, [id])

  const info = (
    <Descriptions column={2} bordered size="small">
      <Descriptions.Item label="姓名">{contact?.name || '-'}</Descriptions.Item>
      <Descriptions.Item label="所属客户">{contact?.customerName || '-'}</Descriptions.Item>
      <Descriptions.Item label="负责人">{contact?.ownerUserName || '-'}</Descriptions.Item>
      <Descriptions.Item label="关键决策人">
        {contact?.master ? <Tag color="blue">是</Tag> : '否'}
      </Descriptions.Item>
      <Descriptions.Item label="职位">{contact?.post || '-'}</Descriptions.Item>
      <Descriptions.Item label="性别">
        {contact?.sex === 1 ? '男' : contact?.sex === 2 ? '女' : '-'}
      </Descriptions.Item>
      <Descriptions.Item label="手机号">{contact?.mobile || '-'}</Descriptions.Item>
      <Descriptions.Item label="电话">{contact?.telephone || '-'}</Descriptions.Item>
      <Descriptions.Item label="QQ">{contact?.qq || '-'}</Descriptions.Item>
      <Descriptions.Item label="微信">{contact?.wechat || '-'}</Descriptions.Item>
      <Descriptions.Item label="邮箱" span={2}>
        {contact?.email || '-'}
      </Descriptions.Item>
      <Descriptions.Item label="所在地区">{contact?.areaName || '-'}</Descriptions.Item>
      <Descriptions.Item label="详细地址">{contact?.detailAddress || '-'}</Descriptions.Item>
      <Descriptions.Item label="最后跟进时间">{contact?.contactLastTime || '-'}</Descriptions.Item>
      <Descriptions.Item label="下次联系时间">{contact?.contactNextTime || '-'}</Descriptions.Item>
      <Descriptions.Item label="直属上级">{contact?.parentName || '-'}</Descriptions.Item>
      <Descriptions.Item label="备注" span={2}>
        {contact?.remark || '-'}
      </Descriptions.Item>
      <Descriptions.Item label="创建时间">{contact?.createTime || '-'}</Descriptions.Item>
    </Descriptions>
  )

  return (
    <DetailShell
      title={contact?.name || '联系人详情'}
      loading={loading}
      tabItems={[
        { key: 'info', label: '详细信息', children: info },
        {
          key: 'followup',
          label: '跟进记录',
          children: <FollowUpPanel bizType={CRM_BIZ_TYPE.CONTACT} bizId={id} />
        }
      ]}
    />
  )
}

export default ContactDetail
