import React, { useState } from 'react'
import { Button, Form, List, message, Space, Tag } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import {
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText
} from '@ant-design/pro-components'
import {
  createAttendanceGroup,
  getAttendanceGroup,
  updateAttendanceGroup
} from '@/api/hrm/attendance/group'
import DeptTreeSelect from '../../../components/DeptTreeSelect'
import HrmEmployeeSelect from '../../../../employee/components/HrmEmployeeSelect'
import AttendanceGroupShiftForm from './AttendanceGroupShiftForm'
import AttendanceGroupWifiForm from './AttendanceGroupWifiForm'
import AttendanceGroupPointForm from './AttendanceGroupPointForm'
import AttendanceGroupSpecialDateForm from './AttendanceGroupSpecialDateForm'
import {
  createDefaultShift,
  formatSpecialDate,
  formatWeeks,
  type AttendancePoint,
  type AttendanceShift,
  type AttendanceSpecialDate,
  type AttendanceWifi
} from '../../../utils'
import { textConst } from '@/locales/zh-CN'
import dayjs from 'dayjs'

interface AttendanceGroupFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

// 扣款方式：1 按月固定，2 按分钟，3 按次
const DEDUCT_METHOD_OPTIONS = [
  { label: '按月固定', value: 1 },
  { label: '按分钟', value: 2 },
  { label: '按次', value: 3 }
]

const DEDUCT_FIELDS: { key: string; label: string }[] = [
  { key: 'late', label: '迟到' },
  { key: 'early', label: '早退' },
  { key: 'absenteeism', label: '旷工' },
  { key: 'missCard', label: '缺卡' }
]

// 可编辑条目行：名称 + 编辑/删除
const ItemRow: React.FC<{
  title: React.ReactNode
  onEdit: () => void
  onDelete: () => void
}> = ({ title, onEdit, onDelete }) => (
  <List.Item
    actions={[
      <Button key="edit" type="text" icon={<EditOutlined />} onClick={onEdit} />,
      <Button key="del" type="text" danger icon={<DeleteOutlined />} onClick={onDelete} />
    ]}
  >
    <span>{title}</span>
  </List.Item>
)

// 考勤组表单：基础信息 + 班次/特殊日期/打卡地点/WiFi 四组子配置 + 扣款规则
const AttendanceGroupForm: React.FC<AttendanceGroupFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  id
}) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()
  const [shifts, setShifts] = useState<AttendanceShift[]>([])
  const [specialDates, setSpecialDates] = useState<AttendanceSpecialDate[]>([])
  const [points, setPoints] = useState<AttendancePoint[]>([])
  const [wifis, setWifis] = useState<AttendanceWifi[]>([])

  const [shiftFormVisible, setShiftFormVisible] = useState(false)
  const [editingShiftIndex, setEditingShiftIndex] = useState<number>()
  const [wifiFormVisible, setWifiFormVisible] = useState(false)
  const [editingWifiIndex, setEditingWifiIndex] = useState<number>()
  const [pointFormVisible, setPointFormVisible] = useState(false)
  const [editingPointIndex, setEditingPointIndex] = useState<number>()
  const [specialFormVisible, setSpecialFormVisible] = useState(false)
  const [editingSpecialIndex, setEditingSpecialIndex] = useState<number>()

  const openPointCard = Form.useWatch('openPointCard', form)
  const openWifiCard = Form.useWatch('openWifiCard', form)

  const resetSubData = () => {
    setShifts([])
    setSpecialDates([])
    setPoints([])
    setWifis([])
  }

  // 通用条目增删改
  const upsert = <T,>(list: T[], setList: (v: T[]) => void, index: number | undefined, item: T) => {
    if (index === undefined) {
      setList([...list, item])
    } else {
      setList(list.map((old, i) => (i === index ? item : old)))
    }
  }
  const removeAt = <T,>(list: T[], setList: (v: T[]) => void, index: number) =>
    setList(list.filter((_, i) => i !== index))

  return (
    <>
      <ModalForm
        title={isUpdate ? '编辑考勤组' : '新增考勤组'}
        open={visible}
        colon={false}
        onOpenChange={(val) => {
          setVisible(val)
          if (!val) {
            form.resetFields()
            resetSubData()
          }
        }}
        form={form}
        layout="horizontal"
        labelAlign="right"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        width={880}
        request={async () => {
          if (id !== undefined) {
            const resp = await getAttendanceGroup({ id } as any)
            const data = resp.data as any
            if (data) {
              setShifts(data.shifts || [])
              setSpecialDates(data.specialDates || [])
              setPoints(data.points || [])
              setWifis(data.wifis || [])
              return data
            }
          }
          setShifts([createDefaultShift()])
          return {
            rest: true,
            openPointCard: false,
            openWifiCard: false,
            deductRule: {
              lateMethod: 1,
              lateDeductMoney: 0,
              earlyMethod: 1,
              earlyDeductMoney: 0,
              absenteeismMethod: 1,
              absenteeismDeductMoney: 0,
              missCardMethod: 1,
              missCardDeductMoney: 0
            }
          }
        }}
        onFinish={async (values) => {
          if (shifts.length === 0) {
            message.warning('请至少添加一个班次')
            return false
          }
          if (values.openPointCard && points.length === 0) {
            message.warning('启用定位打卡时请至少添加一个打卡地点')
            return false
          }
          if (values.openWifiCard && wifis.length === 0) {
            message.warning('启用 WiFi 打卡时请至少添加一个 WiFi')
            return false
          }
          const submitData = {
            ...values,
            shifts,
            specialDates,
            points: values.openPointCard ? points : [],
            wifis: values.openWifiCard ? wifis : []
          }
          try {
            if (isUpdate) {
              await updateAttendanceGroup({ id, ...submitData } as any)
              message.success(textConst.msg.updateSuccess)
            } else {
              await createAttendanceGroup(submitData as any)
              message.success(textConst.msg.createSuccess)
            }
            onSuccess()
            return true
          } catch {
            message.error(textConst.error.operationFail)
            return false
          }
        }}
      >
        <ProFormText
          name="name"
          label="考勤组名称"
          rules={[{ required: true, message: '请输入考勤组名称' }]}
          placeholder="请输入考勤组名称"
        />
        <ProForm.Item name="deptIds" label="参与部门">
          <DeptTreeSelect />
        </ProForm.Item>
        <ProForm.Item name="employeeIds" label="参与员工">
          <HrmEmployeeSelect multiple />
        </ProForm.Item>
        <ProFormSwitch name="rest" label="法定节假日休息" />

        {/* 班次设置 */}
        <ProForm.Item label="班次设置">
          <List
            size="small"
            bordered
            dataSource={shifts}
            renderItem={(shift, index) => (
              <ItemRow
                title={`${formatWeeks(shift.weeks)}：${shift.startTime} - ${shift.endTime}`}
                onEdit={() => {
                  setEditingShiftIndex(index)
                  setShiftFormVisible(true)
                }}
                onDelete={() => removeAt(shifts, setShifts, index)}
              />
            )}
            footer={
              <Button
                type="dashed"
                block
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingShiftIndex(undefined)
                  setShiftFormVisible(true)
                }}
              >
                添加班次
              </Button>
            }
          />
        </ProForm.Item>

        {/* 特殊日期 */}
        <ProForm.Item label="特殊日期">
          <List
            size="small"
            bordered
            dataSource={specialDates}
            renderItem={(item, index) => (
              <ItemRow
                title={
                  <Space>
                    <span>{item.date ? dayjs(item.date).format('YYYY-MM-DD') : '-'}</span>
                    <Tag>{formatSpecialDate(item, shifts)}</Tag>
                  </Space>
                }
                onEdit={() => {
                  setEditingSpecialIndex(index)
                  setSpecialFormVisible(true)
                }}
                onDelete={() => removeAt(specialDates, setSpecialDates, index)}
              />
            )}
            footer={
              <Button
                type="dashed"
                block
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingSpecialIndex(undefined)
                  setSpecialFormVisible(true)
                }}
              >
                添加特殊日期
              </Button>
            }
          />
        </ProForm.Item>

        <ProFormSwitch name="openPointCard" label="启用定位打卡" />
        {openPointCard && (
          <ProForm.Item label="打卡地点">
            <List
              size="small"
              bordered
              dataSource={points}
              renderItem={(point, index) => (
                <ItemRow
                  title={`${point.name}（${point.address}，半径 ${point.radius || 0} 米）`}
                  onEdit={() => {
                    setEditingPointIndex(index)
                    setPointFormVisible(true)
                  }}
                  onDelete={() => removeAt(points, setPoints, index)}
                />
              )}
              footer={
                <Button
                  type="dashed"
                  block
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditingPointIndex(undefined)
                    setPointFormVisible(true)
                  }}
                >
                  添加打卡地点
                </Button>
              }
            />
          </ProForm.Item>
        )}

        <ProFormSwitch name="openWifiCard" label="启用 WiFi 打卡" />
        {openWifiCard && (
          <ProForm.Item label="打卡 WiFi">
            <List
              size="small"
              bordered
              dataSource={wifis}
              renderItem={(wifi, index) => (
                <ItemRow
                  title={`${wifi.ssid}（${wifi.mac}）`}
                  onEdit={() => {
                    setEditingWifiIndex(index)
                    setWifiFormVisible(true)
                  }}
                  onDelete={() => removeAt(wifis, setWifis, index)}
                />
              )}
              footer={
                <Button
                  type="dashed"
                  block
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditingWifiIndex(undefined)
                    setWifiFormVisible(true)
                  }}
                >
                  添加 WiFi
                </Button>
              }
            />
          </ProForm.Item>
        )}

        {/* 扣款规则：迟到/早退/旷工/缺卡四类，各选方式 + 金额 */}
        {DEDUCT_FIELDS.map((field) => (
          <ProForm.Item key={field.key} label={`${field.label}扣款`}>
            <Space>
              <ProFormSelect
                name={['deductRule', `${field.key}Method`]}
                options={DEDUCT_METHOD_OPTIONS}
                fieldProps={{ style: { width: 130 } }}
                noStyle
              />
              <ProFormDigit
                name={['deductRule', `${field.key}DeductMoney`]}
                fieldProps={{ precision: 2, min: 0, addonAfter: '元', style: { width: 160 } }}
                noStyle
              />
            </Space>
          </ProForm.Item>
        ))}
      </ModalForm>

      <AttendanceGroupShiftForm
        visible={shiftFormVisible}
        setVisible={setShiftFormVisible}
        shift={editingShiftIndex !== undefined ? shifts[editingShiftIndex] : undefined}
        onConfirm={(shift) => upsert(shifts, setShifts, editingShiftIndex, shift)}
      />
      <AttendanceGroupSpecialDateForm
        visible={specialFormVisible}
        setVisible={setSpecialFormVisible}
        specialDate={
          editingSpecialIndex !== undefined ? specialDates[editingSpecialIndex] : undefined
        }
        onConfirm={(item) => upsert(specialDates, setSpecialDates, editingSpecialIndex, item)}
      />
      <AttendanceGroupPointForm
        visible={pointFormVisible}
        setVisible={setPointFormVisible}
        point={editingPointIndex !== undefined ? points[editingPointIndex] : undefined}
        onConfirm={(point) => upsert(points, setPoints, editingPointIndex, point)}
      />
      <AttendanceGroupWifiForm
        visible={wifiFormVisible}
        setVisible={setWifiFormVisible}
        wifi={editingWifiIndex !== undefined ? wifis[editingWifiIndex] : undefined}
        onConfirm={(wifi) => upsert(wifis, setWifis, editingWifiIndex, wifi)}
      />
    </>
  )
}

export default AttendanceGroupForm
