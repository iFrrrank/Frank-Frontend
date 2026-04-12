import React, { useRef, useState } from 'react'
import { Button, message, Switch } from 'antd'
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import WarehouseForm from './WarehouseForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'
import { COMMON_STATUS } from '@/utils/constantsValue'
import {
  getWarehousePage,
  deleteWarehouse,
  updateWarehouseDefaultStatus
} from '@/api/erp/stock/warehouse'

const WarehouseManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  const handleExportBtnClick = async () => {
    try {
      message.loading({ content: '正在导出...', key: 'export' })
      message.success({ content: '导出成功', key: 'export' })
    } catch (e) {
      message.error({ content: '导出失败', key: 'export' })
    }
  }

  const handleDefaultStatusChange = async (checked: boolean, record: any) => {
    try {
      await updateWarehouseDefaultStatus({ id: record.id, defaultStatus: checked } as any)
      message.success('状态更新成功')
      actionRef.current?.reload()
    } catch (e) {
      message.error('状态更新失败')
    }
  }

  const columns: ProColumns<API.ErpWarehouseRespVO>[] = [
    {
      title: '仓库名称',
      dataIndex: 'name',
      align: 'center',
      width: 150,
      fieldProps: { placeholder: '请输入仓库名称' }
    },
    {
      title: '仓库地址',
      dataIndex: 'address',
      align: 'center',
      width: 180,
      hideInSearch: true
    },
    {
      title: '仓储费',
      dataIndex: 'warehousePrice',
      align: 'center',
      width: 150,
      hideInSearch: true
    },
    {
      title: '搬运费',
      dataIndex: 'truckagePrice',
      align: 'center',
      width: 150,
      hideInSearch: true
    },
    {
      title: '负责人',
      dataIndex: 'principal',
      align: 'center',
      width: 150,
      hideInSearch: true
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      width: 150,
      hideInSearch: true
    },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      width: 150,
      hideInSearch: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 150,
      fieldProps: { placeholder: '请选择仓库状态' },
      valueType: 'select',
      valueEnum: COMMON_STATUS
    },
    {
      title: '是否默认',
      dataIndex: 'defaultStatus',
      align: 'center',
      width: 150,
      hideInSearch: true,
      render: (_, record: any) => (
        <Switch
          checked={record.defaultStatus}
          onChange={(checked) => handleDefaultStatusChange(checked, record)}
        />
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      align: 'center',
      width: 150,
      hideInSearch: true
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
            key="update"
            onClick={() => {
              setCurrentId(record.id)
              setFormVisible(true)
            }}
          >
            {textConst.action.update}
          </a>
          <a
            key="delete"
            style={deleteTextStyle}
            onClick={() => handleDelete(record, deleteWarehouse, () => actionRef.current?.reload())}
          >
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<API.ErpWarehouseRespVO>
        headerTitle="仓库管理"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        search={{ labelWidth: 'auto', span: 6 }}
        request={async (params) => {
          const { current, pageSize, ...rest } = params
          const req = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...rest
          }
          try {
            const res = await getWarehousePage(req as any)
            return {
              data: res.data?.list || [],
              success: res.code === 0,
              total: res.data?.total || 0
            }
          } catch (error) {
            return { data: [], success: false, total: 0 }
          }
        }}
        pagination={{ align: 'center', showSizeChanger: true }}
        toolBarRender={() => [
          <Button
            key="create"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setCurrentId(undefined)
              setFormVisible(true)
            }}
          >
            {textConst.action.create}
          </Button>,
          <Button
            key="export"
            color="volcano"
            variant="outlined"
            icon={<DownloadOutlined />}
            onClick={handleExportBtnClick}
          >
            {textConst.action.export}
          </Button>
        ]}
      />

      <WarehouseForm
        visible={formVisible}
        setVisible={setFormVisible}
        id={currentId}
        onSuccess={() => {
          setFormVisible(false)
          actionRef.current?.reload()
        }}
      />
    </>
  )
}

export default WarehouseManagement
