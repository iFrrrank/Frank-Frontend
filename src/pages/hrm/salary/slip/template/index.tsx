import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import SalarySlipTemplateForm from './SalarySlipTemplateForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'
import {
  deleteSalarySlipTemplate,
  getSalarySlipTemplateList
} from '@/api/hrm/salary/slipTemplate'

// 工资条模板列表：模板为全量列表（无分页），字段项数量即模板包含的工资项
const SalarySlipTemplateManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  const load = async () => {
    setLoading(true)
    try {
      const resp = await getSalarySlipTemplateList()
      if (resp.code === 0) {
        setTemplates(resp.data || [])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const columns: ProColumns<any>[] = [
    {
      title: '模板名称',
      dataIndex: 'name',
      width: 200
    },
    {
      title: '包含工资项',
      align: 'center',
      width: 120,
      render: (_, record) => `${(record.options || []).length} 项`
    },
    {
      title: '隐藏空值项',
      dataIndex: 'hideEmpty',
      align: 'center',
      width: 110,
      render: (_, record) => (record.hideEmpty ? '是' : '否')
    },
    {
      title: '默认模板',
      dataIndex: 'defaultStatus',
      align: 'center',
      width: 100,
      render: (_, record) => (record.defaultStatus ? '是' : '否')
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 170
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
          <a style={deleteTextStyle} onClick={() => handleDelete(record, deleteSalarySlipTemplate, load)}>
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<any>
        headerTitle="工资条模板"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        dataSource={templates}
        loading={loading}
        search={false}
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
        pagination={false}
      />

      <SalarySlipTemplateForm
        visible={formVisible}
        setVisible={setFormVisible}
        onSuccess={() => {
          setFormVisible(false)
          setCurrentId(undefined)
          load()
        }}
        id={currentId}
      />
    </>
  )
}

export default SalarySlipTemplateManagement
