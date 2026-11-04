import { history } from '@umijs/max'
import { getEmployeeBindStatus } from '@/api/hrm/portal/employee'

export const HRM_PORTAL_HOME_PATH = '/hrm/portal/home'
export const HRM_PORTAL_OPENING_GUIDE_PATH = '/hrm/portal/opening-guide'

/**
 * 校验当前账号是否已绑定员工档案
 * 返回 true 时页面才继续加载业务数据；未绑定时统一跳转员工端开通引导页。
 */
export async function checkHrmPortalAccess(): Promise<boolean> {
  try {
    const resp = await getEmployeeBindStatus()
    if (resp.data) {
      return true
    }
    history.replace(HRM_PORTAL_OPENING_GUIDE_PATH)
    return false
  } catch {
    return true
  }
}

/**
 * 已绑定员工档案时，从开通引导页重定向返回员工端工作台
 */
export async function redirectBoundEmployeeFromOpeningGuide(): Promise<boolean> {
  try {
    const resp = await getEmployeeBindStatus()
    if (!resp.data) {
      return false
    }
    history.replace(HRM_PORTAL_HOME_PATH)
    return true
  } catch {
    return false
  }
}

