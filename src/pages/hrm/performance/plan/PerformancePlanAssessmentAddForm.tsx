import React, { useEffect, useState } from 'react'
import { message, Modal, Transfer } from 'antd'
import {
  addPerformancePlanEmployees,
  getPerformancePlanUnassignedEmployeeIdList
} from '@/api/hrm/performance/assessment'
import { getEmployeeList } from '@/api/hrm/employee/index'
import { textConst } from '@/locales/zh-CN'

interface PerformancePlanAssessmentAddFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  planId: number
}

// 向绩效计划追加参评员工：仅可选择尚未分配到本计划的员工
const PerformancePlanAssessmentAddForm: React.FC<PerformancePlanAssessmentAddFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  planId
}) => {
  const [candidates, setCandidates] = useState<{ key: string; title: string }[]>([])
  const [targetKeys, setTargetKeys] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!visible) return
    setTargetKeys([])
    setLoading(true)
    Promise.all([
      getPerformancePlanUnassignedEmployeeIdList({ planId } as any),
      getEmployeeList()
    ])
      .then(([idsResp, employeesResp]) => {
        const ids = (idsResp.data || []) as number[]
        const employees = (employeesResp as any).data || []
        const nameMap = new Map<number, string>(
          employees.map((e: any) => [e.id, `${e.name}（${e.jobNumber || '-'}）`])
        )
        setCandidates(
          ids.map((id) => ({ key: String(id), title: nameMap.get(id) || `员工 ${id}` }))
        )
      })
      .finally(() => setLoading(false))
  }, [visible, planId])

  const handleOk = async () => {
    if (targetKeys.length === 0) {
      message.warning('请选择要添加的员工')
      return
    }
    setSaving(true)
    try {
      await addPerformancePlanEmployees({
        planId,
        employeeIds: targetKeys.map(Number)
      } as any)
      message.success(textConst.msg.createSuccess)
      setVisible(false)
      onSuccess()
    } catch {
      message.error(textConst.error.operationFail)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      title="添加参评员工"
      open={visible}
      onCancel={() => setVisible(false)}
      onOk={handleOk}
      confirmLoading={saving}
      width={640}
      destroyOnHidden
    >
      <Transfer
        dataSource={candidates}
        targetKeys={targetKeys}
        onChange={(keys) => setTargetKeys(keys as string[])}
        render={(item) => item.title}
        titles={['可添加员工', '已选择']}
        showSearch
        listStyle={{ width: 280, height: 320 }}
        disabled={loading}
      />
    </Modal>
  )
}

export default PerformancePlanAssessmentAddForm
