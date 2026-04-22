import React, { useRef, useState } from 'react'
import { Button, Space } from 'antd'
import { PlusOutlined, CloseCircleFilled, CheckCircleFilled } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import AppForm from './components/AppForm'
import AlipayChannelForm from './components/channel/AlipayChannelForm'
import WechatChannelForm from './components/channel/WechatChannelForm'
import MockWalletChannelForm from './components/channel/MockWalletChannelForm'
import {
  tableActionStyle,
  deleteTextStyle,
  enablePayApp,
  disablePayApp
} from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'
import { getAppPage, deleteApp } from '@/api/pay/app'
import { COMMON_STATUS } from '@/utils/constantsValue'

const PayAppManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [appFormVisible, setAppFormVisible] = useState(false)
  const [currentAppId, setCurrentAppId] = useState<number | undefined>(undefined)
  const [currentChannel, setCurrentChannel] = useState<{
    appId: number
    channelCode: string
  } | null>(null)

  const [alipayVisible, setAlipayVisible] = useState(false)
  const [wechatVisible, setWechatVisible] = useState(false)
  const [mockWalletVisible, setMockWalletVisible] = useState(false)

  const handleOpenChannelForm = (appId: number, channelCode: string) => {
    setCurrentChannel({ appId, channelCode })
    if (channelCode.startsWith('alipay_')) {
      setAlipayVisible(true)
    } else if (channelCode.startsWith('wx_')) {
      setWechatVisible(true)
    } else if (channelCode === 'mock' || channelCode === 'wallet') {
      setMockWalletVisible(true)
    }
  }

  const renderChannelBtn = (record: any, channelCode: string) => {
    const isConfigured = record.channelConfigs?.includes(channelCode)
    return (
      <Button
        type="text"
        shape="circle"
        icon={
          isConfigured ? (
            <CheckCircleFilled style={enablePayApp} />
          ) : (
            <CloseCircleFilled style={disablePayApp} />
          )
        }
        onClick={() => handleOpenChannelForm(record.id, channelCode)}
      />
    )
  }

  const columns: ProColumns<any>[] = [
    {
      title: '应用名称',
      dataIndex: 'name',
      align: 'center',
      fieldProps: { placeholder: '请输入应用名称' }
    },
    {
      title: '应用状态',
      dataIndex: 'status',
      valueType: 'select',
      align: 'center',
      fieldProps: { placeholder: '请选择应用状态' },
      valueEnum: COMMON_STATUS
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInTable: true,
      fieldProps: { placeholder: ['开始日期', '结束日期'] }
    },
    {
      title: '应用标识',
      dataIndex: 'appKey',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '支付宝配置',
      align: 'center',
      hideInSearch: true,
      children: [
        {
          title: 'APP 支付',
          dataIndex: 'alipay_app',
          align: 'center',
          render: (_, r) => renderChannelBtn(r, 'alipay_app')
        },
        {
          title: 'PC 网站支付',
          dataIndex: 'alipay_pc',
          align: 'center',
          render: (_, r) => renderChannelBtn(r, 'alipay_pc')
        },
        {
          title: 'WAP 网站支付',
          dataIndex: 'alipay_wap',
          align: 'center',
          render: (_, r) => renderChannelBtn(r, 'alipay_wap')
        },
        {
          title: '扫码支付',
          dataIndex: 'alipay_qr',
          align: 'center',
          render: (_, r) => renderChannelBtn(r, 'alipay_qr')
        },
        {
          title: '条码支付',
          dataIndex: 'alipay_bar',
          align: 'center',
          render: (_, r) => renderChannelBtn(r, 'alipay_bar')
        }
      ]
    },
    {
      title: '微信配置',
      align: 'center',
      hideInSearch: true,
      children: [
        {
          title: '小程序支付',
          dataIndex: 'wx_lite',
          align: 'center',
          render: (_, r) => renderChannelBtn(r, 'wx_lite')
        },
        {
          title: 'JSAPI 支付',
          dataIndex: 'wx_pub',
          align: 'center',
          render: (_, r) => renderChannelBtn(r, 'wx_pub')
        },
        {
          title: 'APP 支付',
          dataIndex: 'wx_app',
          align: 'center',
          render: (_, r) => renderChannelBtn(r, 'wx_app')
        },
        {
          title: 'Native 支付',
          dataIndex: 'wx_native',
          align: 'center',
          render: (_, r) => renderChannelBtn(r, 'wx_native')
        },
        {
          title: 'WAP 网站支付',
          dataIndex: 'wx_wap',
          align: 'center',
          render: (_, r) => renderChannelBtn(r, 'wx_wap')
        },
        {
          title: '条码支付',
          dataIndex: 'wx_bar',
          align: 'center',
          render: (_, r) => renderChannelBtn(r, 'wx_bar')
        }
      ]
    },
    {
      title: '钱包支付配置',
      align: 'center',
      hideInSearch: true,
      children: [
        {
          title: '钱包支付',
          dataIndex: 'wallet',
          align: 'center',
          render: (_, r) => renderChannelBtn(r, 'wallet')
        }
      ]
    },
    {
      title: '模拟支付配置',
      align: 'center',
      hideInSearch: true,
      children: [
        {
          title: '模拟支付',
          dataIndex: 'mock',
          align: 'center',
          render: (_, r) => renderChannelBtn(r, 'mock')
        }
      ]
    },
    {
      title: textConst.table.action,
      valueType: 'option',
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" style={tableActionStyle}>
          <a
            onClick={() => {
              setCurrentAppId(record.id)
              setAppFormVisible(true)
            }}
          >
            {textConst.action.update}
          </a>
          <a
            style={deleteTextStyle}
            onClick={() => handleDelete(record, deleteApp, () => actionRef.current?.reload())}
          >
            {textConst.action.delete}
          </a>
        </Space>
      )
    }
  ]

  return (
    <>
      <ProTable<any>
        headerTitle="支付应用列表"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        search={{ labelWidth: 'auto', span: 6 }}
        scroll={{ x: 'max-content' }}
        bordered
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
            const res = await getAppPage(req as any)
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
              setCurrentAppId(undefined)
              setAppFormVisible(true)
            }}
          >
            {textConst.action.create}
          </Button>
        ]}
      />

      <AppForm
        visible={appFormVisible}
        setVisible={setAppFormVisible}
        id={currentAppId}
        onSuccess={() => {
          setAppFormVisible(false)
          actionRef.current?.reload()
        }}
      />

      <AlipayChannelForm
        visible={alipayVisible}
        setVisible={setAlipayVisible}
        channelInfo={currentChannel}
        onSuccess={() => {
          setAlipayVisible(false)
          actionRef.current?.reload()
        }}
      />

      <WechatChannelForm
        visible={wechatVisible}
        setVisible={setWechatVisible}
        channelInfo={currentChannel}
        onSuccess={() => {
          setWechatVisible(false)
          actionRef.current?.reload()
        }}
      />

      <MockWalletChannelForm
        visible={mockWalletVisible}
        setVisible={setMockWalletVisible}
        channelInfo={currentChannel}
        onSuccess={() => {
          setMockWalletVisible(false)
          actionRef.current?.reload()
        }}
      />
    </>
  )
}

export default PayAppManagement
