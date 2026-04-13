import { request } from '@umijs/max'

// 创建商品评论 POST /product/comment/create
export async function createComment1(
  body: API.ProductCommentCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/product/comment/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 获取商品评价分页 GET /product/comment/page
export async function getCommentPage(
  params: API.getCommentPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultProductCommentRespVO>('/product/comment/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

// 商家回复评论 PUT /product/comment/reply
export async function commentReply(
  body: API.ProductCommentReplyReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/product/comment/reply', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 显示 / 隐藏评论 PUT /product/comment/update-visible
export async function updateCommentVisible(
  body: API.ProductCommentUpdateVisibleReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/product/comment/update-visible', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

