import { request } from '@umijs/max'

// 创建文章 POST /promotion/article/create
export async function createArticle(
  body: API.PromotionArticleCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/promotion/article/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除文章 DELETE /promotion/article/delete
export async function deleteArticle(
  params: API.deleteArticleParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/article/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取文章 GET /promotion/article/get
export async function getArticle(params: API.getArticleParams, options?: { [key: string]: any }) {
  return request<API.CommonResultPromotionArticleRespVO>('/promotion/article/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取文章分页列表 GET /promotion/article/page
export async function getArticlePage(
  params: API.getArticlePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultPromotionArticleRespVO>('/promotion/article/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

// 更新文章 PUT /promotion/article/update
export async function updateArticle(
  body: API.PromotionArticleUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/article/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

