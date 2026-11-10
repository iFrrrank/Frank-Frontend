import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Button, Dropdown, Modal, Space, Table, Tabs, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DownOutlined, PlusOutlined } from '@ant-design/icons'
import {
  fmsClosingTemplateDeleteClosingTemplate,
  fmsClosingTemplateGetClosingTemplateList
} from '@/api/fms/closing/template'
import HasPermi from '@/directives/permission/HasPermi'
import { useFmsStore } from '@/pages/fms/store/fms'
import {
  FMS_CLOSING_TEMPLATE_CATEGORY,
  FMS_CLOSING_TEMPLATE_CATEGORY_OPTIONS
} from '@/pages/fms/utils/constants'
import ClosingTemplateForm, { type ClosingTemplateFormRef } from './ClosingTemplateForm'

export interface ClosingTemplateSelectRef {
  open: () => void
}

interface ClosingTemplateSelectProps {
  accountSetId: number
  subjects: API.FmsSubjectRespVO[]
  onSelect: (template?: API.FmsClosingTemplateRespVO) => void
}

const ClosingTemplateSelect = forwardRef<ClosingTemplateSelectRef, ClosingTemplateSelectProps>(
  ({ accountSetId, subjects, onSelect }, ref) => {
    const fmsStore = useFmsStore()
    const categoryOptions = FMS_CLOSING_TEMPLATE_CATEGORY_OPTIONS

    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [category, setCategory] = useState<number>(FMS_CLOSING_TEMPLATE_CATEGORY.DAILY_EXPENSE)
    const [templates, setTemplates] = useState<API.FmsClosingTemplateRespVO[]>([])
    const templateFormRef = useRef<ClosingTemplateFormRef>(null)

    const getList = useCallback(async () => {
      if (!accountSetId) return
      setLoading(true)
      try {
        const resp = await fmsClosingTemplateGetClosingTemplateList({ accountSetId })
        if (resp.code === 0) {
          setTemplates(resp.data || [])
        }
      } finally {
        setLoading(false)
      }
    }, [accountSetId])

    useImperativeHandle(ref, () => ({
      open: async () => {
        setCategory(FMS_CLOSING_TEMPLATE_CATEGORY.DAILY_EXPENSE)
        setVisible(true)
        await getList()
      }
    }))

    const filteredTemplates = useMemo(
      () => templates.filter((item) => item.category === category),
      [templates, category]
    )

    const selectTemplate = (template: API.FmsClosingTemplateRespVO) => {
      onSelect(template)
      setVisible(false)
    }

    const createBlankScheme = () => {
      onSelect(undefined)
      setVisible(false)
    }

    const deleteTemplate = (template: API.FmsClosingTemplateRespVO) => {
      if (!template.id) return
      Modal.confirm({
        title: '系统提示',
        content: `确认删除结账模板“${template.name}”吗？`,
        onOk: async () => {
          const resp = await fmsClosingTemplateDeleteClosingTemplate({
            accountSetId,
            id: template.id!
          })
          if (resp.code === 0) {
            message.success('删除成功')
            await getList()
          }
        }
      })
    }

    const columns: ColumnsType<API.FmsClosingTemplateRespVO> = [
      {
        title: '模板名称',
        dataIndex: 'name',
        width: 260
      },
      {
        title: '分录数',
        align: 'center',
        width: 90,
        render: (_, row) => row.subjects?.length || 0
      },
      {
        title: '操作',
        align: 'center',
        width: 210,
        render: (_, row) => (
          <Space size="small">
            <Button type="link" style={{ padding: 0 }} onClick={() => selectTemplate(row)}>
              使用
            </Button>
            {fmsStore.isAccountSetWritable && (
              <HasPermi value="fms:closing:update">
                <Button
                  type="link"
                  style={{ padding: 0 }}
                  onClick={() => templateFormRef.current?.open('update', row)}
                >
                  编辑
                </Button>
                <Button
                  type="link"
                  danger
                  style={{ padding: 0 }}
                  onClick={() => deleteTemplate(row)}
                >
                  删除
                </Button>
              </HasPermi>
            )}
          </Space>
        )
      }
    ]

    return (
      <>
        <Modal
          title="选择结转模板"
          open={visible}
          width={760}
          footer={null}
          onCancel={() => setVisible(false)}
          destroyOnHidden
        >
          <div
            style={{
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20
            }}
          >
            <Tabs
              activeKey={String(category)}
              style={{ flex: 1, minWidth: 0, marginBottom: 0 }}
              items={categoryOptions.map((item) => ({
                key: String(item.value),
                label: item.label
              }))}
              onChange={(key) => setCategory(Number(key))}
            />
            {fmsStore.isAccountSetWritable && (
              <HasPermi value="fms:closing:update">
                <Dropdown
                  menu={{
                    items: [
                      { key: 'template', label: '新增模板' },
                      { key: 'scheme', label: '新增方案' }
                    ],
                    onClick: ({ key }) => {
                      if (key === 'template') {
                        templateFormRef.current?.open('create', undefined, category)
                      } else {
                        createBlankScheme()
                      }
                    }
                  }}
                >
                  <Button type="primary" ghost icon={<PlusOutlined />}>
                    新增 <DownOutlined />
                  </Button>
                </Dropdown>
              </HasPermi>
            )}
          </div>

          <Table<API.FmsClosingTemplateRespVO>
            rowKey="id"
            loading={loading}
            dataSource={filteredTemplates}
            columns={columns}
            bordered
            pagination={false}
            onRow={(record) => ({
              onDoubleClick: () => selectTemplate(record)
            })}
          />
          <div style={{ marginTop: 12, fontSize: 12, color: '#909399' }}>
            双击模板可直接进入结账方案表单
          </div>
        </Modal>

        <ClosingTemplateForm
          ref={templateFormRef}
          accountSetId={accountSetId}
          subjects={subjects}
          onSuccess={getList}
        />
      </>
    )
  }
)

ClosingTemplateSelect.displayName = 'ClosingTemplateSelect'

export default ClosingTemplateSelect
