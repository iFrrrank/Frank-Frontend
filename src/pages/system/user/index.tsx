import React, { useRef } from 'react'
import { Col, Row, Button } from 'antd'
import { PlusOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable, TableDropdown } from '@ant-design/pro-components'
import DeptTree from '@/pages/system/user/DeptTree'
import { getUserPage } from '@/api/system/user'

export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time)
}

const columns: ProColumns<API.UserRespVO>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    align: 'center',
    copyable: true,
    ellipsis: true,
    valueType: 'text',
    fieldProps: {
      placeholder: '请输入员工ID'
    },
    filterSearch: true,
    filters: true
  },
  {
    title: '用户名',
    dataIndex: 'username',
    align: 'center',
    copyable: true,
    ellipsis: true,
    valueType: 'text',
    fieldProps: {
      placeholder: '请输入用户名'
    }
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    align: 'center',
    copyable: true,
    ellipsis: true,
    valueType: 'text',
    fieldProps: {
      placeholder: '请输入邮箱'
    }
  },
  {
    disable: true,
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    filters: true,
    onFilter: true,
    ellipsis: true,
    valueType: 'select',
    valueEnum: {
      0: {
        text: '开启',
        status: 'Success'
      },
      1: {
        text: '关闭',
        status: 'Error'
      }
    },
    fieldProps: {
      placeholder: '请选择状态'
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    valueType: 'date',
    align: 'center',
    ellipsis: true,
    sorter: true,
    hideInSearch: true
  },
  {
    title: '操作',
    valueType: 'option',
    ellipsis: true,
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id)
        }}
      >
        编辑
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' }
        ]}
      />
    ]
  }
]

const App: React.FC = () => {
  // @ts-ignore
  const actionRef = useRef<ActionType>()

  return (
    <Row>
      <Col span={4}>
        <DeptTree />
      </Col>
      <Col span={20} style={{ paddingLeft: 8 }}>
        <ProTable<API.UserRespVO>
          columns={columns}
          actionRef={actionRef}
          cardBordered
          request={async (params: Record<string, any>) => {
            await waitTime(1000)
            const { current, pageSize, ...rest } = params
            const resp = await getUserPage({
              pageReqVO: {
                pageNo: params.current,
                pageSize: params.pageSize
              },
              ...rest
            })
            return {
              data: resp.data?.list,
              success: true,
              total: resp.data?.total
            }
          }}
          editable={{
            type: 'multiple'
          }}
          columnsState={{
            persistenceKey: 'pro-table-singe-demos',
            persistenceType: 'localStorage',
            defaultValue: {
              option: { fixed: 'right', disable: true }
            },
            onChange(value) {
              console.log('value: ', value)
            }
          }}
          rowKey="id"
          search={{
            labelWidth: 'auto'
          }}
          options={{
            setting: {
              listsHeight: 400
            }
          }}
          pagination={{
            align: 'center',
            showSizeChanger: true,
            onChange: (page) => console.log(page)
          }}
          dateFormatter="string"
          headerTitle="用户管理"
          toolBarRender={() => [
            <Button
              key="button"
              icon={<PlusOutlined />}
              onClick={() => {
                actionRef.current?.reload()
              }}
              type="primary"
            >
              新建
            </Button>,
            <Button
              key="button"
              icon={<DownloadOutlined />}
              onClick={() => {
                actionRef.current?.reload()
              }}
              type="primary"
            >
              导入
            </Button>,
            <Button
              key="button"
              icon={<UploadOutlined />}
              onClick={() => {
                actionRef.current?.reload()
              }}
              type="primary"
            >
              导出
            </Button>
          ]}
        />
      </Col>
    </Row>
  )
}

export default App
