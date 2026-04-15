import React, { useRef, useState } from 'react'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Button, Modal, message } from 'antd'
import { DownloadOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { exportCustomerExcel, receiveCustomer, getCustomerPage } from '@/api/crm/customer'
import { textConst } from '@/locales/zh-CN'
import { tableActionStyle } from '@/styles/common.style'
import download from '@/utils/download'
import { INDUSTRY_LIST, CUSTOMER_LEVEL, CUSTOMER_SOURCE } from '@/utils/constantsValue'

const CustomerPool: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)

  const handleExport = () => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleFilled style={{ color: '#faad14' }} />,
      content: '是否确认导出数据项？',
      onOk: async () => {
        try {
          const res = await exportCustomerExcel({ pool: true } as any)
          download.excel(res, '公海客户数据.xls')
          message.success(textConst.msg.createSuccess)
        } catch (e) {
          message.error(textConst.error.operationFail)
        }
      }
    })
  }

  const handleReceive = (record: API.CrmCustomerRespVO) => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleFilled style={{ color: '#faad14' }} />,
      content: `是否确认领取客户「${record.name}」？`,
      onOk: async () => {
        try {
          await receiveCustomer({ id: record.id } as any)
          message.success(textConst.msg.createSuccess)
          actionRef.current?.reload()
        } catch (e) {
          message.error('领取失败')
        }
      }
    })
  }

  const columns: ProColumns<API.CrmCustomerRespVO>[] = [
    {
      title: '客户名称',
      dataIndex: 'name',
      align: 'center',
      fieldProps: {
        placeholder: '请输入客户名称'
      }
    },
    {
      title: '手机',
      dataIndex: 'mobile',
      align: 'center',
      fieldProps: {
        placeholder: '请输入手机'
      }
    },
    {
      title: '所属行业',
      dataIndex: 'industryId',
      valueType: 'select',
      align: 'center',
      hideInTable: true,
      valueEnum: INDUSTRY_LIST,
      fieldProps: {
        placeholder: '请选择所属行业'
      }
    },
    {
      title: '客户级别',
      dataIndex: 'level',
      valueType: 'select',
      align: 'center',
      hideInTable: true,
      valueEnum: CUSTOMER_LEVEL,
      fieldProps: {
        placeholder: '请选择客户级别'
      }
    },
    {
      title: '客户来源',
      dataIndex: 'source',
      valueType: 'select',
      align: 'center',
      hideInTable: true,
      valueEnum: CUSTOMER_SOURCE,
      fieldProps: {
        placeholder: '请选择客户来源'
      }
    },
    {
      title: '客户名称',
      dataIndex: 'name',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '手机',
      dataIndex: 'mobile',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '电话',
      dataIndex: 'telephone',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '客户级别',
      dataIndex: 'level',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '客户行业',
      dataIndex: 'industryId',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '放入公海时间',
      dataIndex: 'poolTime',
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
      title: '原负责人',
      dataIndex: 'ownerUserName',
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
          <a key="receive" onClick={() => handleReceive(record)}>
            领取
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<API.CrmCustomerRespVO>
        headerTitle="客户公海"
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
              key="export"
              color="volcano"
              variant="outlined"
              icon={<DownloadOutlined />}
              onClick={handleExport}
            >
              {textConst.action.export}
            </Button>
          ]
        }}
        request={async (params) => {
          const { current, pageSize, ...rest } = params
          const req = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...rest
          }
          const res = await getCustomerPage({ pageVO: req } as any)
          return {
            data: res.data?.list || [],
            success: res.code === 0,
            total: res.data?.total || 0
          }
        }}
        pagination={{
          align: 'center',
          showSizeChanger: true
        }}
      />
    </>
  )
}

export default CustomerPool
