import React, { useState } from 'react'
import { Input, message, Modal } from 'antd'
import { updateUserPassword } from '@/api/system/user'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { textConst } from '@/locales/zh-CN'

export let handleResetPwd: (record: API.SystemUserRespVO) => void

const ResetPwdForm: React.FC = () => {
  const [resetPwdVisible, setResetPwdVisible] = useState(false)
  const [resetPwdUser, setResetPwdUser] = useState<API.SystemUserRespVO | null>(null)
  const [newPassword, setNewPassword] = useState('')

  handleResetPwd = (record: API.SystemUserRespVO) => {
    setResetPwdUser(record)
    setNewPassword('')
    setResetPwdVisible(true)
  }

  const handleResetPwdSubmit = async () => {
    if (!newPassword) {
      message.warning('请输入新密码')
      return
    }
    try {
      const resp = await updateUserPassword({ id: resetPwdUser!.id, password: newPassword })
      if (resp.code === 0) {
        message.success(textConst.msg.resetPwdSuccess)
        setResetPwdVisible(false)
      } else {
        message.error(resp.msg || textConst.msg.resetPwdError)
      }
    } catch {
      message.error(textConst.msg.resetPwdError)
    }
  }

  return (
    <Modal
      title={textConst.msg.reminder}
      open={resetPwdVisible}
      onCancel={() => setResetPwdVisible(false)}
      onOk={handleResetPwdSubmit}
      okText={textConst.common.ok}
      cancelText={textConst.common.cancel}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: 20 }} />
        <span>请输入 {resetPwdUser?.username} 的新密码</span>
      </div>
      <Input.Password
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="请输入新密码"
      />
    </Modal>
  )
}

export default ResetPwdForm
