import React, { useEffect, useState } from 'react'
import { Button, Card, Descriptions, Empty, message, Table } from 'antd'
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components'
import { getSalaryEmployeeInfo } from '@/api/hrm/salary/employeeInfo'
import { getSalaryChangeRecordList } from '@/api/hrm/salary/changeRecord'
import { getMonthEmployeeRecordPage } from '@/api/hrm/salary/monthEmployeeRecord'
import {
  getEmployeeSalaryCard,
  saveEmployeeSalaryCard
} from '@/api/hrm/salary/salaryCard'
import AreaSelect from '../../insurance/components/AreaSelect'
import { formatHrmMoney } from '@/pages/hrm/utils/format'
import { textConst } from '@/locales/zh-CN'
import dayjs from 'dayjs'

interface EmployeeSalaryInfoProps {
  employeeId: number
}

const fmtDate = (value?: string | number) =>
  value ? dayjs(value as any).format('YYYY-MM-DD') : '-'

// 薪资项小计
const sumOptions = (options?: API.HrmSalaryOptionValueVO[]) =>
  (options || []).reduce((sum, item) => sum + (Number(item.value) || 0), 0)

// 工资社保页签中的薪资部分：薪资档案 + 工资卡 + 定薪/调薪记录 + 历史工资
const EmployeeSalaryInfo: React.FC<EmployeeSalaryInfoProps> = ({ employeeId }) => {
  const [salaryInfo, setSalaryInfo] = useState<API.HrmSalaryEmployeeInfoRespVO>()
  const [card, setCard] = useState<API.HrmEmployeeSalaryCardRespVO>()
  const [changeRecords, setChangeRecords] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [cardFormVisible, setCardFormVisible] = useState(false)

  const load = async () => {
    const [infoResp, cardResp, changeResp, historyResp] = await Promise.all([
      getSalaryEmployeeInfo({ employeeId } as any),
      getEmployeeSalaryCard({ employeeId } as any),
      getSalaryChangeRecordList({ employeeId } as any),
      getMonthEmployeeRecordPage({ pageNo: 1, pageSize: 12, employeeId } as any)
    ])
    if (infoResp.code === 0) setSalaryInfo(infoResp.data)
    if (cardResp.code === 0) setCard(cardResp.data)
    if (changeResp.code === 0) setChangeRecords(changeResp.data || [])
    if (historyResp.code === 0) setHistory(historyResp.data?.list || [])
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId])

  const optionColumns = [
    { title: '工资项', dataIndex: 'name' },
    {
      title: '金额',
      dataIndex: 'value',
      align: 'right' as const,
      render: (v: any) => formatHrmMoney(v)
    }
  ]

  return (
    <>
      <Card
        title="薪资档案"
        style={{ marginBottom: 16 }}
        extra={
          salaryInfo ? (
            <span>
              {salaryInfo.changeType === 1 ? '定薪' : '调薪'} · 生效于{' '}
              {fmtDate(salaryInfo.effectTime)}
            </span>
          ) : undefined
        }
      >
        {salaryInfo ? (
          <>
            <Descriptions column={3} style={{ marginBottom: 12 }}>
              <Descriptions.Item label="试用期薪资合计">
                {formatHrmMoney(
                  salaryInfo.probationSalary ?? sumOptions(salaryInfo.probationSalaryOptions)
                )}
              </Descriptions.Item>
              <Descriptions.Item label="转正后薪资合计">
                {formatHrmMoney(salaryInfo.regularSalary ?? sumOptions(salaryInfo.salaryOptions))}
              </Descriptions.Item>
              <Descriptions.Item label="变更原因">
                {salaryInfo.changeReason || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="备注">{salaryInfo.remark || '-'}</Descriptions.Item>
            </Descriptions>
            <Table
              rowKey={(r) => String(r.code)}
              size="small"
              pagination={false}
              columns={optionColumns}
              dataSource={salaryInfo.salaryOptions || []}
            />
          </>
        ) : (
          <Empty description="该员工尚未定薪" />
        )}
      </Card>

      <Card
        title="工资卡"
        style={{ marginBottom: 16 }}
        extra={
          <Button type="link" onClick={() => setCardFormVisible(true)}>
            {card ? '编辑' : '添加'}
          </Button>
        }
      >
        {card ? (
          <Descriptions column={3}>
            <Descriptions.Item label="银行卡号">{card.bankCardNumber || '-'}</Descriptions.Item>
            <Descriptions.Item label="开户行">{card.bankName || '-'}</Descriptions.Item>
            <Descriptions.Item label="开户支行">{card.bankBranchName || '-'}</Descriptions.Item>
            <Descriptions.Item label="开户地区">{card.bankAreaName || '-'}</Descriptions.Item>
          </Descriptions>
        ) : (
          <Empty description="暂无工资卡信息" />
        )}
      </Card>

      <Card title="定薪/调薪记录" style={{ marginBottom: 16 }}>
        <Table
          rowKey="id"
          size="small"
          pagination={false}
          dataSource={changeRecords}
          columns={[
            { title: '记录类型', dataIndex: 'recordTypeName', width: 100 },
            { title: '变更原因', dataIndex: 'changeReason', width: 140 },
            {
              title: '生效日期',
              dataIndex: 'effectTime',
              width: 110,
              render: (v) => fmtDate(v)
            },
            {
              title: '变更前合计',
              dataIndex: 'beforeTotal',
              align: 'right',
              render: (v) => formatHrmMoney(v)
            },
            {
              title: '变更后合计',
              dataIndex: 'afterTotal',
              align: 'right',
              render: (v) => formatHrmMoney(v)
            },
            { title: '备注', dataIndex: 'remark', ellipsis: true }
          ]}
        />
      </Card>

      <Card title="历史工资">
        <Table
          rowKey="id"
          size="small"
          pagination={false}
          dataSource={history}
          columns={[
            {
              title: '工资月份',
              width: 110,
              render: (_, r) => `${r.year}-${String(r.month).padStart(2, '0')}`
            },
            {
              title: '应发工资',
              dataIndex: 'expectedPaySalary',
              align: 'right',
              render: (v) => formatHrmMoney(v)
            },
            {
              title: '应税工资',
              dataIndex: 'taxableSalary',
              align: 'right',
              render: (v) => formatHrmMoney(v)
            },
            {
              title: '个人所得税',
              dataIndex: 'personalTax',
              align: 'right',
              render: (v) => formatHrmMoney(v)
            },
            {
              title: '实发工资',
              dataIndex: 'realPaySalary',
              align: 'right',
              render: (v) => formatHrmMoney(v)
            }
          ]}
        />
      </Card>

      <ModalForm
        title="工资卡信息"
        open={cardFormVisible}
        onOpenChange={setCardFormVisible}
        width={520}
        modalProps={{ destroyOnHidden: true }}
        initialValues={card}
        onFinish={async (values) => {
          try {
            await saveEmployeeSalaryCard({ ...values, employeeId, id: card?.id } as any)
            message.success(textConst.msg.updateSuccess)
            load()
            return true
          } catch {
            message.error(textConst.error.operationFail)
            return false
          }
        }}
      >
        <ProFormText
          name="bankCardNumber"
          label="银行卡号"
          rules={[{ required: true, message: '请输入银行卡号' }]}
        />
        <ProFormText name="bankName" label="开户行" />
        <ProFormText name="bankBranchName" label="开户支行" />
        {/* 开户地区：复用社保模块的地区树选择组件 */}
        <ProForm.Item name="bankAreaId" label="开户地区">
          <AreaSelect />
        </ProForm.Item>
      </ModalForm>
    </>
  )
}

export default EmployeeSalaryInfo
