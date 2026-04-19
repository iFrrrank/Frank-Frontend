import React, { useState } from 'react'
import { Card, Tabs, Button, message } from 'antd'
import {
  ProForm,
  ProFormText,
  ProFormSwitch,
  ProFormDigit,
  ProFormRadio,
  ProFormCheckbox,
  ProFormUploadButton
} from '@ant-design/pro-components'
import { getConfig, updateConfig } from '@/api/mall/trade/config'
import { textConst } from '@/locales/zh-CN'
import {
  BROKERAGE_ENABLED,
  BROKERAGE_BIND_MODE,
  BROKERAGE_WITHDRAW_TYPE
} from '@/utils/constantsValue'

const TradeConfig: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>('1')

  return (
    <Card>
      <ProForm
        layout="horizontal"
        colon={false}
        labelAlign="right"
        rowProps={{ gutter: 24 }}
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 10 }}
        submitter={{
          render: (props) => {
            return (
              <div style={{ paddingLeft: '8.4%' }}>
                <Button type="primary" onClick={() => props.form?.submit()}>
                  {textConst.action.save}
                </Button>
              </div>
            )
          }
        }}
        request={async () => {
          try {
            const res = await getConfig()
            if (res.code === 0 && res.data) {
              // 后端金额字段是分，需要在此处除以 100 转换为元回显：
              res.data.deliveryExpressFreePrice = res.data.deliveryExpressFreePrice / 100
              res.data.brokerageWithdrawMinPrice = res.data.brokerageWithdrawMinPrice / 100
              return res.data
            }
            return {}
          } catch (error) {
            message.error('获取配置失败')
            return {}
          }
        }}
        // 提交更新
        onFinish={async (values) => {
          try {
            // 后端金额字段是分，需要在此处乘以 100 转换为分再提交：
            const submitData = { ...values }
            // submitData.deliveryExpressFreePrice = Math.round(values.deliveryExpressFreePrice * 100)
            // submitData.brokerageWithdrawMinPrice = Math.round(
            //   values.brokerageWithdrawMinPrice * 100
            // )

            const res = await updateConfig(values as any)
            if (res.code === 0) {
              message.success('保存配置成功')
              return true
            }
            return false
          } catch (error) {
            message.error('保存失败')
            return false
          }
        }}
      >
        <Tabs activeKey={activeKey} onChange={setActiveKey}>
          <Tabs.TabPane tab="售后" key="1">
            <ProFormText
              name="afterSaleRefundReasons"
              label="退款理由"
              placeholder="请直接输入退款理由"
            />
            <ProFormText
              name="afterSaleReturnReasons"
              label="退货理由"
              placeholder="请直接输入退货理由"
            />
          </Tabs.TabPane>

          <Tabs.TabPane tab="配送" key="2">
            <ProFormSwitch
              name="deliveryExpressFreeEnabled"
              label="启用包邮"
              extra="商城是否启用全场包邮"
            />
            <ProFormDigit
              name="deliveryExpressFreePrice"
              label="满额包邮"
              placeholder={'请输入包邮的门栏金额'}
              rules={[{ required: true, message: '请输入满额包邮金额' }]}
              fieldProps={{ precision: 2, min: 0, addonAfter: '元' }}
              extra="商城商品满多少金额即可包邮，单位：元"
            />
            <ProFormSwitch name="deliveryPickUpEnabled" label="启用门店自提" />
          </Tabs.TabPane>

          <Tabs.TabPane tab="分销" key="3">
            <ProFormSwitch name="brokerageEnabled" label="分佣启用" extra="商城是否开启分销模式" />
            <ProFormRadio.Group
              name="brokerageEnabledCondition"
              label="分佣模式"
              rules={[{ required: true, message: '请选择分佣模式' }]}
              options={BROKERAGE_ENABLED}
              extra={
                <div>
                  <div>人人分销：每个用户都可以成为推广员</div>
                  <div>指定分销：仅可在后台手动设置推广员</div>
                </div>
              }
            />
            <ProFormRadio.Group
              name="brokerageBindMode"
              label="分销关系绑定"
              rules={[{ required: true, message: '请选择分销关系绑定方式' }]}
              options={BROKERAGE_BIND_MODE}
              extra={
                <div>
                  <div>首次绑定：只要用户没有推广人，随时都可以绑定推广关系</div>
                  <div>注册绑定：只有新用户注册时或首次进入系统时才可以绑定推广关系</div>
                </div>
              }
            />
            {/* @ts-ignore */}
            <ProFormUploadButton
              name="brokeragePosterUrl"
              label="分销海报图"
              max={1}
              title="单击上传"
              listType="picture-card"
              extra="个人中心分销海报图片，建议尺寸 600x1000"
              fieldProps={
                {
                  // 此处可以配置您的自定义上传请求
                }
              }
            />
            <ProFormDigit
              name="brokerageFirstPercent"
              label="一级返佣比例"
              placeholder={'请输入一级返佣比例'}
              rules={[{ required: true, message: '请输入一级返佣比例' }]}
              fieldProps={{ min: 0, max: 100, precision: 2, addonAfter: '%' }}
              extra="订单交易成功后给推广人返佣的百分比"
            />
            <ProFormDigit
              name="brokerageSecondPercent"
              label="二级返佣比例"
              placeholder={'请输入二级返佣比例'}
              rules={[{ required: true, message: '请输入二级返佣比例' }]}
              fieldProps={{ min: 0, max: 100, precision: 2, addonAfter: '%' }}
              extra="订单交易成功后给推广人的推荐人返佣的百分比"
            />
            <ProFormDigit
              name="brokerageWithdrawFreezeDays"
              label="佣金冻结天数"
              placeholder={'请输入佣金冻结天数'}
              rules={[{ required: true, message: '请输入佣金冻结天数' }]}
              fieldProps={{ min: 0, precision: 0, addonAfter: '天' }}
              extra="防止用户退款，佣金被提现了，所以需要设置佣金冻结时间，单位：天"
            />
            <ProFormDigit
              name="brokerageWithdrawMinPrice"
              label="提现最低金额"
              placeholder={'请输入提现最低金额'}
              rules={[{ required: true, message: '请输入提现最低金额' }]}
              fieldProps={{ precision: 2, min: 0, addonAfter: '元' }}
              extra="用户提现最低金额限制，单位：元"
            />
            <ProFormDigit
              name="brokerageWithdrawFeePercent"
              label="提现手续费"
              placeholder={'请输入提现手续费比例'}
              rules={[{ required: true, message: '请输入提现手续费比例' }]}
              fieldProps={{ min: 0, max: 100, precision: 2, addonAfter: '%' }}
              extra="提现手续费百分比，范围 0-100，0 为无提现手续费。例：设置 10，即收取 10% 手续费，提现 10 元，到账 9 元，1 元手续费"
            />
            <ProFormCheckbox.Group
              name="brokerageWithdrawTypes"
              label="提现方式"
              rules={[{ required: true, message: '请至少选择一种提现方式' }]}
              options={BROKERAGE_WITHDRAW_TYPE}
              extra="商城开通提现的付款方式"
            />
          </Tabs.TabPane>
        </Tabs>
      </ProForm>
    </Card>
  )
}

export default TradeConfig
