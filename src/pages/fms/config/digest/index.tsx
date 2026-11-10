import React, { useEffect, useRef, useState } from 'react'
import { Button, Modal, message } from 'antd'
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import dayjs from 'dayjs'
import {
  fmsDigestDeleteDigest,
  fmsDigestGetDigestList
} from '@/api/fms/config/digest'
import HasPermi, { useHasPermi } from '@/directives/permission/HasPermi'
import { textConst } from '@/locales/zh-CN'
import { deleteTextStyle, tableActionStyle } from '@/styles/common.style'
import { useFmsStore } from '../../store/fms'
import FmsDigestForm from './FmsDigestForm'

/**
 * 常用摘要管理页面
 */
const DigestPage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const hasPermi = useHasPermi()
  const fmsStore = useFmsStore()

  const [formVisible, setFormVisible] = useState(false)
  const [editRow, setEditRow] = useState<API.FmsDigestRespVO | undefined>()

  useEffect(() => {
    actionRef.current?.reload()
  }, [fmsStore.accountSetId])

  const handleDelete = (row: API.FmsDigestRespVO) => {
    if (!fmsStore.accountSetId) return
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除摘要 "${row.content}"？`,
      onOk: async () => {
        const resp = await fmsDigestDeleteDigest({
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

  const columns: ProColumns<API.FmsDigestRespVO>[] = [
    {
      title: '摘要内容',
      dataIndex: 'content',
      ellipsis: true
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
          {hasPermi('fms:config:digest:update') && (
            <a
              onClick={() => {
                setEditRow(record)
                setFormVisible(true)
              }}
            >
              {textConst.action.update}
            </a>
          )}
          {hasPermi('fms:config:digest:delete') && (
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
      <ProTable<API.FmsDigestRespVO>
        headerTitle="常用摘要列表"
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
          const resp = await fmsDigestGetDigestList({
            accountSetId: fmsStore.accountSetId
          })
          return {
            data: resp.data || [],
            success: resp.code === 0
          }
        }}
        toolBarRender={() => [
          fmsStore.isAccountSetWritable && (
            <HasPermi key="create" value="fms:config:digest:create">
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
        <FmsDigestForm
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

export default DigestPage
