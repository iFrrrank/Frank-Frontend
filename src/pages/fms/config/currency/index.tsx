import React, { useEffect, useRef, useState } from 'react'
import { Button, Modal, Tag, message } from 'antd'
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import dayjs from 'dayjs'
import {
  fmsCurrencyDeleteCurrency,
  fmsCurrencyGetCurrencyList
} from '@/api/fms/config/currency'
import HasPermi, { useHasPermi } from '@/directives/permission/HasPermi'
import { textConst } from '@/locales/zh-CN'
import { deleteTextStyle, tableActionStyle } from '@/styles/common.style'
import { useFmsStore } from '../../store/fms'
import { formatExchangeRate } from '../../utils/format'
import FmsCurrencyForm from './FmsCurrencyForm'

/**
 * 币种管理页面
 */
const CurrencyPage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const hasPermi = useHasPermi()
  const fmsStore = useFmsStore()

  const [formVisible, setFormVisible] = useState(false)
  const [editRow, setEditRow] = useState<API.FmsCurrencyRespVO | undefined>()

  useEffect(() => {
    actionRef.current?.reload()
  }, [fmsStore.accountSetId])

  const handleDelete = (row: API.FmsCurrencyRespVO) => {
    if (!fmsStore.accountSetId) return
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除币种 "${row.name}"？`,
      onOk: async () => {
        const resp = await fmsCurrencyDeleteCurrency({
          accountSetId: fmsStore.accountSetId!,
          id: row.id
        })
        if (resp.code === 0) {
          message.success(textConst.msg.delSuccess)
          actionRef.current?.reload()
        }
      }
    })
  }

  const columns: ProColumns<API.FmsCurrencyRespVO>[] = [
    {
      title: '编码',
      dataIndex: 'code',
      align: 'center'
    },
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center'
    },
    {
      title: '汇率',
      dataIndex: 'exchangeRate',
      align: 'center',
      render: (_, record) => formatExchangeRate(record.exchangeRate)
    },
    {
      title: '是否本位币',
      dataIndex: 'standard',
      align: 'center',
      render: (_, record) => (
        <Tag color={record.standard ? 'success' : 'default'}>
          {record.standard ? '是' : '否'}
        </Tag>
      )
    },
    {
      title: textConst.columns.createTime,
      dataIndex: 'createTime',
      align: 'center',
      width: 180,
      render: (_, record) =>
        record.createTime ? dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'
    },
    {
      title: textConst.form.operate,
      valueType: 'option',
      align: 'center',
      width: 150,
      hideInTable: !fmsStore.isAccountSetWritable,
      render: (_, record) => (
        <div style={tableActionStyle}>
          {hasPermi('fms:config:currency:update') && (
            <a
              onClick={() => {
                setEditRow(record)
                setFormVisible(true)
              }}
            >
              {textConst.action.update}
            </a>
          )}
          {!record.standard && hasPermi('fms:config:currency:delete') && (
            <a style={deleteTextStyle} onClick={() => handleDelete(record)}>
              {textConst.action.delete}
            </a>
          )}
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<API.FmsCurrencyRespVO>
        headerTitle="币别列表"
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        cardBordered
        search={false}
        options={false}
        pagination={false}
        request={async () => {
          if (!fmsStore.accountSetId) {
            return { data: [], success: true }
          }
          const resp = await fmsCurrencyGetCurrencyList({
            accountSetId: fmsStore.accountSetId
          })
          return {
            data: resp.data || [],
            success: resp.code === 0
          }
        }}
        toolBarRender={() => [
          fmsStore.isAccountSetWritable && (
            <HasPermi key="create" value="fms:config:currency:create">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditRow(undefined)
                  setFormVisible(true)
                }}
              >
                {textConst.action.addNew}
              </Button>
            </HasPermi>
          )
        ]}
      />

      {fmsStore.accountSetId && (
        <FmsCurrencyForm
          visible={formVisible}
          setVisible={setFormVisible}
          accountSetId={fmsStore.accountSetId}
          row={editRow}
          onSuccess={() => actionRef.current?.reload()}
        />
      )}
    </>
  )
}

export default CurrencyPage
