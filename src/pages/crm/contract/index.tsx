import { history } from '@umijs/max'
import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable, ProFormInstance } from '@ant-design/pro-components'
import { getContractPage } from '@/api/crm/contract'
import { getCustomerSimpleList, exportCustomerExcel } from '@/api/crm/customer'
import ContractForm from './ContractForm'
import { SCENE_TYPE, AUDIT_STATUS } from '@/utils/constantsValue'
import {} from '@/utils/constantsValue'
import { tableActionStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleExport } from '@/components/Export'

const ContractManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)
  const [sceneType, setSceneType] = useState<string>('1')

  const handleAdd = () => {
    setCurrentId(undefined)
    setFormVisible(true)
  }

  const handleUpdate = (id: number) => {
    setCurrentId(id)
    setFormVisible(true)
  }

  // const handleDelete = async (id: number) => {
  //   try {
  //     await deleteContract({ id })
  //     message.success('删除成功')
  //     actionRef.current?.reload()
  //   } catch (error) {
  //     message.error('删除失败')
  //   }
  // }

  const handleExportBtnClick = () => {
    // 获取表单当前的值
    const formValues = formRef.current?.getFieldsValue?.() || {}
    handleExport({
      exportApi: exportCustomerExcel,
      exportParams: { ...formValues },
      fileName: '合同数据.xlsx'
    })
  }

  const columns: ProColumns<API.CrmContractRespVO>[] = [
    {
      title: '合同编号',
      dataIndex: 'no',
      width: 140,
      align: 'center',
      fieldProps: {
        placeholder: '请输入合同编号'
      }
    },
    {
      title: '合同名称',
      dataIndex: 'name',
      width: 160,
      align: 'center',
      fieldProps: {
        placeholder: '请输入合同名称'
      },
      render: (_, record) => (
        <a onClick={() => history.push('/crm/contract/detail?id=' + record.id)}>{record.name}</a>
      )
    },
    {
      title: '客户',
      dataIndex: 'customerId',
      width: 140,
      align: 'center',
      valueType: 'select',
      fieldProps: {
        placeholder: '请选择客户'
      },
      request: async () => {
        const res = await getCustomerSimpleList()
        return res.data?.map((item: any) => ({ label: item.name, value: item.id })) || []
      },
      render: (_, record) => record.customerName
    },
    {
      title: '商机名称',
      dataIndex: 'businessName',
      align: 'center',
      width: 140,
      hideInSearch: true
    },
    {
      title: '合同金额（元）',
      dataIndex: 'totalPrice',
      width: 120,
      align: 'center',
      hideInSearch: true,
      render: (_, record) => (record.totalPrice ? record.totalPrice.toFixed(2) : '0.00')
    },
    {
      title: '下单时间',
      dataIndex: 'orderDate',
      valueType: 'date',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '合同开始时间',
      dataIndex: 'startTime',
      valueType: 'date',
      width: 120,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '合同结束时间',
      dataIndex: 'endTime',
      valueType: 'date',
      width: 120,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '客户签约人',
      dataIndex: 'customerSignerName',
      width: 100,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '公司签约人',
      dataIndex: 'companySignerName',
      width: 100,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '合同状态',
      dataIndex: 'auditStatus',
      width: 100,
      align: 'center',
      hideInSearch: true,
      valueEnum: AUDIT_STATUS
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
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<API.CrmContractRespVO>
        headerTitle="合同管理"
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
            ...rest
          }
          const res = await getContractPage({ pageVO: req } as any)
          return {
            data: res.data?.list || [],
            success: res.code === 0,
            total: res.data?.total || 0
          }
        }}
        search={{
          labelWidth: 'auto',
          span: 6
        }}
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={handleAdd}>
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
        locale={{
          emptyText: <div style={{ padding: '16px 0', color: '#999' }}>暂无数据</div>
        }}
      />

      <ContractForm
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

export default ContractManagement
