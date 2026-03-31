import React, { useState } from 'react'
import { Input, message, Modal } from 'antd'
import { updateUserPassword } from '@/api/system/user'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { textConstants } from '@/locales/zh-CN'

export let handleResetPwd: (record: API.SystemUserRespVO) => void

const ResetPwdForm: React.FC = () => {
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
      message.warning(`${textConstants.common.inputText}新密码`)
      return
    }
    try {
      const resp = await updateUserPassword({ id: resetPwdUser!.id, password: newPassword })
      if (resp.code === 0) {
        message.success(textConstants.msg.resetPwdSuccess)
        setResetPwdVisible(false)
      } else {
        message.error(resp.msg || textConstants.msg.resetPwdError)
      }
    } catch {
      message.error(textConstants.msg.resetPwdError)
    }
  }

  return (
    <Modal
      title={textConstants.msg.reminder}
      open={resetPwdVisible}
      onCancel={() => setResetPwdVisible(false)}
      onOk={handleResetPwdSubmit}
      okText={textConstants.common.ok}
      cancelText={textConstants.common.cancel}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: 20 }} />
        <span>textConstants.common.inputText {resetPwdUser?.username} 的新密码</span>
      </div>
      <Input.Password
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder={`${textConstants.common.inputText}新密码`}
      />
    </Modal>
  )
}

export default ResetPwdForm
