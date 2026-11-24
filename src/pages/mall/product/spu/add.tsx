import React, { useState } from 'react'
import { message, Button, Form, Space } from 'antd'
import { useNavigate } from '@umijs/max'
import {
  StepsForm,
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
  ProFormUploadButton,
  ProFormRadio,
  ProFormCheckbox,
  ProFormDigit,
  EditableProTable,
  ProColumns
} from '@ant-design/pro-components'
import { DISTRIBUTE_TYPE, SPEC_TYPE, DELIVERY_TYPE_OPTIONS } from '@/utils/constantsValue'
import Editor from '@/components/Editor/Editor'
import { getCategoryList } from '@/api/mall/product/category'
import { getBrandList } from '@/api/mall/product/brand'

const AddProductSpu: React.FC = () => {
  const navigate = useNavigate()
  const [skuData, setSkuData] = useState<any[]>([])

  const skuColumns: ProColumns<any>[] = [
    { title: '图片', dataIndex: 'picUrl', valueType: 'avatar', align: 'center', width: 80 },
    { title: '商品条码', dataIndex: 'barCode', align: 'center' },
    {
      title: '销售价',
      dataIndex: 'price',
      valueType: 'digit',
      align: 'center',
      fieldProps: { min: 0 }
    },
    {
      title: '市场价',
      dataIndex: 'marketPrice',
      valueType: 'digit',
      align: 'center',
      fieldProps: { min: 0 }
    },
    {
      title: '成本价',
      dataIndex: 'costPrice',
      valueType: 'digit',
      align: 'center',
      fieldProps: { min: 0 }
    },
    {
      title: '库存',
      dataIndex: 'stock',
      valueType: 'digit',
      align: 'center',
      fieldProps: { min: 0 }
    },
    {
      title: '重量(kg)',
      dataIndex: 'weight',
      valueType: 'digit',
      align: 'center',
      fieldProps: { min: 0 }
    },
    {
      title: '体积(m³)',
      dataIndex: 'volume',
      valueType: 'digit',
      align: 'center',
      fieldProps: { min: 0 }
    }
  ]

  return (
    <div style={{ backgroundColor: '#fff', padding: 24 }}>
      <StepsForm
        onFinish={async (values) => {
          message.success('提交成功！')
          navigate('/mall/product/spu')
          return true
        }}
        formProps={{
          colon: false,
          layout: 'horizontal',
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        }}
        submitter={{
          render: (props) => {
            if (props.step === 0) {
              return (
                <Form.Item style={{ marginTop: 24, marginLeft: 103 }}>
                  <Button type="primary" onClick={() => props.onSubmit?.()}>
                    下一步
                  </Button>
                </Form.Item>
              )
            }

            if (props.step === 4) {
              return (
                <Form.Item wrapperCol={{ offset: 4 }} style={{ marginTop: 24 }}>
                  <Space>
                    <Button onClick={() => props.onPre?.()}>上一步</Button>
                    <Button type="primary" onClick={() => props.onSubmit?.()}>
                      保存
                    </Button>
                  </Space>
                </Form.Item>
              )
            }

            return (
              <Form.Item wrapperCol={{ offset: 4 }} style={{ marginTop: 24 }}>
                <Space>
                  <Button onClick={() => props.onPre?.()}>上一步</Button>
                  <Button type="primary" onClick={() => props.onSubmit?.()}>
                    下一步
                  </Button>
                </Space>
              </Form.Item>
            )
          }
        }}
      >
        {/* Step 1: 基础设置 */}
        <StepsForm.StepForm key={'base'} title="基础设置" name="base">
          <ProFormText
            name="name"
            label="商品名称"
            rules={[
              { required: true, message: '商品名称是必填项！' },
              { len: 64, message: '商品名称最大字数不能超过 64 字符！' }
            ]}
            placeholder="请输入商品名称"
            fieldProps={{ maxLength: 64, showCount: true }}
          />
          <ProFormSelect
            name="categoryId"
            label="商品分类"
            rules={[{ required: true, message: '商品分类是必填项！' }]}
            placeholder="请选择商品分类"
            request={async () => {
              const res = await getCategoryList()
              return (res.data || []).map((item: any) => ({ label: item.name, value: item.id }))
            }}
          />
          <ProFormSelect
            name="brandId"
            label="商品品牌"
            rules={[{ required: true, message: '商品品牌是必填项！' }]}
            placeholder="请选择商品品牌"
            request={async () => {
              const res = await getBrandList({} as any)
              return (res.data || []).map((item: any) => ({ label: item.name, value: item.id }))
            }}
          />
          <ProFormText
            name="keyword"
            label="商品关键字"
            rules={[{ required: true, message: '商品关键字是必填项！' }]}
            placeholder="请输入商品关键字"
          />
          <ProFormTextArea
            name="introduction"
            label="商品简介"
            rules={[{ required: true, message: '商品简介是必填项！' }]}
            placeholder="请输入商品简介"
            fieldProps={{ maxLength: 128, showCount: true, rows: 3 }}
          />
          {/* @ts-ignore */}
          <ProFormUploadButton
            name="picUrl"
            label="商品封面图"
            title="单击上传"
            rules={[{ required: true, message: '商品封面图是必填项！' }]}
            max={1}
            listType="picture-card"
          />
          {/* @ts-ignore */}
          <ProFormUploadButton
            name="sliderPicUrls"
            label="商品轮播图"
            title="单击上传"
            rules={[{ required: true, message: '商品轮播图是必填项！' }]}
            max={5}
            fieldProps={{
              multiple: true,
              maxCount: 5,
              onChange: (info) => {
                if (info.fileList.length > 5) {
                  message.warning('最多只能上传 5 张图片，其余图片已被自动忽略！')
                }
              }
            }}
            listType="picture-card"
          />
        </StepsForm.StepForm>

        {/* Step 2: 价格库存 */}
        <StepsForm.StepForm key="stock" title="价格库存" name="stock">
          <ProFormRadio.Group
            key="distributeType"
            name="distributeType"
            label="分销类型"
            rules={[{ required: true }]}
            initialValue={0}
            options={DISTRIBUTE_TYPE}
          />
          <ProFormRadio.Group
            key="specType"
            name="specType"
            label="商品规格"
            rules={[{ required: true }]}
            initialValue={0}
            options={SPEC_TYPE}
          />
          <div style={{ paddingLeft: '8%' }}>
            <EditableProTable
              rowKey="id"
              name="skus"
              value={skuData}
              onChange={(value) => setSkuData([...value])}
              columns={skuColumns}
              recordCreatorProps={{
                newRecordType: 'dataSource',
                record: () => ({ id: Date.now().toString() }),
                creatorButtonText: '新增规格'
              }}
              bordered
            />
          </div>
        </StepsForm.StepForm>

        {/* Step 3: 物流设置 */}
        <StepsForm.StepForm key="logistics" title="物流设置" name="logistics">
          <ProFormCheckbox.Group
            key="deliveryTypes"
            name="deliveryTypes"
            label="配送方式"
            rules={[{ required: true }]}
            options={DELIVERY_TYPE_OPTIONS}
          />
        </StepsForm.StepForm>

        {/* Step 4: 商品详情 */}
        <StepsForm.StepForm title="商品详情" name="detail">
          <ProForm.Item
            name="detailHtml"
            label="商品详情"
            rules={[{ required: true, message: '请输入商品详情' }]}
          >
            <Editor />
          </ProForm.Item>
        </StepsForm.StepForm>

        {/* Step 5: 其它设置 */}
        <StepsForm.StepForm title="其它设置" name="other">
          <ProFormDigit
            name="sort"
            label="商品排序"
            rules={[{ required: true }]}
            placeholder="0"
            fieldProps={{ precision: 0 }}
          />
          <ProFormDigit
            name="giveIntegral"
            label="赠送积分"
            rules={[{ required: true }]}
            placeholder="0"
            fieldProps={{ precision: 0, min: 0 }}
          />
          <ProFormDigit
            name="virtualSales"
            label="虚拟销量"
            rules={[{ required: true }]}
            placeholder="0"
            fieldProps={{ precision: 0, min: 0 }}
          />
        </StepsForm.StepForm>
      </StepsForm>
    </div>
  )
}

export default AddProductSpu
