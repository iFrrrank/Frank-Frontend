import React, { useEffect, useState } from 'react'
import { Button, Card, Space, Tabs, message } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { history, useSearchParams } from '@umijs/max'
import { getDept, getSimpleDeptList } from '@/api/system/dept'
import { getSimpleUserList } from '@/api/system/user'
import { getEmployeeDeptStatistics } from '@/api/hrm/employee'
import DeptDetailsHeader from './DeptDetailsHeader'
import DeptDetailsInfo from './DeptDetailsInfo'
import DeptEmployeeList from './DeptEmployeeList'

const HrmDeptDetailPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const deptId = Number(searchParams.get('id'))

  const [loading, setLoading] = useState(true)
  const [dept, setDept] = useState<API.SystemDeptRespVO>({} as API.SystemDeptRespVO)
  const [parentDeptName, setParentDeptName] = useState<string>()
  const [leaderUserName, setLeaderUserName] = useState<string>()
  const [statistics, setStatistics] = useState({
    activeCount: 0,
    fullTimeCount: 0,
    nonFullTimeCount: 0
  })
  const [activeTab, setActiveTab] = useState('details')

  const fetchDeptData = async () => {
    if (!deptId) {
      message.error('参数错误，部门编号不能为空')
      history.push('/hrm/dept')
      return
    }
    setLoading(true)
    try {
      const [deptResp, deptListResp, userListResp, statsResp] = await Promise.all([
        getDept({ id: deptId }),
        getSimpleDeptList(),
        getSimpleUserList(),
        getEmployeeDeptStatistics({ deptId })
      ])

      const currentDept = deptResp.data || ({} as API.SystemDeptRespVO)
      setDept(currentDept)

      if (currentDept.parentId) {
        const parent = (deptListResp.data || []).find((d) => d.id === currentDept.parentId)
        setParentDeptName(parent?.name)
      } else {
        setParentDeptName('根部门')
      }

      if (currentDept.leaderUserId) {
        const leader = (userListResp.data || []).find((u) => u.id === currentDept.leaderUserId)
        setLeaderUserName(leader?.nickname)
      }

      const deptStats = (statsResp.data || []).find((s) => s.deptId === deptId)
      setStatistics(
        deptStats || {
          activeCount: 0,
          fullTimeCount: 0,
          nonFullTimeCount: 0
        }
      )
    } catch {
      message.error('加载部门详情失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDeptData()
  }, [deptId])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <DeptDetailsHeader
        dept={dept}
        parentDeptName={parentDeptName}
        leaderUserName={leaderUserName}
        statistics={statistics}
        loading={loading}
      >
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            disabled={!dept.id}
            onClick={() => history.push('/system/dept')}
          >
            编辑
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            disabled={!dept.id}
            onClick={() => history.push('/system/dept')}
          >
            删除
          </Button>
        </Space>
      </DeptDetailsHeader>

      <Card variant="borderless">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'details',
              label: '详细资料',
              children: (
                <DeptDetailsInfo
                  dept={dept}
                  parentDeptName={parentDeptName}
                  leaderUserName={leaderUserName}
                />
              )
            },
            {
              key: 'employees',
              label: '员工列表',
              children: dept.id ? <DeptEmployeeList deptId={dept.id} /> : null
            }
          ]}
        />
      </Card>
    </div>
  )
}

export default HrmDeptDetailPage
