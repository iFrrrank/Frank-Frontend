import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable, ProFormInstance } from '@ant-design/pro-components'
import SupplierForm from './SupplierForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'
import { getSupplierPage, deleteSupplier, exportSupplierExcel } from '@/api/erp/purchase/supplier'
import { COMMON_STATUS } from '@/utils/constantsValue'
import { handleExport } from '@/components/Export'

const SupplierManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  const handleExportBtnClick = () => {
    // 获取表单当前的值
    const formValues = formRef.current?.getFieldsValue?.() || {}
    handleExport({
      exportApi: exportSupplierExcel,
      exportParams: { ...formValues },
      fileName: '供应商列表.xlsx'
    })
  }

  const columns: ProColumns<API.ErpSupplierRespVO>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
      fieldProps: { placeholder: '请输入名称' }
    },
    { title: '联系人', dataIndex: 'contact', align: 'center', hideInSearch: true },
    {
      title: '手机号码',
      dataIndex: 'mobile',
      align: 'center',
      fieldProps: { placeholder: '请输入手机号码' }
    },
    {
      title: '联系电话',
      dataIndex: 'telephone',
      align: 'center',
      fieldProps: { placeholder: '请输入联系电话' }
    },
    { title: '电子邮箱', dataIndex: 'email', align: 'center', hideInSearch: true },
    { title: '备注', dataIndex: 'remark', align: 'center', hideInSearch: true },
    { title: '排序', dataIndex: 'sort', align: 'center', hideInSearch: true },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      hideInSearch: true,
      valueType: 'select',
      valueEnum: COMMON_STATUS
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
            onClick={() => handleDelete(record, deleteSupplier, () => actionRef.current?.reload())}
          >
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<API.ErpSupplierRespVO>
        headerTitle="供应商信息"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        search={{ labelWidth: 'auto', span: 6 }}
        options={false}
        request={async (params) => {
          const { current, pageSize, ...rest } = params
          const req = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...rest
          }
          try {
            const res = await getSupplierPage(req as any)
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

      <SupplierForm
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

export default SupplierManagement
