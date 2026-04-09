import React, { useRef, useState } from 'react'
import { Button, message, Popconfirm } from 'antd'
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { getReceivablePage, deleteReceivable } from '@/api/crm/receivable'
import { getCustomerSimpleList } from '@/api/crm/customer'
import ReceivableForm from './ReceivableForm'
import { SCENE_TYPE } from '@/utils/constantsValue'
import { textConst } from '@/locales/zh-CN'
import { tableActionStyle, deleteTextStyle, emptyTextStyle } from '@/styles/common.style'
import { handleDelete } from '@/components/Delete'

const ReceivableManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
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

  //   const handleDelete = async (id: number) => {
  //     try {
  //       await deleteReceivable({ id })
  //       message.success('删除成功')
  //       actionRef.current?.reload()
  //     } catch (error) {
  //       message.error('删除失败')
  //     }
  //   }

  const handleExport = async () => {
    try {
      message.loading({ content: '正在导出...', key: 'export' })
      message.success({ content: '导出成功', key: 'export' })
    } catch (e) {
      message.error({ content: '导出失败', key: 'export' })
    }
  }

  const columns: ProColumns<API.CrmReceivableRespVO>[] = [
    {
      title: '回款编号',
      dataIndex: 'no',
      width: 140,
      align: 'center',
      fieldProps: { placeholder: '请输入回款编号' }
    },
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
      hideInSearch: true
    },
    {
      title: '合同金额（元）',
      dataIndex: 'contractPrice',
      width: 120,
      align: 'center',
      hideInSearch: true,
      render: (_, record) =>
        record.contract?.totalPrice ? record.contract.totalPrice.toFixed(2) : '0.00'
    },
    {
      title: '回款日期',
      dataIndex: 'returnTime',
      valueType: 'date',
      width: 120,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '回款金额(元)',
      dataIndex: 'price',
      width: 120,
      align: 'center',
      hideInSearch: true,
      render: (_, record) => (record.price ? record.price.toFixed(2) : '0.00')
    },
    {
      title: '回款方式',
      dataIndex: 'returnType',
      width: 100,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '回款状态',
      dataIndex: 'auditStatus',
      width: 100,
      align: 'center',
      hideInSearch: true,
      valueEnum: {
        0: { text: '待审核', status: 'Default' },
        1: { text: '审核通过', status: 'Success' },
        2: { text: '审核不通过', status: 'Error' }
      }
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
      title: '所属部门',
      dataIndex: 'ownerUserDeptName',
      width: 120,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 160,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      width: 160,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      width: 100,
      align: 'center',
      hideInSearch: true
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
              handleDelete(record, deleteReceivable, () => actionRef.current?.reload())
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
      <ProTable<API.CrmReceivableRespVO>
        headerTitle="回款列表"
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
          const res = await getReceivablePage({ pageVO: req } as any)
          return {
            data: res.data?.list || [],
            success: res.code === 0,
            total: res.data?.total || 0
          }
        }}
        search={{
          labelWidth: 'auto'
        }}
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
            onClick={handleExport}
          >
            {textConst.action.export}
          </Button>
        ]}
        locale={{
          emptyText: <div style={emptyTextStyle}>暂无数据</div>
        }}
      />

      <ReceivableForm
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

export default ReceivableManagement
