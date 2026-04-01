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
import { handleBatchDelete } from '@/components/BatchDelete'
import { handleDelete } from '@/components/SingleDelete'

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
      hideInSearch: true, // Mock 中没有在头部搜索时间，只在列里显示
      width: 180,
      render: (_, record) => <span>{record.createTime as any}</span>
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 120,
      key: 'option',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <a key="edit" onClick={() => handleEditDictData(record)}>
            修改
          </a>
          <a
            key="delete"
            style={{ color: '#ff4d4f' }}
            onClick={() => handleDelete(record, deleteDictData, () => actionRef.current?.reload())}
          >
            删除
          </a>
        </div>
      )
    }
  ]

  // ===== 导出字典数据 =====
  const handleExport = () => {
    Modal.confirm({
      title: textConst.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '确认导出所有字典数据项?',
      okText: textConst.common.ok,
      cancelText: textConst.common.cancel,
      onOk: async () => {
        try {
          const formValues = formRef.current?.getFieldsValue?.() || {}
          // 填补隐藏/默认的 dictType
          if (!formValues.dictType && defaultDictType) {
            formValues.dictType = defaultDictType
          }
          const resp = await export3(formValues as any)
          if (!resp) return
          // 处理为 Blob 下载
          const blob = new Blob([resp as any], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = '字典数据.xlsx'
          link.click()
          window.URL.revokeObjectURL(url)
          message.success(textConst.msg.exportSuccess)
        } catch {
          message.error('textConst.msg.exportError')
        }
      }
    })
  }

  return (
    <>
      <ProTable<any>
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
          defaultCollapsed: false
        }}
        options={false}
        pagination={{
          align: 'center',
          showSizeChanger: true
        }}
        headerTitle={false}
        toolBarRender={() => [
          <Button
            key="create"
            icon={<PlusOutlined />}
            onClick={() =>
              handleCreateDictData(formRef.current?.getFieldValue('dictType') || defaultDictType)
            }
            type="primary"
          >
            新增
          </Button>,
          <Button
            key="export"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            style={{ color: '#52c41a', borderColor: '#b7eb8f', background: '#f6ffed' }}
          >
            导出
          </Button>,
          <Button
            key="batchDelete"
            icon={<DeleteOutlined />}
            danger
            disabled={selectedRowKeys.length === 0}
            onClick={() =>
              handleBatchDelete(
                selectedRowKeys,
                deleteDictData,
                () => setSelectedRowKeys([]),
                () => actionRef.current?.reload()
              )
            }
            style={
              selectedRowKeys.length > 0
                ? { color: '#ff4d4f', borderColor: '#ffccc7', background: '#fff2f0' }
                : { color: '#ffccc7', borderColor: '#ffe6e6', background: '#fffaf0' }
            }
          >
            批量删除
          </Button>
        ]}
      />

      <SaveDictDataForm onSuccess={() => actionRef.current?.reload()} />
    </>
  )
}

export default DictDataList
