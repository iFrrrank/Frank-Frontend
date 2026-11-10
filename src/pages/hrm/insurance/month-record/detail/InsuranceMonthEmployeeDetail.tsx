import React, { useEffect, useMemo, useState } from 'react'
import { Button, Descriptions, Drawer, Spin, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EditOutlined } from '@ant-design/icons'
import { getMonthEmployeeRecord } from '@/api/hrm/insurance/monthEmployeeRecord'
import { EMPLOYEE_STATUS, SEX_OPTIONS } from '@/utils/constantsValue'
import { HRM_INSURANCE_EMP_STATUS_LABELS, HrmInsuranceEmployeeStatus, HrmInsuranceSchemeType } from '../../constants'
import {
  formatHrmDate,
  formatHrmInsuranceProjectName,
  formatHrmMoney,
  formatHrmRate
} from '../../utils'

interface InsuranceMonthEmployeeDetailProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  /** 员工月度社保记录 Id */
  id?: number
  /** 社保表未归档时才允许编辑 */
  editable?: boolean
  onEdit: (detail: API.HrmInsuranceMonthEmployeeRecordRespVO) => void
}

type DetailProject = API.HrmInsuranceMonthEmployeeProjectRespVO & { totalAmount: number }

const EMPTY = '--'

/** 员工月度社保详情抽屉 */
const InsuranceMonthEmployeeDetail: React.FC<InsuranceMonthEmployeeDetailProps> = ({
  visible,
  setVisible,
  id,
  editable,
  onEdit
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [detail, setDetail] = useState<API.HrmInsuranceMonthEmployeeRecordRespVO | undefined>()

  useEffect(() => {
    if (!visible || !id) {
      return
    }
    setDetail(undefined)
    setLoading(true)
    getMonthEmployeeRecord({ id })
      .then((resp) => setDetail(resp.data))
      .finally(() => setLoading(false))
  }, [visible, id])

  const projects = useMemo<DetailProject[]>(() => {
    if (!detail) return []
    return [...(detail.socialSecurityProjectList || []), ...(detail.providentFundProjectList || [])].map(
      (project) => ({
        ...project,
        totalAmount: Number(project.personalAmount || 0) + Number(project.corporateAmount || 0)
      })
    )
  }, [detail])

  const isProportion = detail?.schemeType === HrmInsuranceSchemeType.PROPORTION

  const columns: ColumnsType<DetailProject> = [
    {
      title: '缴纳项目',
      width: 130,
      render: (_, row) => formatHrmInsuranceProjectName(row)
    },
    {
      title: '缴纳基数',
      dataIndex: 'baseAmount',
      align: 'right',
      width: 100,
      render: (value) => formatHrmMoney(value)
    }
  ]
  if (isProportion) {
    columns.push(
      {
        title: '企业比例',
        dataIndex: 'corporateRate',
        align: 'right',
        width: 90,
        render: (value) => formatHrmRate(value)
      },
      {
        title: '个人比例',
        dataIndex: 'personalRate',
        align: 'right',
        width: 90,
        render: (value) => formatHrmRate(value)
      }
    )
  }
  columns.push(
    {
      title: '个人缴纳',
      dataIndex: 'personalAmount',
      align: 'right',
      width: 100,
      render: (value) => formatHrmMoney(value)
    },
    {
      title: '企业缴纳',
      dataIndex: 'corporateAmount',
      align: 'right',
      width: 100,
      render: (value) => formatHrmMoney(value)
    },
    {
      title: '合计缴费',
      dataIndex: 'totalAmount',
      align: 'right',
      width: 100,
      render: (value) => formatHrmMoney(value)
    }
  )

  /** 合计行：基数与比例列不汇总，仅汇总三个金额列 */
  const renderSummary = (data: readonly DetailProject[]) => {
    const sum = (field: 'personalAmount' | 'corporateAmount' | 'totalAmount') =>
      formatHrmMoney(data.reduce((total, project) => total + Number(project[field] || 0), 0))
    const blankCount = isProportion ? 3 : 1
    return (
      <Table.Summary.Row>
        <Table.Summary.Cell index={0}>缴费总价</Table.Summary.Cell>
        {Array.from({ length: blankCount }).map((_, index) => (
          <Table.Summary.Cell key={index} index={index + 1} />
        ))}
        <Table.Summary.Cell index={blankCount + 1} align="right">
          {sum('personalAmount')}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={blankCount + 2} align="right">
          {sum('corporateAmount')}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={blankCount + 3} align="right">
          {sum('totalAmount')}
        </Table.Summary.Cell>
      </Table.Summary.Row>
    )
  }

  const sexLabel = SEX_OPTIONS.find((item) => item.value === detail?.sex)?.label

  return (
    <Drawer
      title="员工月度社保详情"
      open={visible}
      width={980}
      destroyOnHidden
      onClose={() => setVisible(false)}
    >
      <Spin spinning={loading}>
        <div style={{ minHeight: 320 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 16,
              marginBottom: 18
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20, fontWeight: 600 }}>{detail?.employeeName || EMPTY}</span>
                {detail?.status !== undefined && (
                  <Tag
                    color={detail.status === HrmInsuranceEmployeeStatus.NORMAL ? 'success' : 'default'}
                  >
                    {HRM_INSURANCE_EMP_STATUS_LABELS[detail.status]}
                  </Tag>
                )}
              </div>
              <div style={{ marginTop: 6, fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>
                {detail?.postName || EMPTY} · {detail?.year || EMPTY} 年 {detail?.month || EMPTY} 月
              </div>
            </div>
            {editable && detail && (
              <Button type="primary" ghost icon={<EditOutlined />} onClick={() => onEdit(detail)}>
                编辑
              </Button>
            )}
          </div>

          <Descriptions column={3} bordered size="small" style={{ marginBottom: 20 }}>
            <Descriptions.Item label="性别">{sexLabel || EMPTY}</Descriptions.Item>
            <Descriptions.Item label="年龄">{detail?.age ?? EMPTY}</Descriptions.Item>
            <Descriptions.Item label="工号">{detail?.jobNumber || EMPTY}</Descriptions.Item>
            <Descriptions.Item label="部门">{detail?.deptName || EMPTY}</Descriptions.Item>
            <Descriptions.Item label="员工状态">
              {detail?.employeeStatus != null
                ? EMPLOYEE_STATUS[detail.employeeStatus]?.text || EMPTY
                : EMPTY}
            </Descriptions.Item>
            <Descriptions.Item label="入职日期">{formatHrmDate(detail?.entryTime)}</Descriptions.Item>
            <Descriptions.Item label="参保城市">{detail?.areaName || EMPTY}</Descriptions.Item>
            <Descriptions.Item label="身份证号">{detail?.idNumber || EMPTY}</Descriptions.Item>
            <Descriptions.Item label="个人社保号">
              {detail?.socialSecurityNumber || EMPTY}
            </Descriptions.Item>
            <Descriptions.Item label="个人公积金号">
              {detail?.accumulationFundNumber || EMPTY}
            </Descriptions.Item>
            <Descriptions.Item label="参保方案">{detail?.schemeName || EMPTY}</Descriptions.Item>
          </Descriptions>

          <div style={{ marginBottom: 10, fontSize: 15, fontWeight: 600 }}>缴费项目</div>
          <Table<DetailProject>
            rowKey={(row, index) => `${row.type}-${row.schemeProjectId ?? index}`}
            size="small"
            bordered
            pagination={false}
            dataSource={projects}
            columns={columns}
            summary={renderSummary}
          />
        </div>
      </Spin>
    </Drawer>
  )
}

export default InsuranceMonthEmployeeDetail
