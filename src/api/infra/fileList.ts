import { request } from '@umijs/max'

/** 下载文件 GET /infra/file/${param0}/get/&#42;&#42; */
export async function getFileContent(
  params: API.getFileContentParams,
  options?: { [key: string]: any }
) {
  const { configId: param0, ...queryParams } = params
  return request<any>(`/infra/file/${param0}/get/**`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {})
  })
}

/** 创建文件 模式二：前端上传文件：配合 presigned-url 接口，记录上传了上传的文件 POST /infra/file/create */
export async function createFile1(
  body: API.InfraFileCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/infra/file/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 删除文件 DELETE /infra/file/delete */
export async function deleteFile(params: API.deleteFileParams, options?: { [key: string]: any }) {
  return request<API.CommonResultBoolean>('/infra/file/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 批量删除文件 DELETE /infra/file/delete-list */
export async function deleteFileList(
  params: API.deleteFileListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/infra/file/delete-list', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取文件分页列表 GET /infra/file/page */
export async function getFilePage(params: API.getFilePageParams, options?: { [key: string]: any }) {
  return request<API.CommonResultPageResultInfraFileRespVO>('/infra/file/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

/** 获取文件预签名地址（上传） 模式二：前端上传文件：用于前端直接上传七牛、阿里云 OSS 等文件存储器 GET /infra/file/presigned-url */
export async function getFilePresignedUrl(
  params: API.getFilePresignedUrlParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultInfraFilePresignedUrlRespVO>('/infra/file/presigned-url', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 上传文件 模式一：后端上传文件 POST /infra/file/upload */
export async function uploadFile(body: API.InfraFileUploadReqVO, options?: { [key: string]: any }) {
  return request<API.CommonResultString>('/infra/file/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
