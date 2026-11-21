import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import PerformanceConfigForm, { BIZ_TYPE_OPTIONS, OBJECT_TYPE_OPTIONS } from './PerformanceConfigForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'
import { deletePerformanceConfig, getPerformanceConfigPage } from '@/api/crm/performanceConfig'

const MONTH_FIELDS = [
  'januaryTargetPrice',
  'februaryTargetPrice',
  'marchTargetPrice',
  'aprilTargetPrice',
  'mayTargetPrice',
  'juneTargetPrice',
  'julyTargetPrice',
  'augustTargetPrice',
  'septemberTargetPrice',
  'octoberTargetPrice',
  'novemberTargetPrice',
  'decemberTargetPrice'
] as const

// 全年目标 = 十二个月目标之和（后端未单独维护时前端汇总展示，VO 自带 yearTargetPrice 时优先）
const yearTotal = (record: any) => {
  if (record.yearTargetPrice !== undefined && record.yearTargetPrice !== null) {
    return record.yearTargetPrice
  }
  return MONTH_FIELDS.reduce((sum, field) => sum + (record[field] || 0), 0)
}

// 业绩目标配置列表：按部门/员工、年份、业绩类型维护逐月目标
const PerformanceConfigManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  const columns: ProColumns<any>[] = [
    {
      title: '目标对象',
      dataIndex: 'objectName',
      align: 'center',
      width: 140,
      hideInSearch: true
    },
    {
      title: '对象类型',
      dataIndex: 'objectType',
      align: 'center',
      width: 100,
      valueType: 'select',
      fieldProps: { placeholder: '请选择对象类型', options: OBJECT_TYPE_OPTIONS },
      render: (_, record) =>
        OBJECT_TYPE_OPTIONS.find((o) => o.value === record.objectType)?.label || '-'
    },
    {
      title: '年份',
      dataIndex: 'year',
      align: 'center',
      width: 90,
      fieldProps: { placeholder: '请输入年份' }
    },
    {
      title: '业绩类型',
      dataIndex: 'bizType',
      align: 'center',
      width: 110,
      valueType: 'select',
      fieldProps: { placeholder: '请选择业绩类型', options: BIZ_TYPE_OPTIONS },
      render: (_, record) => BIZ_TYPE_OPTIONS.find((o) => o.value === record.bizType)?.label || '-'
    },
    ...MONTH_FIELDS.map((field, index) => ({
      title: `${index + 1}月`,
      dataIndex: field,
      align: 'center' as const,
      width: 90,
      hideInSearch: true,
      render: (_: any, record: any) =>
        record[field] !== undefined ? `￥${Number(record[field]).toFixed(2)}` : '-'
    })),
    {
      title: '全年目标',
      align: 'center',
      width: 110,
      hideInSearch: true,
      render: (_, record) => `￥${yearTotal(record).toFixed(2)}`
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 160,
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
              handleDelete(record, deletePerformanceConfig, () => actionRef.current?.reload())
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
        headerTitle="业绩目标配置"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        search={{ labelWidth: 'auto', span: 6 }}
        request={async (params: Record<string, any>) => {
          const { current, pageSize, ...rest } = params
          const resp = await getPerformanceConfigPage({
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

      <PerformanceConfigForm
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

export default PerformanceConfigManagement
