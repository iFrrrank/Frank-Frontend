import React, { useRef, useState } from 'react'
import { Button, Modal, message } from 'antd'
import { ImportOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { history } from '@umijs/max'
import ImportTable from './ImportTable'
import PreviewCode from './PreviewCode'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import {
  deleteCodegenTable,
  deleteCodegenTableList,
  downloadCodegen,
  getCodegenTablePage,
  syncCodegenFromDB
} from '@/api/infra/codegen'
import dayjs from 'dayjs'

// 代码生成表列表：导入/编辑/同步/预览/生成（下载 ZIP）/删除
const CodegenManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [importVisible, setImportVisible] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewRecord, setPreviewRecord] = useState<any>()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const reload = () => actionRef.current?.reload()

  const handleGenerate = async (record: any) => {
    const blob = (await downloadCodegen({ tableId: record.id })) as any
    const url = URL.createObjectURL(new Blob([blob], { type: 'application/zip' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${record.tableName || 'codegen'}.zip`
    link.click()
    URL.revokeObjectURL(url)
  }

  const columns: ProColumns<any>[] = [
    {
      title: '数据源',
      dataIndex: 'dataSourceConfigId',
      align: 'center',
      width: 90,
      hideInSearch: true
    },
    {
      title: '表名称',
      dataIndex: 'tableName',
      width: 200,
      fieldProps: { placeholder: '请输入表名称' }
    },
    {
      title: '表描述',
      dataIndex: 'tableComment',
      width: 180,
      fieldProps: { placeholder: '请输入表描述' },
      render: (_, record) => <span>{record.tableComment || '-'}</span>
    },
    {
      title: '实体类名称',
      dataIndex: 'className',
      width: 160,
      fieldProps: { placeholder: '请输入实体类名称' }
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
      width: 300,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a
            onClick={() => {
              setPreviewRecord(record)
              setPreviewVisible(true)
            }}
          >
            预览
          </a>
          <a onClick={() => handleGenerate(record)}>生成</a>
          <a onClick={() => history.push(`/infra/codegen/edit?id=${record.id}`)}>
            {textConst.action.update}
          </a>
          <a
            onClick={() =>
              Modal.confirm({
                title: '确认同步该表的数据库结构吗？',
                onOk: async () => {
                  await syncCodegenFromDB({ tableId: record.id })
                  message.success('同步成功')
                  reload()
                }
              })
            }
          >
            同步
          </a>
          <a
            style={deleteTextStyle}
            onClick={() =>
              Modal.confirm({
                title: textConst.msg.confirmTitle,
                content: textConst.msg.delDataMsg,
                onOk: async () => {
                  await deleteCodegenTable({ tableId: record.id })
                  message.success(textConst.msg.delSuccess)
                  reload()
                }
              })
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
        headerTitle="代码生成"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        search={{ labelWidth: 'auto', span: 6 }}
        request={async (params: Record<string, any>) => {
          const { current, pageSize, createTime, ...rest } = params
          const resp = await getCodegenTablePage({
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
          <Button type="primary" key="import" onClick={() => setImportVisible(true)}>
            <ImportOutlined /> 导入表
          </Button>,
          <Button
            key="batchDelete"
            danger
            disabled={selectedRowKeys.length === 0}
            onClick={() =>
              Modal.confirm({
                title: textConst.msg.confirmTitle,
                content: textConst.msg.delDataMsg,
                onOk: async () => {
                  await deleteCodegenTableList({
                    tableIds: (selectedRowKeys as number[]).join(',')
                  })
                  message.success(textConst.msg.batchDelSuccess)
                  setSelectedRowKeys([])
                  reload()
                }
              })
            }
          >
            {textConst.action.batchDelete}
          </Button>
        ]}
        pagination={{ align: 'center', showSizeChanger: true }}
      />

      <ImportTable
        visible={importVisible}
        setVisible={setImportVisible}
        onSuccess={reload}
      />
      <PreviewCode
        visible={previewVisible}
        setVisible={setPreviewVisible}
        tableId={previewRecord?.id}
        tableName={previewRecord?.tableName}
      />
    </>
  )
}

export default CodegenManagement
