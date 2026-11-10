import React from 'react'
import { Form } from 'antd'
import { ModalForm, ProFormText } from '@ant-design/pro-components'
import { MAC_PATTERN } from '../../utils'
import type { AttendanceWifi } from '../../utils'

interface AttendanceGroupWifiFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  // 编辑时传入；不传表示新增
  wifi?: AttendanceWifi
  onConfirm: (wifi: AttendanceWifi) => void
}

// 考勤组打卡 WiFi 表单
const AttendanceGroupWifiForm: React.FC<AttendanceGroupWifiFormProps> = ({
  visible,
  setVisible,
  wifi,
  onConfirm
}) => {
  const [form] = Form.useForm()

  return (
    <ModalForm
      title={wifi ? '编辑打卡 WiFi' : '新增打卡 WiFi'}
      open={visible}
      onOpenChange={setVisible}
      form={form}
      layout="horizontal"
      colon={false}
      labelAlign="right"
      width={560}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      modalProps={{ destroyOnHidden: true, onCancel: () => form.resetFields() }}
      request={async () => ({ ssid: wifi?.ssid || '', mac: wifi?.mac || '' })}
      onFinish={async (values) => {
        onConfirm({ ssid: values.ssid, mac: values.mac })
        return true
      }}
    >
      <ProFormText
        name="ssid"
        label="WiFi 名称"
        placeholder="请输入 WiFi 名称"
        fieldProps={{ maxLength: 50 }}
        rules={[{ required: true, message: 'WiFi 名称不能为空' }]}
      />
      <ProFormText
        name="mac"
        label="MAC 地址"
        placeholder="例如 00:11:22:33:44:55"
        fieldProps={{ maxLength: 17 }}
        rules={[
          { required: true, message: 'MAC 地址不能为空' },
          { pattern: MAC_PATTERN, message: 'MAC 地址格式不正确' }
        ]}
      />
    </ModalForm>
  )
}

export default AttendanceGroupWifiForm
