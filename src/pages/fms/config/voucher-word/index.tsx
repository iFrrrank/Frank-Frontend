import React, { useEffect, useRef, useState } from 'react'
import { Button, Modal, Tag, message } from 'antd'
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import dayjs from 'dayjs'
import {
  fmsVoucherWordDeleteVoucherWord,
  fmsVoucherWordGetVoucherWordList
} from '@/api/fms/config/voucherWord'
import HasPermi, { useHasPermi } from '@/directives/permission/HasPermi'
import { textConst } from '@/locales/zh-CN'
import { deleteTextStyle, tableActionStyle } from '@/styles/common.style'
import { useFmsStore } from '../../store/fms'
import FmsVoucherWordForm from './FmsVoucherWordForm'

/**
 * 凭证字管理页面
 */
const VoucherWordPage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const hasPermi = useHasPermi()
  const fmsStore = useFmsStore()

  const [formVisible, setFormVisible] = useState(false)
  const [editRow, setEditRow] = useState<API.FmsVoucherWordRespVO | undefined>()

  useEffect(() => {
    actionRef.current?.reload()
  }, [fmsStore.accountSetId])

  const handleDelete = (row: API.FmsVoucherWordRespVO) => {
    if (!fmsStore.accountSetId) return
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除凭证字 "${row.name}"？`,
      onOk: async () => {
        const resp = await fmsVoucherWordDeleteVoucherWord({
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

  const columns: ProColumns<API.FmsVoucherWordRespVO>[] = [
    {
      title: '凭证字',
      dataIndex: 'name',
      align: 'center'
    },
    {
      title: '打印标题',
      dataIndex: 'printTitle',
      align: 'center'
    },
    {
      title: '是否默认',
      dataIndex: 'defaultStatus',
      align: 'center',
      render: (_, record) => (
        <Tag color={record.defaultStatus ? 'success' : 'default'}>
          {record.defaultStatus ? '是' : '否'}
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
          {hasPermi('fms:config:voucher-word:update') && (
            <a
              onClick={() => {
                setEditRow(record)
                setFormVisible(true)
              }}
            >
              {textConst.action.update}
            </a>
          )}
          {hasPermi('fms:config:voucher-word:delete') && (
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
      <ProTable<API.FmsVoucherWordRespVO>
        headerTitle="凭证字列表"
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
          const resp = await fmsVoucherWordGetVoucherWordList({
            accountSetId: fmsStore.accountSetId
          })
          return {
            data: resp.data || [],
            success: resp.code === 0
          }
        }}
        toolBarRender={() => [
          fmsStore.isAccountSetWritable && (
            <HasPermi key="create" value="fms:config:voucher-word:create">
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
        <FmsVoucherWordForm
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

export default VoucherWordPage
