import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Alert, Button, Card, Descriptions, Empty, Space, Spin, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import * as EmployeeApi from '@/api/hrm/portal/employee'
import { formatEmployeeIdType, formatHrmDate, formatHrmDateTime } from '@/pages/hrm/utils/format'
import { SEX_OPTIONS, getEducationOptions, type DictOption } from '@/pages/hrm/employee/utils'

export interface EmployeeBaseInfoProps {
  employee: EmployeeApi.HrmPortalEmployeeVO
  fieldConfigList: EmployeeApi.HrmEmployeeFieldConfigVO[]
  onEdit: () => void
}

export interface EmployeeBaseInfoRef {
  getList: () => Promise<void>
}

const EmployeeBaseInfo = forwardRef<EmployeeBaseInfoRef, EmployeeBaseInfoProps>(
  ({ employee, fieldConfigList, onEdit }, ref) => {
    const [loading, setLoading] = useState(false)
    const [educationOptions, setEducationOptions] = useState<DictOption[]>([])
    const [educationExperienceList, setEducationExperienceList] = useState<
      EmployeeApi.HrmEmployeeEducationExperienceVO[]
    >([])
    const [workExperienceList, setWorkExperienceList] = useState<
      EmployeeApi.HrmEmployeeWorkExperienceVO[]
    >([])
    const [certificateList, setCertificateList] = useState<EmployeeApi.HrmEmployeeCertificateVO[]>(
      []
    )
    const [trainingExperienceList, setTrainingExperienceList] = useState<
      EmployeeApi.HrmEmployeeTrainingExperienceVO[]
    >([])
    const [contactList, setContactList] = useState<EmployeeApi.HrmEmployeeContactVO[]>([])

    const hasEditableFields = fieldConfigList.some((field) => field.editable)
    const visibleFieldNames = new Set(
      fieldConfigList.filter((field) => field.visible !== false).map((field) => field.name)
    )

    const isVisible = (name: string) => visibleFieldNames.has(name)
    const hasVisibleContactFields =
      isVisible('mobile') || isVisible('email') || isVisible('address')

    const getEducationLabel = (val?: number) => {
      if (val === undefined || val === null) return '-'
      const match = educationOptions.find((opt) => opt.value === val)
      return match ? match.label : String(val)
    }

    const getSexLabel = (val?: number) => {
      if (val === undefined || val === null) return '-'
      const match = SEX_OPTIONS.find((opt) => opt.value === val)
      return match ? match.label : '-'
    }

    const getList = async () => {
      setLoading(true)
      try {
        const [educationResp, workResp, certificateResp, trainingResp, contactResp] =
          await Promise.all([
            EmployeeApi.getEmployeeEducationExperienceList(),
            EmployeeApi.getEmployeeWorkExperienceList(),
            EmployeeApi.getEmployeeCertificateList(),
            EmployeeApi.getEmployeeTrainingExperienceList(),
            EmployeeApi.getEmployeeContactList()
          ])
        setEducationExperienceList(educationResp.data || [])
        setWorkExperienceList(workResp.data || [])
        setCertificateList(certificateResp.data || [])
        setTrainingExperienceList(trainingResp.data || [])
        setContactList(contactResp.data || [])
      } finally {
        setLoading(false)
      }
    }

    useImperativeHandle(ref, () => ({
      getList
    }))

    useEffect(() => {
      getEducationOptions().then((opts) => setEducationOptions(opts || []))
      getList()
    }, [])

    const educationColumns: ColumnsType<EmployeeApi.HrmEmployeeEducationExperienceVO> = [
      {
        title: '学历',
        dataIndex: 'education',
        width: 110,
        render: (val) => <Tag color="blue">{getEducationLabel(val)}</Tag>
      },
      { title: '毕业院校', dataIndex: 'graduateSchool', minWidth: 160 },
      { title: '专业', dataIndex: 'major', minWidth: 130 },
      {
        title: '入学日期',
        dataIndex: 'admissionTime',
        width: 120,
        render: (val) => formatHrmDate(val)
      },
      {
        title: '毕业日期',
        dataIndex: 'graduationTime',
        width: 120,
        render: (val) => formatHrmDate(val)
      }
    ]

    const workColumns: ColumnsType<EmployeeApi.HrmEmployeeWorkExperienceVO> = [
      { title: '工作单位', dataIndex: 'workUnit', minWidth: 170 },
      { title: '职务', dataIndex: 'postName', minWidth: 130 },
      {
        title: '开始日期',
        dataIndex: 'startTime',
        width: 120,
        render: (val) => formatHrmDate(val)
      },
      {
        title: '结束日期',
        dataIndex: 'endTime',
        width: 120,
        render: (val) => formatHrmDate(val)
      },
      { title: '离职原因', dataIndex: 'reason', minWidth: 180 }
    ]

    const certificateColumns: ColumnsType<EmployeeApi.HrmEmployeeCertificateVO> = [
      { title: '证书名称', dataIndex: 'name', minWidth: 160 },
      { title: '级别', dataIndex: 'level', width: 110 },
      { title: '证书编号', dataIndex: 'no', minWidth: 150 },
      { title: '发证机构', dataIndex: 'issuingAuthority', minWidth: 150 },
      {
        title: '发证日期',
        dataIndex: 'issuingTime',
        width: 120,
        render: (val) => formatHrmDate(val)
      }
    ]

    const trainingColumns: ColumnsType<EmployeeApi.HrmEmployeeTrainingExperienceVO> = [
      {
        title: '培训课程',
        dataIndex: 'course',
        minWidth: 150,
        render: (val, row) => val || row.courseName || '-'
      },
      {
        title: '培训机构',
        dataIndex: 'organizationName',
        minWidth: 150,
        render: (val, row) => val || row.trainingUnit || '-'
      },
      {
        title: '培训时间',
        minWidth: 230,
        render: (_, row) => `${formatHrmDate(row.startTime)} 至 ${formatHrmDate(row.endTime)}`
      },
      { title: '培训成绩', dataIndex: 'result', width: 110 },
      { title: '培训证书', dataIndex: 'certificateName', minWidth: 150 }
    ]

    const contactColumns: ColumnsType<EmployeeApi.HrmEmployeeContactVO> = [
      { title: '联系人', dataIndex: 'name', width: 120 },
      { title: '关系', dataIndex: 'relation', width: 100 },
      {
        title: '联系电话',
        dataIndex: 'phone',
        width: 140,
        render: (val, row) => val || row.mobile || '-'
      },
      { title: '工作单位', dataIndex: 'workUnit', minWidth: 150 },
      { title: '联系地址', dataIndex: 'address', minWidth: 180 }
    ]

    return (
      <Spin spinning={loading}>
        <Alert
          message={
            hasEditableFields
              ? '可编辑的信息由公司管理员设置，如有问题，请联系公司管理员。'
              : '您的编辑权限已被管理员关闭，如有问题，请联系公司管理员。'
          }
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Card
            title="基本信息"
            extra={
              hasEditableFields && (
                <Button type="link" onClick={onEdit}>
                  编辑
                </Button>
              )
            }
          >
            <Descriptions bordered column={4} size="small">
              {isVisible('name') && (
                <Descriptions.Item label="姓名">{employee.name || '-'}</Descriptions.Item>
              )}
              {isVisible('sex') && (
                <Descriptions.Item label="性别">
                  {employee.sex != null ? <Tag color="cyan">{getSexLabel(employee.sex)}</Tag> : '-'}
                </Descriptions.Item>
              )}
              {isVisible('birthday') && (
                <Descriptions.Item label="出生时间">
                  {formatHrmDateTime(employee.birthday)}
                </Descriptions.Item>
              )}
              {isVisible('age') && (
                <Descriptions.Item label="年龄">{employee.age ?? '-'}</Descriptions.Item>
              )}
              {isVisible('country') && (
                <Descriptions.Item label="国家或地区">{employee.country || '-'}</Descriptions.Item>
              )}
              {isVisible('nation') && (
                <Descriptions.Item label="民族">{employee.nation || '-'}</Descriptions.Item>
              )}
              {isVisible('nativePlace') && (
                <Descriptions.Item label="籍贯">{employee.nativePlace || '-'}</Descriptions.Item>
              )}
              {isVisible('highestEducation') && (
                <Descriptions.Item label="最高学历">
                  {employee.highestEducation != null ? (
                    <Tag color="blue">{getEducationLabel(employee.highestEducation)}</Tag>
                  ) : (
                    '-'
                  )}
                </Descriptions.Item>
              )}
              {isVisible('idType') && (
                <Descriptions.Item label="证件类型">
                  {formatEmployeeIdType(employee.idType)}
                </Descriptions.Item>
              )}
              {isVisible('idNumber') && (
                <Descriptions.Item label="证件号码">{employee.idNumber || '-'}</Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {hasVisibleContactFields && (
            <Card title="通讯信息">
              <Descriptions bordered column={4} size="small">
                {isVisible('mobile') && (
                  <Descriptions.Item label="手机号">{employee.mobile || '-'}</Descriptions.Item>
                )}
                {isVisible('email') && (
                  <Descriptions.Item label="邮箱">{employee.email || '-'}</Descriptions.Item>
                )}
                {isVisible('address') && (
                  <Descriptions.Item label="户籍地址" span={4}>
                    {employee.address || '-'}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          )}

          <Card title="教育经历">
            {educationExperienceList.length > 0 ? (
              <Table
                rowKey="id"
                dataSource={educationExperienceList}
                columns={educationColumns}
                pagination={false}
                bordered
                size="small"
              />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
            )}
          </Card>

          <Card title="工作经历">
            {workExperienceList.length > 0 ? (
              <Table
                rowKey="id"
                dataSource={workExperienceList}
                columns={workColumns}
                pagination={false}
                bordered
                size="small"
              />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
            )}
          </Card>

          <Card title="证书/证件">
            {certificateList.length > 0 ? (
              <Table
                rowKey="id"
                dataSource={certificateList}
                columns={certificateColumns}
                pagination={false}
                bordered
                size="small"
              />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
            )}
          </Card>

          <Card title="培训经历">
            {trainingExperienceList.length > 0 ? (
              <Table
                rowKey="id"
                dataSource={trainingExperienceList}
                columns={trainingColumns}
                pagination={false}
                bordered
                size="small"
              />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
            )}
          </Card>

          <Card title="联系人">
            {contactList.length > 0 ? (
              <Table
                rowKey="id"
                dataSource={contactList}
                columns={contactColumns}
                pagination={false}
                bordered
                size="small"
              />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
            )}
          </Card>
        </Space>
      </Spin>
    )
  }
)

export default EmployeeBaseInfo
