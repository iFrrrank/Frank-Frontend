import React, { useRef, useState } from 'react'
import { Button, message } from 'antd'
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import DeliveryExpressForm from './DeliveryExpressForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'
import { getDeliveryExpressPage, deleteDeliveryExpress } from '@/api/mall/trade/delivery/express'
import { COMMON_STATUS } from '@/utils/constantsValue'

const DeliveryExpressManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  const handleExport = async () => {
    try {
      message.loading({ content: '正在导出中...', key: 'export' })
      message.success({ content: '导出成功', key: 'export' })
    } catch (error) {
      message.error({ content: '导出失败', key: 'export' })
    }
  }

  const columns: ProColumns<API.DeliveryExpressRespVO>[] = [
    {
      title: '快递公司编号',
      dataIndex: 'code',
      align: 'center',
      fieldProps: { placeholder: '请输入快递公司编号' },
      hideInTable: true
    },
    {
      title: '公司编码',
      dataIndex: 'code',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '快递公司名称',
      dataIndex: 'name',
      align: 'center',
      fieldProps: { placeholder: '请输入快递公司名称' }
    },
    {
      title: '公司 logo',
      dataIndex: 'logo',
      valueType: 'image',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '开启状态',
      dataIndex: 'status',
      align: 'center',
      hideInSearch: true,
      valueEnum: COMMON_STATUS
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      align: 'center',
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
            onClick={() =>
              handleDelete(record, deleteDeliveryExpress, () => actionRef.current?.reload())
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
      <ProTable<API.DeliveryExpressRespVO>
        headerTitle="快递公司列表"
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
            const res = await getDeliveryExpressPage(req as any)
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
            onClick={handleExport}
          >
            {textConst.action.export}
          </Button>
        ]}
      />

      <DeliveryExpressForm
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

export default DeliveryExpressManagement
