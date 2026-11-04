import React, { useRef, useState } from 'react'
import { Button, Card, Modal, Upload, message } from 'antd'
import {
  DownloadOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  UploadOutlined
} from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { history } from '@umijs/max'
import {
  getChangeImportTemplate,
  getFixImportTemplate,
  getSalaryEmployeeInfoPage,
  importChangeExcel,
  importFixExcel
} from '@/api/hrm/salary/employeeInfo'
import { textConst } from '@/locales/zh-CN'
import { formatHrmMoney } from '@/pages/hrm/utils/format'
import { formatDateTime } from '@/pages/hrm/recruit/format'
import DeptSelect from '@/pages/hrm/employee/components/DeptSelect'
import SalaryEmployeeInfoForm from './SalaryEmployeeInfoForm'
import SalaryEmployeeInfoBatchForm from './SalaryEmployeeInfoBatchForm'

const CHANGE_TYPE_OPTIONS = {
  1: { text: '定薪' },
  2: { text: '调薪' }
}

const SalaryEmployeeInfoPage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const [formVisible, setFormVisible] = useState(false)
  const [currentEmployeeId, setCurrentEmployeeId] = useState<number>()
  const [batchFormVisible, setBatchFormVisible] = useState(false)

  const reload = () => actionRef.current?.reload()

  const selectedEmployeeIds = selectedRowKeys.map((k) => Number(k))

  // 导入/导出相关处理
  const handleDownloadFixTemplate = async () => {
    try {
      const resp = await getFixImportTemplate()
      // 创建 blob 下载
      const blob = new Blob([resp], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = '薪资档案定薪导入模板.xlsx'
      link.click()
    } catch {
      message.error(textConst.msg.importTemplateError)
    }
  }

  const handleDownloadChangeTemplate = async () => {
    try {
      const resp = await getChangeImportTemplate()
      const blob = new Blob([resp], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = '薪资档案调薪导入模板.xlsx'
      link.click()
    } catch {
      message.error(textConst.msg.importTemplateError)
    }
  }

  const columns: ProColumns<API.HrmSalaryEmployeeInfoRespVO>[] = [
    {
      title: '员工姓名',
      dataIndex: 'employeeName',
      align: 'center',
      minWidth: 120,
      fixed: 'left',
      render: (_, record) => (
        <a onClick={() => history.push(`/hrm/salary/employee-info/detail?id=${record.employeeId}`)}>
          {record.employeeName || '-'}
        </a>
      )
    },
    {
      title: '工号',
      dataIndex: 'jobNumber',
      align: 'center',
      width: 110,
      render: (_, record) => record.jobNumber || '-'
    },
    {
      title: '部门',
      dataIndex: 'deptId',
      align: 'center',
      width: 140,
      render: (_, record) => record.deptName || '-',
      renderFormItem: () => <DeptSelect placeholder="请选择部门" />
    },
    {
      title: '岗位',
      dataIndex: 'postName',
      align: 'center',
      width: 140,
      render: (_, record) => record.postName || '-'
    },
    {
      title: '档案状态',
      dataIndex: 'changeType',
      align: 'center',
      width: 110,
      valueType: 'select',
      valueEnum: CHANGE_TYPE_OPTIONS,
      render: (_, record) => {
        if (!record.id) return <span style={{ color: '#8c8c8c' }}>未定薪</span>
        return record.changeType === 1 ? '定薪' : '调薪'
      }
    },
    {
      title: '正式工资',
      dataIndex: 'regularSalary',
      align: 'right',
      width: 120,
      hideInSearch: true,
      render: (_, record) => formatHrmMoney(record.regularSalary)
    },
    {
      title: '试用期工资',
      dataIndex: 'probationSalary',
      align: 'right',
      width: 120,
      hideInSearch: true,
      render: (_, record) => formatHrmMoney(record.probationSalary)
    },
    {
      title: '最新生效时间',
      dataIndex: 'effectTime',
      align: 'center',
      width: 130,
      hideInSearch: true,
      render: (_, record) =>
        record.effectTime ? formatDateTime(record.effectTime, 'YYYY-MM-DD') : '-'
    },
    {
      title: textConst.table.action,
      valueType: 'option',
      align: 'center',
      width: 140,
      fixed: 'right',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          <a
            onClick={() => {
              setCurrentEmployeeId(record.employeeId)
              setFormVisible(true)
            }}
          >
            {record.id ? '调薪' : '定薪'}
          </a>
          <a
            onClick={() => history.push(`/hrm/salary/employee-info/detail?id=${record.employeeId}`)}
          >
            详情
          </a>
        </div>
      )
    }
  ]

  return (
    <Card variant="borderless">
      <ProTable<API.HrmSalaryEmployeeInfoRespVO>
        headerTitle="员工薪资档案"
        actionRef={actionRef}
        rowKey="employeeId"
        columns={columns}
        cardBordered
        form={{ colon: false }}
        search={{ labelWidth: 'auto', defaultCollapsed: false }}
        options={false}
        scroll={{ x: 'max-content' }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys)
        }}
        pagination={{ align: 'center', showSizeChanger: true }}
        toolBarRender={() => [
          <Button
            key="batch"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setBatchFormVisible(true)}
          >
            批量调薪
          </Button>,
          <Button key="fixTpl" icon={<DownloadOutlined />} onClick={handleDownloadFixTemplate}>
            定薪模板
          </Button>,
          <Button
            key="changeTpl"
            icon={<DownloadOutlined />}
            onClick={handleDownloadChangeTemplate}
          >
            调薪模板
          </Button>
        ]}
        request={async (params) => {
          const { current, pageSize, name, jobNumber, deptId, postName, changeType } = params
          try {
            const resp = await getSalaryEmployeeInfoPage({
              reqVO: {
                pageNo: current || 1,
                pageSize: pageSize || 10,
                ...(name ? { name } : {}),
                ...(jobNumber ? { jobNumber } : {}),
                ...(deptId ? { deptId: Number(deptId) } : {}),
                ...(postName ? { postName } : {}),
                ...(changeType !== undefined && changeType !== ''
                  ? { changeType: Number(changeType) }
                  : {})
              }
            } as any)
            return {
              data: resp.data?.list || [],
              success: resp.code === 0,
              total: resp.data?.total || 0
            }
          } catch {
            return { data: [], success: false, total: 0 }
          }
        }}
      />

      <SalaryEmployeeInfoForm
        visible={formVisible}
        setVisible={setFormVisible}
        employeeId={currentEmployeeId}
        onSuccess={reload}
      />

      <SalaryEmployeeInfoBatchForm
        visible={batchFormVisible}
        setVisible={setBatchFormVisible}
        selectedEmployeeIds={selectedEmployeeIds}
        onSuccess={() => {
          setSelectedRowKeys([])
          reload()
        }}
      />
    </Card>
  )
}

export default SalaryEmployeeInfoPage
