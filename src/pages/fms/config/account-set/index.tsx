import React, { useRef, useState } from 'react'
import { Button, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import dayjs from 'dayjs'
import { fmsAccountSetGetAccountSetList } from '@/api/fms/config/accountSet'
import HasPermi, { useHasPermi } from '@/directives/permission/HasPermi'
import { textConst } from '@/locales/zh-CN'
import { tableActionStyle } from '@/styles/common.style'
import { useFmsStore } from '../../store/fms'
import { FMS_ACCOUNT_USER_LEVEL } from '../../utils/constants'
import FmsAccountSetForm from './FmsAccountSetForm'
import FmsAccountSetInitializeForm from './FmsAccountSetInitializeForm'
import FmsAccountSetMemberForm from './FmsAccountSetMemberForm'

/**
 * 账套管理页面
 */
const AccountSetPage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const hasPermi = useHasPermi()
  const fmsStore = useFmsStore()

  const [formVisible, setFormVisible] = useState(false)
  const [editId, setEditId] = useState<number | undefined>()
  const [memberVisible, setMemberVisible] = useState(false)
  const [currentRow, setCurrentRow] = useState<API.FmsAccountSetRespVO | undefined>()
  const [initVisible, setInitVisible] = useState(false)

  /** 刷新表格及全局账套列表 */
  const handleRefresh = async () => {
    actionRef.current?.reload()
    await fmsStore.loadAccountSetList()
  }

  const columns: ProColumns<API.FmsAccountSetRespVO>[] = [
    {
      title: '账套名称',
      dataIndex: 'companyName',
      minWidth: 220,
      ellipsis: true,
      render: (_, record) => (
        <>
          <span>{record.companyName}</span>
          {record.defaultStatus && (
            <Tag color="blue" style={{ marginLeft: 8 }}>
              默认
            </Tag>
          )}
        </>
      )
    },
    {
      title: '公司编码',
      dataIndex: 'companyCode',
      align: 'center',
      minWidth: 140
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
      align: 'center',
      minWidth: 120
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
      align: 'center',
      width: 140
    },
    {
      title: '启用期间',
      dataIndex: 'startTime',
      align: 'center',
      width: 120,
      render: (_, record) =>
        record.startTime ? dayjs(Number(record.startTime) || record.startTime).format('YYYY-MM-DD') : '-'
    },
    {
      title: '账套状态',
      dataIndex: 'initialized',
      align: 'center',
      width: 100,
      render: (_, record) =>
        record.initialized ? <Tag color="success">已启用</Tag> : <Tag color="default">待初始化</Tag>
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
      fixed: 'right',
      width: 200,
      render: (_, record) => {
        const isOwner = record.level === FMS_ACCOUNT_USER_LEVEL.OWNER
        const isNotRead = record.level !== FMS_ACCOUNT_USER_LEVEL.READ
        return (
          <div style={tableActionStyle}>
            {isOwner && hasPermi('fms:config:account-set:update') && (
              <a
                onClick={() => {
                  setEditId(record.id)
                  setFormVisible(true)
                }}
              >
                {textConst.action.update}
              </a>
            )}
            {isOwner && hasPermi('fms:config:account-set:authorize') && (
              <a
                onClick={() => {
                  setCurrentRow(record)
                  setMemberVisible(true)
                }}
              >
                授权
              </a>
            )}
            {!record.initialized && isNotRead && hasPermi('fms:config:account-set:initialize') && (
              <a
                onClick={() => {
                  setCurrentRow(record)
                  setInitVisible(true)
                }}
              >
                开始记账
              </a>
            )}
          </div>
        )
      }
    }
  ]

  return (
    <>
      <ProTable<API.FmsAccountSetRespVO>
        headerTitle="账套列表"
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        cardBordered
        search={false}
        options={false}
        pagination={false}
        request={async () => {
          const resp = await fmsAccountSetGetAccountSetList()
          const list = resp.data || []
          if (fmsStore.accountSetId && !list.some((item) => item.id === fmsStore.accountSetId)) {
            fmsStore.clearAccountSet()
          }
          return {
            data: list,
            success: resp.code === 0
          }
        }}
        toolBarRender={() => [
          <HasPermi key="create" value="fms:config:account-set:create">
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
        ]}
      />

      <FmsAccountSetForm
        visible={formVisible}
        setVisible={setFormVisible}
        id={editId}
        onSuccess={handleRefresh}
      />

      <FmsAccountSetMemberForm
        visible={memberVisible}
        setVisible={setMemberVisible}
        accountSet={currentRow}
        onSuccess={handleRefresh}
      />

      <FmsAccountSetInitializeForm
        visible={initVisible}
        setVisible={setInitVisible}
        row={currentRow}
        onSuccess={handleRefresh}
      />
    </>
  )
}

export default AccountSetPage
