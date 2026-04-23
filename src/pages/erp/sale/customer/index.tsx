import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import { PlusOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable, ProFormInstance } from '@ant-design/pro-components'
import CustomerForm from './CustomerForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'
import { getCustomerPage, deleteCustomer, exportCustomerExcel } from '@/api/erp/sale/customer'
import { ERP_AUDIT_STATUS } from '@/utils/constantsValue'
import { handleExport } from '@/components/Export'

const CustomerManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  const handleExportBtnClick = () => {
    // 获取表单当前的值
    const formValues = formRef.current?.getFieldsValue?.() || {}
    handleExport({
      exportApi: exportCustomerExcel,
      exportParams: { ...formValues },
      fileName: '客户信息.xlsx'
    })
  }

  const columns: ProColumns<API.ErpCustomerRespVO>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
      width: 150,
      fieldProps: { placeholder: '请输入名称' }
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      align: 'center',
      width: 150,
      hideInSearch: true
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
      align: 'center',
      width: 150,
      fieldProps: { placeholder: '请输入手机号码' }
    },
    {
      title: '联系电话',
      dataIndex: 'telephone',
      align: 'center',
      width: 150,
      fieldProps: { placeholder: '请输入联系电话' }
    },
    {
      title: '电子邮箱',
      dataIndex: 'email',
      width: 200,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      width: 200,
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
      hideInSearch: true,
      valueType: 'select',
      valueEnum: ERP_AUDIT_STATUS
    },
    {
      title: textConst.table.action,
      valueType: 'option',
      width: 150,
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
            onClick={() => handleDelete(record, deleteCustomer, () => actionRef.current?.reload())}
          >
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<API.ErpCustomerRespVO>
        headerTitle="客户信息"
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
            const res = await getCustomerPage(req as any)
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

      <CustomerForm
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

export default CustomerManagement
