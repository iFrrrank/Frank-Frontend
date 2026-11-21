import React from 'react'
import { message } from 'antd'
import {
  ModalForm,
  ProFormDigit,
  ProFormText
} from '@ant-design/pro-components'
import type { AttendancePoint } from '../../utils'
import { textConst } from '@/locales/zh-CN'

interface AttendanceGroupPointFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  // 编辑时传入的打卡地点；不传表示新增
  point?: AttendancePoint
  onConfirm: (point: AttendancePoint) => void
}

// 考勤组打卡地点表单：名称、地址、经纬度与有效半径（米）
const AttendanceGroupPointForm: React.FC<AttendanceGroupPointFormProps> = ({
  visible,
  setVisible,
  point,
  onConfirm
}) => {
  return (
    <ModalForm
      title={point ? '编辑打卡地点' : '添加打卡地点'}
      open={visible}
      onOpenChange={setVisible}
      width={520}
      layout="horizontal"
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
      modalProps={{ destroyOnHidden: true }}
      initialValues={point || { radius: 300 }}
      onFinish={async (values) => {
        onConfirm(values as AttendancePoint)
        message.success(textConst.msg.operationSuccess)
        return true
      }}
    >
      <ProFormText
        name="name"
        label="地点名称"
        rules={[{ required: true, message: '请输入地点名称' }]}
        placeholder="请输入地点名称"
      />
      <ProFormText
        name="address"
        label="详细地址"
        rules={[{ required: true, message: '请输入详细地址' }]}
        placeholder="请输入详细地址"
      />
      <ProFormDigit
        name="longitude"
        label="经度"
        rules={[{ required: true, message: '请输入经度' }]}
        placeholder="如 116.397"
        fieldProps={{ precision: 6, style: { width: '100%' } }}
      />
      <ProFormDigit
        name="latitude"
        label="纬度"
        rules={[{ required: true, message: '请输入纬度' }]}
        placeholder="如 39.908"
        fieldProps={{ precision: 6, style: { width: '100%' } }}
      />
      <ProFormDigit
        name="radius"
        label="有效半径"
        rules={[{ required: true, message: '请输入有效半径' }]}
        placeholder="请输入有效半径"
        fieldProps={{ precision: 0, min: 1, addonAfter: '米', style: { width: '100%' } }}
      />
    </ModalForm>
  )
}

export default AttendanceGroupPointForm
