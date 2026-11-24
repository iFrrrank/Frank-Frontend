import React, { useEffect, useState } from 'react'
import { Button, Card, Descriptions, Empty, message } from 'antd'
import {
  ModalForm,
  ProForm,
  ProFormDatePicker,
  ProFormSwitch,
  ProFormText
} from '@ant-design/pro-components'
import {
  getInsuranceEmployeeInfo,
  saveInsuranceEmployeeInfo
} from '@/api/hrm/insurance/employeeInfo'
import InsuranceSchemeSelect from '../../insurance/scheme/components/InsuranceSchemeSelect'
import { textConst } from '@/locales/zh-CN'
import dayjs from 'dayjs'

interface EmployeeInsuranceInfoProps {
  employeeId: number
}

// 起缴月份（yyyyMM 数字）展示为 yyyy-MM
const fmtMonth = (value?: number) => {
  if (!value) return '-'
  const text = String(value)
  return text.length === 6 ? `${text.slice(0, 4)}-${text.slice(4)}` : text
}

// 员工参保信息：社保/公积金账号、起缴月份与参保方案，可编辑保存
const EmployeeInsuranceInfo: React.FC<EmployeeInsuranceInfoProps> = ({ employeeId }) => {
  const [info, setInfo] = useState<API.HrmInsuranceEmployeeInfoRespVO>()
  const [formVisible, setFormVisible] = useState(false)

  const load = async () => {
    const resp = await getInsuranceEmployeeInfo({ employeeId })
    if (resp.code === 0) {
      setInfo(resp.data)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId])

  return (
    <Card
      title="参保信息"
      extra={
        <Button type="link" onClick={() => setFormVisible(true)}>
          {info ? '编辑' : '添加'}
        </Button>
      }
    >
      {info ? (
        <Descriptions column={3}>
          <Descriptions.Item label="参保方案">{info.schemeName || '-'}</Descriptions.Item>
          <Descriptions.Item label="社保账号">
            {info.socialSecurityNumber || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="公积金账号">
            {info.accumulationFundNumber || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="社保起缴月份">
            {fmtMonth(info.socialSecurityStartMonth)}
          </Descriptions.Item>
          <Descriptions.Item label="本地首次缴纳社保">
            {info.firstSocialSecurity ? '是' : '否'}
          </Descriptions.Item>
          <Descriptions.Item label="本地首次缴纳公积金">
            {info.firstAccumulationFund ? '是' : '否'}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <Empty description="暂无参保信息" />
      )}

      <ModalForm
        title="参保信息"
        open={formVisible}
        onOpenChange={setFormVisible}
        width={520}
        modalProps={{ destroyOnHidden: true }}
        initialValues={
          info
            ? {
                ...info,
                startMonthDate: info.socialSecurityStartMonth
                  ? dayjs(fmtMonth(info.socialSecurityStartMonth))
                  : undefined
              }
            : undefined
        }
        onFinish={async (values) => {
          try {
            await saveInsuranceEmployeeInfo({
              id: info?.id,
              employeeId,
              schemeId: values.schemeId,
              socialSecurityNumber: values.socialSecurityNumber,
              accumulationFundNumber: values.accumulationFundNumber,
              firstSocialSecurity: values.firstSocialSecurity,
              firstAccumulationFund: values.firstAccumulationFund,
              // 起缴月份按 yyyyMM 数字提交
              socialSecurityStartMonth: values.startMonthDate
                ? Number(dayjs(values.startMonthDate).format('YYYYMM'))
                : undefined
            })
            message.success(textConst.msg.updateSuccess)
            load()
            return true
          } catch {
            message.error(textConst.error.operationFail)
            return false
          }
        }}
      >
        <ProForm.Item name="schemeId" label="参保方案">
          <InsuranceSchemeSelect />
        </ProForm.Item>
        <ProFormText name="socialSecurityNumber" label="社保账号" />
        <ProFormText name="accumulationFundNumber" label="公积金账号" />
        <ProFormDatePicker
          name="startMonthDate"
          label="社保起缴月份"
          fieldProps={{ picker: 'month', style: { width: '100%' } }}
        />
        <ProFormSwitch name="firstSocialSecurity" label="本地首次缴纳社保" />
        <ProFormSwitch name="firstAccumulationFund" label="本地首次缴纳公积金" />
      </ModalForm>
    </Card>
  )
}

export default EmployeeInsuranceInfo
