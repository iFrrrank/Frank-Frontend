import React from 'react'
import { Card } from 'antd'
import { history } from '@umijs/max'
import { useHasPermi } from '@/directives/permission/HasPermi'
import type { HrmHrHomeTodoSurveyVO } from '../api'
import {
  HRM_HOME_PERMISSIONS,
  HRM_HOME_ROUTES,
  HrmEmployeeStatusTab,
  HrmEmployeeTodoType
} from '../constants'
import SurveyStat from './SurveyStat'

type TodoAction = 'salary' | 'leave' | 'contract' | 'regular' | 'entry' | 'birthday'

interface Props {
  survey?: HrmHrHomeTodoSurveyVO
}

// 各员工类待办对应的员工列表筛选条件
const EMPLOYEE_FILTERS: Record<
  Exclude<TodoAction, 'salary'>,
  { todoType: number; statusCategory: number }
> = {
  leave: {
    todoType: HrmEmployeeTodoType.PENDING_LEAVE,
    statusCategory: HrmEmployeeStatusTab.PENDING_LEAVE
  },
  contract: {
    todoType: HrmEmployeeTodoType.CONTRACT_EXPIRE,
    statusCategory: HrmEmployeeStatusTab.ACTIVE
  },
  regular: { todoType: HrmEmployeeTodoType.REGULAR, statusCategory: HrmEmployeeStatusTab.ACTIVE },
  entry: {
    todoType: HrmEmployeeTodoType.PENDING_ENTRY,
    statusCategory: HrmEmployeeStatusTab.PENDING_ENTRY
  },
  birthday: { todoType: HrmEmployeeTodoType.BIRTHDAY, statusCategory: HrmEmployeeStatusTab.ACTIVE }
}

const HrmHomeTodoSurvey: React.FC<Props> = ({ survey }) => {
  const hasPermi = useHasPermi()
  const canQueryEmployee = hasPermi(HRM_HOME_PERMISSIONS.EMPLOYEE_QUERY)
  const canQuerySalary = hasPermi(HRM_HOME_PERMISSIONS.SALARY_MONTH_RECORD_QUERY)

  const todoItems: {
    label: string
    value: number
    unit: string
    action: TodoAction
    disabled: boolean
  }[] = [
    {
      label: '待核算薪资',
      value: survey?.toSalaryComputeCount || 0,
      unit: '条',
      action: 'salary',
      disabled: !canQuerySalary || !survey?.toSalaryComputeCount
    },
    {
      label: '待离职',
      value: survey?.toLeaveCount || 0,
      unit: '人',
      action: 'leave',
      disabled: !canQueryEmployee
    },
    {
      label: '合同到期',
      value: survey?.toExpireContractCount || 0,
      unit: '人',
      action: 'contract',
      disabled: !canQueryEmployee
    },
    {
      label: '待转正',
      value: survey?.toRegularCount || 0,
      unit: '人',
      action: 'regular',
      disabled: !canQueryEmployee
    },
    {
      label: '待入职',
      value: survey?.toEntryCount || 0,
      unit: '人',
      action: 'entry',
      disabled: !canQueryEmployee
    },
    {
      label: '生日',
      value: survey?.toBirthdayCount || 0,
      unit: '人',
      action: 'birthday',
      disabled: !canQueryEmployee
    }
  ]

  /** 打开待办对应的业务列表 */
  const goTodo = (action: TodoAction) => {
    if (action === 'salary') {
      if (canQuerySalary) history.push(HRM_HOME_ROUTES.SALARY_MONTH_RECORD)
      return
    }
    if (!canQueryEmployee) return
    const filter = EMPLOYEE_FILTERS[action]
    history.push({
      pathname: HRM_HOME_ROUTES.EMPLOYEE,
      search: `?todoType=${filter.todoType}&statusCategory=${filter.statusCategory}`
    })
  }

  return (
    <Card title="待办提醒" style={{ marginBottom: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', rowGap: 20 }}>
        {todoItems.map((todo) => (
          <SurveyStat
            key={todo.label}
            label={todo.label}
            value={todo.value}
            unit={todo.unit}
            disabled={todo.disabled}
            minHeight={78}
            valueFontSize={22}
            onClick={() => goTodo(todo.action)}
          />
        ))}
      </div>
    </Card>
  )
}

export default HrmHomeTodoSurvey
