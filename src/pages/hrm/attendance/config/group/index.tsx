import React, { useRef, useState } from 'react'
import { Button, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import AttendanceGroupForm from './AttendanceGroupForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'
import { deleteAttendanceGroup, getAttendanceGroupPage } from '@/api/hrm/attendance/group'
import { formatWeeks } from '../../utils'

// 考勤组配置列表：班次概览、参与范围与打卡方式
const AttendanceGroupManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  const columns: ProColumns<any>[] = [
    {
      title: '考勤组名称',
      dataIndex: 'name',
      width: 160,
      fieldProps: { placeholder: '请输入考勤组名称' }
    },
    {
      title: '班次',
      dataIndex: 'shifts',
      hideInSearch: true,
      width: 260,
      render: (_, record) => (
        <div>
          {(record.shifts || []).map((shift: any, index: number) => (
            <div key={index}>
              {formatWeeks(shift.weeks)}：{shift.startTime} - {shift.endTime}
            </div>
          ))}
        </div>
      )
    },
    {
      title: '参与部门数',
      align: 'center',
      width: 100,
      hideInSearch: true,
      render: (_, record) => (record.deptIds || []).length
    },
    {
      title: '参与员工数',
      align: 'center',
      width: 100,
      hideInSearch: true,
      render: (_, record) => (record.employeeIds || []).length
    },
    {
      title: '打卡方式',
      align: 'center',
      width: 170,
      hideInSearch: true,
      render: (_, record) => (
        <span>
          {record.openPointCard && <Tag color="blue">定位打卡</Tag>}
          {record.openWifiCard && <Tag color="green">WiFi 打卡</Tag>}
          {!record.openPointCard && !record.openWifiCard && '-'}
        </span>
      )
    },
    {
      title: '法定节假日休息',
      dataIndex: 'rest',
      align: 'center',
      width: 120,
      hideInSearch: true,
      render: (_, record) => (record.rest ? '是' : '否')
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 170,
      hideInSearch: true
    },
    {
      title: textConst.table.action,
      valueType: 'option',
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a
            onClick={() => {
              setCurrentId(record.id)
              setFormVisible(true)
            }}
          >
            {textConst.action.update}
          </a>
          <a
            style={deleteTextStyle}
            onClick={() =>
              handleDelete(record, deleteAttendanceGroup, () => actionRef.current?.reload())
            }
          >
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<any>
        headerTitle="考勤组配置"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        search={{ labelWidth: 'auto', span: 6 }}
        request={async (params: Record<string, any>) => {
          const { current, pageSize, ...rest } = params
          const resp = await getAttendanceGroupPage({
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...rest
          } as any)
          return {
            data: resp.data?.list || [],
            success: true,
            total: resp.data?.total || 0
          }
        }}
        scroll={{ x: 'max-content' }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            onClick={() => {
              setCurrentId(undefined)
              setFormVisible(true)
            }}
          >
            <PlusOutlined /> {textConst.action.create}
          </Button>
        ]}
        pagination={{ align: 'center', showSizeChanger: true }}
      />

      <AttendanceGroupForm
        visible={formVisible}
        setVisible={setFormVisible}
        onSuccess={() => {
          setFormVisible(false)
          setCurrentId(undefined)
          actionRef.current?.reload()
        }}
        id={currentId}
      />
    </>
  )
}

export default AttendanceGroupManagement
