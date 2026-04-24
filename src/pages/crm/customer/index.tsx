import React, { useRef, useState } from 'react'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable, ProFormSelect } from '@ant-design/pro-components'
import { Button } from 'antd'
import { PlusOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import {
  getCustomerPage,
  exportCustomerExcel,
  importTemplate,
  importExcel
} from '@/api/crm/customer'
import { SCENE_TYPE } from '@/utils/constantsValue'
import { textConst } from '@/locales/zh-CN'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import CustomerForm from './CustomerForm'
import { INDUSTRY_LIST, CUSTOMER_LEVEL, CUSTOMER_SOURCE } from '@/utils/constantsValue'
import { handleExport } from '@/components/Export'
import ImportModal from '@/components/Import'
import { getSimpleUserList } from '@/api/system/user'

// 用户列表缓存
let userOptionsCache: any[] | null = null

const CustomerList: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const [sceneType, setSceneType] = useState<number>(1)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [formId, setFormId] = useState<number | undefined>(undefined)
  const [importVisible, setImportVisible] = useState<boolean>(false)

  const handleExportBtnClick = () => {
    // 获取表单当前的值
    const formValues = formRef.current?.getFieldsValue?.() || {}
    handleExport({
      exportApi: exportCustomerExcel,
      exportParams: { ...formValues },
      fileName: '客户数据.xlsx'
    })
  }

  const columns: ProColumns<API.CrmCustomerRespVO>[] = [
    {
      title: '客户名称',
      dataIndex: 'name',
      align: 'center',
      fieldProps: {
        placeholder: '请输入客户名称'
      }
    },
    {
      title: '手机',
      dataIndex: 'mobile',
      align: 'center',
      fieldProps: {
        placeholder: '请输入手机'
      }
    },
    {
      title: '所属行业',
      dataIndex: 'industryId',
      valueType: 'select',
      align: 'center',
      hideInTable: true,
      valueEnum: INDUSTRY_LIST,
      fieldProps: {
        placeholder: '请选择所属行业'
      }
    },
    {
      title: '客户级别',
      dataIndex: 'level',
      valueType: 'select',
      align: 'center',
      hideInTable: true,
      valueEnum: CUSTOMER_LEVEL,
      fieldProps: {
        placeholder: '请选择客户级别'
      }
    },
    {
      title: '客户来源',
      dataIndex: 'source',
      valueType: 'select',
      align: 'center',
      hideInTable: true,
      valueEnum: CUSTOMER_SOURCE,
      fieldProps: {
        placeholder: '请选择客户来源'
      }
    },
    {
      title: '客户名称',
      dataIndex: 'name',
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
      title: '客户级别',
      dataIndex: 'level',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '客户行业',
      dataIndex: 'industryId',
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
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '锁定状态',
      dataIndex: 'lockStatus',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '成交状态',
      dataIndex: 'dealStatus',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '最后跟进时间',
      dataIndex: 'contactLastTime',
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
      <ProTable<API.CrmCustomerRespVO>
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
              key="import"
              color="green"
              variant="outlined"
              icon={<UploadOutlined />}
              onClick={() => setImportVisible(true)}
            >
              {textConst.action.import}
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
          const res = await getCustomerPage({ pageVO: req } as any)
          return {
            data: res.data?.list || [],
            success: res.code === 0,
            total: res.data?.total || 0
          }
        }}
        pagination={{
          align: 'center',
          showSizeChanger: true
        }}
      />

      {formVisible && (
        <CustomerForm
          id={formId}
          visible={formVisible}
          setVisible={setFormVisible}
          onSuccess={() => {
            setFormVisible(false)
            actionRef.current?.reload()
          }}
        />
      )}

      <ImportModal
        title="导入客户"
        open={importVisible}
        accept=".xls,.xlsx"
        onCancel={() => setImportVisible(false)}
        onSuccess={() => {
          setImportVisible(false)
          // 导入成功后刷新表格
          actionRef.current?.reload()
        }}
        importApi={importExcel}
        templateApi={importTemplate}
        templateName="客户导入模板.xlsx"
        showUpdateSupport={true}
        topContent={
          <ProFormSelect
            name="ownerUserId"
            label="负责人"
            colon={false}
            rules={[{ required: true, message: '负责人是必选项！' }]}
            placeholder="请选择负责人"
            showSearch
            request={async () => {
              if (userOptionsCache) return userOptionsCache
              const res = await getSimpleUserList()
              if (res.data) {
                userOptionsCache = res.data.map((u: any) => ({ label: u.nickname, value: u.id }))
              }
              return userOptionsCache || []
            }}
          />
        }
      />
    </>
  )
}

export default CustomerList
