import React from 'react'
import { message, Form } from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
  ProFormRate,
  ProFormUploadButton
} from '@ant-design/pro-components'
import { createComment1 } from '@/api/mall/product/comment'

interface CommentFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
}

const CommentForm: React.FC<CommentFormProps> = ({ visible, setVisible, onSuccess }) => {
  const [form] = Form.useForm()

  return (
    <ModalForm
      title="创建"
      open={visible}
      onOpenChange={setVisible}
      form={form}
      layout="horizontal"
      modalProps={{
        destroyOnHidden: true,
        onCancel: () => form.resetFields()
      }}
      colon={false}
      labelAlign="right"
      width={500}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      onFinish={async (values) => {
        try {
          // TODO: 如果实现了自定义的商品选择器，这里需要把对应选择的商品 ID 提取出来
          // values.spuId = values.productSelector[0].id
          await createComment1(values as any)
          message.success('添加成功')
          onSuccess()
          return true
        } catch (e) {
          message.error('操作失败')
          return false
        }
      }}
    >
      {/* @ts-ignore */}
      <ProFormUploadButton
        name="spuId"
        label="商品"
        rules={[{ required: true, message: '请选择商品' }]}
        max={1}
        title="选择商品"
        listType="picture-card"
        // 阻止默认的上传行为，你可以重写 onChange 或 onClick 来弹窗选商品
        fieldProps={{ beforeUpload: () => false }}
      />{' '}
      {/* @ts-ignore */}
      <ProFormUploadButton
        name="userAvatar"
        label="用户头像"
        rules={[{ required: true, message: '请上传用户头像' }]}
        max={1}
        title="上传头像"
        listType="picture-card"
      />
      <ProFormText
        name="userNickname"
        label="用户名称"
        rules={[{ required: true, message: '请输入用户名称' }]}
        placeholder="请输入用户名称"
      />
      <ProFormTextArea
        name="content"
        label="评论内容"
        rules={[{ required: true, message: '请输入评论内容' }]}
        placeholder="请输入评论内容"
        fieldProps={{ rows: 3 }}
      />
      <ProFormRate
        name="descriptionScores"
        label="描述星级"
        rules={[{ required: true, message: '请选择描述星级' }]}
        initialValue={5}
      />
      <ProFormRate
        name="benefitScores"
        label="服务星级"
        rules={[{ required: true, message: '请选择服务星级' }]}
        initialValue={5}
      />
      {/* @ts-ignore */}
      <ProFormUploadButton
        name="picUrls"
        label="评论图片"
        max={5}
        title="上传图片"
        listType="picture-card"
        fieldProps={{
          multiple: true,
          maxCount: 5
        }}
      />
    </ModalForm>
  )
}

export default CommentForm
