import { request } from '@umijs/max'

// 创建钱包充值套餐 POST /pay/wallet-recharge-package/create
export async function createWalletRechargePackage(
  body: API.WalletRechargePackageCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/pay/wallet-recharge-package/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除钱包充值套餐 DELETE /pay/wallet-recharge-package/delete
export async function deleteWalletRechargePackage(
  params: API.deleteWalletRechargePackageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/pay/wallet-recharge-package/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取钱包充值套餐 GET /pay/wallet-recharge-package/get
export async function getWalletRechargePackage(
  params: API.getWalletRechargePackageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultWalletRechargePackageRespVO>('/pay/wallet-recharge-package/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取钱包充值套餐分页列表 GET /pay/wallet-recharge-package/page
export async function getWalletRechargePackagePage(
  params: API.getWalletRechargePackagePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultWalletRechargePackageRespVO>(
    '/pay/wallet-recharge-package/page',
    {
      method: 'GET',
      params: {
        ...params,
        pageVO: undefined,
        ...params['pageVO']
      },
      ...(options || {})
    }
  )
}

// 更新钱包充值套餐 PUT /pay/wallet-recharge-package/update
export async function updateWalletRechargePackage(
  body: API.WalletRechargePackageUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/pay/wallet-recharge-package/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

