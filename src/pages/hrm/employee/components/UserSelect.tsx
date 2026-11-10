import React, { useEffect, useState } from 'react'
import { Select } from 'antd'
import { getSimpleUserList } from '@/api/system/user'

interface UserSelectProps {
  value?: number
  onChange?: (value: number | undefined) => void
  placeholder?: string
  disabled?: boolean
  style?: React.CSSProperties
}

// 后台用户选择器（用于员工绑定系统用户，只展示开启状态的用户）
const UserSelect: React.FC<UserSelectProps> = ({
  value,
  onChange,
  placeholder = '请选择后台用户',
  disabled,
  style
}) => {
  const [userList, setUserList] = useState<API.SystemUserSimpleRespVO[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    getSimpleUserList()
      .then((resp) => setUserList(resp.data || []))
      .catch(() => setUserList([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Select
      value={value}
      style={{ width: '100%', ...style }}
      disabled={disabled}
      loading={loading}
      allowClear
      showSearch
      optionFilterProp="label"
      placeholder={placeholder}
      options={userList.map((user) => ({ label: user.nickname, value: user.id }))}
      onChange={onChange}
    />
  )
}

export default UserSelect
