import React, { useEffect, useState } from 'react'
import { Button, Card, Tabs, message } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { history, useSearchParams } from '@umijs/max'
import { getRecruitPost } from '@/api/hrm/recruit/post'
import { getOperateLogPage } from '@/api/hrm/operateLog'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import { formatDateTime } from '../../format'
import RecruitPostDetailsHeader from './RecruitPostDetailsHeader'
import RecruitPostDetailsInfo from './RecruitPostDetailsInfo'
import RecruitPostForm from '../RecruitPostForm'

const RecruitPostDetailPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const postId = Number(searchParams.get('id'))

  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState<API.HrmRecruitPostRespVO>({})
  const [formVisible, setFormVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('details')

  const fetchPost = async () => {
    if (!postId) {
      message.error('参数错误，招聘职位编号不能为空')
      history.push('/hrm/recruit/post')
      return
    }
    setLoading(true)
    try {
      const resp = await getRecruitPost({ id: postId })
      if (!resp.data) {
        message.warning('招聘职位不存在')
        history.push('/hrm/recruit/post')
        return
      }
      setPost(resp.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPost()
  }, [postId])

  const logColumns: ProColumns<API.HrmOperateLogRespVO>[] = [
    {
      title: '操作人',
      dataIndex: 'userNickname',
      align: 'center',
      width: 120
    },
    {
      title: '操作内容',
      dataIndex: 'content',
      align: 'center',
      minWidth: 200
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 180,
      render: (_, record) => formatDateTime(record.createTime)
    }
  ]

  return (
    <div>
      <RecruitPostDetailsHeader post={post} loading={loading}>
        <Button
          type="primary"
          icon={<EditOutlined />}
          disabled={!post.id}
          onClick={() => setFormVisible(true)}
        >
          编辑
        </Button>
      </RecruitPostDetailsHeader>

      <Card variant="borderless">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'details',
              label: '详细资料',
              children: <RecruitPostDetailsInfo post={post} />
            },
            {
              key: 'logs',
              label: '操作日志',
              children: (
                <ProTable<API.HrmOperateLogRespVO>
                  rowKey="id"
                  columns={logColumns}
                  search={false}
                  options={false}
                  pagination={{ pageSize: 10, align: 'center' }}
                  request={async (params) => {
                    const { current, pageSize } = params
                    try {
                      // HrmBizType.RECRUIT_POST = 11 (对应招聘职位业务日志)
                      const resp = await getOperateLogPage({
                        pageReqVO: {
                          pageNo: current || 1,
                          pageSize: pageSize || 10,
                          bizType: 11,
                          bizId: postId
                        }
                      } as any)
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
              )
            }
          ]}
        />
      </Card>

      <RecruitPostForm
        visible={formVisible}
        setVisible={setFormVisible}
        id={postId}
        onSuccess={() => {
          setFormVisible(false)
          fetchPost()
        }}
      />
    </div>
  )
}

export default RecruitPostDetailPage
