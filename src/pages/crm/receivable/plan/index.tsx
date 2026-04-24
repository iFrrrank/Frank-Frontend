import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable, ProFormInstance } from '@ant-design/pro-components'
import {
  getReceivablePlanPage,
  deleteReceivablePlan,
  exportReceivablePlanExcel
} from '@/api/crm/receivablePlan'
import { getCustomerSimpleList } from '@/api/crm/customer'
import ReceivablePlanForm from './ReceivablePlanForm'
import { textConst } from '@/locales/zh-CN'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { handleDelete } from '@/components/Delete'
import { SCENE_TYPE } from '@/utils/constantsValue'
import { handleExport } from '@/components/Export'

const ReceivablePlanManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)
  const [sceneType, setSceneType] = useState<string>('1')

  const handleCreate = () => {
    setCurrentId(undefined)
    setFormVisible(true)
  }

  const handleUpdate = (id: number) => {
    setCurrentId(id)
    setFormVisible(true)
  }

  const handleExportBtnClick = () => {
    // 获取表单当前的值
    const formValues = formRef.current?.getFieldsValue?.() || {}
    handleExport({
      exportApi: exportReceivablePlanExcel,
      exportParams: { ...formValues },
      fileName: '回款计划列表.xlsx'
    })
  }

  const columns: ProColumns<API.CrmReceivablePlanRespVO>[] = [
    {
      title: '客户名称',
      dataIndex: 'customerId',
      width: 140,
      align: 'center',
      valueType: 'select',
      fieldProps: { placeholder: '请选择客户名称' },
      request: async () => {
        const res = await getCustomerSimpleList()
        return res.data?.map((item: any) => ({ label: item.name, value: item.id })) || []
      },
      render: (_, record) => record.customerName
    },
    {
      title: '合同编号',
      dataIndex: 'contractNo',
      width: 140,
      align: 'center',
      fieldProps: { placeholder: '请输入合同编号' }
    },
    {
      title: '期数',
      dataIndex: 'period',
      width: 100,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '计划回款金额（元）',
      dataIndex: 'price',
      width: 150,
      align: 'center',
      hideInSearch: true,
      render: (_, record) => (record.price ? record.price.toFixed(2) : '0.00')
    },
    {
      title: '计划回款日期',
      dataIndex: 'returnTime',
      valueType: 'date',
      width: 120,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '提前几天提醒',
      dataIndex: 'remindDays',
      width: 120,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '提醒日期',
      dataIndex: 'remindTime',
      valueType: 'date',
      width: 120,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '回款方式',
      dataIndex: 'returnType',
      width: 100,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 160,
      align: 'center',
      ellipsis: true,
      hideInSearch: true
    },
    {
      title: '负责人',
      dataIndex: 'ownerUserName',
      width: 100,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '实际回款金额（元）',
      dataIndex: 'receivablesPrice',
      width: 150,
      align: 'center',
      hideInSearch: true,
      render: (_, record) =>
        record.receivable?.price ? record.receivable?.price.toFixed(2) : '0.00'
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a key="update" onClick={() => handleUpdate(record.id as number)}>
            {textConst.action.update}
          </a>
          <a
            key="delete"
            style={deleteTextStyle}
            onClick={() =>
              handleDelete(record, deleteReceivablePlan, () => actionRef.current?.reload())
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
      <ProTable<API.CrmReceivablePlanRespVO>
        headerTitle="回款计划列表"
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        form={{ colon: false }}
        toolbar={{
          menu: {
            type: 'tab',
            activeKey: sceneType,
            items: Object.entries(SCENE_TYPE).map(([key, value]) => ({
              key: key,
              label: value.text
            })),
            onChange: (key) => {
              setSceneType(key as string)
              actionRef.current?.reload()
            }
          }
        }}
        request={async (params) => {
          const { current, pageSize, ...rest } = params
          const req = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            sceneType,
            ...rest
          }
          const res = await getReceivablePlanPage(req as any)
          return {
            data: res.data?.list || [],
            success: res.code === 0,
            total: res.data?.total || 0
          }
        }}
        search={{ labelWidth: 'auto', span: 6 }}
        pagination={{ align: 'center', showSizeChanger: true }}
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={handleCreate}>
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

      <ReceivablePlanForm
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

export default ReceivablePlanManagement
