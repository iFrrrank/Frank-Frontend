import React, { useEffect, useState } from 'react'
import { Alert, Button, Card, Form, Input, Space, Table, Tooltip } from 'antd'
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { history } from '@umijs/max'
import { getSimpleDeptList } from '@/api/system/dept'
import { getEmployeeDeptStatistics } from '@/api/hrm/employee'
import { textConst } from '@/locales/zh-CN'

interface EmployeeStatistics {
  activeCount: number
  fullTimeCount: number
  nonFullTimeCount: number
}

interface DeptTreeNode extends API.SystemDeptSimpleRespVO {
  children?: DeptTreeNode[]
  directStatistics: EmployeeStatistics
  totalStatistics: EmployeeStatistics
}

const EMPTY_STATISTICS: EmployeeStatistics = {
  activeCount: 0,
  fullTimeCount: 0,
  nonFullTimeCount: 0
}

/** 构建包含直属与下级人数统计的组织树 */
function buildDeptTree(
  deptList: API.SystemDeptSimpleRespVO[],
  statisticsList: API.HrmEmployeeDeptStatisticsRespVO[]
): DeptTreeNode[] {
  const map = new Map<number, DeptTreeNode>()
  deptList.forEach((dept) => {
    const directStatistics = statisticsList.find((s) => s.deptId === dept.id) || {
      ...EMPTY_STATISTICS
    }
    map.set(dept.id!, {
      ...dept,
      children: [],
      directStatistics,
      totalStatistics: { ...directStatistics }
    })
  })

  const tree: DeptTreeNode[] = []
  deptList.forEach((dept) => {
    const node = map.get(dept.id!)!
    const parentId = dept.parentId
    if (parentId && map.has(parentId)) {
      map.get(parentId)!.children!.push(node)
    } else {
      tree.push(node)
    }
  })

  // 递归计算包含下级的 totalStatistics
  function calculateTotal(node: DeptTreeNode): EmployeeStatistics {
    let activeCount = node.directStatistics.activeCount
    let fullTimeCount = node.directStatistics.fullTimeCount
    let nonFullTimeCount = node.directStatistics.nonFullTimeCount

    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        const childTotal = calculateTotal(child)
        activeCount += childTotal.activeCount
        fullTimeCount += childTotal.fullTimeCount
        nonFullTimeCount += childTotal.nonFullTimeCount
      })
    } else {
      delete node.children
    }

    node.totalStatistics = {
      activeCount,
      fullTimeCount,
      nonFullTimeCount
    }
    return node.totalStatistics
  }

  tree.forEach(calculateTotal)
  return tree
}

/** 按部门名称过滤组织树，并保留命中节点的上级路径 */
function filterDeptTree(deptList: DeptTreeNode[], keyword?: string): DeptTreeNode[] {
  if (!keyword || !keyword.trim()) {
    return deptList
  }
  const kw = keyword.trim()
  return deptList.reduce<DeptTreeNode[]>((result, dept) => {
    const children = filterDeptTree(dept.children || [], kw)
    if (dept.name?.includes(kw) || children.length > 0) {
      result.push({
        ...dept,
        children: children.length > 0 ? children : undefined
      })
    }
    return result
  }, [])
}

const HrmDeptPage: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [deptTree, setDeptTree] = useState<DeptTreeNode[]>([])
  const [keyword, setKeyword] = useState<string>('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const [deptResp, statsResp] = await Promise.all([
        getSimpleDeptList(),
        getEmployeeDeptStatistics()
      ])
      const tree = buildDeptTree(deptResp.data || [], statsResp.data || [])
      setDeptTree(tree)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSearch = () => {
    const values = form.getFieldsValue()
    setKeyword(values.name || '')
  }

  const handleReset = () => {
    form.resetFields()
    setKeyword('')
  }

  const filteredData = filterDeptTree(deptTree, keyword)

  const columns = [
    {
      title: '部门名称',
      dataIndex: 'name',
      key: 'name',
      minWidth: 260,
      render: (name: string, record: DeptTreeNode) => (
        <a onClick={() => history.push(`/hrm/dept/detail?id=${record.id}`)}>{name}</a>
      )
    },
    {
      title: (
        <Tooltip title="直属在职人数（包含下级部门在职人数）" placement="top">
          <span>在职员工</span>
        </Tooltip>
      ),
      key: 'activeCount',
      align: 'center' as const,
      minWidth: 160,
      render: (_: any, record: DeptTreeNode) =>
        `${record.directStatistics.activeCount}（${record.totalStatistics.activeCount}）`
    },
    {
      title: (
        <Tooltip title="直属全职人数（包含下级部门全职人数）" placement="top">
          <span>全职员工</span>
        </Tooltip>
      ),
      key: 'fullTimeCount',
      align: 'center' as const,
      minWidth: 160,
      render: (_: any, record: DeptTreeNode) =>
        `${record.directStatistics.fullTimeCount}（${record.totalStatistics.fullTimeCount}）`
    },
    {
      title: (
        <Tooltip title="直属非全职人数（包含下级部门非全职人数）" placement="top">
          <span>非全职人数</span>
        </Tooltip>
      ),
      key: 'nonFullTimeCount',
      align: 'center' as const,
      minWidth: 160,
      render: (_: any, record: DeptTreeNode) =>
        `${record.directStatistics.nonFullTimeCount}（${record.totalStatistics.nonFullTimeCount}）`
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card variant="borderless">
        <Form form={form} layout="inline" colon={false}>
          <Form.Item name="name" label="部门名称">
            <Input
              placeholder="请输入部门名称"
              allowClear
              onPressEnter={handleSearch}
              style={{ width: 240 }}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                {textConst.action.query}
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                {textConst.action.reset}
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => history.push('/system/dept')}
              >
                新建部门
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card variant="borderless">
        <Alert
          message="人数格式为：直属人数（包含下级部门人数）"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Table<DeptTreeNode>
          loading={loading}
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={false}
          defaultExpandAllRows
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  )
}

export default HrmDeptPage
