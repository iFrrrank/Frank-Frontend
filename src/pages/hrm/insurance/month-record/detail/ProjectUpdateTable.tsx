import React from 'react'
import { InputNumber, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { HrmInsuranceSchemeType } from '../../constants'
import { formatHrmRate, getInsuranceProjectTypeName } from '../../utils'

export type EditableProject = API.HrmInsuranceMonthEmployeeProjectRespVO

interface ProjectUpdateTableProps {
  projects: EditableProject[]
  schemeType?: number
  onChange: (projects: EditableProject[]) => void
}

/**
 * 员工月度参保项目调整表格（单个调整 / 批量调整共用）
 * 比例方案只允许修改缴纳基数；固定金额方案只允许修改公司 / 个人金额。
 */
const ProjectUpdateTable: React.FC<ProjectUpdateTableProps> = ({
  projects,
  schemeType,
  onChange
}) => {
  const updateRow = (index: number, patch: Partial<EditableProject>) =>
    onChange(projects.map((item, i) => (i === index ? { ...item, ...patch } : item)))

  const renderInput = (
    field: 'baseAmount' | 'corporateAmount' | 'personalAmount',
    index: number,
    value?: number
  ) => (
    <InputNumber
      style={{ width: '100%' }}
      min={0}
      precision={2}
      controls={false}
      value={value}
      onChange={(val) => updateRow(index, { [field]: val ?? undefined })}
    />
  )

  const columns: ColumnsType<EditableProject> = [
    {
      title: '类型',
      dataIndex: 'type',
      width: 130,
      render: (value) => getInsuranceProjectTypeName(value)
    },
    { title: '项目名称', dataIndex: 'name', width: 150 }
  ]

  if (schemeType === HrmInsuranceSchemeType.PROPORTION) {
    columns.push(
      {
        title: '缴纳基数',
        dataIndex: 'baseAmount',
        width: 150,
        render: (value, _row, index) => renderInput('baseAmount', index, value)
      },
      {
        title: '公司比例',
        dataIndex: 'corporateRate',
        width: 120,
        render: (value) => formatHrmRate(value)
      },
      {
        title: '个人比例',
        dataIndex: 'personalRate',
        width: 120,
        render: (value) => formatHrmRate(value)
      }
    )
  }
  if (schemeType === HrmInsuranceSchemeType.AMOUNT) {
    columns.push(
      {
        title: '公司金额',
        dataIndex: 'corporateAmount',
        width: 150,
        render: (value, _row, index) => renderInput('corporateAmount', index, value)
      },
      {
        title: '个人金额',
        dataIndex: 'personalAmount',
        width: 150,
        render: (value, _row, index) => renderInput('personalAmount', index, value)
      }
    )
  }

  return (
    <Table<EditableProject>
      rowKey={(row, index) => String(row.schemeProjectId ?? index)}
      size="small"
      bordered
      pagination={false}
      dataSource={projects}
      columns={columns}
    />
  )
}

/** 构建参保项目修改参数：比例方案提交基数，金额方案提交公司 / 个人金额 */
export const buildProjectUpdateList = (
  projects: EditableProject[],
  schemeType?: number
): API.HrmInsuranceMonthEmployeeProjectUpdateReqVO[] =>
  projects.map((project) => ({
    schemeProjectId: project.schemeProjectId as number,
    ...(schemeType === HrmInsuranceSchemeType.PROPORTION
      ? { baseAmount: project.baseAmount }
      : {
          corporateAmount: project.corporateAmount,
          personalAmount: project.personalAmount
        })
  }))

export default ProjectUpdateTable
