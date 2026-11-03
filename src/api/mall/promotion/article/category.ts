import { request } from '@umijs/max'

// 创建文章分类 POST /promotion/article-category/create
export async function createArticleCategory(
  body: API.PromotionArticleCategoryCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/promotion/article-category/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除文章分类 DELETE /promotion/article-category/delete
export async function deleteArticleCategory(
  params: API.deleteArticleCategoryParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/article-category/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取文章分类 GET /promotion/article-category/get
export async function getArticleCategory(
  params: API.getArticleCategoryParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPromotionArticleCategoryRespVO>(
    '/promotion/article-category/get',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}

// 获取文章分类精简列表 只包含被开启的文章分类，主要用于前端的下拉选项 GET /promotion/article-category/list-all-simple
export async function getSimpleDeptList(options?: { [key: string]: any }) {
  return request<API.CommonResultListPromotionArticleCategorySimpleRespVO>(
    '/promotion/article-category/list-all-simple',
    {
      method: 'GET',
      ...(options || {})
    }
  )
}

// 获取文章分类分页列表 GET /promotion/article-category/page
export async function getArticleCategoryPage(
  params: API.getArticleCategoryPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultPromotionArticleCategoryRespVO>(
    '/promotion/article-category/page',
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

// 更新文章分类 PUT /promotion/article-category/update
export async function updateArticleCategory(
  body: API.PromotionArticleCategoryUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/article-category/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
