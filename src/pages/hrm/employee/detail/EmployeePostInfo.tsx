import React, { useEffect, useState } from 'react'
import { Card, Descriptions, Empty, Table } from 'antd'
import { getQuitInfo } from '@/api/hrm/employee/quitInfo'
import { getEmployeeChangeRecordList } from '@/api/hrm/employee/changeRecord'
import { EMPLOYEE_ENTRY_STATUS } from '@/utils/constantsValue'
import dayjs from 'dayjs'

interface EmployeePostInfoProps {
  employee: API.HrmEmployeeRespVO
}

const fmtDate = (value?: string | number) =>
  value ? dayjs(value as any).format('YYYY-MM-DD') : '-'

// 变动记录中一项变更的展示：旧值 → 新值
const changeText = (oldValue?: string, newValue?: string) => {
  if (!oldValue && !newValue) return '-'
  if (!oldValue) return newValue
  if (!newValue || oldValue === newValue) return oldValue
  return `${oldValue} → ${newValue}`
}

// 岗位信息页签：岗位资料 + 离职信息（待离职/已离职时） + 异动记录
const EmployeePostInfo: React.FC<EmployeePostInfoProps> = ({ employee }) => {
  const [quitInfo, setQuitInfo] = useState<API.HrmEmployeeQuitInfoRespVO>()
  const [changeRecords, setChangeRecords] = useState<any[]>([])

  const showQuit = employee.entryStatus === 3 || employee.entryStatus === 4

  useEffect(() => {
    if (!employee.id) return
    if (showQuit) {
      getQuitInfo({ employeeId: employee.id } as any).then((resp) => {
        if (resp.code === 0) setQuitInfo(resp.data)
      })
    }
    getEmployeeChangeRecordList({ employeeId: employee.id } as any).then((resp) => {
      if (resp.code === 0) setChangeRecords(resp.data || [])
    })
  }, [employee.id, showQuit])

  return (
    <>
      <Card title="岗位信息" style={{ marginBottom: 16 }}>
        <Descriptions column={3}>
          <Descriptions.Item label="部门">{employee.deptName || '-'}</Descriptions.Item>
          <Descriptions.Item label="岗位">{employee.postName || '-'}</Descriptions.Item>
          <Descriptions.Item label="职级">{employee.postLevel || '-'}</Descriptions.Item>
          <Descriptions.Item label="直属上级">
            {employee.leaderEmployeeName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="入职状态">
            {employee.entryStatus !== undefined
              ? EMPLOYEE_ENTRY_STATUS[employee.entryStatus]?.text || '-'
              : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="员工类型">{employee.type || '-'}</Descriptions.Item>
          <Descriptions.Item label="入职日期">{fmtDate(employee.entryTime)}</Descriptions.Item>
          <Descriptions.Item label="试用期（月）">
            {employee.probation !== undefined ? employee.probation : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="转正日期">{fmtDate(employee.regularTime)}</Descriptions.Item>
          <Descriptions.Item label="司龄起始日">
            {fmtDate(employee.companyAgeStartTime)}
          </Descriptions.Item>
          <Descriptions.Item label="司龄">
            {employee.companyAge !== undefined ? `${employee.companyAge} 年` : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="工作城市">{employee.workCity || '-'}</Descriptions.Item>
          <Descriptions.Item label="工作地点">{employee.workAddress || '-'}</Descriptions.Item>
          <Descriptions.Item label="详细地址">
            {employee.workDetailAddress || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="招聘渠道">{employee.channelName || '-'}</Descriptions.Item>
        </Descriptions>
      </Card>

      {showQuit && (
        <Card title="离职信息" style={{ marginBottom: 16 }}>
          {quitInfo ? (
            <Descriptions column={3}>
              <Descriptions.Item label="申请离职时间">
                {fmtDate(quitInfo.applyQuitTime)}
              </Descriptions.Item>
              <Descriptions.Item label="计划离职时间">
                {fmtDate(quitInfo.planQuitTime)}
              </Descriptions.Item>
              <Descriptions.Item label="薪资结算时间">
                {fmtDate(quitInfo.salarySettlementTime)}
              </Descriptions.Item>
              <Descriptions.Item label="离职类型">{quitInfo.type || '-'}</Descriptions.Item>
              <Descriptions.Item label="离职原因">{quitInfo.reason || '-'}</Descriptions.Item>
              <Descriptions.Item label="备注">{quitInfo.remark || '-'}</Descriptions.Item>
            </Descriptions>
          ) : (
            <Empty description="暂无离职信息" />
          )}
        </Card>
      )}

      <Card title="异动记录">
        <Table
          rowKey="id"
          size="small"
          pagination={false}
          dataSource={changeRecords}
          columns={[
            { title: '异动类型', dataIndex: 'type', width: 100 },
            { title: '异动原因', dataIndex: 'reason', width: 100 },
            {
              title: '部门变更',
              width: 180,
              render: (_, r) => changeText(r.oldDeptName, r.newDeptName)
            },
            {
              title: '岗位变更',
              width: 160,
              render: (_, r) => changeText(r.oldPostName, r.newPostName)
            },
            {
              title: '职级变更',
              width: 130,
              render: (_, r) => changeText(r.oldPostLevel, r.newPostLevel)
            },
            {
              title: '直属上级变更',
              width: 170,
              render: (_, r) => changeText(r.oldLeaderEmployeeName, r.newLeaderEmployeeName)
            },
            {
              title: '生效日期',
              dataIndex: 'effectTime',
              width: 110,
              render: (v) => fmtDate(v)
            },
            { title: '备注', dataIndex: 'remark', ellipsis: true }
          ]}
        />
      </Card>
    </>
  )
}

export default EmployeePostInfo
