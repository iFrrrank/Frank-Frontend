import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  message
} from 'antd'
import {
  DeleteOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  SwapOutlined,
  UploadOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { fmsAuxiliaryTypeGetAuxiliaryTypeSimpleList } from '@/api/fms/config/auxiliaryType'
import { fmsCurrencyGetCurrencySimpleList } from '@/api/fms/config/currency'
import {
  fmsSubjectDeleteSubjectList,
  fmsSubjectExportSubject,
  fmsSubjectGetSubjectList,
  fmsSubjectUpdateSubjectStatus
} from '@/api/fms/config/subject'
import HasPermi, { useHasPermi } from '@/directives/permission/HasPermi'
import { textConst } from '@/locales/zh-CN'
import { deleteTextStyle, tableActionStyle } from '@/styles/common.style'
import { COMMON_STATUS_OPTIONS } from '@/utils/constantsValue'
import download from '@/utils/download'
import { handleTree } from '@/utils/tree'
import { useFmsStore } from '../../store/fms'
import {
  FMS_DEBIT_CREDIT_DIRECTION,
  FMS_SUBJECT_CATEGORY_OPTIONS,
  FMS_SUBJECT_LEVEL_MAX,
  FMS_SUBJECT_STATUS,
  FMS_SUBJECT_TYPE,
  FMS_SUBJECT_TYPE_OPTIONS
} from '../../utils/constants'
import FmsSubjectForm from './FmsSubjectForm'
import FmsSubjectImportForm from './FmsSubjectImportForm'

type SubjectTreeRecord = API.FmsSubjectRespVO & {
  children?: SubjectTreeRecord[]
}

/**
 * 会计科目管理页面
 */
const SubjectPage: React.FC = () => {
  const hasPermi = useHasPermi()
  const fmsStore = useFmsStore()

  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [subjectType, setSubjectType] = useState<number>(FMS_SUBJECT_TYPE.ASSET)
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<number | undefined>()
  const [list, setList] = useState<SubjectTreeRecord[]>([])
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([])
  const [isExpandAll, setIsExpandAll] = useState(true)
  const [selectedRows, setSelectedRows] = useState<SubjectTreeRecord[]>([])

  const [auxiliaryTypeMap, setAuxiliaryTypeMap] = useState<Map<number, string>>(new Map())
  const [currencyMap, setCurrencyMap] = useState<Map<number, string>>(new Map())

  const [formVisible, setFormVisible] = useState(false)
  const [editId, setEditId] = useState<number | undefined>()
  const [parentSubject, setParentSubject] = useState<API.FmsSubjectRespVO | undefined>()
  const [importVisible, setImportVisible] = useState(false)

  /** 加载辅助核算和币种字典映射 */
  const loadOptionMaps = useCallback(async () => {
    if (!fmsStore.accountSetId) return
    const [auxResp, curResp] = await Promise.all([
      fmsAuxiliaryTypeGetAuxiliaryTypeSimpleList({ accountSetId: fmsStore.accountSetId }),
      fmsCurrencyGetCurrencySimpleList({ accountSetId: fmsStore.accountSetId })
    ])
    if (auxResp.code === 0) {
      setAuxiliaryTypeMap(new Map((auxResp.data || []).map((item) => [item.id, item.name])))
    }
    if (curResp.code === 0) {
      setCurrencyMap(new Map((curResp.data || []).map((item) => [item.id, item.name])))
    }
  }, [fmsStore.accountSetId])

  /** 加载会计科目树 */
  const fetchList = useCallback(
    async (
      currentType = subjectType,
      currentKeyword = keyword,
      currentStatus = statusFilter
    ) => {
      if (!fmsStore.accountSetId) {
        setList([])
        setSelectedRows([])
        return
      }
      setLoading(true)
      try {
        const resp = await fmsSubjectGetSubjectList({
          accountSetId: String(fmsStore.accountSetId),
          type: String(currentType)
        })
        if (resp.code === 0) {
          let raw = resp.data || []
          const kw = currentKeyword.trim().toLowerCase()
          if (kw) {
            raw = raw.filter(
              (item) =>
                item.code.toLowerCase().includes(kw) ||
                item.name.toLowerCase().includes(kw)
            )
          }
          if (currentStatus !== undefined) {
            raw = raw.filter((item) => item.status === currentStatus)
          }
          const treeData = handleTree(raw) as SubjectTreeRecord[]
          setList(treeData)
          setSelectedRows([])
          if (isExpandAll) {
            setExpandedRowKeys(raw.map((item) => item.id))
          } else {
            setExpandedRowKeys([])
          }
        }
      } finally {
        setLoading(false)
      }
    },
    [fmsStore.accountSetId, subjectType, keyword, statusFilter, isExpandAll]
  )

  useEffect(() => {
    loadOptionMaps()
    fetchList()
  }, [fmsStore.accountSetId])

  const allNodeKeys = useMemo(() => {
    const keys: React.Key[] = []
    const traverse = (nodes: SubjectTreeRecord[]) => {
      nodes.forEach((n) => {
        keys.push(n.id)
        if (n.children?.length) traverse(n.children)
      })
    }
    traverse(list)
    return keys
  }, [list])

  const toggleExpandAll = () => {
    const next = !isExpandAll
    setIsExpandAll(next)
    setExpandedRowKeys(next ? allNodeKeys : [])
  }

  /** 判断当前行是否允许删除（无下级科目） */
  const canDeleteRow = (row: SubjectTreeRecord) => !row.children?.length

  const canBatchDelete =
    selectedRows.length > 0 && selectedRows.every((row) => canDeleteRow(row))

  /** 修改科目启用/停用状态 */
  const handleStatusChange = (row: SubjectTreeRecord, checked: boolean) => {
    if (!fmsStore.accountSetId) return
    const nextStatus = checked ? FMS_SUBJECT_STATUS.ENABLED : FMS_SUBJECT_STATUS.DISABLED
    const statusText = checked ? '启用' : '停用'
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined />,
      content: `确认要 "${statusText}" 科目 "${row.name}" 吗？`,
      onOk: async () => {
        const resp = await fmsSubjectUpdateSubjectStatus({
          ids: [row.id],
          accountSetId: fmsStore.accountSetId!,
          status: nextStatus
        })
        if (resp.code === 0) {
          message.success(textConst.msg.updateSuccess)
          await fetchList()
        }
      }
    })
  }

  /** 删除科目 */
  const handleDelete = (row: SubjectTreeRecord) => {
    if (!fmsStore.accountSetId) return
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除科目 "${row.code} ${row.name}"？`,
      onOk: async () => {
        const resp = await fmsSubjectDeleteSubjectList({
          accountSetId: fmsStore.accountSetId!,
          ids: [row.id]
        })
        if (resp.code === 0) {
          message.success(textConst.msg.delSuccess)
          await fetchList()
        }
      }
    })
  }

  /** 批量删除科目 */
  const handleBatchDelete = () => {
    if (!fmsStore.accountSetId || !canBatchDelete) return
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除选中的 ${selectedRows.length} 个科目？`,
      onOk: async () => {
        const resp = await fmsSubjectDeleteSubjectList({
          accountSetId: fmsStore.accountSetId!,
          ids: selectedRows.map((item) => item.id)
        })
        if (resp.code === 0) {
          message.success(textConst.msg.delSuccess)
          await fetchList()
        }
      }
    })
  }

  /** 导出科目 */
  const handleExport = () => {
    if (!fmsStore.accountSetId) return
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined />,
      content: textConst.msg.exportMsg,
      onOk: async () => {
        setExportLoading(true)
        try {
          const data = await fmsSubjectExportSubject(
            {
              accountSetId: String(fmsStore.accountSetId!),
              type: String(subjectType)
            },
            { responseType: 'blob' }
          )
          download.excel(data, '会计科目.xls')
          message.success(textConst.msg.exportSuccess)
        } finally {
          setExportLoading(false)
        }
      }
    })
  }

  const columns: ColumnsType<SubjectTreeRecord> = [
    {
      title: '科目编码',
      dataIndex: 'code',
      width: 150
    },
    {
      title: '科目名称',
      dataIndex: 'name',
      minWidth: 200
    },
    {
      title: '类别',
      dataIndex: 'category',
      align: 'center',
      width: 140,
      render: (val) =>
        FMS_SUBJECT_CATEGORY_OPTIONS.find((item) => item.value === val)?.label || '-'
    },
    {
      title: '余额方向',
      dataIndex: 'balanceDirection',
      align: 'center',
      width: 90,
      render: (val) => (
        <Tag color={val === FMS_DEBIT_CREDIT_DIRECTION.DEBIT ? 'processing' : 'warning'}>
          {val === FMS_DEBIT_CREDIT_DIRECTION.DEBIT ? '借' : '贷'}
        </Tag>
      )
    },
    {
      title: '数量核算',
      dataIndex: 'quantityAccounting',
      align: 'center',
      width: 110,
      render: (_, record) => (record.quantityAccounting ? record.quantityUnit || '-' : '-')
    },
    {
      title: '辅助核算',
      key: 'auxiliaryTypeIds',
      align: 'center',
      minWidth: 160,
      render: (_, record) =>
        record.auxiliaryTypeIds?.length
          ? record.auxiliaryTypeIds
              .map((id) => auxiliaryTypeMap.get(id))
              .filter(Boolean)
              .join('、') || '-'
          : '-'
    },
    {
      title: '外币核算',
      key: 'currencyIds',
      align: 'center',
      minWidth: 150,
      render: (_, record) =>
        record.currencyIds?.length
          ? record.currencyIds
              .map((id) => currencyMap.get(id))
              .filter(Boolean)
              .join('、') || '-'
          : '-'
    },
    {
      title: '现金项',
      dataIndex: 'cash',
      align: 'center',
      width: 95,
      render: (_, record) => (
        <Tag color={record.cash ? 'success' : 'default'}>
          {record.cash ? '是' : '否'}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 95,
      render: (_, record) => (
        <Switch
          checked={record.status === FMS_SUBJECT_STATUS.ENABLED}
          disabled={!fmsStore.isAccountSetWritable || !hasPermi('fms:config:subject:update')}
          onChange={(checked) => handleStatusChange(record, checked)}
        />
      )
    },
    ...(fmsStore.isAccountSetWritable
      ? [
          {
            title: textConst.form.operate,
            key: 'action',
            align: 'center' as const,
            fixed: 'right' as const,
            width: 200,
            render: (_: any, record: SubjectTreeRecord) => (
              <div style={tableActionStyle}>
                {record.level < FMS_SUBJECT_LEVEL_MAX && hasPermi('fms:config:subject:create') && (
                  <a
                    onClick={() => {
                      setEditId(undefined)
                      setParentSubject(record)
                      setFormVisible(true)
                    }}
                  >
                    新增下级
                  </a>
                )}
                {hasPermi('fms:config:subject:update') && (
                  <a
                    onClick={() => {
                      setEditId(record.id)
                      setParentSubject(undefined)
                      setFormVisible(true)
                    }}
                  >
                    {textConst.action.update}
                  </a>
                )}
                {canDeleteRow(record) && hasPermi('fms:config:subject:delete') && (
                  <a style={deleteTextStyle} onClick={() => handleDelete(record)}>
                    {textConst.action.delete}
                  </a>
                )}
              </div>
            )
          }
        ]
      : [])
  ]

  return (
    <>
      <Card variant="borderless" style={{ marginBottom: 16 }}>
        <Form layout="inline" colon={false}>
          <Form.Item label="编码/名称">
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              allowClear
              placeholder="请输入科目编码或科目名称"
              style={{ width: 220 }}
              onPressEnter={() => fetchList()}
            />
          </Form.Item>
          <Form.Item label="状态">
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
              placeholder="请选择状态"
              options={COMMON_STATUS_OPTIONS}
              style={{ width: 160 }}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => fetchList(subjectType, keyword, statusFilter)}
              >
                {textConst.action.query}
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  setKeyword('')
                  setStatusFilter(undefined)
                  fetchList(subjectType, '', undefined)
                }}
              >
                {textConst.action.reset}
              </Button>
              {fmsStore.isAccountSetWritable && (
                <HasPermi value="fms:config:subject:create">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setEditId(undefined)
                      setParentSubject(undefined)
                      setFormVisible(true)
                    }}
                  >
                    {textConst.action.create}
                  </Button>
                </HasPermi>
              )}
              {fmsStore.isAccountSetWritable && (
                <HasPermi value="fms:config:subject:import">
                  <Button
                    color="green"
                    variant="outlined"
                    icon={<UploadOutlined />}
                    onClick={() => setImportVisible(true)}
                  >
                    {textConst.action.import}
                  </Button>
                </HasPermi>
              )}
              <HasPermi value="fms:config:subject:export">
                <Button
                  color="volcano"
                  variant="outlined"
                  icon={<DownloadOutlined />}
                  loading={exportLoading}
                  onClick={handleExport}
                >
                  {textConst.action.export}
                </Button>
              </HasPermi>
              {fmsStore.isAccountSetWritable && (
                <HasPermi value="fms:config:subject:delete">
                  <Button
                    danger
                    type="primary"
                    icon={<DeleteOutlined />}
                    disabled={!canBatchDelete}
                    onClick={handleBatchDelete}
                  >
                    {textConst.action.batchDelete}
                  </Button>
                </HasPermi>
              )}
              <Button
                color="blue"
                variant="outlined"
                icon={<SwapOutlined rotate={90} />}
                onClick={toggleExpandAll}
              >
                {textConst.action.expandOrCollapse}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card variant="borderless">
        <Tabs
          activeKey={String(subjectType)}
          items={FMS_SUBJECT_TYPE_OPTIONS.map((item) => ({
            key: String(item.value),
            label: item.label
          }))}
          onChange={(activeKey) => {
            const nextType = Number(activeKey)
            setSubjectType(nextType)
            fetchList(nextType, keyword, statusFilter)
          }}
        />

        <Table<SubjectTreeRecord>
          rowKey="id"
          loading={loading}
          dataSource={list}
          columns={columns}
          pagination={false}
          bordered
          size="middle"
          scroll={{ x: 'max-content' }}
          expandable={{
            expandedRowKeys,
            onExpandedRowsChange: (keys) => setExpandedRowKeys([...keys])
          }}
          rowSelection={
            fmsStore.isAccountSetWritable
              ? {
                  selectedRowKeys: selectedRows.map((item) => item.id),
                  onChange: (_, rows) => setSelectedRows(rows),
                  getCheckboxProps: (record) => ({
                    disabled: !canDeleteRow(record)
                  })
                }
              : undefined
          }
        />
      </Card>

      {fmsStore.accountSetId && (
        <>
          <FmsSubjectForm
            visible={formVisible}
            setVisible={setFormVisible}
            accountSetId={fmsStore.accountSetId}
            id={editId}
            defaultType={subjectType}
            parentSubject={parentSubject}
            onSuccess={async () => {
              await loadOptionMaps()
              await fetchList()
            }}
          />

          <FmsSubjectImportForm
            visible={importVisible}
            setVisible={setImportVisible}
            accountSetId={fmsStore.accountSetId}
            onSuccess={async () => {
              await loadOptionMaps()
              await fetchList()
            }}
          />
        </>
      )}
    </>
  )
}

export default SubjectPage
