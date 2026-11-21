import { request } from '@umijs/max'

// 示例学生（主子表）接口按变体区分基础路径：erp 子表独立 CRUD，inner/normal 子表随学生一并提交
export type Demo03Variant = 'erp' | 'inner' | 'normal'

const baseOf = (variant: Demo03Variant) => `/infra/demo03-student-${variant}`

// 查询学生分页 GET /infra/demo03-student-{variant}/page
export async function getDemo03StudentPage(
  variant: Demo03Variant,
  params: { pageNo: number; pageSize: number; name?: string; sex?: number; createTime?: string[] },
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultDemo03StudentVO>(`${baseOf(variant)}/page`, {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 查询学生详情 GET /infra/demo03-student-{variant}/get
export async function getDemo03Student(
  variant: Demo03Variant,
  params: API.getDemo03StudentParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultDemo03StudentVO>(`${baseOf(variant)}/get`, {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 新增学生 POST /infra/demo03-student-{variant}/create
export async function createDemo03Student(
  variant: Demo03Variant,
  body: API.Demo03StudentVO & { demo03courses?: API.Demo03CourseVO[]; demo03grade?: API.Demo03GradeVO },
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>(`${baseOf(variant)}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 修改学生 PUT /infra/demo03-student-{variant}/update
export async function updateDemo03Student(
  variant: Demo03Variant,
  body: API.Demo03StudentVO & { demo03courses?: API.Demo03CourseVO[]; demo03grade?: API.Demo03GradeVO },
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>(`${baseOf(variant)}/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除学生 DELETE /infra/demo03-student-{variant}/delete
export async function deleteDemo03Student(
  variant: Demo03Variant,
  params: API.deleteDemo03StudentParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>(`${baseOf(variant)}/delete`, {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 批量删除学生 DELETE /infra/demo03-student-{variant}/delete-list
export async function deleteDemo03StudentList(
  variant: Demo03Variant,
  params: API.deleteDemo03StudentListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>(`${baseOf(variant)}/delete-list`, {
    method: 'DELETE',
    params: {
      ids: params.ids.join(',')
    },
    ...(options || {})
  })
}

// 导出学生 Excel GET /infra/demo03-student-{variant}/export-excel
export async function exportDemo03Student(
  variant: Demo03Variant,
  params: { name?: string; sex?: number; createTime?: string[] },
  options?: { [key: string]: any }
) {
  return request(`${baseOf(variant)}/export-excel`, {
    method: 'GET',
    params: {
      ...params
    },
    responseType: 'blob',
    ...(options || {})
  })
}

// ===== erp 变体子表：学生课程（独立 CRUD） =====

// 查询学生课程分页 GET /infra/demo03-student-erp/demo03-course/page
export async function getDemo03CoursePage(
  params: { pageNo: number; pageSize: number; studentId: number; name?: string },
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultDemo03CourseVO>(
    '/infra/demo03-student-erp/demo03-course/page',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}

// 新增学生课程 POST /infra/demo03-student-erp/demo03-course/create
export async function createDemo03Course(
  body: API.Demo03CourseVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/infra/demo03-student-erp/demo03-course/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 修改学生课程 PUT /infra/demo03-student-erp/demo03-course/update
export async function updateDemo03Course(
  body: API.Demo03CourseVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/infra/demo03-student-erp/demo03-course/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除学生课程 DELETE /infra/demo03-student-erp/demo03-course/delete
export async function deleteDemo03Course(
  params: API.deleteDemo03CourseParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/infra/demo03-student-erp/demo03-course/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// ===== erp 变体子表：学生班级（独立 CRUD） =====

// 查询学生班级分页 GET /infra/demo03-student-erp/demo03-grade/page
export async function getDemo03GradePage(
  params: { pageNo: number; pageSize: number; studentId: number; name?: string },
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultDemo03GradeVO>(
    '/infra/demo03-student-erp/demo03-grade/page',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}

// 新增学生班级 POST /infra/demo03-student-erp/demo03-grade/create
export async function createDemo03Grade(
  body: API.Demo03GradeVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/infra/demo03-student-erp/demo03-grade/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 修改学生班级 PUT /infra/demo03-student-erp/demo03-grade/update
export async function updateDemo03Grade(
  body: API.Demo03GradeVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/infra/demo03-student-erp/demo03-grade/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除学生班级 DELETE /infra/demo03-student-erp/demo03-grade/delete
export async function deleteDemo03Grade(
  params: API.deleteDemo03GradeParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/infra/demo03-student-erp/demo03-grade/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}
