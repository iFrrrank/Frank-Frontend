import React, { useState } from 'react'
import { message, Form, Button } from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormRadio,
  ProFormDigit,
  ProFormUploadButton,
  ProFormTextArea
} from '@ant-design/pro-components'
import { createArticle, updateArticle, getArticle } from '@/api/mall/promotion/article/article'
import { getSimpleDeptList as getArticleCategorySimpleList } from '@/api/mall/promotion/article/category'
import { textConst } from '@/locales/zh-CN'
import { BOOLEAN_OPTIONS, COMMON_STATUS_OPTIONS } from '@/utils/constantsValue'
import { Editor } from '@/components/Editor'
import ProductSelectForm from './ProductSelectForm'

interface ArticleFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const ArticleForm: React.FC<ArticleFormProps> = ({ visible, setVisible, onSuccess, id }) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()
  const [productModalVisible, setProductModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  return (
    <ModalForm
      title={isUpdate ? textConst.action.update : textConst.action.create}
      open={visible}
      onOpenChange={setVisible}
      form={form}
      layout="horizontal"
      modalProps={{
        destroyOnHidden: true,
        onCancel: () => form.resetFields()
      }}
      grid={true}
      rowProps={{ gutter: 24 }}
      colon={false}
      labelAlign="right"
      width={850}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getArticle({ id } as any)
          return resp.data as Record<string, any>
        }
        return {}
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateArticle({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createArticle(values as any)
            message.success(textConst.msg.createSuccess)
          }
          onSuccess()
          return true
        } catch (e) {
          message.error(textConst.error.operationFail)
          return false
        }
      }}
    >
      <ProFormText
        name="title"
        label="文章标题"
        rules={[{ required: true }]}
        placeholder="请输入文章标题"
        colProps={{ span: 12 }}
      />
      <ProFormSelect
        name="categoryId"
        label="文章分类"
        rules={[{ required: true }]}
        placeholder="请选择文章分类"
        request={async () => {
          const resp = await getArticleCategorySimpleList()
          return (resp.data || []).map((item: any) => ({ label: item.name, value: item.id }))
        }}
        colProps={{ span: 12 }}
      />
      <ProFormText
        name="author"
        label="文章作者"
        placeholder="请输入文章作者"
        colProps={{ span: 12 }}
      />
      <ProFormText
        name="introduction"
        label="文章简介"
        placeholder="请输入文章简介"
        colProps={{ span: 12 }}
      />
      {/* @ts-ignore */}
      <ProFormUploadButton
        name="picUrl"
        label="文章封面"
        rules={[{ required: true }]}
        max={1}
        listType="picture-card"
        colProps={{ span: 12 }}
      />
      <ProFormDigit
        name="sort"
        label="排序"
        rules={[{ required: true }]}
        placeholder="请输入排序"
        fieldProps={{ precision: 0 }}
        colProps={{ span: 12 }}
      />
      <ProFormRadio.Group
        name="status"
        label="状态"
        rules={[{ required: true }]}
        options={COMMON_STATUS_OPTIONS}
        colProps={{ span: 12 }}
      />
      <ProFormRadio.Group
        name="recommendHot"
        label="是否热门"
        rules={[{ required: true }]}
        options={BOOLEAN_OPTIONS}
        colProps={{ span: 12 }}
      />
      <ProFormRadio.Group
        name="recommendBanner"
        label="是否轮播图"
        rules={[{ required: true }]}
        options={BOOLEAN_OPTIONS}
        colProps={{ span: 12 }}
      />
      <Form.Item
        label="商品关联"
        required
        className="ant-col-12"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Button onClick={() => setProductModalVisible(true)}>选择商品</Button>
        {selectedProduct && <span style={{ marginLeft: 8 }}>已选: {selectedProduct.name}</span>}

        <ProductSelectForm
          visible={productModalVisible}
          setVisible={setProductModalVisible}
          multiple={false}
          onSelect={(rows) => {
            setSelectedProduct(rows[0])
            message.success(`成功关联商品: ${rows[0].name}`)
          }}
        />
      </Form.Item>
      <Form.Item
        name="content"
        label="文章内容"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
        rules={[{ required: true, message: '请输入文章内容' }]}
      >
        <Editor height={100} />
      </Form.Item>
    </ModalForm>
  )
}

export default ArticleForm
