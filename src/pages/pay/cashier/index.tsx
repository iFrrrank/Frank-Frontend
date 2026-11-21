import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Input, message, Modal, QRCode, Spin, Typography } from 'antd'
import { history, useSearchParams } from '@umijs/max'
import { getOrder1, submitPayOrder } from '@/api/pay/order'

// 支付状态枚举（PayOrderStatusEnum）
const ORDER_STATUS_SUCCESS = 10
const ORDER_STATUS_CLOSED = 30

// 支付渠道分组（与原收银台的渠道清单保持一致）
const CHANNELS_ALIPAY = [
  { name: '支付宝 PC 网站支付', code: 'alipay_pc' },
  { name: '支付宝 Wap 网站支付', code: 'alipay_wap' },
  { name: '支付宝 App 支付', code: 'alipay_app' },
  { name: '支付宝扫码支付', code: 'alipay_qr' },
  { name: '支付宝条码支付', code: 'alipay_bar' }
]
const CHANNELS_WECHAT = [
  { name: '微信公众号支付', code: 'wx_pub' },
  { name: '微信小程序支付', code: 'wx_lite' },
  { name: '微信 App 支付', code: 'wx_app' },
  { name: '微信扫码支付', code: 'wx_native' },
  { name: '微信条码支付', code: 'wx_bar' }
]
const CHANNELS_OTHER = [
  { name: '钱包支付', code: 'wallet' },
  { name: '模拟支付', code: 'mock' }
]

// 金额（分）转元展示
const fenToYuan = (price?: number) => ((price || 0) / 100).toFixed(2)

// 收银台：展示支付单信息，选择渠道发起支付，并轮询支付结果
const Cashier: React.FC = () => {
  const [searchParams] = useSearchParams()
  const idParam = searchParams.get('id')
  const orderId = idParam ? Number(idParam) : undefined
  const returnUrlParam = searchParams.get('returnUrl')
  const returnUrl = returnUrlParam ? decodeURIComponent(returnUrlParam) : undefined

  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [payOrder, setPayOrder] = useState<API.PayOrderRespVO | null>(null)
  // 二维码弹窗状态
  const [qrCode, setQrCode] = useState<{ title: string; url: string; visible: boolean }>({
    title: '',
    url: '',
    visible: false
  })
  // 条码支付弹窗状态
  const [barCode, setBarCode] = useState<{ channelCode: string; value: string; visible: boolean }>({
    channelCode: '',
    value: '',
    visible: false
  })
  // 轮询定时器
  const intervalRef = useRef<any>(undefined)

  /** 回到业务页面：payResult 取 success / cancel / close */
  const goReturnUrl = (payResult: string) => {
    clearQueryInterval()
    if (!returnUrl) {
      history.back()
      return
    }
    const url =
      returnUrl.indexOf('?') >= 0
        ? `${returnUrl}&payResult=${payResult}`
        : `${returnUrl}?payResult=${payResult}`
    if (returnUrl.indexOf('http') === 0) {
      window.location.href = url
    } else {
      history.push(url)
    }
  }

  /** 清空轮询任务与二维码弹窗 */
  const clearQueryInterval = () => {
    setQrCode({ title: '', url: '', visible: false })
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = undefined
    }
  }

  /** 获得支付信息；已支付/已关闭时直接回跳 */
  const getDetail = async () => {
    if (!orderId) {
      message.error('未传递支付单号，无法查看对应的支付信息')
      goReturnUrl('cancel')
      return
    }
    try {
      const resp = await getOrder1({ id: orderId, sync: true })
      const data = resp.data
      if (!data) {
        message.error('支付订单不存在，请检查！')
        goReturnUrl('cancel')
        return
      }
      if (data.status === ORDER_STATUS_SUCCESS) {
        message.success('支付成功')
        goReturnUrl('success')
        return
      }
      if (data.status === ORDER_STATUS_CLOSED) {
        message.error('无法支付，原因：订单已关闭')
        goReturnUrl('close')
        return
      }
      setPayOrder(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getDetail()
    // 页面卸载时清理轮询
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** 轮询支付结果（每 2 秒查询一次订单状态） */
  const createQueryInterval = () => {
    if (intervalRef.current) {
      return
    }
    intervalRef.current = setInterval(async () => {
      if (!orderId) {
        return
      }
      try {
        const resp = await getOrder1({ id: orderId })
        const data = resp.data
        if (!data) {
          return
        }
        if (data.status === ORDER_STATUS_SUCCESS) {
          clearQueryInterval()
          message.success('支付成功！')
          goReturnUrl('success')
        }
        if (data.status === ORDER_STATUS_CLOSED) {
          clearQueryInterval()
          message.error('支付已关闭！')
          goReturnUrl('close')
        }
      } catch {
        // 轮询期间的查询失败不打断支付流程
      }
    }, 2000)
  }

  /** 构建提交支付的额外参数（条码支付需要 authCode） */
  const buildSubmitParam = (channelCode: string) => {
    if (channelCode === 'alipay_bar') {
      return { channelExtras: { auth_code: barCode.value } }
    }
    if (channelCode === 'wx_bar') {
      return { channelExtras: { authCode: barCode.value } }
    }
    return {}
  }

  /** 提交支付后的 URL 展示：直接跳转到渠道页面 */
  const displayUrl = (data: API.PayOrderSubmitRespVO) => {
    window.location.href = data.displayContent
  }

  /** 提交支付后的表单展示（如支付宝 PC 支付返回的自动提交表单） */
  const displayForm = (data: API.PayOrderSubmitRespVO) => {
    const div = document.createElement('div')
    div.innerHTML = data.displayContent
    document.body.appendChild(div)
    const form = div.querySelector('form')
    if (form) {
      form.submit()
    }
  }

  /** 提交支付后的二维码展示 */
  const displayQrCode = (channelCode: string, data: API.PayOrderSubmitRespVO) => {
    let title = '请使用手机浏览器“扫一扫”'
    if (channelCode.indexOf('alipay_') === 0) {
      title = '请使用支付宝“扫一扫”扫码支付'
    } else if (channelCode.indexOf('wx_') === 0) {
      title = '请使用微信“扫一扫”扫码支付'
    }
    setQrCode({ title, url: data.displayContent, visible: true })
  }

  /** 提交支付后的 App 展示：网页端无法拉起 App 支付 */
  const displayApp = (channelCode: string) => {
    if (channelCode === 'alipay_app') {
      message.error('支付宝 App 支付：无法在网页支付！')
    }
    if (channelCode === 'wx_app') {
      message.error('微信 App 支付：无法在网页支付！')
    }
  }

  /** 真正提交支付 */
  const submit0 = async (channelCode: string) => {
    if (!orderId) {
      return
    }
    setSubmitLoading(true)
    try {
      const resp = await submitPayOrder({
        id: orderId,
        channelCode,
        // 渠道支付完成后先跳回当前页，再由当前页回跳业务地址
        returnUrl: window.location.href,
        ...buildSubmitParam(channelCode)
      })
      const data = resp.data
      if (!data) {
        message.error('提交支付失败')
        return
      }
      // 直接已支付的情况（例如钱包、模拟支付）
      if (data.status === ORDER_STATUS_SUCCESS) {
        clearQueryInterval()
        message.success('支付成功！')
        goReturnUrl('success')
        return
      }
      if (data.displayMode === 'url') {
        displayUrl(data)
      } else if (data.displayMode === 'form') {
        displayForm(data)
      } else if (data.displayMode === 'qr_code') {
        displayQrCode(channelCode, data)
      } else if (data.displayMode === 'app') {
        displayApp(channelCode)
      }
      // 打开轮询，等待扫码等异步支付结果
      createQueryInterval()
    } finally {
      setSubmitLoading(false)
      setBarCode((prev) => ({ ...prev, visible: false }))
    }
  }

  /** 点击渠道：条码支付先弹窗输入条码；公众号/小程序在 PC 端不可用 */
  const submit = (channelCode: string) => {
    if (channelCode === 'alipay_bar' || channelCode === 'wx_bar') {
      setBarCode({ channelCode, value: '', visible: true })
      return
    }
    if (channelCode === 'wx_pub') {
      message.error('微信公众号支付：不支持 PC 网站')
      return
    }
    if (channelCode === 'wx_lite') {
      message.error('微信小程序：不支持 PC 网站')
      return
    }
    submit0(channelCode)
  }

  const renderChannelGroup = (title: string, channels: { name: string; code: string }[]) => (
    <div style={{ marginBottom: 24 }}>
      <Typography.Title level={5}>{title}</Typography.Title>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {channels.map((channel) => (
          <Button
            key={channel.code}
            size="large"
            loading={submitLoading}
            onClick={() => submit(channel.code)}
            style={{ minWidth: 200 }}
          >
            {channel.name}
          </Button>
        ))}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 900, margin: '24px auto', padding: '0 16px' }}>
      <Card style={{ marginBottom: 16 }}>
        <Typography.Title level={4} style={{ marginTop: 0 }}>
          {payOrder?.subject || '收银台'}
        </Typography.Title>
        <div style={{ color: '#888' }}>
          <div>支付单号：{payOrder?.no || orderId}</div>
          <div>商户订单号：{payOrder?.merchantOrderId}</div>
          <div>过期时间：{payOrder?.expireTime}</div>
        </div>
        <div style={{ marginTop: 12, fontSize: 28, color: '#f5222d' }}>
          ￥{fenToYuan(payOrder?.price)}
        </div>
      </Card>

      <Card title="选择支付方式">
        {renderChannelGroup('支付宝', CHANNELS_ALIPAY)}
        {renderChannelGroup('微信', CHANNELS_WECHAT)}
        {renderChannelGroup('其他', CHANNELS_OTHER)}
        <Button onClick={() => goReturnUrl('cancel')}>取消支付</Button>
      </Card>

      {/* 二维码弹窗：扫码支付时展示，支付结果由轮询感知 */}
      <Modal
        title={qrCode.title}
        open={qrCode.visible}
        footer={null}
        onCancel={clearQueryInterval}
        width={320}
      >
        <div style={{ textAlign: 'center', padding: 16 }}>
          <QRCode value={qrCode.url || '-'} size={220} />
          <div style={{ marginTop: 12, color: '#888' }}>支付金额：￥{fenToYuan(payOrder?.price)}</div>
        </div>
      </Modal>

      {/* 条码弹窗：输入付款条码后确认支付 */}
      <Modal
        title={barCode.channelCode === 'alipay_bar' ? '“支付宝”条码支付' : '“微信”条码支付'}
        open={barCode.visible}
        onCancel={() => setBarCode((prev) => ({ ...prev, visible: false }))}
        onOk={() => submit0(barCode.channelCode)}
        okText="确认支付"
        okButtonProps={{ disabled: barCode.value.length === 0, loading: submitLoading }}
      >
        <Input
          placeholder="请输入付款条码"
          value={barCode.value}
          onChange={(e) => setBarCode((prev) => ({ ...prev, value: e.target.value }))}
        />
      </Modal>
    </div>
  )
}

export default Cashier
