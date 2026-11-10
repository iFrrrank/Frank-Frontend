import { request } from '@umijs/max'
import type { CommonResult } from './types'

// HRM 员工端员工档案 VO
export interface HrmPortalEmployeeVO {
  id: number
  name?: string
  avatar?: string
  jobNumber?: string
  mobile?: string
  country?: string
  nation?: string
  idType?: number
  idNumber?: string
  sex?: number
  email?: string
  nativePlace?: string
  birthday?: number
  age?: number
  address?: string
  highestEducation?: number
  deptId?: number
  deptName?: string
  leaderEmployeeId?: number
  leaderEmployeeName?: string
  entryStatus?: number
  status?: number
  type?: number
  entryTime?: string | Date
  entryDay?: number
  probation?: number
  regularTime?: string | Date
  leaveTime?: string | Date
  postName?: string
  postLevel?: string
  workCity?: string
  workAddress?: string
  workDetailAddress?: string
  companyAgeStartTime?: string | Date
  companyAge?: number
}

// HRM 员工端员工档案更新 Request VO
export interface HrmPortalEmployeeUpdateReqVO {
  name?: string
  mobile?: string
  country?: string
  nation?: string
  idType?: number
  idNumber?: string
  sex?: number
  email?: string
  nativePlace?: string
  birthday?: number
  address?: string
  highestEducation?: number
}

export interface HrmEmployeeFieldConfigVO {
  name: string
  title?: string
  groupName?: string
  visible?: boolean
  editable?: boolean
  visibleLocked?: boolean
  editableLocked?: boolean
}

export interface HrmEmployeeContactVO {
  id?: number
  employeeId?: number
  name?: string
  relation?: string
  phone?: string
  mobile?: string
  workUnit?: string
  address?: string
  isEmergencyContact?: boolean
}

export interface HrmEmployeeEducationExperienceVO {
  id?: number
  employeeId?: number
  education?: number
  graduateSchool?: string
  major?: string
  admissionTime?: string | number
  graduationTime?: string | number
}

export interface HrmEmployeeWorkExperienceVO {
  id?: number
  employeeId?: number
  workUnit?: string
  postName?: string
  startTime?: string | number
  endTime?: string | number
  reason?: string
}

export interface HrmEmployeeCertificateVO {
  id?: number
  employeeId?: number
  name?: string
  level?: string
  no?: string
  issuingAuthority?: string
  issuingTime?: string | number
}

export interface HrmEmployeeTrainingExperienceVO {
  id?: number
  employeeId?: number
  course?: string
  courseName?: string
  organizationName?: string
  trainingUnit?: string
  startTime?: string | number
  endTime?: string | number
  result?: string
  certificateName?: string
}

export interface HrmEmployeeQuitInfoVO {
  id?: number
  employeeId?: number
  planQuitTime?: string
  applyQuitTime?: string
  salarySettlementTime?: string
  type?: number
  reason?: number
  remark?: string
}

// 获得当前账号的员工绑定状态 GET /hrm/portal/employee/get-bind-status
export async function getEmployeeBindStatus() {
  return request<API.CommonResultBoolean>('/hrm/portal/employee/get-bind-status', {
    method: 'GET'
  })
}

// 获得当前员工档案 GET /hrm/portal/employee/get
export async function getEmployee() {
  return request<CommonResult<HrmPortalEmployeeVO>>('/hrm/portal/employee/get', {
    method: 'GET'
  })
}

// 修改当前员工档案 PUT /hrm/portal/employee/update
export async function updateEmployee(data: HrmPortalEmployeeUpdateReqVO) {
  return request<API.CommonResultBoolean>('/hrm/portal/employee/update', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

// 获得当前员工的档案字段配置 GET /hrm/portal/employee/field-config/list
export async function getEmployeeFieldConfigList() {
  return request<CommonResult<HrmEmployeeFieldConfigVO[]>>(
    '/hrm/portal/employee/field-config/list',
    {
      method: 'GET'
    }
  )
}

// 获得当前员工的联系人列表 GET /hrm/portal/employee/contact/list
export async function getEmployeeContactList() {
  return request<CommonResult<HrmEmployeeContactVO[]>>('/hrm/portal/employee/contact/list', {
    method: 'GET'
  })
}

// 获得当前员工的教育经历列表 GET /hrm/portal/employee/education-experience/list
export async function getEmployeeEducationExperienceList() {
  return request<CommonResult<HrmEmployeeEducationExperienceVO[]>>(
    '/hrm/portal/employee/education-experience/list',
    {
      method: 'GET'
    }
  )
}

// 获得当前员工的工作经历列表 GET /hrm/portal/employee/work-experience/list
export async function getEmployeeWorkExperienceList() {
  return request<CommonResult<HrmEmployeeWorkExperienceVO[]>>(
    '/hrm/portal/employee/work-experience/list',
    {
      method: 'GET'
    }
  )
}

// 获得当前员工的证书列表 GET /hrm/portal/employee/certificate/list
export async function getEmployeeCertificateList() {
  return request<CommonResult<HrmEmployeeCertificateVO[]>>(
    '/hrm/portal/employee/certificate/list',
    {
      method: 'GET'
    }
  )
}

// 获得当前员工的培训经历列表 GET /hrm/portal/employee/training-experience/list
export async function getEmployeeTrainingExperienceList() {
  return request<CommonResult<HrmEmployeeTrainingExperienceVO[]>>(
    '/hrm/portal/employee/training-experience/list',
    {
      method: 'GET'
    }
  )
}

// 获得当前员工的离职信息 GET /hrm/portal/employee/quit-info/get
export async function getEmployeeQuitInfo() {
  return request<CommonResult<HrmEmployeeQuitInfoVO>>('/hrm/portal/employee/quit-info/get', {
    method: 'GET'
  })
}
