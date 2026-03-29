import { useCache, CACHE_KEY } from '@/hooks/useCache'
import { decrypt, encrypt } from './jsencrypt'

const { wsCache } = useCache()

const AccessTokenKey = 'ACCESS_TOKEN'
const RefreshTokenKey = 'REFRESH_TOKEN'

// 获取 token
export const getAccessToken = () => {
  // 此处与TokenKey相同，此写法解决初始化时 Cookies 中不存在 TokenKey报错
  const accessToken = wsCache.get(AccessTokenKey)
  return accessToken ? accessToken : wsCache.get('ACCESS_TOKEN')
}

// 刷新 token
export const getRefreshToken = () => {
  return wsCache.get(RefreshTokenKey)
}

// 设置token
export const setToken = (token: API.SystemOAuth2AccessTokenRespVO) => {
  wsCache.set(RefreshTokenKey, token.refreshToken)
  wsCache.set(AccessTokenKey, token.accessToken)
}

// 删除token
export const removeToken = () => {
  wsCache.delete(AccessTokenKey)
  wsCache.delete(RefreshTokenKey)
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return 'Bearer ' + token
}
// ========== 账号相关 ==========

export type LoginFormType = {
  username: string
  password: string
  rememberMe: boolean
}

export const getLoginForm = () => {
  const loginForm: LoginFormType = wsCache.get(CACHE_KEY.LoginForm)
  if (loginForm) {
    loginForm.password = decrypt(loginForm.password) as string
  }
  return loginForm
}

export const setLoginForm = (loginForm: LoginFormType) => {
  loginForm.password = encrypt(loginForm.password) as string
  wsCache.set(CACHE_KEY.LoginForm, loginForm, { exp: 30 * 24 * 60 * 60 })
}

export const removeLoginForm = () => {
  wsCache.delete(CACHE_KEY.LoginForm)
}