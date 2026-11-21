import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import PerformanceResultTemplateForm from './PerformanceResultTemplateForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete, handleBatchDelete } from '@/components/Delete'
import {
  deletePerformanceResultTemplate,
  deletePerformanceResultTemplateList,
  getPerformanceResultTemplatePage
} from '@/api/hrm/performance/resultTemplate'

// 绩效结果模板列表：等级以「名称(最低分-最高分,系数)」形式概览
const PerformanceResultTemplateManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const columns: ProColumns<any>[] = [
    {
      title: '模板名称',
      dataIndex: 'name',
      width: 200,
      fieldProps: { placeholder: '请输入模板名称' }
    },
    {
      title: '结果等级',
      hideInSearch: true,
      render: (_, record) =>
        (record.levels || [])
          .map(
            (level: any) =>
              `${level.name}（${level.minScore ?? 0}-${level.maxScore ?? 0}，系数 ${level.coefficient ?? 0}）`
          )
          .join('、') || '-'
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
              handleDelete(record, deletePerformanceResultTemplate, () =>
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
        headerTitle="绩效结果模板"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        search={{ labelWidth: 'auto', span: 6 }}
        request={async (params: Record<string, any>) => {
          const { current, pageSize, ...rest } = params
          const resp = await getPerformanceResultTemplatePage({
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
                deletePerformanceResultTemplateList,
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

      <PerformanceResultTemplateForm
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

export default PerformanceResultTemplateManagement
