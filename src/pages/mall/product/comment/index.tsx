import React, { useRef, useState } from 'react'
import { Button, message, Switch, Modal, Form, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import CommentForm from './CommentForm'
import { tableActionStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { getCommentPage, updateCommentVisible, commentReply } from '@/api/mall/product/comment'
import { REPLY_STATUS } from '@/utils/constantsValue'

const ProductCommentManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [replyModalVisible, setReplyModalVisible] = useState<boolean>(false)
  const [currentRecord, setCurrentRecord] = useState<any>(null)
  const [replyForm] = Form.useForm()

  // 💡 处理显示/隐藏状态切换
  const handleVisibleChange = async (checked: boolean, record: any) => {
    try {
      await updateCommentVisible({ id: record.id, visible: checked } as any)
      message.success('状态更新成功')
      actionRef.current?.reload()
    } catch (e) {
      message.error('状态更新失败')
    }
  }

  // 💡 处理商家回复
  const handleReplySubmit = async () => {
    try {
      const values = await replyForm.validateFields()
      await commentReply({ id: currentRecord.id, replyContent: values.replyContent } as any)
      message.success('回复成功')
      setReplyModalVisible(false)
      replyForm.resetFields()
      actionRef.current?.reload()
    } catch (e) {
      message.error('回复失败或请填写回复内容')
    }
  }

  const columns: ProColumns<any>[] = [
    {
      title: '评论编号',
      dataIndex: 'id',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '回复状态',
      dataIndex: 'replyStatus',
      hideInTable: true,
      valueType: 'select',
      fieldProps: { placeholder: '请选择回复状态' },
      valueEnum: REPLY_STATUS
    },
    {
      title: '商品名称',
      dataIndex: 'spuName',
      hideInTable: true,
      fieldProps: { placeholder: '请输入商品名称' }
    },
    {
      title: '用户名称',
      dataIndex: 'userNickname',
      align: 'center',
      fieldProps: { placeholder: '请输入用户名称' }
    },
    {
      title: '订单编号',
      dataIndex: 'orderId',
      hideInTable: true,
      fieldProps: { placeholder: '请输入订单编号' }
    },
    {
      title: '商品信息',
      dataIndex: 'spuName',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '商品评分',
      dataIndex: 'descriptionScores',
      align: 'center',
      hideInSearch: true,
      render: (text) => <span>{text} 星</span>
    },
    {
      title: '服务评分',
      dataIndex: 'benefitScores',
      align: 'center',
      hideInSearch: true,
      render: (text) => <span>{text} 星</span>
    },
    {
      title: '评论内容',
      dataIndex: 'content',
      align: 'center',
      hideInSearch: true,
      ellipsis: true
    },
    {
      title: '回复内容',
      dataIndex: 'replyContent',
      align: 'center',
      hideInSearch: true,
      ellipsis: true
    },
    {
      title: '是否展示',
      dataIndex: 'visible',
      align: 'center',
      hideInSearch: true,
      render: (_, record: any) => (
        <Switch
          checked={record.visible}
          onChange={(checked) => handleVisibleChange(checked, record)}
        />
      )
    },
    {
      title: '评论时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      align: 'center',
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
            key="reply"
            onClick={() => {
              setCurrentRecord(record)
              setReplyModalVisible(true)
            }}
          >
            回复
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<any>
        headerTitle="商品评论"
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
            const res = await getCommentPage(req as any)
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
              setFormVisible(true)
            }}
          >
            添加虚拟评论
          </Button>
        ]}
      />

      {/* 添加虚拟评论弹窗 */}
      <CommentForm
        visible={formVisible}
        setVisible={setFormVisible}
        onSuccess={() => {
          setFormVisible(false)
          actionRef.current?.reload()
        }}
      />

      {/* 商家回复弹窗 */}
      <Modal
        title="商家回复"
        open={replyModalVisible}
        onOk={handleReplySubmit}
        onCancel={() => {
          setReplyModalVisible(false)
          replyForm.resetFields()
        }}
        destroyOnClose
      >
        <Form form={replyForm} layout="vertical">
          <Form.Item
            name="replyContent"
            label="回复内容"
            rules={[{ required: true, message: '请输入回复内容' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入对该评论的回复..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ProductCommentManagement
