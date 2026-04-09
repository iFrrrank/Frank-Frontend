import React, { useRef, useState } from 'react'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { getBusinessStatusPage, deleteBusinessStatusType } from '@/api/crm/businessStatus'
import BusinessStatusForm from './BusinessStatusForm'
import { textConst } from '@/locales/zh-CN'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { handleDelete } from '@/components/Delete'

const BusinessStatusManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  const handleCreate = () => {
    setCurrentId(undefined)
    setFormVisible(true)
  }

  const handleUpdate = (id: number) => {
    setCurrentId(id)
    setFormVisible(true)
  }

  const columns: ProColumns<API.CrmBusinessStatusRespVO>[] = [
    {
      title: '状态组名',
      dataIndex: 'name',
      width: 180,
      align: 'center',
      fieldProps: { placeholder: '请输入状态组名' }
    },
    {
      title: '应用部门',
      dataIndex: 'deptNames',
      width: 200,
      align: 'center',
      hideInSearch: true,
      render: (_, record) => {
        if (Array.isArray(record.deptNames)) return record.deptNames.join('，')
        return record.deptNames || '无'
      }
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      width: 120,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 180,
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
          <a key="update" onClick={() => handleUpdate(record.id as number)}>
            {textConst.action.update}
          </a>
          <a
            key="delete"
            style={deleteTextStyle}
            onClick={() =>
              handleDelete(record, deleteBusinessStatusType, () => actionRef.current?.reload())
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
      <ProTable<API.CrmBusinessStatusRespVO>
        headerTitle="商机状态配置"
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        form={{ colon: false }}
        search={{
          labelWidth: 'auto'
        }}
        request={async (params) => {
          const { current, pageSize, ...rest } = params
          const req = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...rest
          }
          const res = await getBusinessStatusPage({ pageReqVO: req } as any)
          return {
            data: res.data?.list || [],
            success: res.code === 0,
            total: res.data?.total || 0
          }
        }}
        pagination={{ align: 'center', showSizeChanger: true }}
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={handleCreate}>
            {textConst.action.create}
          </Button>
        ]}
      />

      <BusinessStatusForm
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

export default BusinessStatusManagement
