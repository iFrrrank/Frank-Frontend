import React, { useEffect, useMemo, useState } from 'react'
import { Select } from 'antd'
import type { CSSProperties } from 'react'
import { getRecruitPost, getRecruitPostSimpleList } from '@/api/hrm/recruit/post'

interface RecruitPostSelectProps {
  value?: number
  onChange?: (value: number | undefined, post?: API.HrmRecruitPostRespVO) => void
  disabled?: boolean
  clearable?: boolean
  filterable?: boolean
  placeholder?: string
  style?: CSSProperties
}

// 选项文案：职位名称（用人部门）
const formatPostLabel = (post: API.HrmRecruitPostRespVO) =>
  post.deptName ? `${post.postName}（${post.deptName}）` : post.postName

// 招聘职位选择器
const RecruitPostSelect: React.FC<RecruitPostSelectProps> = ({
  value,
  onChange,
  disabled = false,
  clearable = true,
  filterable = true,
  placeholder = '请选择招聘职位',
  style
}) => {
  const [postList, setPostList] = useState<API.HrmRecruitPostRespVO[]>([])
  const [selectedPost, setSelectedPost] = useState<API.HrmRecruitPostRespVO>()
  const [loading, setLoading] = useState<boolean>(false)

  // 精简列表不含已停止招聘的职位，已选中但不在列表内的职位需要补充回显
  const options = useMemo(() => {
    const list = postList.filter((post) => post.id !== undefined)
    if (selectedPost?.id === undefined || list.some((post) => post.id === selectedPost.id)) {
      return list
    }
    return [selectedPost, ...list]
  }, [postList, selectedPost])

  useEffect(() => {
    setLoading(true)
    getRecruitPostSimpleList()
      .then((resp) => setPostList(resp.data || []))
      .catch(() => setPostList([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setSelectedPost(undefined)
    if (value === undefined || value === null || postList.some((post) => post.id === value)) {
      return
    }
    getRecruitPost({ id: value })
      .then((resp) => {
        if (resp.data?.id === value) {
          setSelectedPost(resp.data)
        }
      })
      .catch(() => undefined)
  }, [value, postList])

  return (
    <Select
      value={value}
      style={{ width: '100%', ...style }}
      disabled={disabled}
      loading={loading}
      allowClear={clearable}
      showSearch={filterable}
      optionFilterProp="label"
      placeholder={placeholder}
      options={options.map((post) => ({ label: formatPostLabel(post), value: post.id as number }))}
      onChange={(val) =>
        onChange?.(
          val,
          options.find((post) => post.id === val)
        )
      }
    />
  )
}

export default RecruitPostSelect
