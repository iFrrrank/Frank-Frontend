import React, { useEffect, useState } from 'react'
import { Button, Card, Space, Spin, Table, Tabs } from 'antd'
import { PageContainer } from '@ant-design/pro-components'
import { history, useSearchParams } from '@umijs/max'
import { getEmployee } from '@/api/hrm/employee/index'
import { getContactList, createContact, updateContact, deleteContact } from '@/api/hrm/employee/contact'
import {
  getContractList,
  createContract,
  updateContract,
  deleteContract
} from '@/api/hrm/employee/contract'
import {
  getCertificateList,
  createCertificate,
  updateCertificate,
  deleteCertificate
} from '@/api/hrm/employee/certificate'
import {
  getEducationExperienceList,
  createEducationExperience,
  updateEducationExperience,
  deleteEducationExperience
} from '@/api/hrm/employee/educationExperience'
import {
  getWorkExperienceList,
  createWorkExperience,
  updateWorkExperience,
  deleteWorkExperience
} from '@/api/hrm/employee/workExperience'
import {
  getTrainingExperienceList,
  createTrainingExperience,
  updateTrainingExperience,
  deleteTrainingExperience
} from '@/api/hrm/employee/trainingExperience'
import { getOperateLogPage } from '@/api/hrm/operateLog'
import EmployeeDetailsHeader from '../components/EmployeeDetailsHeader'
import EmployeeDetailsInfo from './EmployeeDetailsInfo'
import EmployeePostInfo from './EmployeePostInfo'
import EmployeeSalaryInfo from './EmployeeSalaryInfo'
import EmployeeInsuranceInfo from './EmployeeInsuranceInfo'
import EmployeeMaterialFiles from './EmployeeMaterialFiles'
import SubResourcePanel from './SubResourcePanel'
import EmployeeRegularForm from '../EmployeeRegularForm'
import EmployeeTransferForm from '../EmployeeTransferForm'
import EmployeePromoteForm from '../EmployeePromoteForm'
import EmployeeDemoteForm from '../EmployeeDemoteForm'
import EmployeeQuitForm from '../EmployeeQuitForm'
import EmployeeCancelQuitForm from '../EmployeeCancelQuitForm'
import dayjs from 'dayjs'

const fmtDate = (value?: string | number) =>
  value ? dayjs(value as any).format('YYYY-MM-DD') : '-'

const dateColumn = (title: string, dataIndex: string, width = 120) => ({
  title,
  dataIndex,
  width,
  render: (v: any) => fmtDate(v)
})

// 员工详情：岗位信息 / 基本信息（含各类经历） / 员工合同 / 工资社保 / 材料附件 / 操作记录
const EmployeeDetail: React.FC = () => {
  const [searchParams] = useSearchParams()
  const employeeId = Number(searchParams.get('id'))
  const [employee, setEmployee] = useState<API.HrmEmployeeRespVO>()
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<any[]>([])

  const [regularVisible, setRegularVisible] = useState(false)
  const [transferVisible, setTransferVisible] = useState(false)
  const [promoteVisible, setPromoteVisible] = useState(false)
  const [demoteVisible, setDemoteVisible] = useState(false)
  const [quitVisible, setQuitVisible] = useState(false)
  const [cancelQuitVisible, setCancelQuitVisible] = useState(false)

  const load = async () => {
    if (!employeeId) return
    setLoading(true)
    try {
      const resp = await getEmployee({ id: employeeId })
      if (resp.code === 0) {
        setEmployee(resp.data)
      }
      // 操作日志：业务类型 3 = 员工档案
      const logResp = await getOperateLogPage({
        pageReqVO: { pageNo: 1, pageSize: 50, bizType: 3, bizId: employeeId }
      } as any)
      if (logResp.code === 0) {
        setLogs(logResp.data?.list || [])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId])

  if (!employee) {
    return (
      <PageContainer title="员工详情">
        <Spin spinning={loading}>
          <Card>暂无员工数据</Card>
        </Spin>
      </PageContainer>
    )
  }

  const listLoader =
    (fn: (params: any) => Promise<any>) =>
    async (id: number) => {
      const resp = await fn({ employeeId: id })
      return resp.code === 0 ? resp.data || [] : []
    }

  const tabItems = [
    {
      key: 'post',
      label: '岗位信息',
      children: <EmployeePostInfo employee={employee} />
    },
    {
      key: 'basic',
      label: '基本信息',
      children: (
        <>
          <EmployeeDetailsInfo employee={employee} />
          <Card title="教育经历" style={{ marginBottom: 16 }}>
            <SubResourcePanel
              employeeId={employeeId}
              loadList={listLoader(getEducationExperienceList)}
              createFn={createEducationExperience}
              updateFn={updateEducationExperience}
              deleteFn={deleteEducationExperience}
              addText="添加教育经历"
              columns={[
                { title: '学校', dataIndex: 'graduateSchool', width: 180 },
                { title: '专业', dataIndex: 'major', width: 140 },
                { title: '学历', dataIndex: 'education', width: 100 },
                dateColumn('入学时间', 'admissionTime'),
                dateColumn('毕业时间', 'graduationTime'),
                { title: '教学方式', dataIndex: 'teachingMethods', width: 110 },
                {
                  title: '第一学历',
                  dataIndex: 'firstDegree',
                  width: 90,
                  render: (v) => (v ? '是' : '否')
                }
              ]}
              formFields={[
                { name: 'graduateSchool', label: '学校', required: true },
                { name: 'major', label: '专业' },
                { name: 'education', label: '学历' },
                { name: 'admissionTime', label: '入学时间', type: 'date' },
                { name: 'graduationTime', label: '毕业时间', type: 'date' },
                { name: 'teachingMethods', label: '教学方式' }
              ]}
            />
          </Card>
          <Card title="工作经历" style={{ marginBottom: 16 }}>
            <SubResourcePanel
              employeeId={employeeId}
              loadList={listLoader(getWorkExperienceList)}
              createFn={createWorkExperience}
              updateFn={updateWorkExperience}
              deleteFn={deleteWorkExperience}
              addText="添加工作经历"
              columns={[
                { title: '工作单位', dataIndex: 'workUnit', width: 180 },
                { title: '岗位', dataIndex: 'postName', width: 120 },
                dateColumn('开始时间', 'startTime'),
                dateColumn('结束时间', 'endTime'),
                { title: '离职原因', dataIndex: 'reason', width: 140 },
                { title: '证明人', dataIndex: 'witnessName', width: 100 },
                { title: '证明人电话', dataIndex: 'witnessPhone', width: 130 }
              ]}
              formFields={[
                { name: 'workUnit', label: '工作单位', required: true },
                { name: 'postName', label: '岗位' },
                { name: 'startTime', label: '开始时间', type: 'date' },
                { name: 'endTime', label: '结束时间', type: 'date' },
                { name: 'reason', label: '离职原因' },
                { name: 'witnessName', label: '证明人' },
                { name: 'witnessPhone', label: '证明人电话' },
                { name: 'remark', label: '备注', type: 'textarea' }
              ]}
            />
          </Card>
          <Card title="证书/证件" style={{ marginBottom: 16 }}>
            <SubResourcePanel
              employeeId={employeeId}
              loadList={listLoader(getCertificateList)}
              createFn={createCertificate}
              updateFn={updateCertificate}
              deleteFn={deleteCertificate}
              addText="添加证书"
              columns={[
                { title: '证书名称', dataIndex: 'name', width: 180 },
                { title: '等级', dataIndex: 'level', width: 100 },
                { title: '证书编号', dataIndex: 'no', width: 150 },
                { title: '颁发机构', dataIndex: 'issuingAuthority', width: 160 },
                dateColumn('颁发时间', 'issuingTime'),
                dateColumn('有效期起', 'startTime'),
                dateColumn('有效期止', 'endTime')
              ]}
              formFields={[
                { name: 'name', label: '证书名称', required: true },
                { name: 'level', label: '等级' },
                { name: 'no', label: '证书编号' },
                { name: 'issuingAuthority', label: '颁发机构' },
                { name: 'issuingTime', label: '颁发时间', type: 'date' },
                { name: 'startTime', label: '有效期起', type: 'date' },
                { name: 'endTime', label: '有效期止', type: 'date' },
                { name: 'remark', label: '备注', type: 'textarea' }
              ]}
            />
          </Card>
          <Card title="培训经历" style={{ marginBottom: 16 }}>
            <SubResourcePanel
              employeeId={employeeId}
              loadList={listLoader(getTrainingExperienceList)}
              createFn={createTrainingExperience}
              updateFn={updateTrainingExperience}
              deleteFn={deleteTrainingExperience}
              addText="添加培训经历"
              columns={[
                { title: '培训课程', dataIndex: 'course', width: 180 },
                { title: '培训机构', dataIndex: 'organizationName', width: 160 },
                dateColumn('开始时间', 'startTime'),
                dateColumn('结束时间', 'endTime'),
                { title: '培训时长', dataIndex: 'duration', width: 100 },
                { title: '培训结果', dataIndex: 'result', width: 110 },
                { title: '获得证书', dataIndex: 'certificateName', width: 140 }
              ]}
              formFields={[
                { name: 'course', label: '培训课程', required: true },
                { name: 'organizationName', label: '培训机构' },
                { name: 'startTime', label: '开始时间', type: 'date' },
                { name: 'endTime', label: '结束时间', type: 'date' },
                { name: 'duration', label: '培训时长' },
                { name: 'result', label: '培训结果' },
                { name: 'certificateName', label: '获得证书' },
                { name: 'remark', label: '备注', type: 'textarea' }
              ]}
            />
          </Card>
          <Card title="联系人">
            <SubResourcePanel
              employeeId={employeeId}
              loadList={listLoader(getContactList)}
              createFn={createContact}
              updateFn={updateContact}
              deleteFn={deleteContact}
              addText="添加联系人"
              columns={[
                { title: '姓名', dataIndex: 'name', width: 120 },
                { title: '关系', dataIndex: 'relation', width: 100 },
                { title: '电话', dataIndex: 'phone', width: 140 },
                { title: '工作单位', dataIndex: 'workUnit', width: 160 },
                { title: '岗位', dataIndex: 'postName', width: 120 },
                { title: '地址', dataIndex: 'address' }
              ]}
              formFields={[
                { name: 'name', label: '姓名', required: true },
                { name: 'relation', label: '关系' },
                { name: 'phone', label: '电话', required: true },
                { name: 'workUnit', label: '工作单位' },
                { name: 'postName', label: '岗位' },
                { name: 'address', label: '地址' }
              ]}
            />
          </Card>
        </>
      )
    },
    {
      key: 'contract',
      label: '员工合同',
      children: (
        <Card>
          <SubResourcePanel
            employeeId={employeeId}
            loadList={listLoader(getContractList)}
            createFn={createContract}
            updateFn={updateContract}
            deleteFn={deleteContract}
            addText="添加合同"
            columns={[
              { title: '合同编号', dataIndex: 'no', width: 150 },
              { title: '合同类型', dataIndex: 'type', width: 110 },
              dateColumn('开始时间', 'startTime'),
              dateColumn('结束时间', 'endTime'),
              { title: '合同期限', dataIndex: 'term', width: 100 },
              { title: '签订公司', dataIndex: 'signCompany', width: 160 },
              dateColumn('签订时间', 'signTime'),
              { title: '状态', dataIndex: 'status', width: 90 }
            ]}
            formFields={[
              { name: 'no', label: '合同编号' },
              { name: 'type', label: '合同类型' },
              { name: 'startTime', label: '开始时间', type: 'date' },
              { name: 'endTime', label: '结束时间', type: 'date' },
              { name: 'term', label: '合同期限' },
              { name: 'signCompany', label: '签订公司' },
              { name: 'signTime', label: '签订时间', type: 'date' },
              { name: 'remark', label: '备注', type: 'textarea' }
            ]}
          />
        </Card>
      )
    },
    {
      key: 'salary',
      label: '工资社保',
      children: (
        <>
          <EmployeeSalaryInfo employeeId={employeeId} />
          <div style={{ marginTop: 16 }}>
            <EmployeeInsuranceInfo employeeId={employeeId} />
          </div>
        </>
      )
    },
    {
      key: 'file',
      label: '材料附件',
      children: <EmployeeMaterialFiles employeeId={employeeId} />
    },
    {
      key: 'operateLog',
      label: '操作记录',
      children: (
        <Card>
          <Table
            rowKey="id"
            size="small"
            pagination={false}
            dataSource={logs}
            columns={[
              { title: '操作人', dataIndex: 'userName', width: 120 },
              { title: '操作类型', dataIndex: 'subType', width: 140 },
              { title: '操作内容', dataIndex: 'action' },
              {
                title: '操作时间',
                dataIndex: 'createTime',
                width: 170,
                render: (v) => (v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : '-')
              }
            ]}
          />
        </Card>
      )
    }
  ]

  return (
    <PageContainer
      title="员工详情"
      onBack={() => history.push('/hrm/employee')}
    >
      <EmployeeDetailsHeader employee={employee} loading={loading}>
        <Space>
          {/* 试用期员工可转正 */}
          {employee.status === 2 && (
            <Button type="primary" onClick={() => setRegularVisible(true)}>
              转正
            </Button>
          )}
          <Button onClick={() => setTransferVisible(true)}>调动</Button>
          <Button onClick={() => setPromoteVisible(true)}>晋升</Button>
          <Button onClick={() => setDemoteVisible(true)}>降职</Button>
          {employee.entryStatus === 3 ? (
            <Button danger onClick={() => setCancelQuitVisible(true)}>
              撤销离职
            </Button>
          ) : (
            employee.entryStatus !== 4 && (
              <Button danger onClick={() => setQuitVisible(true)}>
                办理离职
              </Button>
            )
          )}
        </Space>
      </EmployeeDetailsHeader>

      <Card style={{ marginTop: 16 }}>
        <Tabs items={tabItems} />
      </Card>

      <EmployeeRegularForm
        visible={regularVisible}
        setVisible={setRegularVisible}
        onSuccess={load}
        employee={employee}
      />
      <EmployeeTransferForm
        visible={transferVisible}
        setVisible={setTransferVisible}
        onSuccess={load}
        employee={employee}
      />
      <EmployeePromoteForm
        visible={promoteVisible}
        setVisible={setPromoteVisible}
        onSuccess={load}
        employee={employee}
      />
      <EmployeeDemoteForm
        visible={demoteVisible}
        setVisible={setDemoteVisible}
        onSuccess={load}
        employee={employee}
      />
      <EmployeeQuitForm
        visible={quitVisible}
        setVisible={setQuitVisible}
        onSuccess={load}
        employee={employee}
      />
      <EmployeeCancelQuitForm
        visible={cancelQuitVisible}
        setVisible={setCancelQuitVisible}
        onSuccess={load}
        employee={employee}
      />
    </PageContainer>
  )
}

export default EmployeeDetail
