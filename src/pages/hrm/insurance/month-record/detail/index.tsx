import React, { useEffect, useRef, useState } from 'react'
import { Alert, Button, Card, Descriptions, Space, Spin, Typography, message } from 'antd'
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { history, useSearchParams } from '@umijs/max'
import { getMonthRecord1 } from '@/api/hrm/insurance/monthRecord'
import {
  getMonthEmployeeRecordPage1,
  stopMonthEmployeeRecordList
} from '@/api/hrm/insurance/monthEmployeeRecord'
import InsuranceSchemeSelect from '../../../scheme/components/InsuranceSchemeSelect'
import AreaSelect from '../../../components/AreaSelect'
import InsuranceAddEmployeeForm from './InsuranceAddEmployeeForm'
import InsuranceEmployeeRecordForm from './InsuranceEmployeeRecordForm'
import InsuranceBatchEmployeeRecordForm from './InsuranceBatchEmployeeRecordForm'
import InsuranceMonthEmployeeDetail from './InsuranceMonthEmployeeDetail'
import {
  HRM_INSURANCE_EMP_STATUS_LABELS,
  HrmInsuranceMonthStatus
} from '../../../constants'
import { formatHrmMoney } from '../../../utils'
import { tableActionStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { Modal } from 'antd'

// 月度社保详情：汇总信息 + 参保员工列表（添加/调整/批量调整/停保/详情），已归档时只读
const InsuranceMonthRecordDetailPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const idStr = searchParams.get('id')
  const recordId = idStr ? Number(idStr) : undefined

  const actionRef = useRef<ActionType>(undefined)
  const [loading, setLoading] = useState(false)
  const [record, setRecord] = useState<API.HrmInsuranceMonthRecordRespVO>()
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [addVisible, setAddVisible] = useState(false)
  const [editId, setEditId] = useState<number>()
  const [editVisible, setEditVisible] = useState(false)
  const [batchVisible, setBatchVisible] = useState(false)
  const [detailId, setDetailId] = useState<number>()
  const [detailVisible, setDetailVisible] = useState(false)

  // 未归档才可编辑
  const editable = record?.status === HrmInsuranceMonthStatus.UNARCHIVED

  const loadRecord = () => {
    if (!recordId) {
      return
    }
    setLoading(true)
    getMonthRecord1({ id: recordId } as any)
      .then((resp) => setRecord(resp.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!recordId) {
      message.warning('参数错误，社保表编号不能为空')
      history.back()
      return
    }
    loadRecord()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordId])

  const reloadAll = () => {
    loadRecord()
    actionRef.current?.reload()
  }

  // 停保（批量）：把选中的正常参保员工改为停止参保
  const handleStop = () => {
    if (selectedIds.length === 0) {
      message.warning('请先选择员工')
      return
    }
    Modal.confirm({
      title: '确认停保',
      content: `确定要为选中的 ${selectedIds.length} 名员工停保吗？`,
      okText: '停保',
      cancelText: '取消',
      onOk: async () => {
        const resp = await stopMonthEmployeeRecordList(selectedIds as any)
        if (resp.code === 0) {
          message.success('停保成功')
          setSelectedIds([])
          reloadAll()
        } else {
          message.error(resp.msg || '停保失败')
        }
      }
    })
  }

  const columns: ProColumns<any>[] = [
    { title: '员工姓名', dataIndex: 'employeeName', width: 110, fieldProps: { placeholder: '请输入员工姓名' } },
    { title: '工号', dataIndex: 'jobNumber', align: 'center', width: 100, hideInSearch: true },
    { title: '部门', dataIndex: 'deptName', align: 'center', width: 120, hideInSearch: true },
    { title: '岗位', dataIndex: 'postName', align: 'center', width: 120, hideInSearch: true },
    {
      title: '参保方案',
      dataIndex: 'schemeId',
      width: 180,
      renderFormItem: () => <InsuranceSchemeSelect />,
      render: (_, r) => <span>{r.schemeName || '-'}</span>
    },
    {
      title: '参保城市',
      dataIndex: 'areaId',
      width: 120,
      align: 'center',
      renderFormItem: () => <AreaSelect />,
      render: (_, r) => <span>{r.areaName || '-'}</span>
    },
    {
      title: '参保状态',
      dataIndex: 'employeeStatus',
      align: 'center',
      width: 100,
      valueType: 'select',
      fieldProps: {
        placeholder: '请选择参保状态',
        options: Object.entries(HRM_INSURANCE_EMP_STATUS_LABELS).map(([value, label]) => ({
          label,
          value: Number(value)
        }))
      },
      render: (_, r) => (
        <span>
          {HRM_INSURANCE_EMP_STATUS_LABELS[r.employeeStatus as number] || r.employeeStatus}
        </span>
      )
    },
    {
      title: '个人社保',
      dataIndex: 'personalInsuranceAmount',
      align: 'center',
      width: 110,
      hideInSearch: true,
      render: (_, r) => formatHrmMoney(r.personalInsuranceAmount)
    },
    {
      title: '公司社保',
      dataIndex: 'corporateInsuranceAmount',
      align: 'center',
      width: 110,
      hideInSearch: true,
      render: (_, r) => formatHrmMoney(r.corporateInsuranceAmount)
    },
    {
      title: '个人公积金',
      dataIndex: 'personalProvidentFundAmount',
      align: 'center',
      width: 110,
      hideInSearch: true,
      render: (_, r) => formatHrmMoney(r.personalProvidentFundAmount)
    },
    {
      title: '公司公积金',
      dataIndex: 'corporateProvidentFundAmount',
      align: 'center',
      width: 110,
      hideInSearch: true,
      render: (_, r) => formatHrmMoney(r.corporateProvidentFundAmount)
    },
    {
      title: textConst.table.action,
      valueType: 'option',
      width: 130,
      align: 'center',
      fixed: 'right',
      render: (_, r) => (
        <div style={tableActionStyle}>
          <a
            onClick={() => {
              setDetailId(r.id)
              setDetailVisible(true)
            }}
          >
            详情
          </a>
          {editable && (
            <a
              onClick={() => {
                setEditId(r.id)
                setEditVisible(true)
              }}
            >
              调整
            </a>
          )}
        </div>
      )
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card bodyStyle={{ padding: '12px 24px' }}>
        <Space size="middle">
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => history.back()} />
          <Typography.Title level={4} style={{ margin: 0 }}>
            {record?.title || '月度社保详情'}
          </Typography.Title>
          {editable && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddVisible(true)}>
              添加参保人员
            </Button>
          )}
        </Space>
      </Card>

      <Spin spinning={loading}>
        <Card>
          <Descriptions column={3} bordered size="small">
            <Descriptions.Item label="参保人数">{record?.insuredEmployeeCount ?? 0}</Descriptions.Item>
            <Descriptions.Item label="停保人数">{record?.stoppedEmployeeCount ?? 0}</Descriptions.Item>
            <Descriptions.Item label="状态">
              {record?.status === HrmInsuranceMonthStatus.ARCHIVED ? '已归档' : '未归档'}
            </Descriptions.Item>
            <Descriptions.Item label="个人社保">
              {formatHrmMoney(record?.personalInsuranceAmount)}
            </Descriptions.Item>
            <Descriptions.Item label="公司社保">
              {formatHrmMoney(record?.corporateInsuranceAmount)}
            </Descriptions.Item>
            <Descriptions.Item label="个人公积金">
              {formatHrmMoney(record?.personalProvidentFundAmount)}
            </Descriptions.Item>
            <Descriptions.Item label="公司公积金">
              {formatHrmMoney(record?.corporateProvidentFundAmount)}
            </Descriptions.Item>
          </Descriptions>
          {record && !editable && (
            <Alert
              style={{ marginTop: 16 }}
              type="info"
              showIcon
              message="当前社保表已归档，仅可查询。"
            />
          )}
        </Card>
      </Spin>

      <ProTable<any>
        headerTitle="参保员工"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        search={{ labelWidth: 'auto', span: 6 }}
        params={{ monthRecordId: recordId }}
        request={async (params) => {
          const { current, pageSize, monthRecordId, ...rest } = params as any
          const resp = await getMonthEmployeeRecordPage1({
            pageNo: current || 1,
            pageSize: pageSize || 10,
            monthRecordId,
            ...rest
          } as any)
          return {
            data: resp.data?.list || [],
            success: true,
            total: resp.data?.total || 0
          }
        }}
        scroll={{ x: 'max-content' }}
        rowSelection={
          editable
            ? {
                selectedRowKeys: selectedIds,
                onChange: (keys) => setSelectedIds(keys as number[])
              }
            : undefined
        }
        toolBarRender={() =>
          editable
            ? [
                <Button key="batch" onClick={() => {
                  if (selectedIds.length === 0) {
                    message.warning('请先选择员工')
                    return
                  }
                  setBatchVisible(true)
                }}>
                  批量调整方案
                </Button>,
                <Button key="stop" danger onClick={handleStop}>
                  批量停保
                </Button>
              ]
            : []
        }
        pagination={{ align: 'center', showSizeChanger: true }}
      />

      <InsuranceAddEmployeeForm
        visible={addVisible}
        setVisible={setAddVisible}
        onSuccess={() => {
          setAddVisible(false)
          reloadAll()
        }}
        monthRecordId={recordId}
      />
      <InsuranceEmployeeRecordForm
        visible={editVisible}
        setVisible={setEditVisible}
        onSuccess={() => {
          setEditVisible(false)
          reloadAll()
        }}
        id={editId}
      />
      <InsuranceBatchEmployeeRecordForm
        visible={batchVisible}
        setVisible={setBatchVisible}
        onSuccess={() => {
          setBatchVisible(false)
          setSelectedIds([])
          reloadAll()
        }}
        ids={selectedIds}
      />
      <InsuranceMonthEmployeeDetail
        visible={detailVisible}
        setVisible={setDetailVisible}
        id={detailId}
        editable={editable}
        onEdit={(detail) => {
          setDetailVisible(false)
          setEditId(detail.id)
          setEditVisible(true)
        }}
      />
    </div>
  )
}

export default InsuranceMonthRecordDetailPage
