import React, { useEffect, useState } from 'react'
import { Button, Form, Modal, Space, Switch, Upload, message } from 'antd'
import type { UploadFile } from 'antd'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import {
  computeMonthRecordWithImport,
  getAdditionalDeductionImportTemplate,
  getAttendanceImportTemplate,
  getCumulativeTaxImportTemplate,
  getPayrollReadiness
} from '@/api/hrm/salary/monthRecord'
import { textConst } from '@/locales/zh-CN'

interface SalaryMonthComputeFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  record?: API.HrmSalaryMonthRecordRespVO
  onSuccess: () => void
}

const SalaryMonthComputeForm: React.FC<SalaryMonthComputeFormProps> = ({
  visible,
  setVisible,
  record,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false)
  const [payrollEmployeeCount, setPayrollEmployeeCount] = useState(0)

  // 配置项
  const [syncInsuranceData, setSyncInsuranceData] = useState(true)
  const [syncAttendanceData, setSyncAttendanceData] = useState(false)

  // 导入文件
  const [attendanceFileList, setAttendanceFileList] = useState<UploadFile[]>([])
  const [taxFileList, setTaxFileList] = useState<UploadFile[]>([])
  const [deductionFileList, setDeductionFileList] = useState<UploadFile[]>([])

  useEffect(() => {
    if (!visible || !record?.id) {
      setAttendanceFileList([])
      setTaxFileList([])
      setDeductionFileList([])
      setSyncInsuranceData(true)
      setSyncAttendanceData(false)
      return
    }

    setPayrollEmployeeCount(record.employeeCount || 0)
    getPayrollReadiness({ monthRecordId: record.id }).then((resp) => {
      setPayrollEmployeeCount(resp.data?.payrollEmployeeCount || 0)
    })
  }, [visible, record])

  // 下载模板
  const handleDownloadTemplate = async (
    type: 'attendance' | 'cumulativeTax' | 'additionalDeduction'
  ) => {
    if (!record?.id) return
    try {
      let resp: any
      let fileName = ''
      if (type === 'attendance') {
        resp = await getAttendanceImportTemplate({ monthRecordId: record.id })
        fileName = '月度工资考勤导入模板.xls'
      } else if (type === 'cumulativeTax') {
        resp = await getCumulativeTaxImportTemplate({ monthRecordId: record.id })
        fileName = '月度工资上月个税累计导入模板.xls'
      } else {
        resp = await getAdditionalDeductionImportTemplate({
          monthRecordId: record.id
        })
        fileName = '月度工资专项附加扣除导入模板.xls'
      }

      const blob = new Blob([resp], {
        type: 'application/vnd.ms-excel'
      })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      link.click()
    } catch {
      message.error(textConst.msg.importTemplateError)
    }
  }

  const handleSubmit = async () => {
    if (!record?.id) return
    setLoading(true)
    try {
      const attendanceRaw = (attendanceFileList[0]?.originFileObj || attendanceFileList[0]) as
        | File
        | undefined
      const taxRaw = (taxFileList[0]?.originFileObj || taxFileList[0]) as File | undefined
      const deductionRaw = (deductionFileList[0]?.originFileObj || deductionFileList[0]) as
        | File
        | undefined

      await computeMonthRecordWithImport(
        {
          id: record.id,
          syncInsuranceData: String(syncInsuranceData) as any,
          syncAttendanceData: String(syncAttendanceData) as any
        },
        {},
        attendanceRaw,
        deductionRaw,
        taxRaw
      )

      message.success('核算成功')
      setVisible(false)
      onSuccess()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="核算工资表"
      open={visible}
      onOk={handleSubmit}
      onCancel={() => setVisible(false)}
      confirmLoading={loading}
      width={760}
      destroyOnClose
    >
      <Form layout="horizontal" labelCol={{ span: 5 }}>
        <Form.Item label="工资表">
          <span style={{ fontWeight: 500 }}>{record?.title || '-'}</span>
        </Form.Item>

        <Form.Item label="计薪人员">
          <span>{payrollEmployeeCount} 人</span>
        </Form.Item>

        <Form.Item label="社保数据">
          <Switch
            checked={syncInsuranceData}
            checkedChildren="从社保表同步"
            unCheckedChildren="本次不带入"
            onChange={setSyncInsuranceData}
          />
        </Form.Item>

        <Form.Item label="同步考勤">
          <Switch
            checked={syncAttendanceData}
            checkedChildren="从考勤统计同步"
            unCheckedChildren="使用导入文件"
            onChange={(checked) => {
              setSyncAttendanceData(checked)
              if (checked) {
                setAttendanceFileList([])
              }
            }}
          />
        </Form.Item>

        <Form.Item label="考勤数据">
          <Space align="start">
            <Upload
              beforeUpload={() => false}
              fileList={attendanceFileList}
              onChange={({ fileList }) => setAttendanceFileList(fileList.slice(-1))}
              disabled={syncAttendanceData}
              accept=".xls,.xlsx"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />} disabled={syncAttendanceData}>
                选择文件
              </Button>
            </Upload>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleDownloadTemplate('attendance')}
            >
              下载模板
            </Button>
          </Space>
        </Form.Item>

        <Form.Item label="上月个税累计">
          <Space align="start">
            <Upload
              beforeUpload={() => false}
              fileList={taxFileList}
              onChange={({ fileList }) => setTaxFileList(fileList.slice(-1))}
              accept=".xls,.xlsx"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleDownloadTemplate('cumulativeTax')}
            >
              下载模板
            </Button>
          </Space>
        </Form.Item>

        <Form.Item label="专项附加扣除">
          <Space align="start">
            <Upload
              beforeUpload={() => false}
              fileList={deductionFileList}
              onChange={({ fileList }) => setDeductionFileList(fileList.slice(-1))}
              accept=".xls,.xlsx"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleDownloadTemplate('additionalDeduction')}
            >
              下载模板
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default SalaryMonthComputeForm
