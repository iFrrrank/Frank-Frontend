import React, { useEffect, useState } from 'react'
import { Button, Card, Dropdown, Modal, Space, Switch, Table, Tabs, Tag, message } from 'antd'
import type { MenuProps } from 'antd'
import {
  DownOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import {
  deleteSalaryOption,
  getSalaryOptionList,
  syncSalaryOption,
  updateSalaryOptionEnabled,
  updateSalaryOptionVisible
} from '@/api/hrm/salary/option'
import { textConst } from '@/locales/zh-CN'
import SalaryOptionForm from './SalaryOptionForm'

interface SalaryOptionTreeNode extends API.HrmSalaryOptionRespVO {
  children?: SalaryOptionTreeNode[]
}

const buildOptionTree = (list: API.HrmSalaryOptionRespVO[]): SalaryOptionTreeNode[] => {
  const map = new Map<number, SalaryOptionTreeNode>()
  list.forEach((item) => {
    map.set(item.code!, { ...item, children: [] })
  })

  const tree: SalaryOptionTreeNode[] = []
  list.forEach((item) => {
    const node = map.get(item.code!)!
    const parentCode = item.parentCode
    if (parentCode && parentCode !== 0 && map.has(parentCode)) {
      map.get(parentCode)!.children!.push(node)
    } else if (!parentCode || parentCode === 0) {
      tree.push(node)
    }
  })

  const cleanEmpty = (nodes: SalaryOptionTreeNode[]) => {
    nodes.forEach((n) => {
      if (n.children && n.children.length > 0) {
        cleanEmpty(n.children)
      } else {
        delete n.children
      }
    })
  }
  cleanEmpty(tree)
  return tree
}

const SalaryOptionPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [list, setList] = useState<API.HrmSalaryOptionRespVO[]>([])
  const [activeTab, setActiveTab] = useState<'enterprise' | 'system'>('enterprise')
  const [formVisible, setFormVisible] = useState(false)
  const [currentParentCode, setCurrentParentCode] = useState<number>()

  const fetchList = async () => {
    setLoading(true)
    try {
      const resp = await getSalaryOptionList()
      setList(resp.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  // 判断节点类型
  const isCategory = (item: API.HrmSalaryOptionRespVO) => !item.parentCode || item.parentCode === 0
  const isOptionalCategory = (item: API.HrmSalaryOptionRespVO) =>
    isCategory(item) && !!item.templateId && !item.systemFlag
  const isEnterpriseOption = (item: API.HrmSalaryOptionRespVO) =>
    !isCategory(item) && !item.systemFlag
  const isSystemStandardOption = (item: API.HrmSalaryOptionRespVO) =>
    !isCategory(item) && !!item.templateId && item.systemFlag

  // 获得分类下停用的标准薪资项
  const getInactiveStandardOptions = (category: API.HrmSalaryOptionRespVO) => {
    return list.filter(
      (item) => item.parentCode === category.code && item.templateId && !item.enabled
    )
  }

  // 过滤当前 tab 展示数据
  const enterpriseTree = buildOptionTree(
    list
      .filter((item) => !item.systemFlag)
      .filter((item) => {
        // 如果是子项，必须其本身 enabled
        if (!isCategory(item)) return item.enabled
        return true
      })
  )

  const systemTree = buildOptionTree(list.filter((item) => item.systemFlag))

  const activeData = activeTab === 'enterprise' ? enterpriseTree : systemTree

  // 同步标准薪资项
  const handleSync = async () => {
    setSyncing(true)
    try {
      await syncSalaryOption()
      message.success('同步完成，已保留启用和显示设置')
      fetchList()
    } catch {
      message.error(textConst.msg.updateError)
    } finally {
      setSyncing(false)
    }
  }

  // 更新启用状态
  const handleToggleEnabled = async (record: API.HrmSalaryOptionRespVO, enabled: boolean) => {
    try {
      await updateSalaryOptionEnabled({ id: record.id!, enabled })
      message.success(textConst.msg.updateSuccess)
      fetchList()
    } catch {
      message.error(textConst.msg.updateError)
    }
  }

  // 更新显示状态
  const handleToggleVisible = async (record: API.HrmSalaryOptionRespVO, visible: boolean) => {
    try {
      await updateSalaryOptionVisible({ id: record.id!, visible })
      message.success(textConst.msg.updateSuccess)
      fetchList()
    } catch {
      message.error(textConst.msg.updateError)
    }
  }

  // 恢复已移除的标准项
  const handleRestoreStandardOption = async (optionId: number) => {
    try {
      await updateSalaryOptionEnabled({ id: optionId, enabled: true })
      message.success(textConst.msg.createSuccess)
      fetchList()
    } catch {
      message.error(textConst.msg.createError)
    }
  }

  // 删除企业自定义项或停用标准项
  const handleDelete = (record: API.HrmSalaryOptionRespVO) => {
    Modal.confirm({
      title: textConst.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: `确认要删除薪资项"${record.name}"吗？`,
      okText: textConst.common.ok,
      cancelText: textConst.common.cancel,
      onOk: async () => {
        try {
          if (record.templateId) {
            await updateSalaryOptionEnabled({ id: record.id!, enabled: false })
          } else {
            await deleteSalaryOption({ id: record.id! })
          }
          message.success(textConst.msg.delSuccess)
          fetchList()
        } catch {
          message.error(textConst.msg.delError)
        }
      }
    })
  }

  const columns = [
    {
      title: '薪资项',
      dataIndex: 'name',
      key: 'name',
      minWidth: 220
    },
    {
      title: '类型',
      key: 'optionType',
      align: 'center' as const,
      width: 100,
      render: (_: any, record: API.HrmSalaryOptionRespVO) => {
        if (isCategory(record)) return <Tag>分类</Tag>
        if (record.templateId) return <Tag color="warning">标准项</Tag>
        return <Tag color="blue">自定义项</Tag>
      }
    },
    {
      title: '加减类型',
      dataIndex: 'type',
      key: 'type',
      align: 'center' as const,
      width: 100,
      render: (type: number, record: API.HrmSalaryOptionRespVO) => {
        if (isCategory(record) || type === 2) return '-'
        return type === 1 ? <Tag color="success">加项</Tag> : <Tag color="error">减项</Tag>
      }
    },
    {
      title: '计税',
      dataIndex: 'taxEnabled',
      key: 'taxEnabled',
      align: 'center' as const,
      width: 90,
      render: (taxEnabled: boolean, record: API.HrmSalaryOptionRespVO) => {
        if (isCategory(record)) return '-'
        return taxEnabled ? <Tag color="success">是</Tag> : <Tag>否</Tag>
      }
    },
    {
      title: activeTab === 'enterprise' ? '分类状态' : '显示状态',
      key: 'status',
      align: 'center' as const,
      width: 100,
      render: (_: any, record: API.HrmSalaryOptionRespVO) => {
        if (activeTab === 'enterprise' && isOptionalCategory(record)) {
          return (
            <Switch
              checked={record.enabled}
              onChange={(checked) => handleToggleEnabled(record, checked)}
            />
          )
        }
        if (activeTab === 'system' && isSystemStandardOption(record)) {
          return (
            <Switch
              checked={record.visible}
              onChange={(checked) => handleToggleVisible(record, checked)}
            />
          )
        }
        return '-'
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      minWidth: 160,
      render: (text: string) => text || '-'
    },
    ...(activeTab === 'enterprise'
      ? [
          {
            title: '操作',
            key: 'action',
            align: 'center' as const,
            width: 160,
            render: (_: any, record: API.HrmSalaryOptionRespVO) => {
              if (isOptionalCategory(record)) {
                if (!record.enabled) return '-'
                const inactiveOptions = getInactiveStandardOptions(record)
                const menuItems: MenuProps['items'] = [
                  ...inactiveOptions.map((opt) => ({
                    key: String(opt.id),
                    label: opt.name
                  })),
                  ...(inactiveOptions.length > 0 ? [{ type: 'divider' as const }] : []),
                  {
                    key: 'custom',
                    label: '自定义薪资项'
                  }
                ]

                const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
                  if (key === 'custom') {
                    setCurrentParentCode(record.code)
                    setFormVisible(true)
                  } else {
                    handleRestoreStandardOption(Number(key))
                  }
                }

                return (
                  <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }}>
                    <Button type="link">
                      <PlusOutlined /> 添加薪资项 <DownOutlined />
                    </Button>
                  </Dropdown>
                )
              }
              if (isEnterpriseOption(record)) {
                return (
                  <Button type="link" danger onClick={() => handleDelete(record)}>
                    {textConst.action.delete}
                  </Button>
                )
              }
              return '-'
            }
          }
        ]
      : [])
  ]

  return (
    <Card variant="borderless">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as any)}
          items={[
            { key: 'enterprise', label: '企业可选项' },
            { key: 'system', label: '系统默认项' }
          ]}
          style={{ marginBottom: -16 }}
        />
        <Button
          icon={<ReloadOutlined />}
          loading={syncing}
          onClick={handleSync}
          title="补齐并更新标准薪资项，保留已有项的启用和显示设置"
        >
          同步标准薪资项
        </Button>
      </div>

      <Table<SalaryOptionTreeNode>
        columns={columns}
        dataSource={activeData}
        rowKey="id"
        loading={loading}
        pagination={false}
        defaultExpandAllRows
      />

      <SalaryOptionForm
        visible={formVisible}
        setVisible={setFormVisible}
        parentCode={currentParentCode}
        onSuccess={fetchList}
      />
    </Card>
  )
}

export default SalaryOptionPage
