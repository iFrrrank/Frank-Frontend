import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'
import { Alert, Button, Modal, Space } from 'antd'
import { getPayrollReadiness } from '@/api/hrm/salary/monthRecord'
import SalaryPayrollReadinessEmployeeList from './SalaryPayrollReadinessEmployeeList'

export interface SalaryPayrollReadinessAlertRef {
  refresh: () => Promise<void>
}

interface SalaryPayrollReadinessAlertProps {
  monthRecordId?: number
}

const SalaryPayrollReadinessAlert = forwardRef<
  SalaryPayrollReadinessAlertRef,
  SalaryPayrollReadinessAlertProps
>(({ monthRecordId }, ref) => {
  const [readiness, setReadiness] = useState<API.HrmSalaryPayrollReadinessRespVO>()
  const [noSalaryGroupDialogVisible, setNoSalaryGroupDialogVisible] = useState(false)
  const [noSalaryDialogVisible, setNoSalaryDialogVisible] = useState(false)

  const refresh = useCallback(async () => {
    if (!monthRecordId) {
      setReadiness(undefined)
      return
    }
    try {
      const resp = await getPayrollReadiness({ monthRecordId })
      setReadiness(resp.data)
    } catch {
      setReadiness(undefined)
    }
  }, [monthRecordId])

  useImperativeHandle(ref, () => ({
    refresh
  }))

  useEffect(() => {
    refresh()
  }, [refresh])

  if (!readiness) return null

  const hasNoGroup = (readiness.noSalaryGroupEmployeeCount || 0) > 0
  const hasNoSalary = (readiness.noSalaryEmployeeCount || 0) > 0

  if (!hasNoGroup && !hasNoSalary) return null

  return (
    <Space direction="vertical" style={{ width: '100%', marginTop: 12 }}>
      {hasNoGroup && (
        <Alert
          type="warning"
          showIcon
          message={
            <span>
              有 {readiness.noSalaryGroupEmployeeCount} 名员工未加入任何薪资组，无法参与工资核算。
              <Button type="link" size="small" onClick={() => setNoSalaryGroupDialogVisible(true)}>
                查看员工
              </Button>
            </span>
          }
        />
      )}

      {hasNoSalary && (
        <Alert
          type="warning"
          showIcon
          message={
            <span>
              有 {readiness.noSalaryEmployeeCount}{' '}
              名员工没有生效薪资档案，将优先继承上月工资；无上月工资时按 0 核算。
              <Button type="link" size="small" onClick={() => setNoSalaryDialogVisible(true)}>
                查看员工
              </Button>
            </span>
          }
        />
      )}

      {/* 未加入薪资组员工弹窗 */}
      <Modal
        title="未加入薪资组的员工"
        open={noSalaryGroupDialogVisible}
        onCancel={() => setNoSalaryGroupDialogVisible(false)}
        footer={null}
        width={860}
        destroyOnClose
      >
        <SalaryPayrollReadinessEmployeeList list={readiness.noSalaryGroupEmployees} />
      </Modal>

      {/* 未设置薪资档案员工弹窗 */}
      <Modal
        title="未设置薪资档案的员工"
        open={noSalaryDialogVisible}
        onCancel={() => setNoSalaryDialogVisible(false)}
        footer={null}
        width={860}
        destroyOnClose
      >
        <SalaryPayrollReadinessEmployeeList list={readiness.noSalaryEmployees} />
      </Modal>
    </Space>
  )
})

export default SalaryPayrollReadinessAlert
