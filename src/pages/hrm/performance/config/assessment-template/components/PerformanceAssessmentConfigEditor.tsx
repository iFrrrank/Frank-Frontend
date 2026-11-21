import React, { useState } from 'react'
import { Button, Card, Space, Table, Tag } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components'

// 考核指标
export interface AssessmentQuota {
  name?: string
  illustrate?: string
  standard?: string
  weight?: number
  scoreType?: number
}

// 考核维度（含其指标列表）
export interface AssessmentDimension {
  name?: string
  quotaType?: number
  weight?: number
  remark?: string
  allowEdit?: boolean
  quotas?: AssessmentQuota[]
}

interface ConfigEditorProps {
  dimensions: AssessmentDimension[]
  onChange: (dimensions: AssessmentDimension[]) => void
}

// 指标类型：1 业绩指标，2 行为态度指标
export const QUOTA_TYPE_OPTIONS = [
  { label: '业绩指标', value: 1 },
  { label: '行为态度指标', value: 2 }
]

// 考核配置编辑器：维度列表 + 每维度下的指标列表，模板表单与计划表单共用
const PerformanceAssessmentConfigEditor: React.FC<ConfigEditorProps> = ({
  dimensions,
  onChange
}) => {
  const [dimensionFormVisible, setDimensionFormVisible] = useState(false)
  const [editingDimensionIndex, setEditingDimensionIndex] = useState<number>()
  const [quotaFormVisible, setQuotaFormVisible] = useState(false)
  const [quotaDimensionIndex, setQuotaDimensionIndex] = useState<number>()
  const [editingQuotaIndex, setEditingQuotaIndex] = useState<number>()

  const updateDimension = (index: number, dimension: AssessmentDimension) =>
    onChange(dimensions.map((item, i) => (i === index ? dimension : item)))

  return (
    <>
      {dimensions.map((dimension, dimensionIndex) => (
        <Card
          key={dimensionIndex}
          size="small"
          style={{ marginBottom: 12 }}
          title={
            <Space>
              <span>{dimension.name || '未命名维度'}</span>
              <Tag>
                {QUOTA_TYPE_OPTIONS.find((o) => o.value === dimension.quotaType)?.label || '-'}
              </Tag>
              <span style={{ color: '#8c8c8c' }}>权重 {dimension.weight ?? 0}%</span>
              {dimension.allowEdit && <Tag color="blue">允许员工编辑</Tag>}
            </Space>
          }
          extra={
            <Space>
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => {
                  setEditingDimensionIndex(dimensionIndex)
                  setDimensionFormVisible(true)
                }}
              >
                编辑维度
              </Button>
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => onChange(dimensions.filter((_, i) => i !== dimensionIndex))}
              >
                删除
              </Button>
            </Space>
          }
        >
          <Table
            rowKey={(_, index) => String(index)}
            size="small"
            pagination={false}
            dataSource={dimension.quotas || []}
            columns={[
              { title: '指标名称', dataIndex: 'name', width: 160 },
              { title: '指标说明', dataIndex: 'illustrate', ellipsis: true },
              { title: '评分标准', dataIndex: 'standard', ellipsis: true },
              { title: '权重(%)', dataIndex: 'weight', width: 90, align: 'center' },
              {
                title: '操作',
                width: 110,
                render: (_, __, quotaIndex) => (
                  <Space>
                    <a
                      onClick={() => {
                        setQuotaDimensionIndex(dimensionIndex)
                        setEditingQuotaIndex(quotaIndex)
                        setQuotaFormVisible(true)
                      }}
                    >
                      编辑
                    </a>
                    <a
                      style={{ color: '#ff4d4f' }}
                      onClick={() =>
                        updateDimension(dimensionIndex, {
                          ...dimension,
                          quotas: (dimension.quotas || []).filter((_, i) => i !== quotaIndex)
                        })
                      }
                    >
                      删除
                    </a>
                  </Space>
                )
              }
            ]}
          />
          <Button
            type="dashed"
            block
            size="small"
            icon={<PlusOutlined />}
            style={{ marginTop: 8 }}
            onClick={() => {
              setQuotaDimensionIndex(dimensionIndex)
              setEditingQuotaIndex(undefined)
              setQuotaFormVisible(true)
            }}
          >
            添加指标
          </Button>
        </Card>
      ))}
      <Button
        type="dashed"
        block
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingDimensionIndex(undefined)
          setDimensionFormVisible(true)
        }}
      >
        添加维度
      </Button>

      {/* 维度表单 */}
      <ModalForm
        title={editingDimensionIndex !== undefined ? '编辑维度' : '添加维度'}
        open={dimensionFormVisible}
        onOpenChange={setDimensionFormVisible}
        width={480}
        modalProps={{ destroyOnHidden: true, zIndex: 1100 }}
        initialValues={
          editingDimensionIndex !== undefined
            ? dimensions[editingDimensionIndex]
            : { quotaType: 1, allowEdit: false }
        }
        onFinish={async (values) => {
          const dimension: AssessmentDimension = {
            ...(editingDimensionIndex !== undefined
              ? dimensions[editingDimensionIndex]
              : { quotas: [] }),
            ...values
          }
          if (editingDimensionIndex !== undefined) {
            updateDimension(editingDimensionIndex, dimension)
          } else {
            onChange([...dimensions, dimension])
          }
          return true
        }}
      >
        <ProFormText
          name="name"
          label="维度名称"
          rules={[{ required: true, message: '请输入维度名称' }]}
        />
        <ProFormSelect
          name="quotaType"
          label="指标类型"
          options={QUOTA_TYPE_OPTIONS}
          rules={[{ required: true, message: '请选择指标类型' }]}
        />
        <ProFormDigit
          name="weight"
          label="维度权重(%)"
          fieldProps={{ precision: 0, min: 0, max: 100, style: { width: '100%' } }}
        />
        <ProFormSwitch name="allowEdit" label="允许员工编辑" />
        <ProFormTextArea name="remark" label="备注" fieldProps={{ rows: 2 }} />
      </ModalForm>

      {/* 指标表单 */}
      <ModalForm
        title={editingQuotaIndex !== undefined ? '编辑指标' : '添加指标'}
        open={quotaFormVisible}
        onOpenChange={setQuotaFormVisible}
        width={480}
        modalProps={{ destroyOnHidden: true, zIndex: 1100 }}
        initialValues={
          quotaDimensionIndex !== undefined && editingQuotaIndex !== undefined
            ? dimensions[quotaDimensionIndex]?.quotas?.[editingQuotaIndex]
            : { scoreType: 1 }
        }
        onFinish={async (values) => {
          if (quotaDimensionIndex === undefined) return false
          const dimension = dimensions[quotaDimensionIndex]
          const quotas = [...(dimension.quotas || [])]
          const quota: AssessmentQuota = { ...values, scoreType: values.scoreType ?? 1 }
          if (editingQuotaIndex !== undefined) {
            quotas[editingQuotaIndex] = quota
          } else {
            quotas.push(quota)
          }
          updateDimension(quotaDimensionIndex, { ...dimension, quotas })
          return true
        }}
      >
        <ProFormText
          name="name"
          label="指标名称"
          rules={[{ required: true, message: '请输入指标名称' }]}
        />
        <ProFormTextArea name="illustrate" label="指标说明" fieldProps={{ rows: 2 }} />
        <ProFormTextArea name="standard" label="评分标准" fieldProps={{ rows: 2 }} />
        <ProFormDigit
          name="weight"
          label="指标权重(%)"
          fieldProps={{ precision: 0, min: 0, max: 100, style: { width: '100%' } }}
        />
      </ModalForm>
    </>
  )
}

export default PerformanceAssessmentConfigEditor
