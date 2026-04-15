import React, { useRef, useState } from 'react'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Button, Modal, message } from 'antd'
import { PlusOutlined, DownloadOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { getBusinessPage, exportBusinessExcel, deleteBusiness } from '@/api/crm/business'
import { getBusinessStatusSimpleList } from '@/api/crm/businessStatus'
import { SCENE_TYPE } from '@/utils/constantsValue'
import { textConst } from '@/locales/zh-CN'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import download from '@/utils/download'
import BusinessForm from './BusinessForm'

const BusinessList: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [sceneType, setSceneType] = useState<number>(1)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [formId, setFormId] = useState<number | undefined>(undefined)

  const handleExport = () => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleFilled style={{ color: '#faad14' }} />,
      content: '是否确认导出数据项？',
      onOk: async () => {
        try {
          const res = await exportBusinessExcel({ sceneType } as any)
          download.excel(res, '商机数据.xls')
          message.success(textConst.msg.createSuccess)
        } catch (e) {
          message.error(textConst.error.operationFail)
        }
      }
    })
  }

  const handleDelete = (record: API.CrmBusinessRespVO) => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleFilled style={{ color: '#faad14' }} />,
      content: `是否确认删除商机「${record.name}」？`,
      onOk: async () => {
        try {
          await deleteBusiness({ id: record.id } as any)
          message.success(textConst.msg.delSuccess)
          actionRef.current?.reload()
        } catch (e) {
          message.error(textConst.error.operationFail)
        }
      }
    })
  }

  const columns: ProColumns<API.CrmBusinessRespVO>[] = [
    {
      title: '商机名称',
      dataIndex: 'name',
      align: 'center',
      fieldProps: {
        placeholder: '请输入商机名称'
      }
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      align: 'center',
      fieldProps: {
        placeholder: '请输入客户名称'
      }
    },
    {
      title: '商机状态',
      dataIndex: 'statusId',
      valueType: 'select',
      align: 'center',
      hideInTable: true,
      fieldProps: {
        placeholder: '请选择商机状态'
      },
      request: async () => {
        const res = await getBusinessStatusSimpleList({})
        if (res.data) {
          return res.data.map((item: any) => ({
            label: item.name,
            value: item.id
          }))
        }
        return []
      }
    },
    {
      title: '负责人',
      dataIndex: 'ownerUserName',
      align: 'center',
      hideInTable: true,
      fieldProps: {
        placeholder: '请输入负责人'
      }
    },
    {
      title: '商机名称',
      dataIndex: 'name',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '预计成交金额',
      dataIndex: 'dealAmount',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '商机状态',
      dataIndex: 'statusId',
      align: 'center',
      hideInSearch: true,
      request: async () => {
        const res = await getBusinessStatusSimpleList({})
        if (res.data) {
          return res.data.map((item: any) => ({
            label: item.name,
            value: item.id
          }))
        }
        return []
      }
    },
    {
      title: '负责人',
      dataIndex: 'ownerUserName',
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
      title: '预计成交时间',
      dataIndex: 'dealTime',
      valueType: 'dateTime',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '最后跟进时间',
      dataIndex: 'contactLastTime',
      valueType: 'dateTime',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 120,
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a
            key="edit"
            onClick={() => {
              setFormId(record.id)
              setFormVisible(true)
            }}
          >
            {textConst.action.update}
          </a>
          <a key="delete" style={deleteTextStyle} onClick={() => handleDelete(record)}>
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<API.CrmBusinessRespVO>
        columns={columns}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          span: 6
        }}
        form={{ colon: false }}
        options={false}
        toolbar={{
          actions: [
            <Button
              key="add"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setFormId(undefined)
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
          ],
          menu: {
            type: 'tab',
            activeKey: sceneType.toString(),
            items: Object.entries(SCENE_TYPE).map(([key, value]) => ({
              key: key,
              label: value.text
            })),
            onChange: (key) => {
              setSceneType(Number(key))
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
          const res = await getBusinessPage({ pageVO: req } as any)
          return {
            data: res.data?.list || [],
            success: res.code === 0,
            total: res.data?.total || 0
          }
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true
        }}
      />

      {formVisible && (
        <BusinessForm
          id={formId}
          visible={formVisible}
          setVisible={setFormVisible}
          onSuccess={() => {
            setFormVisible(false)
            actionRef.current?.reload()
          }}
        />
      )}
    </>
  )
}

export default BusinessList
