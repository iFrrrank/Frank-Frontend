import React, { useEffect, useRef, useState } from 'react'
import { Button, Modal, Tag, message } from 'antd'
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import dayjs from 'dayjs'
import {
  fmsFinanceIndicatorDelete,
  fmsFinanceIndicatorGetList
} from '@/api/fms/config/financeIndicator'
import HasPermi, { useHasPermi } from '@/directives/permission/HasPermi'
import { textConst } from '@/locales/zh-CN'
import { deleteTextStyle, tableActionStyle } from '@/styles/common.style'
import { CommonStatusEnum } from '@/utils/constants'
import { useFmsStore } from '../../store/fms'
import {
  FMS_FINANCE_INDICATOR_TYPE,
  FMS_FINANCE_INDICATOR_TYPE_OPTIONS
} from '../../utils/constants'
import FmsFinanceIndicatorForm from './FmsFinanceIndicatorForm'

/**
 * 财务指标管理页面
 */
const FinanceIndicatorPage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const hasPermi = useHasPermi()
  const fmsStore = useFmsStore()

  const [formVisible, setFormVisible] = useState(false)
  const [editId, setEditId] = useState<number | undefined>()

  useEffect(() => {
    actionRef.current?.reload()
  }, [fmsStore.accountSetId])

  const handleDelete = (row: API.FmsFinanceIndicatorRespVO) => {
    if (!fmsStore.accountSetId || row.id === undefined) return
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除财务指标 "${row.name}"？`,
      onOk: async () => {
        const resp = await fmsFinanceIndicatorDelete({
          accountSetId: fmsStore.accountSetId!,
          id: row.id!
        })
        if (resp.code === 0) {
          message.success(textConst.msg.delSuccess)
          actionRef.current?.reload()
        }
      }
    })
  }

  const columns: ProColumns<API.FmsFinanceIndicatorRespVO>[] = [
    {
      title: '取数报表',
      dataIndex: 'type',
      align: 'center',
      render: (_, record) => (
        <Tag
          color={
            record.type === FMS_FINANCE_INDICATOR_TYPE.BALANCE_SHEET ? 'processing' : 'success'
          }
        >
          {FMS_FINANCE_INDICATOR_TYPE_OPTIONS.find((item) => item.value === record.type)?.label ||
            '-'}
        </Tag>
      )
    },
    {
      title: '指标名称',
      dataIndex: 'name',
      align: 'center'
    },
    {
      title: '指标编码',
      dataIndex: 'code',
      align: 'center'
    },
    {
      title: '指标公式',
      dataIndex: 'formula',
      align: 'center',
      ellipsis: true
    },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      width: 90
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 90,
      render: (_, record) => (
        <Tag color={record.status === CommonStatusEnum.ENABLE.status ? 'success' : 'default'}>
          {record.status === CommonStatusEnum.ENABLE.status ? '启用' : '停用'}
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
          {hasPermi('fms:config:finance-indicator:update') && (
            <a
              onClick={() => {
                setEditId(record.id)
                setFormVisible(true)
              }}
            >
              {textConst.action.update}
            </a>
          )}
          {hasPermi('fms:config:finance-indicator:delete') && (
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
      <ProTable<API.FmsFinanceIndicatorRespVO>
        headerTitle="财务指标列表"
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
          const resp = await fmsFinanceIndicatorGetList({
            accountSetId: fmsStore.accountSetId
          })
          return {
            data: resp.data || [],
            success: resp.code === 0
          }
        }}
        toolBarRender={() => [
          fmsStore.isAccountSetWritable && (
            <HasPermi key="create" value="fms:config:finance-indicator:create">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditId(undefined)
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
        <FmsFinanceIndicatorForm
          visible={formVisible}
          setVisible={setFormVisible}
          accountSetId={fmsStore.accountSetId}
          id={editId}
          onSuccess={() => actionRef.current?.reload()}
        />
      )}
    </>
  )
}

export default FinanceIndicatorPage
