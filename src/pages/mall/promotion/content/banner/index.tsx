import React, { useRef, useState } from 'react'
import { Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import BannerForm from './BannerForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'
import { getBannerPage, deleteBanner } from '@/api/mall/promotion/banner'
import { COMMON_STATUS, BANNER_POSITION } from '@/utils/constantsValue'

const BannerManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  const columns: ProColumns<any>[] = [
    {
      title: 'Banner标题',
      dataIndex: 'title',
      align: 'center',
      width: 120,
      fieldProps: { placeholder: '请输入 Banner 标题' }
    },
    {
      title: '描述',
      dataIndex: 'memo',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 120,
      valueType: 'select',
      hideInTable: true,
      fieldProps: { placeholder: '请选择状态' },
      valueEnum: COMMON_STATUS
    },
    {
      title: '图片',
      dataIndex: 'picUrl',
      valueType: 'image',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '位置',
      dataIndex: 'position',
      align: 'center',
      width: 120,
      hideInSearch: true,
      valueType: 'select',
      valueEnum: BANNER_POSITION
    },
    {
      title: '跳转地址',
      dataIndex: 'url',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      align: 'center',
      width: 120,
      fieldProps: { placeholder: ['开始日期', '结束日期'] },
      render: (_, record) => record.createTime
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
            onClick={() => handleDelete(record, deleteBanner, () => actionRef.current?.reload())}
          >
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<any>
        headerTitle="Banner列表"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        search={{ labelWidth: 'auto', span: 6 }}
        request={async (params) => {
          const { current, pageSize, createTime, ...rest } = params
          const req = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            startTime: createTime?.[0] ? createTime[0] + ' 00:00:00' : undefined,
            endTime: createTime?.[1] ? createTime[1] + ' 23:59:59' : undefined,
            ...rest
          }
          try {
            const res = await getBannerPage(req as any)
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

      <BannerForm
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

export default BannerManagement
