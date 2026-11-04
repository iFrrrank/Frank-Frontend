import React, { useRef, useState } from 'react'
import { Button, Modal, message } from 'antd'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { deleteScheme, getSchemeList } from '@/api/hrm/insurance/scheme'
import { textConst } from '@/locales/zh-CN'
import { deleteTextStyle, tableActionStyle } from '@/styles/common.style'
import { formatHrmMoney } from '../utils'
import InsuranceSchemeForm from './InsuranceSchemeForm'

const money = (value?: number) => formatHrmMoney(value)

const InsuranceSchemePage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  const openForm = (id?: number) => {
    setCurrentId(id)
    setFormVisible(true)
  }

  const handleDelete = (id?: number) => {
    if (!id) return
    Modal.confirm({
      title: textConst.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: textConst.msg.delOneMsg,
      okText: textConst.common.ok,
      cancelText: textConst.common.cancel,
      onOk: async () => {
        try {
          await deleteScheme({ id })
          message.success(textConst.msg.delSuccess)
          actionRef.current?.reload()
        } catch {
          message.error(textConst.msg.delError)
        }
      }
    })
  }

  const columns: ProColumns<API.HrmInsuranceSchemeRespVO>[] = [
    { title: '方案名称', dataIndex: 'name', width: 180, ellipsis: true },
    { title: '参保城市', dataIndex: 'areaName', width: 180, ellipsis: true },
    {
      title: '个人社保',
      dataIndex: 'personalInsuranceAmount',
      align: 'right',
      width: 120,
      render: (_, record) => money(record.personalInsuranceAmount)
    },
    {
      title: '公司社保',
      dataIndex: 'corporateInsuranceAmount',
      align: 'right',
      width: 120,
      render: (_, record) => money(record.corporateInsuranceAmount)
    },
    {
      title: '个人公积金',
      dataIndex: 'personalProvidentFundAmount',
      align: 'right',
      width: 120,
      render: (_, record) => money(record.personalProvidentFundAmount)
    },
    {
      title: '公司公积金',
      dataIndex: 'corporateProvidentFundAmount',
      align: 'right',
      width: 120,
      render: (_, record) => money(record.corporateProvidentFundAmount)
    },
    { title: '使用人数', dataIndex: 'useCount', align: 'center', width: 100 },
    { title: '历史月记录', dataIndex: 'monthRecordCount', align: 'center', width: 110 },
    {
      title: textConst.table.action,
      valueType: 'option',
      align: 'center',
      fixed: 'right',
      width: 140,
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a key="edit" onClick={() => openForm(record.id)}>
            编辑
          </a>
          <a key="delete" style={deleteTextStyle} onClick={() => handleDelete(record.id)}>
            删除
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<API.HrmInsuranceSchemeRespVO>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        search={false}
        options={false}
        pagination={false}
        scroll={{ x: 'max-content' }}
        toolBarRender={() => [
          <Button key="create" type="primary" ghost icon={<PlusOutlined />} onClick={() => openForm()}>
            新建参保方案
          </Button>
        ]}
        request={async () => {
          try {
            const resp = await getSchemeList()
            return { data: resp.data || [], success: resp.code === 0 }
          } catch {
            return { data: [], success: false }
          }
        }}
      />
      <InsuranceSchemeForm
        visible={formVisible}
        setVisible={setFormVisible}
        id={currentId}
        onSuccess={() => {
          setFormVisible(false)
          actionRef.current?.reload()
        }}
      />
    </>
  )
}

export default InsuranceSchemePage
