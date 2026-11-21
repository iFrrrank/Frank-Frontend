import React, { useState } from 'react'
import { Button, message, Form } from 'antd'
import {
  ModalForm,
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormRate,
  ProFormUploadButton
} from '@ant-design/pro-components'
import { createComment1 } from '@/api/mall/product/comment'
import ProductSelectModal from '@/pages/mall/promotion/coupon/list/ProductSelectModal'

interface CommentFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
}

// 上传控件的值是文件列表，提交前提取为单个 URL
const extractSingleUrl = (value: any) => {
  if (!value) {
    return undefined
  }
  const file = Array.isArray(value) ? value[0] : value
  if (!file) {
    return undefined
  }
  return file.url || file.response?.data || file.response?.url
}

// 上传控件的值提取为 URL 数组
const extractUrlList = (value: any): string[] => {
  if (!Array.isArray(value)) {
    return []
  }
  return value
    .map((file: any) => file.url || file.response?.data || file.response?.url)
    .filter(Boolean)
}

// 创建虚拟评论：商品通过商品选择弹窗关联，其余为手工填写的买家信息与评论内容
const CommentForm: React.FC<CommentFormProps> = ({ visible, setVisible, onSuccess }) => {
  const [form] = Form.useForm()
  const [productModalVisible, setProductModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  return (
    <ModalForm
      title="创建"
      open={visible}
      onOpenChange={(val) => {
        setVisible(val)
        if (!val) {
          setSelectedProduct(null)
        }
      }}
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
          const submitData = {
            ...values,
            // 头像与评论图片由上传控件的文件列表转换为 URL
            userAvatar: extractSingleUrl(values.userAvatar),
            picUrls: extractUrlList(values.picUrls)
          }
          await createComment1(submitData as any)
          message.success('添加成功')
          onSuccess()
          return true
        } catch (e) {
          message.error('操作失败')
          return false
        }
      }}
    >
      <ProForm.Item
        name="spuId"
        label="商品"
        rules={[{ required: true, message: '请选择商品' }]}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Button onClick={() => setProductModalVisible(true)}>选择商品</Button>
        {selectedProduct && <span style={{ marginLeft: 8 }}>已选：{selectedProduct.name}</span>}
        <ProductSelectModal
          visible={productModalVisible}
          setVisible={setProductModalVisible}
          multiple={false}
          onSelect={(rows) => {
            setSelectedProduct(rows[0])
            form.setFieldValue('spuId', rows[0].id)
            message.success(`成功关联商品：${rows[0].name}`)
          }}
        />
      </ProForm.Item>
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
