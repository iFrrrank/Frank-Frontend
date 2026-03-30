import React, { useState } from 'react'
import { Modal, Input, message } from 'antd'
import { updateUserPassword } from '@/api/system/user'
import { ExclamationCircleOutlined } from '@ant-design/icons'

export let handleResetPwd: (record: API.SystemUserRespVO) => void

const ResetPwdModal: React.FC = () => {
  const [resetPwdVisible, setResetPwdVisible] = useState(false)
  const [resetPwdUser, setResetPwdUser] = useState<API.SystemUserRespVO | null>(null)
  const [newPassword, setNewPassword] = useState('')

  // ===== 重置密码 =====
  handleResetPwd = (record: API.SystemUserRespVO) => {
    setResetPwdUser(record)
    setNewPassword('')
    setResetPwdVisible(true)
  }

  // 提交重置密码
  const handleResetPwdSubmit = async () => {
    if (!newPassword) {
      message.warning('请输入新密码')
      return
    }
    try {
      const resp = await updateUserPassword({ id: resetPwdUser!.id, password: newPassword })
      if (resp.code === 0) {
        message.success('重置密码成功')
        setResetPwdVisible(false)
      } else {
        message.error(resp.msg || '重置密码失败')
      }
    } catch {
      message.error('重置密码失败')
    }
  }

  return (
    <Modal
      title="温馨提示"
      open={resetPwdVisible}
      onCancel={() => setResetPwdVisible(false)}
      onOk={handleResetPwdSubmit}
      okText="确定"
      cancelText="取消"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: 20 }} />
        <span>请输入"{resetPwdUser?.username}"的新密码</span>
      </div>
      <Input.Password
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="请输入新密码"
      />
    </Modal>
  )
}

export default ResetPwdModal
