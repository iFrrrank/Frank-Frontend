import React, { useRef, useState } from 'react'
import { Button, message, Popconfirm, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import DiyTemplateForm from './DiyTemplateForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'

import {
  getDiyTemplatePage,
  deleteDiyTemplate,
  useDiyTemplate
} from '@/api/mall/promotion/diy/template'

const DiyTemplateManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  const handleUseTemplate = async (id: number) => {
    try {
      const res = await useDiyTemplate({ id })
      if (res.code === 0) {
        message.success('模板应用成功')
        actionRef.current?.reload()
      }
    } catch (error) {
      message.error(textConst.error.operationFail)
    }
  }

  const columns: ProColumns<any>[] = [
    {
      title: '模板ID',
      dataIndex: 'id',
      align: 'center',
      width: 180,
      hideInSearch: true
    },
    {
      title: '模板名称',
      dataIndex: 'name',
      align: 'center',
      width: 180,
      fieldProps: { placeholder: '请输入模板名称' }
    },
    {
      title: '预览图',
      dataIndex: 'previewPicUrls',
      valueType: 'image',
      align: 'center',
      width: 180,
      hideInSearch: true
    },
    {
      title: '是否使用',
      dataIndex: 'used',
      align: 'center',
      width: 180,
      hideInSearch: true,
      render: (_, record) => {
        return record.used ? <Tag color="success">使用中</Tag> : <Tag color="default">未使用</Tag>
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      align: 'center',
      width: 180,
      fieldProps: { placeholder: ['开始日期', '结束日期'] },
      render: (_, record) => record.createTime
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      width: 180,
      hideInSearch: true,
      ellipsis: true
    },
    {
      title: textConst.table.action,
      valueType: 'option',
      width: 150,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          {!record.used && (
            <Popconfirm title="确定要应用此模板吗？" onConfirm={() => handleUseTemplate(record.id)}>
              <a key="use" style={{ color: '#52c41a' }}>
                使用
              </a>
            </Popconfirm>
          )}
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
              handleDelete(record, deleteDiyTemplate, () => actionRef.current?.reload())
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
      <ProTable<any>
        headerTitle="装修模板列表"
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
            const res = await getDiyTemplatePage(req as any)
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

      <DiyTemplateForm
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

export default DiyTemplateManagement
