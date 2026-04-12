import React, { useRef, useState } from 'react'
import { Button, message, Switch } from 'antd'
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import AccountForm from './AccountForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'
import {
  getAccountPage,
  deleteAccount,
  updateAccountDefaultStatus
} from '@/api/erp/finance/account'
import { COMMON_STATUS } from '@/utils/constantsValue'

const AccountManagement: React.FC = () => {
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
      await updateAccountDefaultStatus({ id: record.id, defaultStatus: checked } as any)
      message.success('状态更新成功')
      actionRef.current?.reload()
    } catch (e) {
      message.error('状态更新失败')
    }
  }

  const columns: ProColumns<API.ErpAccountRespVO>[] = [
    {
      title: '账户名称',
      dataIndex: 'name',
      align: 'center',
      width: 200,
      fieldProps: { placeholder: '请输入账户名称' }
    },
    {
      title: '账户编码',
      dataIndex: 'code',
      align: 'center',
      width: 200,
      fieldProps: { placeholder: '请输入账户编码' }
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 200,
      hideInSearch: true,
      valueType: 'select',
      valueEnum: COMMON_STATUS
    },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      width: 200,
      hideInSearch: true
    },
    {
      title: '是否默认',
      dataIndex: 'defaultStatus',
      align: 'center',
      width: 200,
      hideInSearch: true,
      render: (_, record: any) => (
        <Switch
          checked={record.defaultStatus} // 假设 boolean 或者 1/0
          onChange={(checked) => handleDefaultStatusChange(checked, record)}
        />
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 200,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      width: 200,
      hideInSearch: true,
      fieldProps: { placeholder: '请输入备注' }
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
            onClick={() => handleDelete(record, deleteAccount, () => actionRef.current?.reload())}
          >
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<API.ErpAccountRespVO>
        headerTitle="结算账户"
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
            const res = await getAccountPage(req as any)
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

      <AccountForm
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

export default AccountManagement
