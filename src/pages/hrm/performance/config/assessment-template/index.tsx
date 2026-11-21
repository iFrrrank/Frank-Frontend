import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import PerformanceAssessmentTemplateForm from './PerformanceAssessmentTemplateForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete, handleBatchDelete } from '@/components/Delete'
import {
  deletePerformanceAssessmentTemplate,
  deletePerformanceAssessmentTemplateList,
  getPerformanceAssessmentTemplatePage
} from '@/api/hrm/performance/assessTemplate'

// 绩效考核模板列表：维度数/指标数由后端统计返回
const PerformanceAssessmentTemplateManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const columns: ProColumns<any>[] = [
    {
      title: '模板名称',
      dataIndex: 'name',
      width: 220,
      fieldProps: { placeholder: '请输入模板名称' }
    },
    {
      title: '模板说明',
      dataIndex: 'illustrate',
      hideInSearch: true,
      ellipsis: true,
      render: (_, record) => <span>{record.illustrate || '-'}</span>
    },
    {
      title: '维度数量',
      dataIndex: 'dimensionCount',
      align: 'center',
      width: 100,
      hideInSearch: true,
      render: (_, record) => <span>{record.dimensionCount ?? (record.dimensions || []).length}</span>
    },
    {
      title: '指标数量',
      dataIndex: 'quotaCount',
      align: 'center',
      width: 100,
      hideInSearch: true,
      render: (_, record) => <span>{record.quotaCount ?? 0}</span>
    },
    {
      title: '分数上限',
      dataIndex: 'upperLimitScore',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      width: 120,
      hideInSearch: true,
      render: (_, record) => <span>{record.creatorName || '-'}</span>
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
              handleDelete(record, deletePerformanceAssessmentTemplate, () =>
                actionRef.current?.reload()
              )
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
        headerTitle="绩效考核模板"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        search={{ labelWidth: 'auto', span: 6 }}
        request={async (params: Record<string, any>) => {
          const { current, pageSize, ...rest } = params
          const resp = await getPerformanceAssessmentTemplatePage({
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
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys)
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
          </Button>,
          <Button
            key="batchDelete"
            danger
            disabled={selectedRowKeys.length === 0}
            onClick={() =>
              handleBatchDelete(
                selectedRowKeys,
                deletePerformanceAssessmentTemplateList,
                () => setSelectedRowKeys([]),
                () => actionRef.current?.reload()
              )
            }
          >
            {textConst.action.batchDelete}
          </Button>
        ]}
        pagination={{ align: 'center', showSizeChanger: true }}
      />

      <PerformanceAssessmentTemplateForm
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

export default PerformanceAssessmentTemplateManagement
