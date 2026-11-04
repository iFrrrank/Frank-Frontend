import React from 'react'
import { demoteEmployee } from '@/api/hrm/employee'
import { HrmEmployeeChangeTypeEnum } from '@/utils/constants'
import EmployeePositionChangeForm from './EmployeePositionChangeForm'

interface EmployeeDemoteFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  employee?: API.HrmEmployeeRespVO
}

// 办理员工降级（岗位异动表单的降级壳组件）
const EmployeeDemoteForm: React.FC<EmployeeDemoteFormProps> = (props) => (
  <EmployeePositionChangeForm
    {...props}
    title="办理降级"
    changeType={HrmEmployeeChangeTypeEnum.DEMOTION.type}
    submitRequest={demoteEmployee}
  />
)

export default EmployeeDemoteForm
