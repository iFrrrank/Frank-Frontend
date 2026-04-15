import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import {
  type ActionType,
  type ProColumns,
  type ProFormInstance,
  ProTable
} from '@ant-design/pro-components'
import {
  CaretDownOutlined,
  CaretRightOutlined,
  PlusOutlined,
  SwapOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import { deleteDept, getDeptList } from '@/api/system/dept'
import { getSimpleUserList } from '@/api/system/user'
import { textConst } from '@/locales/zh-CN'
import SaveDeptForm, { handleCreateDept, handleEditDept } from '@/pages/system/dept/SaveDeptForm'
import { handleTreeData } from '@/utils/tree'
import { handleBatchDelete, handleDelete } from '@/components/Delete'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'

const DeptManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  // 树表格展开控制
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>([])
  const [isExpandAll, setIsExpandAll] = useState(false)
  const [allKeys, setAllKeys] = useState<React.Key[]>([])
  const [hasInitExpanded, setHasInitExpanded] = useState(false)

  // 全量扁平数据（用于在创建弹窗里选择父级）
  const [flatDeptData, setFlatDeptData] = useState<any[]>([])

  // 用户选项缓存，用于匹配表格的负责人显示
  const [userList, setUserList] = useState<any[]>([])

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // 展开折叠切换
  const handleToggleExpandAll = () => {
    const nextState = !isExpandAll
    setIsExpandAll(nextState)
    if (nextState) {
      setExpandedRowKeys(allKeys)
    } else {
      setExpandedRowKeys([])
    }
  }

  // 获取用户列表（负责人字典）
  const fetchUserList = async () => {
    if (userList.length > 0) return userList
    try {
      const resp = await getSimpleUserList()
      if (resp.code === 0 && resp.data) {
        setUserList(resp.data)
        return resp.data
      }
    } catch {}
    return []
  }

  const columns: ProColumns<any>[] = [
    {
      title: '部门名称',
      dataIndex: 'name',
      width: 250,
      fieldProps: {
        placeholder: '请输入部门名称'
      }
    },
    {
      title: '负责人',
      dataIndex: 'leaderUserId',
      hideInSearch: true,
      width: 150,
      render: (_, record) => {
        // 如果后端有直接返回 leaderName 就直接使用，或者根据 ID 到 userList 里查询
        const leader = userList.find((u) => u.id === record.leaderUserId)
        return <span>{leader?.nickname || record.leader || ''}</span>
      }
    },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      hideInSearch: true,
      width: 100
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      valueType: 'select',
      valueEnum: {
        0: { text: '开启', status: 'Success' },
        1: { text: '关闭', status: 'Error' }
      },
      fieldProps: {
        placeholder: '请选择部门状态'
      }
    },
    {
      title: textConst.columns.createTime,
      dataIndex: 'createTime',
      align: 'center',
      hideInSearch: true,
      width: 180,
      valueType: 'dateTime'
    },
    {
      title: textConst.form.operate,
      valueType: 'option',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a onClick={() => handleEditDept(record)}>{textConst.action.update}</a>
          <a
            style={deleteTextStyle}
            onClick={() =>
              handleDelete(
                record,
                deleteDept,
                () => actionRef.current?.reload(),
                '确认删除该部门？（若存在子部门则不允许删除）'
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
        headerTitle="部门管理"
        columns={columns}
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        formRef={formRef}
        form={{ colon: false }}
        cardBordered
        pagination={false}
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys)
          }
        }}
        // 控制展开和折叠状态
        expandable={{
          expandedRowKeys,
          onExpandedRowsChange: (keys) => {
            setExpandedRowKeys(keys)
            if (keys.length === 0) setIsExpandAll(false)
          },
          expandIcon: ({ expanded, onExpand, record }) => {
            if (record.children && record.children.length > 0) {
              return expanded ? (
                <CaretDownOutlined
                  style={{ marginRight: 8, cursor: 'pointer', color: '#666' }}
                  onClick={(e) => onExpand(record, e)}
                />
              ) : (
                <CaretRightOutlined
                  style={{ marginRight: 8, cursor: 'pointer', color: '#666' }}
                  onClick={(e) => onExpand(record, e)}
                />
              )
            }
            return <span style={{ display: 'inline-block', width: 22 }} />
          }
        }}
        request={async (params) => {
          // 初始化加载一下户列表以供映射渲染
          await fetchUserList()

          const { name, status } = params
          // getDeptList params
          const resp = await getDeptList({
            ...(name ? { name } : {}),
            ...(status !== undefined && status !== '' ? { status: String(status) } : {})
          } as any)

          if (resp.code === 0 && resp.data) {
            const list = resp.data || []
            setFlatDeptData(list)

            // 提取所有父节点 id 用于全部展开
            const parentKeys: React.Key[] = list
              .filter((item) => list.some((child) => child.parentId === item.id))
              .map((item) => item.id as number)
            setAllKeys(parentKeys)

            if (!hasInitExpanded && list.length > 0) {
              setExpandedRowKeys(parentKeys)
              setIsExpandAll(true)
              setHasInitExpanded(true)
            }

            // 构建树形数据
            const treeData = handleTreeData(list, 0)
            return {
              data: treeData,
              success: true
            }
          }
          return { data: [], success: true }
        }}
        search={{
          labelWidth: 'auto',
          span: 6,
          defaultCollapsed: false
        }}
        options={false}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleCreateDept()}
          >
            {textConst.action.create}
          </Button>,
          <Button
            key="expand"
            type="default"
            color="blue"
            variant="outlined"
            icon={<SwapOutlined rotate={90} />}
            onClick={handleToggleExpandAll}
          >
            {textConst.action.expandOrCollapse}
          </Button>,
          <Button
            key="batchDelete"
            icon={<DeleteOutlined />}
            danger
            type="primary"
            disabled={selectedRowKeys.length === 0}
            onClick={() =>
              handleBatchDelete(
                selectedRowKeys,
                deleteDept,
                () => setSelectedRowKeys([]),
                () => actionRef.current?.reload()
              )
            }
          >
            {textConst.action.batchDelete}
          </Button>
        ]}
      />

      <SaveDeptForm onSuccess={() => actionRef.current?.reload()} />
    </>
  )
}

export default DeptManagement
