import React, { useRef, useState } from 'react'
import { Avatar, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import Demo01ContactForm, { SEX_OPTIONS } from './Demo01ContactForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete, handleBatchDelete } from '@/components/Delete'
import { handleExport } from '@/components/Export'
import {
  deleteDemo01Contact,
  deleteDemo01ContactList,
  exportDemo01Contact,
  getDemo01ContactPage
} from '@/api/infra/demo01'
import dayjs from 'dayjs'

// 示例联系人列表（单表 CRUD 示例页）
const Demo01ContactManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const columns: ProColumns<any>[] = [
    { title: '编号', dataIndex: 'id', align: 'center', width: 80, hideInSearch: true },
    {
      title: '名字',
      dataIndex: 'name',
      align: 'center',
      width: 140,
      fieldProps: { placeholder: '请输入名字' }
    },
    {
      title: '性别',
      dataIndex: 'sex',
      align: 'center',
      width: 90,
      valueType: 'select',
      fieldProps: { options: SEX_OPTIONS },
      render: (_, record) => SEX_OPTIONS.find((o) => o.value === record.sex)?.label || '-'
    },
    {
      title: '出生年',
      dataIndex: 'birthday',
      align: 'center',
      width: 110,
      hideInSearch: true,
      render: (_, record) => (record.birthday ? dayjs(record.birthday).format('YYYY') : '-')
    },
    {
      title: '简介',
      dataIndex: 'description',
      align: 'center',
      ellipsis: true,
      hideInSearch: true,
      render: (_, record) => <span>{record.description || '-'}</span>
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      align: 'center',
      width: 90,
      hideInSearch: true,
      render: (_, record) =>
        record.avatar ? <Avatar src={record.avatar} /> : <span>-</span>
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 170,
      valueType: 'dateRange'
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
            onClick={() => handleDelete(record, deleteDemo01Contact, () => actionRef.current?.reload())}
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
        headerTitle="示例联系人"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        search={{ labelWidth: 'auto', span: 6 }}
        request={async (params: Record<string, any>) => {
          const { current, pageSize, createTime, ...rest } = params
          const resp = await getDemo01ContactPage({
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...rest,
            createTime:
              createTime?.length === 2
                ? [
                    dayjs(createTime[0]).format('YYYY-MM-DD 00:00:00'),
                    dayjs(createTime[1]).format('YYYY-MM-DD 23:59:59')
                  ]
                : undefined
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
                deleteDemo01ContactList,
                () => setSelectedRowKeys([]),
                () => actionRef.current?.reload()
              )
            }
          >
            {textConst.action.batchDelete}
          </Button>,
          <Button
            key="export"
            onClick={() =>
              handleExport({
                exportApi: exportDemo01Contact,
                exportParams: {},
                fileName: '示例联系人.xls'
              })
            }
          >
            {textConst.action.export}
          </Button>
        ]}
        pagination={{ align: 'center', showSizeChanger: true }}
      />

      <Demo01ContactForm
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

export default Demo01ContactManagement
