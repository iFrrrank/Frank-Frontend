import React, { useEffect, useState } from 'react'
import { Button, Descriptions, message, Modal, Tag } from 'antd'
import { useSearchParams } from '@umijs/max'
import { getClue, transformClue } from '@/api/crm/clue'
import DetailShell from '../../components/DetailShell'
import FollowUpPanel, { CRM_BIZ_TYPE } from '../../components/FollowUpPanel'
import { CUSTOMER_LEVEL, CUSTOMER_SOURCE, INDUSTRY_LIST } from '@/utils/constantsValue'

const dictText = (map: Record<string, any>, value: any) => (map[value] as any)?.text || '-'

// 线索详情：基本信息、跟进记录，支持转化为客户
const ClueDetail: React.FC = () => {
  const [searchParams] = useSearchParams()
  const id = Number(searchParams.get('id'))
  const [loading, setLoading] = useState(true)
  const [clue, setClue] = useState<any>()

  const load = async () => {
    if (!id) {
      setLoading(false)
      return
    }
    const resp = await getClue({ id } as any)
    if (resp.code === 0) {
      setClue(resp.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // 线索转化为客户（已转化时后端返回关联客户编号）
  const handleTransform = () => {
    Modal.confirm({
      title: '确认转化',
      content: `确定要将线索「${clue?.name}」转化为客户吗？`,
      okText: '转化',
      cancelText: '取消',
      onOk: async () => {
        const resp = await transformClue({ id } as any)
        if (resp.code === 0) {
          message.success('转化成功')
          load()
        } else {
          message.error(resp.msg || '转化失败')
        }
      }
    })
  }

  const info = (
    <>
      <div style={{ marginBottom: 12 }}>
        {clue?.transformStatus ? (
          <Tag color="green">已转化为客户</Tag>
        ) : (
          <Button type="primary" onClick={handleTransform}>
            转化为客户
          </Button>
        )}
      </div>
      <Descriptions column={2} bordered size="small">
        <Descriptions.Item label="线索名称">{clue?.name || '-'}</Descriptions.Item>
        <Descriptions.Item label="负责人">{clue?.ownerUserName || '-'}</Descriptions.Item>
        <Descriptions.Item label="客户等级">
          {dictText(CUSTOMER_LEVEL as any, clue?.level)}
        </Descriptions.Item>
        <Descriptions.Item label="客户来源">
          {dictText(CUSTOMER_SOURCE as any, clue?.source)}
        </Descriptions.Item>
        <Descriptions.Item label="所属行业">
          {dictText(INDUSTRY_LIST as any, clue?.industryId)}
        </Descriptions.Item>
        <Descriptions.Item label="跟进状态">
          {clue?.followUpStatus ? '已跟进' : '待跟进'}
        </Descriptions.Item>
        <Descriptions.Item label="手机">{clue?.mobile || '-'}</Descriptions.Item>
        <Descriptions.Item label="电话">{clue?.telephone || '-'}</Descriptions.Item>
        <Descriptions.Item label="QQ">{clue?.qq || '-'}</Descriptions.Item>
        <Descriptions.Item label="微信">{clue?.wechat || '-'}</Descriptions.Item>
        <Descriptions.Item label="邮箱" span={2}>
          {clue?.email || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="所在地区">{clue?.areaName || '-'}</Descriptions.Item>
        <Descriptions.Item label="详细地址">{clue?.detailAddress || '-'}</Descriptions.Item>
        <Descriptions.Item label="最后跟进时间">{clue?.contactLastTime || '-'}</Descriptions.Item>
        <Descriptions.Item label="下次联系时间">{clue?.contactNextTime || '-'}</Descriptions.Item>
        <Descriptions.Item label="备注" span={2}>
          {clue?.remark || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">{clue?.createTime || '-'}</Descriptions.Item>
      </Descriptions>
    </>
  )

  return (
    <DetailShell
      title={clue?.name || '线索详情'}
      loading={loading}
      tabItems={[
        { key: 'info', label: '详细信息', children: info },
        {
          key: 'followup',
          label: '跟进记录',
          children: <FollowUpPanel bizType={CRM_BIZ_TYPE.CLUE} bizId={id} />
        }
      ]}
    />
  )
}

export default ClueDetail
