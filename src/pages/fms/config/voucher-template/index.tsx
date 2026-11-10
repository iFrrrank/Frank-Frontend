import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, Col, Input, Modal, Row, Space, Spin, Table, message } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { fmsSubjectGetSubjectSimpleList } from '@/api/fms/config/subject'
import {
  fmsVoucherTemplateDeleteVoucherTemplate,
  fmsVoucherTemplateGetVoucherTemplateList
} from '@/api/fms/config/voucherTemplate'
import {
  fmsVoucherTemplateCategoryDeleteTemplateCategory,
  fmsVoucherTemplateCategoryGetTemplateCategorySimpleList
} from '@/api/fms/config/voucherTemplateCategory'
import HasPermi, { useHasPermi } from '@/directives/permission/HasPermi'
import { textConst } from '@/locales/zh-CN'
import { deleteTextStyle, tableActionStyle } from '@/styles/common.style'
import { useFmsStore } from '../../store/fms'
import { formatMoney } from '../../utils/format'
import FmsVoucherTemplateCategoryForm from './FmsVoucherTemplateCategoryForm'

/**
 * 凭证模板管理页面（左侧模板类别栏，右侧凭证模板列表）
 */
const VoucherTemplatePage: React.FC = () => {
  const hasPermi = useHasPermi()
  const fmsStore = useFmsStore()

  const [categoryLoading, setCategoryLoading] = useState(false)
  const [categoryList, setCategoryList] = useState<
    API.FmsVoucherTemplateCategoryRespVO[]
  >([])
  const [categoryKeyword, setCategoryKeyword] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>()
  const [categoryFormVisible, setCategoryFormVisible] = useState(false)
  const [editCategoryId, setEditCategoryId] = useState<number | undefined>()

  const [loading, setLoading] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [allList, setAllList] = useState<API.FmsVoucherTemplateRespVO[]>([])
  const [subjectMap, setSubjectMap] = useState<Map<number, API.FmsSubjectRespVO>>(
    new Map()
  )
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const loadCategoryList = useCallback(async () => {
    if (!fmsStore.accountSetId) {
      setCategoryList([])
      setSelectedCategoryId(undefined)
      return
    }
    setCategoryLoading(true)
    try {
      const resp = await fmsVoucherTemplateCategoryGetTemplateCategorySimpleList({
        accountSetId: fmsStore.accountSetId
      })
      if (resp.code === 0) {
        const cats = resp.data || []
        setCategoryList(cats)
        setSelectedCategoryId((prev) =>
          prev && cats.some((c) => c.id === prev) ? prev : undefined
        )
      }
    } finally {
      setCategoryLoading(false)
    }
  }, [fmsStore.accountSetId])

  const fetchTemplateList = useCallback(async () => {
    if (!fmsStore.accountSetId) {
      setAllList([])
      setSelectedRowKeys([])
      return
    }
    setLoading(true)
    try {
      const [tplResp, subResp] = await Promise.all([
        fmsVoucherTemplateGetVoucherTemplateList({
          accountSetId: fmsStore.accountSetId
        }),
        fmsSubjectGetSubjectSimpleList({
          accountSetId: String(fmsStore.accountSetId)
        })
      ])
      if (tplResp.code === 0) {
        setAllList(tplResp.data || [])
        setSelectedRowKeys([])
      }
      if (subResp.code === 0) {
        setSubjectMap(
          new Map((subResp.data || []).map((item) => [item.id, item]))
        )
      }
    } finally {
      setLoading(false)
    }
  }, [fmsStore.accountSetId])

  useEffect(() => {
    loadCategoryList()
    fetchTemplateList()
  }, [fmsStore.accountSetId])

  const filteredCategoryList = useMemo(() => {
    const kw = categoryKeyword.trim().toLowerCase()
    if (!kw) return categoryList
    return categoryList.filter((item) => item.name.toLowerCase().includes(kw))
  }, [categoryList, categoryKeyword])

  const filteredTemplates = useMemo(() => {
    const kw = templateName.trim().toLowerCase()
    return allList.filter((item) => {
      if (
        selectedCategoryId !== undefined &&
        item.categoryId !== selectedCategoryId
      ) {
        return false
      }
      if (kw && !item.name.toLowerCase().includes(kw)) {
        return false
      }
      return true
    })
  }, [allList, selectedCategoryId, templateName])

  const handleDeleteCategory = (row: API.FmsVoucherTemplateCategoryRespVO) => {
    if (!fmsStore.accountSetId) return
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除模板类别 "${row.name}"？`,
      onOk: async () => {
        const resp = await fmsVoucherTemplateCategoryDeleteTemplateCategory({
          accountSetId: fmsStore.accountSetId!,
          id: row.id
        })
        if (resp.code === 0) {
          message.success(textConst.msg.delSuccess)
          await loadCategoryList()
          await fetchTemplateList()
        }
      }
    })
  }

  const handleDeleteTemplate = (row: API.FmsVoucherTemplateRespVO) => {
    if (!fmsStore.accountSetId) return
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除凭证模板 "${row.name}"？`,
      onOk: async () => {
        const resp = await fmsVoucherTemplateDeleteVoucherTemplate({
          accountSetId: fmsStore.accountSetId!,
          id: row.id
        })
        if (resp.code === 0) {
          message.success(textConst.msg.delSuccess)
          await fetchTemplateList()
        }
      }
    })
  }

  const handleBatchDeleteTemplates = () => {
    if (!fmsStore.accountSetId || !selectedRowKeys.length) return
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除选中的 ${selectedRowKeys.length} 个凭证模板？`,
      onOk: async () => {
        await Promise.all(
          selectedRowKeys.map((id) =>
            fmsVoucherTemplateDeleteVoucherTemplate({
              accountSetId: fmsStore.accountSetId!,
              id: Number(id)
            })
          )
        )
        message.success(textConst.msg.delSuccess)
        await fetchTemplateList()
      }
    })
  }

  const entryRowStyle: React.CSSProperties = {
    minHeight: 28,
    lineHeight: '28px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    borderBottom: '1px dashed #f0f0f0'
  }

  const columns: ColumnsType<API.FmsVoucherTemplateRespVO> = [
    {
      title: '模板类别',
      dataIndex: 'categoryName',
      align: 'center',
      width: 130
    },
    {
      title: '模板名称',
      dataIndex: 'name',
      width: 170
    },
    {
      title: '摘要',
      key: 'digest',
      minWidth: 190,
      render: (_, record) => (
        <div>
          {(record.entries || []).map((entry, idx) => (
            <div
              key={idx}
              title={entry.digest}
              style={{
                ...entryRowStyle,
                borderBottom:
                  idx === record.entries.length - 1 ? 'none' : entryRowStyle.borderBottom
              }}
            >
              {entry.digest}
            </div>
          ))}
        </div>
      )
    },
    {
      title: '会计科目',
      key: 'subject',
      minWidth: 230,
      render: (_, record) => (
        <div>
          {(record.entries || []).map((entry, idx) => {
            const subject = subjectMap.get(entry.subjectId)
            return (
              <div
                key={idx}
                style={{
                  ...entryRowStyle,
                  borderBottom:
                    idx === record.entries.length - 1 ? 'none' : entryRowStyle.borderBottom
                }}
              >
                {subject
                  ? `${subject.code} ${subject.name}`
                  : String(entry.subjectId || '-')}
              </div>
            )
          })}
        </div>
      )
    },
    {
      title: '借方金额',
      key: 'debitAmount',
      align: 'right',
      width: 135,
      render: (_, record) => (
        <div>
          {(record.entries || []).map((entry, idx) => (
            <div
              key={idx}
              style={{
                ...entryRowStyle,
                borderBottom:
                  idx === record.entries.length - 1 ? 'none' : entryRowStyle.borderBottom
              }}
            >
              {Number(entry.debitAmount) ? formatMoney(entry.debitAmount) : ''}
            </div>
          ))}
        </div>
      )
    },
    {
      title: '贷方金额',
      key: 'creditAmount',
      align: 'right',
      width: 135,
      render: (_, record) => (
        <div>
          {(record.entries || []).map((entry, idx) => (
            <div
              key={idx}
              style={{
                ...entryRowStyle,
                borderBottom:
                  idx === record.entries.length - 1 ? 'none' : entryRowStyle.borderBottom
              }}
            >
              {Number(entry.creditAmount) ? formatMoney(entry.creditAmount) : ''}
            </div>
          ))}
        </div>
      )
    },
    ...(fmsStore.isAccountSetWritable
      ? [
          {
            title: textConst.form.operate,
            key: 'action',
            align: 'center' as const,
            fixed: 'right' as const,
            width: 100,
            render: (_: any, record: API.FmsVoucherTemplateRespVO) => (
              <div style={tableActionStyle}>
                {hasPermi('fms:config:voucher-template:delete') && (
                  <a
                    style={deleteTextStyle}
                    onClick={() => handleDeleteTemplate(record)}
                  >
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
    <Row gutter={16}>
      {/* 左侧凭证模板类别栏 */}
      <Col xs={24} md={6} lg={5}>
        <Card
          title="模板类别"
          variant="borderless"
          extra={
            fmsStore.isAccountSetWritable && (
              <HasPermi value="fms:config:voucher-template-category:create">
                <Button
                  type="primary"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditCategoryId(undefined)
                    setCategoryFormVisible(true)
                  }}
                >
                  新增
                </Button>
              </HasPermi>
            )
          }
        >
          <Input
            value={categoryKeyword}
            onChange={(e) => setCategoryKeyword(e.target.value)}
            allowClear
            prefix={<SearchOutlined />}
            placeholder="请输入模板类别"
            style={{ marginBottom: 12 }}
          />
          <Spin spinning={categoryLoading}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div
                onClick={() => setSelectedCategoryId(undefined)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  border: `1px solid ${selectedCategoryId === undefined ? '#91caff' : '#f0f0f0'}`,
                  backgroundColor:
                    selectedCategoryId === undefined ? '#e6f4ff' : '#fff',
                  color:
                    selectedCategoryId === undefined
                      ? '#1677ff'
                      : 'rgba(0,0,0,0.88)',
                  fontWeight: selectedCategoryId === undefined ? 600 : 400
                }}
              >
                全部模板
              </div>

              {filteredCategoryList.map((item) => {
                const isSelected = item.id === selectedCategoryId
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedCategoryId(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      border: `1px solid ${isSelected ? '#91caff' : '#f0f0f0'}`,
                      backgroundColor: isSelected ? '#e6f4ff' : '#fff',
                      color: isSelected ? '#1677ff' : 'rgba(0,0,0,0.88)',
                      fontWeight: isSelected ? 600 : 400
                    }}
                  >
                    <span>{item.name}</span>
                    {fmsStore.isAccountSetWritable && (
                      <Space size={4} onClick={(e) => e.stopPropagation()}>
                        {hasPermi('fms:config:voucher-template-category:update') && (
                          <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined style={{ color: '#1677ff' }} />}
                            onClick={() => {
                              setEditCategoryId(item.id)
                              setCategoryFormVisible(true)
                            }}
                          />
                        )}
                        {hasPermi('fms:config:voucher-template-category:delete') && (
                          <Button
                            type="text"
                            size="small"
                            icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                            onClick={() => handleDeleteCategory(item)}
                          />
                        )}
                      </Space>
                    )}
                  </div>
                )
              })}
            </div>
          </Spin>
        </Card>
      </Col>

      {/* 右侧凭证模板列表 */}
      <Col xs={24} md={18} lg={19}>
        <Card variant="borderless" style={{ marginBottom: 16 }}>
          <Space wrap>
            <span>模板名称：</span>
            <Input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              allowClear
              placeholder="请输入模板名称"
              style={{ width: 220 }}
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => fetchTemplateList()}
            >
              {textConst.action.query}
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => setTemplateName('')}
            >
              {textConst.action.reset}
            </Button>
            {fmsStore.isAccountSetWritable && (
              <HasPermi value="fms:config:voucher-template:delete">
                <Button
                  danger
                  type="primary"
                  icon={<DeleteOutlined />}
                  disabled={selectedRowKeys.length === 0}
                  onClick={handleBatchDeleteTemplates}
                >
                  {textConst.action.batchDelete}
                </Button>
              </HasPermi>
            )}
          </Space>
        </Card>

        <Card variant="borderless">
          <Table<API.FmsVoucherTemplateRespVO>
            rowKey="id"
            loading={loading}
            dataSource={filteredTemplates}
            columns={columns}
            bordered
            size="middle"
            scroll={{ x: 'max-content' }}
            rowSelection={
              fmsStore.isAccountSetWritable
                ? {
                    selectedRowKeys,
                    onChange: setSelectedRowKeys
                  }
                : undefined
            }
            pagination={{
              defaultPageSize: 10,
              align: 'center',
              showSizeChanger: true
            }}
          />
        </Card>
      </Col>

      {fmsStore.accountSetId && (
        <FmsVoucherTemplateCategoryForm
          visible={categoryFormVisible}
          setVisible={setCategoryFormVisible}
          accountSetId={fmsStore.accountSetId}
          id={editCategoryId}
          onSuccess={async () => {
            await loadCategoryList()
            await fetchTemplateList()
          }}
        />
      )}
    </Row>
  )
}

export default VoucherTemplatePage
