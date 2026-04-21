import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import DeliveryExpressTemplateForm from './ExpressTemplateForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'
import {
  getDeliveryExpressTemplatePage,
  deleteDeliveryExpressTemplate
} from '@/api/mall/trade/delivery/expressTemplate'
import { CHARGE_MODE } from '@/utils/constantsValue'

const DeliveryExpressTemplateManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  const columns: ProColumns<API.DeliveryExpressTemplateRespVO>[] = [
    {
      title: '模板 ID',
      dataIndex: 'id',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '模板名称',
      dataIndex: 'name',
      align: 'center',
      fieldProps: { placeholder: '请输入模板名称' }
    },
    {
      title: '计费方式',
      dataIndex: 'chargeMode',
      align: 'center',
      valueType: 'select',
      fieldProps: { placeholder: '全部' },
      valueEnum: CHARGE_MODE
    },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      hideInSearch: true
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
              handleDelete(record, deleteDeliveryExpressTemplate, () => actionRef.current?.reload())
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
      <ProTable<API.DeliveryExpressTemplateRespVO>
        headerTitle="运费模板列表"
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
            const res = await getDeliveryExpressTemplatePage(req as any)
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
          </Button>
        ]}
      />

      <DeliveryExpressTemplateForm
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

export default DeliveryExpressTemplateManagement
