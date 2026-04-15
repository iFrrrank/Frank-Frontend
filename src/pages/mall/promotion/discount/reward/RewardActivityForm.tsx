import React, { useState } from 'react'
import { message, Form, Button, Col, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  ModalForm,
  ProFormText,
  ProFormDateTimeRangePicker,
  ProFormRadio,
  ProFormTextArea,
  ProFormDependency,
  EditableProTable,
  ProFormSelect,
  ProForm,
  ProColumns
} from '@ant-design/pro-components'
import {
  createRewardActivity,
  updateRewardActivity,
  getRewardActivity
} from '@/api/mall/promotion/rewardActivity'
import ProductSelectModal from '@/pages/mall/promotion/coupon/list/ProductSelectModal'
import CouponSelectModal from './CouponSelectModal'
import { textConst } from '@/locales/zh-CN'
import { COUPON_TYPE_OPTIONS, PROMOTION_CONDITION_TYPE } from '@/utils/constantsValue'
import { emptyTextStyle, tableActionStyle, deleteTextStyle } from '@/styles/common.style'

interface RewardActivityFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const RewardActivityForm: React.FC<RewardActivityFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  id
}) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([])
  const [productModalVisible, setProductModalVisible] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<any[]>([])
  const [dataSource, setDataSource] = useState<any[]>([])

  const conditionType = Form.useWatch('conditionType', form)
  const isCount = conditionType === 20
  const [couponModalVisible, setCouponModalVisible] = useState(false)
  const [selectedCoupons, setSelectedCoupons] = useState<any[]>([])

  const handleItemChange = (val: readonly any[]) => {
    setDataSource([...val])
  }

  const itemColumns: ProColumns<any>[] = [
    {
      title: isCount ? '优惠门槛(件)' : '优惠门槛(元)',
      dataIndex: 'limit',
      valueType: 'digit',
      width: 120,
      align: 'center',
      formItemProps: {
        rules: [{ required: true, message: isCount ? '请输入门槛件数' : '请输入门槛金额' }]
      },
      fieldProps: {
        placeholder: isCount ? '请输入门槛件数' : '请输入门槛金额',
        precision: isCount ? 0 : 2,
        min: isCount ? 1 : 0.01,
        stringMode: true, // TODO: 切换条件类型，满 N 件会显示 0
        style: { width: '100%', textAlign: 'left' }
      }
    },
    {
      title: '减免金额(元)',
      dataIndex: 'discountPrice',
      valueType: 'digit',
      width: 120,
      align: 'center',
      formItemProps: { rules: [{ required: true, message: '请输入减免金额' }] },
      fieldProps: {
        precision: 2,
        placeholder: '请输入减免金额',
        style: { width: '100%', textAlign: 'left' }
      }
    },
    {
      title: '是否包邮',
      dataIndex: 'freeDelivery',
      valueType: 'switch',
      width: 80,
      align: 'center',
      formItemProps: {
        style: { display: 'flex', justifyContent: 'center', marginBottom: 0 }
      },
      fieldProps: {
        checkedChildren: '是',
        unCheckedChildren: '否'
      },
      render: (_, record) => {
        return record.freeDelivery ? '是' : '否'
      }
    },
    {
      title: '赠送积分',
      dataIndex: 'point',
      valueType: 'digit',
      width: 120,
      align: 'center',
      tooltip: '赠送积分为 0 时无法设置优惠',
      fieldProps: {
        min: 0,
        placeholder: '请输入赠送的积分',
        style: { width: '100%', textAlign: 'left' }
      }
    },
    {
      title: '赠送优惠券',
      dataIndex: 'couponId',
      width: 140,
      align: 'center',
      tooltip: '未选优惠券时无法设置优惠',
      renderFormItem: () => (
        <>
          <Button type="default" onClick={() => setCouponModalVisible(true)}>
            选择优惠券
          </Button>
          {selectedCoupons.map((c) => (
            <Tag
              color="blue"
              key={c.id}
              closable
              onClose={() => {
                // TODO: 删除逻辑
              }}
            >
              {c.name}
            </Tag>
          ))}
        </>
      ),
      render: (text) => <span>{text && text !== '-' ? `已选优惠券` : '未选择'}</span>
    },
    {
      title: '操作',
      valueType: 'option',
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (text, record, _, action) => (
        <div style={tableActionStyle}>
          <a key="update" onClick={() => action?.startEditable?.(record.id)}>
            {textConst.action.update}
          </a>
          <a
            key="delete"
            style={deleteTextStyle}
            onClick={() => setDataSource(dataSource.filter((i) => i.id !== record.id))}
          >
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <ModalForm
      title={isUpdate ? textConst.action.update : textConst.action.create}
      open={visible}
      onOpenChange={(val) => {
        setVisible(val)
        if (!val) {
          form.resetFields()
          setSelectedProducts([])
          setEditableRowKeys([])
        }
      }}
      form={form}
      colon={false}
      grid={true}
      layout="horizontal"
      labelAlign="right"
      rowProps={{ gutter: 24 }}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      width={1000}
      request={async () => {
        if (id !== undefined) {
          const resp = await getRewardActivity({ id } as any)
          const data = resp.data as Record<string, any>

          if (data.startTime && data.endTime) {
            data.activityTime = [data.startTime, data.endTime]
          }
          if (data.productScope === 20 && data.spuList) {
            setSelectedProducts(data.spuList)
          }

          if (data.rules) {
            data.rules = data.rules.map((rule: any, index: number) => ({ ...rule, key: index }))
          }
          return data
        }
        return { conditionType: 10, productScope: 1, rules: [] }
      }}
      onFinish={async (values) => {
        try {
          if (values.activityTime && values.activityTime.length === 2) {
            values.startTime = values.activityTime[0]
            values.endTime = values.activityTime[1]
            delete values.activityTime
          }

          if (isUpdate) {
            await updateRewardActivity({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createRewardActivity(values as any)
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
        name="name"
        label="活动名称"
        rules={[{ required: true, message: '请输入活动名称' }]}
        placeholder="请输入活动名称"
        colProps={{ span: 12 }}
      />
      <ProFormDateTimeRangePicker
        name="activityTime"
        label="活动时间"
        placeholder={['开始时间', '结束时间']}
        rules={[{ required: true, message: '请选择活动时间' }]}
        fieldProps={{ style: { width: '100%' } }}
        colProps={{ span: 12 }}
      />
      <ProFormRadio.Group
        name="conditionType"
        label="条件类型"
        rules={[{ required: true, message: '请选择条件类型' }]}
        options={PROMOTION_CONDITION_TYPE}
        colProps={{ span: 12 }}
      />
      <Col span={24} style={{ marginTop: -23 }}>
        <EditableProTable<any>
          headerTitle="优惠设置"
          rowKey="id"
          size="small"
          columns={itemColumns}
          value={dataSource}
          onChange={handleItemChange}
          recordCreatorProps={{
            position: 'bottom',
            record: () => ({
              id: Date.now().toString(),
              limit: isCount ? 1 : undefined
            }),
            disabled: editableKeys.length > 0,
            creatorButtonText: editableKeys.length > 0 ? '请先保存当前行' : '添加优惠规则',
            icon: editableKeys.length > 0 ? null : <PlusOutlined />
          }}
          editable={{
            type: 'multiple',
            editableKeys,
            onChange: setEditableRowKeys,
            onSave: async (key, record) => {
              // 校验1：赠送积分为 0（或为空）时提示
              if (!record.point || Number(record.point) === 0) {
                message.warning('赠送积分为 0 时无法设置优惠！')
                return Promise.reject('error') // 抛出 reject 阻止表格行保存
              }

              // 校验2：未选优惠券时提示
              if (!record.couponId) {
                message.warning('未选优惠券时无法设置优惠！')
                return Promise.reject('error')
              }

              // 如果通过所有校验，正常保存
              return Promise.resolve()
            }
          }}
          bordered
          locale={{ emptyText: <div style={emptyTextStyle}>暂无数据</div> }}
        />
      </Col>
      <ProFormRadio.Group
        name="productScope"
        label="活动范围"
        colProps={{ span: 12 }}
        rules={[{ required: true, message: '请选择活动范围' }]}
        options={COUPON_TYPE_OPTIONS}
      />
      <ProFormDependency name={['productScope']}>
        {({ productScope }) => {
          if (productScope === 2) {
            return (
              <ProForm.Item
                name="spuIds"
                label="活动商品"
                className="ant-col-12"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                rules={[{ required: true, message: '请选择商品' }]}
              >
                <Button type="default" onClick={() => setProductModalVisible(true)}>
                  选择商品
                </Button>
                {selectedProducts && selectedProducts.length > 0 && (
                  <span style={{ marginLeft: 12, color: '#666' }}>
                    已选: {selectedProducts.map((item) => item.name).join('、')}
                  </span>
                )}
              </ProForm.Item>
            )
          }

          if (productScope === 3) {
            return (
              <ProFormSelect
                name="categoryIds"
                label="商品分类"
                placeholder={'请选择商品分类'}
                rules={[{ required: true, message: '请选择商品分类' }]}
                colProps={{ span: 12 }}
                fieldProps={{
                  mode: 'multiple'
                }}
                request={async () => {
                  return []
                }}
              />
            )
          }
          return null
        }}
      </ProFormDependency>
      <ProFormTextArea
        name="remark"
        label="备注"
        placeholder="请输入备注"
        colProps={{ span: 24 }}
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 22 }}
        fieldProps={{ rows: 2 }}
      />

      <ProductSelectModal
        visible={productModalVisible}
        setVisible={setProductModalVisible}
        multiple={true}
        onSelect={(rows) => {
          setSelectedProducts(rows)
          form.setFieldValue(
            'spuIds',
            rows.map((r: any) => r.id)
          )
          message.success(`成功选择 ${rows.length} 件商品`)
        }}
      />

      <CouponSelectModal
        visible={couponModalVisible}
        setVisible={setCouponModalVisible}
        multiple={true}
        onSelect={(rows) => {
          setSelectedCoupons(rows)
          const ids = rows.map((item) => item.id)
          form.setFieldValue('couponIds', ids)
          message.success(`成功选择了 ${rows.length} 张优惠券`)
        }}
      />
    </ModalForm>
  )
}

export default RewardActivityForm
