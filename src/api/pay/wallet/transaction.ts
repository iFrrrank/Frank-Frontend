import { request } from '@umijs/max'

// 获取钱包流水分页列表 GET /pay/wallet-transaction/page
export async function getWalletTransactionPage(
  params: API.getWalletTransactionPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultPayWalletTransactionRespVO>(
    '/pay/wallet-transaction/page',
    {
      method: 'GET',
      params: {
        ...params,
        pageReqVO: undefined,
        ...params['pageReqVO']
      },
      ...(options || {})
    }
  )
}
