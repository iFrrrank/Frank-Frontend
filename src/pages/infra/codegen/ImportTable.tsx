import React, { useEffect, useState } from 'react'
import { Modal, Select, Table, message } from 'antd'
import { createCodegenList, getSchemaTableList } from '@/api/infra/codegen'
import { getDataSourceConfigList } from '@/api/infra/dataSourceConfig'
import { textConst } from '@/locales/zh-CN'

interface ImportTableProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
}

// 导入数据库表：选择数据源后勾选表，批量创建代码生成定义
const ImportTable: React.FC<ImportTableProps> = ({ visible, setVisible, onSuccess }) => {
  const [dataSourceOptions, setDataSourceOptions] = useState<{ label: string; value: number }[]>([])
  const [dataSourceConfigId, setDataSourceConfigId] = useState<number>()
  const [tables, setTables] = useState<API.InfraDatabaseTableVO[]>([])
  const [selectedNames, setSelectedNames] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!visible) return
    getDataSourceConfigList().then((resp) => {
      const list = ((resp as any).data || []) as any[]
      setDataSourceOptions(list.map((item) => ({ label: item.name, value: item.id })))
      // 默认选主数据源（id 为 0 或列表第一项）
      const primary = list.find((item) => item.id === 0) || list[0]
      if (primary) {
        setDataSourceConfigId(primary.id)
      }
    })
  }, [visible])

  useEffect(() => {
    if (!visible || dataSourceConfigId === undefined) return
    setLoading(true)
    setSelectedNames([])
    getSchemaTableList({ dataSourceConfigId })
      .then((resp) => {
        if (resp.code === 0) setTables(resp.data || [])
      })
      .finally(() => setLoading(false))
  }, [visible, dataSourceConfigId])

  const handleOk = async () => {
    if (dataSourceConfigId === undefined) {
      message.warning('请选择数据源')
      return
    }
    if (selectedNames.length === 0) {
      message.warning('请至少勾选一张表')
      return
    }
    setSaving(true)
    try {
      await createCodegenList({ dataSourceConfigId, tableNames: selectedNames })
      message.success(textConst.msg.createSuccess)
      setVisible(false)
      onSuccess()
    } catch {
      message.error(textConst.error.operationFail)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      title="导入数据库表"
      open={visible}
      onCancel={() => setVisible(false)}
      onOk={handleOk}
      confirmLoading={saving}
      width={720}
      destroyOnHidden
    >
      <div style={{ marginBottom: 12 }}>
        数据源：
        <Select
          style={{ width: 280 }}
          options={dataSourceOptions}
          value={dataSourceConfigId}
          onChange={setDataSourceConfigId}
          placeholder="请选择数据源"
        />
      </div>
      <Table
        rowKey="name"
        size="small"
        loading={loading}
        dataSource={tables}
        pagination={{ pageSize: 8 }}
        rowSelection={{
          selectedRowKeys: selectedNames,
          onChange: (keys) => setSelectedNames(keys as string[])
        }}
        columns={[
          { title: '表名称', dataIndex: 'name' },
          { title: '表描述', dataIndex: 'comment' }
        ]}
      />
    </Modal>
  )
}

export default ImportTable
