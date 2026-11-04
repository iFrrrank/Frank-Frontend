import React from 'react'
import { transferEmployee } from '@/api/hrm/employee'
import { HrmEmployeeChangeTypeEnum } from '@/utils/constants'
import EmployeePositionChangeForm from './EmployeePositionChangeForm'

interface EmployeeTransferFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  employee?: API.HrmEmployeeRespVO
}

// 办理员工调岗（岗位异动表单的调岗壳组件）
const EmployeeTransferForm: React.FC<EmployeeTransferFormProps> = (props) => (
  <EmployeePositionChangeForm
    {...props}
    title="办理调岗"
    changeType={HrmEmployeeChangeTypeEnum.TRANSFER.type}
    submitRequest={transferEmployee}
  />
)

export default EmployeeTransferForm
