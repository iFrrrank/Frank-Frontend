import React, { useEffect, useRef, useState } from 'react'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { useParams } from '@umijs/max'
import { getSimpleDictTypeList } from '@/api/system/dictType'
import { textConst } from '@/locales/zh-CN'
import SaveDictDataForm, { handleCreateDictData, handleEditDictData } from './SaveDictDataForm'
import {
  DeleteOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { deleteDictData, export3, getDictTypePage } from '@/api/system/dictData'
import { Button, message, Modal } from 'antd'
import { handleBatchDelete, handleDelete } from '@/components/Delete'
import { handleExport } from '@/components/Export'

import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'

const DictDataList: React.FC = () => {
  const params = useParams<{ dictType: string }>()
  const defaultDictType = params.dictType || ''

  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const [dictTypeOptions, setDictTypeOptions] = useState<{ label: string; value: string }[]>([])

  // ===== 加载字典类型下拉列表 =====
  useEffect(() => {
    const fetchDictTypes = async () => {
      try {
        const res = await getSimpleDictTypeList()
        if (res.code === 0 && res.data) {
          const options = res.data.map((item: any) => ({
            label: item.name,
            value: item.type
          }))
          setDictTypeOptions(options)
        }
      } catch (e) {
        console.error('加载字典类型失败', e)
      }
    }
    fetchDictTypes()
  }, [])

  // ===== 数据列定义 =====
  const columns: ProColumns<any>[] = [
    {
      title: '字典名称',
      dataIndex: 'dictType',
      hideInTable: true,
      valueType: 'select',
      initialValue: defaultDictType,
      fieldProps: {
        options: dictTypeOptions,
        showSearch: true,
        placeholder: '请输入字典名称'
      }
    },
    {
      title: '字典编码',
      dataIndex: 'id',
      align: 'center',
      hideInSearch: true,
      width: 80
    },
    {
      title: '字典标签',
      dataIndex: 'label',
      align: 'center',
      width: 150,
      fieldProps: {
        placeholder: '请输入字典标签'
      }
    },
    {
      title: '字典键值',
      dataIndex: 'value',
      align: 'center',
      hideInSearch: true,
      width: 150
    },
    {
      title: '字典排序',
      dataIndex: 'sort',
      align: 'center',
      hideInSearch: true,
      width: 100
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      valueType: 'select',
      valueEnum: {
        0: { text: '开启', status: 'Success' },
        1: { text: '关闭', status: 'Error' }
      },
      fieldProps: {
        placeholder: '数据状态'
      }
    },
    {
      title: '颜色类型',
      dataIndex: 'colorType',
      align: 'center',
      hideInSearch: true,
      width: 100
    },
    {
      title: 'CSS Class',
      dataIndex: 'cssClass',
      align: 'center',
      hideInSearch: true,
      width: 120
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      width: 150,
      hideInSearch: true,
      ellipsis: true
    },
    {
      title: textConst.columns.createTime,
      dataIndex: 'createTime',
      valueType: 'dateRange',
      align: 'center',
      hideInSearch: true,
      width: 180,
      render: (_, record) => <span>{record.createTime as any}</span>
    },
    {
      title: textConst.form.operate,
      valueType: 'option',
      align: 'center',
      width: 120,
      key: 'option',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a key="edit" onClick={() => handleEditDictData(record)}>
            {textConst.action.create}
          </a>
          <a
            key="delete"
            style={deleteTextStyle}
            onClick={() => handleDelete(record, deleteDictData, () => actionRef.current?.reload())}
          >
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  const handleExportClick = () => {
    const formValues = formRef.current?.getFieldsValue?.() || {}
    // 填补隐藏/默认的 dictType
    if (!formValues.dictType && defaultDictType) {
      formValues.dictType = defaultDictType
    }
    handleExport(export3, formValues, '字典数据.xlsx', '确认导出所有字典数据项？')
  }

  return (
    <>
      <ProTable<any>
        headerTitle="字典数据管理"
        columns={columns}
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        formRef={formRef}
        form={{ colon: false }}
        cardBordered
        request={async (params: Record<string, any>) => {
          const { current, pageSize, dictType, label, status, ...rest } = params
          // 使用当前 URL 参数 dictType 或表单搜索的 dictType
          const queryDictType = dictType || defaultDictType

          const resp = await getDictTypePage({
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...(queryDictType ? { dictType: queryDictType } : {}),
            ...(label ? { label } : {}),
            ...(status !== undefined && status !== '' ? { status: Number(status) } : {}),
            ...rest
          } as any)
          return {
            data: resp.data?.list || [],
            success: true,
            total: resp.data?.total || 0
          }
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys)
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          span: 6,
          defaultCollapsed: false
        }}
        options={false}
        pagination={{
          align: 'center',
          showSizeChanger: true
        }}
        toolBarRender={() => [
          <Button
            key="create"
            icon={<PlusOutlined />}
            onClick={() =>
              handleCreateDictData(formRef.current?.getFieldValue('dictType') || defaultDictType)
            }
            type="primary"
          >
            {textConst.action.create}
          </Button>,
          <Button
            key="export"
            color="volcano"
            variant="outlined"
            icon={<DownloadOutlined />}
            onClick={handleExportClick}
          >
            {textConst.action.export}
          </Button>,
          <Button
            key="batchDelete"
            icon={<DeleteOutlined />}
            danger
            type="primary"
            disabled={selectedRowKeys.length === 0}
            onClick={() =>
              handleBatchDelete(
                selectedRowKeys,
                deleteDictData,
                () => setSelectedRowKeys([]),
                () => actionRef.current?.reload()
              )
            }
          >
            {textConst.action.batchDelete}
          </Button>
        ]}
      />

      <SaveDictDataForm onSuccess={() => actionRef.current?.reload()} />
    </>
  )
}

export default DictDataList
