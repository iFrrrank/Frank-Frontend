import React, { useRef, useState } from 'react'
import { Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import ArticleForm from './ArticleForm'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'
import { getArticlePage, deleteArticle } from '@/api/mall/promotion/article/article'
import { COMMON_STATUS } from '@/utils/constantsValue'

const ArticleManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  const columns: ProColumns<any>[] = [
    { title: 'ID', dataIndex: 'id', align: 'center', width: 120, hideInSearch: true },

    {
      title: '文章标题',
      dataIndex: 'title',
      align: 'center',
      width: 120,
      fieldProps: { placeholder: '请输入文章标题' }
    },
    {
      title: '文章简介',
      dataIndex: 'introduction',
      align: 'center',
      width: 120,
      hideInSearch: true,
      ellipsis: true
    },
    { title: '作者', dataIndex: 'author', align: 'center', width: 120, hideInSearch: true },
    {
      title: '文章分类',
      dataIndex: 'categoryId',
      valueType: 'select',
      width: 120,
      align: 'center',
      fieldProps: { placeholder: '全部' },
      request: async () => []
    },
    {
      title: '封面',
      dataIndex: 'picUrl',
      valueType: 'image',
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
      fieldProps: { placeholder: '请选择文章状态' },
      valueEnum: COMMON_STATUS
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      align: 'center',
      width: 120,
      hideInTable: true,
      fieldProps: { placeholder: ['开始日期', '结束日期'] }
    },
    { title: '浏览量', dataIndex: 'browseCount', align: 'center', width: 120, hideInSearch: true },
    { title: '排序', dataIndex: 'sort', align: 'center', width: 120, hideInSearch: true },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      valueType: 'dateTime',
      align: 'center',
      width: 120,
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
            onClick={() => handleDelete(record, deleteArticle, () => actionRef.current?.reload())}
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
        headerTitle="文章列表"
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
            const res = await getArticlePage(req as any)
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

      <ArticleForm
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

export default ArticleManagement
