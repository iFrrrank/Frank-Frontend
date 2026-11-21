import { history } from '@umijs/max'
import React, { useRef, useState } from 'react'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Button, Modal, message } from 'antd'
import { PlusOutlined, DownloadOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { getContactPage, exportContactExcel } from '@/api/crm/contact'
import { SCENE_TYPE } from '@/utils/constantsValue'
import { textConst } from '@/locales/zh-CN'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import ContactForm from './ContactForm'
import { handleExport } from '@/components/Export'

const ContactList: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const [sceneType, setSceneType] = useState<number>(1)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [formId, setFormId] = useState<number | undefined>(undefined)

  const handleExportBtnClick = () => {
    // 获取表单当前的值
    const formValues = formRef.current?.getFieldsValue?.() || {}
    handleExport({
      exportApi: exportContactExcel,
      exportParams: { ...formValues },
      fileName: '用户数联系人数据据.xlsx'
    })
  }

  const columns: ProColumns<API.CrmContactRespVO>[] = [
    {
      title: '客户',
      dataIndex: 'customerId',
      valueType: 'select',
      align: 'center',
      hideInTable: true,
      fieldProps: {
        placeholder: '请选择客户'
      }
    },
    {
      title: '姓名',
      dataIndex: 'name',
      align: 'center',
      fieldProps: {
        placeholder: '请输入姓名'
      },
      render: (_, record) => (
        <a onClick={() => history.push('/crm/contact/detail?id=' + record.id)}>{record.name}</a>
      )
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      align: 'center',
      fieldProps: {
        placeholder: '请输入手机号'
      }
    },
    {
      title: '电话',
      dataIndex: 'telephone',
      align: 'center',
      fieldProps: {
        placeholder: '请输入电话'
      }
    },
    {
      title: '微信',
      dataIndex: 'wechat',
      align: 'center',
      hideInTable: true,
      fieldProps: {
        placeholder: '请输入微信'
      }
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      align: 'center',
      fieldProps: {
        placeholder: '请输入邮箱'
      }
    },
    {
      title: '联系人姓名',
      dataIndex: 'name',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '手机',
      dataIndex: 'mobile',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '电话',
      dataIndex: 'telephone',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '职位',
      dataIndex: 'post',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '关键决策人',
      dataIndex: 'master',
      align: 'center',
      hideInSearch: true,
      render: (_, record) => (record.master ? '是' : '否')
    },
    {
      title: '直属上级',
      dataIndex: 'parentName',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '地址',
      dataIndex: 'areaName',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '下次联系时间',
      dataIndex: 'contactNextTime',
      valueType: 'dateTime',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 120,
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a
            key="edit"
            onClick={() => {
              setFormId(record.id)
              setFormVisible(true)
            }}
          >
            {textConst.action.update}
          </a>
          <a key="delete" style={deleteTextStyle}>
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<API.CrmContactRespVO>
        columns={columns}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          span: 6
        }}
        form={{ colon: false }}
        options={false}
        toolbar={{
          actions: [
            <Button
              key="add"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setFormId(undefined)
                setFormVisible(true)
              }}
            >
              {textConst.action.create}
            </Button>,
            <Button
              key="export"
              color="volcano"
              variant="outlined"
              icon={<DownloadOutlined />}
              onClick={handleExportBtnClick}
            >
              {textConst.action.export}
            </Button>
          ],
          menu: {
            type: 'tab',
            activeKey: sceneType.toString(),
            items: Object.entries(SCENE_TYPE).map(([key, value]) => ({
              key: key,
              label: value.text
            })),
            onChange: (key) => {
              setSceneType(Number(key))
              actionRef.current?.reload()
            }
          }
        }}
        request={async (params) => {
          const { current, pageSize, ...rest } = params
          const req = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            sceneType,
            ...rest
          }
          const res = await getContactPage({ pageVO: req } as any)
          return {
            data: res.data?.list || [],
            success: res.code === 0,
            total: res.data?.total || 0
          }
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true
        }}
      />

      {formVisible && (
        <ContactForm
          id={formId}
          visible={formVisible}
          setVisible={setFormVisible}
          onSuccess={() => {
            setFormVisible(false)
            actionRef.current?.reload()
          }}
        />
      )}
    </>
  )
}

export default ContactList
