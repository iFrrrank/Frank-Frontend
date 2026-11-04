import React from 'react'
import { promoteEmployee } from '@/api/hrm/employee'
import { HrmEmployeeChangeTypeEnum } from '@/utils/constants'
import EmployeePositionChangeForm from './EmployeePositionChangeForm'

interface EmployeePromoteFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  employee?: API.HrmEmployeeRespVO
}

// 办理员工晋升（岗位异动表单的晋升壳组件）
const EmployeePromoteForm: React.FC<EmployeePromoteFormProps> = (props) => (
  <EmployeePositionChangeForm
    {...props}
    title="办理晋升"
    changeType={HrmEmployeeChangeTypeEnum.PROMOTION.type}
    submitRequest={promoteEmployee}
  />
)

export default EmployeePromoteForm
