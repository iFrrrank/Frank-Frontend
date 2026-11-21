import React, { useRef, useState, useEffect } from 'react'
import { Card, Row, Col, message } from 'antd'
import { UserOutlined, TeamOutlined, UsergroupAddOutlined } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { textConst } from '@/locales/zh-CN'
import CombinationRecordDetail, { handleOpenCombinationRecordDetail } from './CombinationRecordDetail'
import { tableActionStyle } from '@/styles/common.style'
import {
  getCombinationRecordPage,
  getCombinationRecordSummary
} from '@/api/mall/promotion/combination/record'
import { COMBINATION_RECORD_STATUS } from '@/utils/constantsValue'
import { rootStyle, innerStyles, iconBaseStyle, combinateRecordNumber } from '@/styles/common.style'

const CombinationRecordManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [summaryData, setSummaryData] = useState({
    userCount: 0,
    successCount: 0,
    virtualGroupCount: 0
  })

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await getCombinationRecordSummary()
        if (res.code === 0 && res.data) {
          setSummaryData({
            userCount: res.data.userCount || 0,
            successCount: res.data.successCount || 0,
            virtualGroupCount: res.data.virtualGroupCount || 0
          })
        }
      } catch (error) {
        console.error('获取统计数据失败', error)
      }
    }
    fetchSummary()
  }, [])

  const summaryCards = [
    {
      title: '参与人数(个)',
      value: summaryData.userCount,
      icon: <UserOutlined />,
      bgColor: '#e6f7ff',
      iconColor: '#1890ff'
    },
    {
      title: '成团数量(个)',
      value: summaryData.successCount,
      icon: <TeamOutlined />,
      bgColor: '#f9f0ff',
      iconColor: '#b37feb'
    },
    {
      title: '虚拟成团(个)',
      value: summaryData.virtualGroupCount,
      icon: <UsergroupAddOutlined />,
      bgColor: '#f9f0ff',
      iconColor: '#b37feb'
    }
  ]

  const columns: ProColumns<any>[] = [
    {
      title: '拼团ID',
      dataIndex: 'id',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '开团团长',
      dataIndex: 'headName',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      valueType: 'avatar',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '开团时间',
      dataIndex: 'startTime',
      valueType: 'dateTime',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '拼团商品',
      dataIndex: 'spuName',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '拼团状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      valueType: 'select',
      valueEnum: COMBINATION_RECORD_STATUS,
      fieldProps: { placeholder: '请选择拼团状态' }
    },
    {
      title: '几人团',
      dataIndex: 'userSize',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '参与人数',
      dataIndex: 'userCount',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '参团时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      valueType: 'dateTime',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInTable: true,
      align: 'center',
      width: 120,
      fieldProps: { placeholder: ['开始日期', '结束日期'] }
    },
    {
      title: textConst.table.action,
      valueType: 'option',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a key="detail" onClick={() => handleOpenCombinationRecordDetail(record)}>
            {textConst.action.detail}
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        {summaryCards.map((item, index) => (
          <Col span={8} key={index}>
            <Card title={item.title} style={rootStyle} styles={innerStyles} variant="borderless">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{ ...iconBaseStyle, backgroundColor: item.bgColor, color: item.iconColor }}
                >
                  {item.icon}
                </div>
                <div style={combinateRecordNumber}>{item.value}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <ProTable<any>
        headerTitle="拼团记录"
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
            const res = await getCombinationRecordPage(req as any)
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
      />
          <CombinationRecordDetail />
    </>
  )
}

export default CombinationRecordManagement
