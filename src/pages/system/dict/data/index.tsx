import React, { useRef, useState, useEffect } from 'react'
import { Button, message, Modal } from 'antd'
import {
  DeleteOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  PlusOutlined
} from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import {
  ModalForm,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable
} from '@ant-design/pro-components'
import { useParams, history } from '@umijs/max'

import {
  createDictData,
  deleteDictData,
  export3,
  getDictTypePage,
  updateDictData
} from '@/api/system/dictData'
import { getSimpleDictTypeList } from '@/api/system/dictType'

const DictDataList: React.FC = () => {
  const params = useParams<{ dictType: string }>()
  const defaultDictType = params.dictType || ''

  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editingDictData, setEditingDictData] = useState<any | null>(null)
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
      title: '字典名称', // 搜索字段 (字典类型下拉)
      dataIndex: 'dictType',
      hideInTable: true,
      valueType: 'select',
      initialValue: defaultDictType,
      fieldProps: {
        options: dictTypeOptions,
        showSearch: true,
        placeholder: '请选择字典名称'
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
      title: '创建时间',
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
          <a key="edit" onClick={() => handleEdit(record)}>
            修改
          </a>
          <a key="delete" style={{ color: '#ff4d4f' }} onClick={() => handleDelete(record)}>
            删除
          </a>
        </div>
      )
    }
  ]

  // ===== 删除字典数据 =====
  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '是否确认删除选中数据？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteDictData({ id: record.id })
          message.success('删除成功')
          actionRef.current?.reload()
        } catch {
          message.error('删除失败')
        }
      }
    })
  }

  // ===== 批量删除 =====
  const handleBatchDelete = () => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '是否确认删除选中数据?',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await Promise.all(selectedRowKeys.map((id) => deleteDictData({ id: Number(id) })))
          message.success('批量删除成功')
          setSelectedRowKeys([])
          actionRef.current?.reload()
        } catch {
          message.error('批量删除失败')
        }
      }
    })
  }

  // ===== 导出字典数据 =====
  const handleExport = () => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '确认导出所有字典数据项?',
      okText: '确定',
      cancelText: '取消',
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
          message.success('导出成功')
        } catch {
          message.error('导出失败')
        }
      }
    })
  }

  // ===== 修改 =====
  const handleEdit = (record: any) => {
    setEditingDictData(record)
    setCreateModalVisible(true)
  }

  return (
    <>
      <ProTable<any>
        columns={columns}
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        formRef={formRef}
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
            onClick={() => {
              setEditingDictData(null)
              setCreateModalVisible(true)
            }}
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
            onClick={handleBatchDelete}
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

      {/* ========== 新增/修改弹窗 ========== */}
      <ModalForm<any>
        title={editingDictData ? '修改' : '新增'}
        width={600}
        open={createModalVisible}
        onOpenChange={(visible) => {
          setCreateModalVisible(visible)
          if (!visible) {
            setEditingDictData(null)
          }
        }}
        initialValues={
          editingDictData
            ? {
              ...editingDictData
            }
            : {
              dictType: formRef.current?.getFieldValue('dictType') || defaultDictType,
              status: 0,
              sort: 0
            }
        }
        layout="horizontal"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        colon={false}
        modalProps={{
          destroyOnClose: true,
          bodyStyle: { paddingBottom: 0 }
        }}
        onFinish={async (values) => {
          try {
            let resp
            if (editingDictData) {
              resp = await updateDictData({ ...values, id: editingDictData.id } as any)
            } else {
              resp = await createDictData(values as any)
            }
            if (resp.code === 0) {
              message.success(editingDictData ? '修改成功' : '创建成功')
              actionRef.current?.reload()
              return true
            } else {
              message.error(resp.msg || (editingDictData ? '修改失败' : '创建失败'))
              return false
            }
          } catch {
            message.error(editingDictData ? '修改失败' : '创建失败')
            return false
          }
        }}
      >
        <ProFormText
          name="dictType"
          label="字典类型"
          colProps={{ span: 24 }}
          placeholder="请输入字典类型"
          readonly // 页面上一般是不可编辑或者就是下拉选择
        />
        <ProFormText
          name="label"
          label="数据标签"
          colProps={{ span: 24 }}
          placeholder="请输入数据标签"
          rules={[{ required: true, message: '请输入数据标签' }]}
        />
        <ProFormText
          name="value"
          label="数据键值"
          colProps={{ span: 24 }}
          placeholder="请输入数据键值"
          rules={[{ required: true, message: '请输入数据键值' }]}
        />
        <ProFormDigit
          name="sort"
          label="显示排序"
          colProps={{ span: 24 }}
          placeholder="请输入显示排序"
          rules={[{ required: true, message: '请输入显示排序' }]}
          fieldProps={{ min: 0 }}
        />
        <ProFormRadio.Group
          name="status"
          label="状态"
          colProps={{ span: 24 }}
          options={[
            { label: '开启', value: 0 },
            { label: '关闭', value: 1 }
          ]}
          rules={[{ required: true, message: '请选择状态' }]}
        />
        <ProFormSelect
          name="colorType"
          label="颜色类型"
          colProps={{ span: 24 }}
          placeholder="请选择"
          options={[
            { label: '默认（default）', value: 'default' },
            { label: '主要（primary）', value: 'primary' },
            { label: '成功（success）', value: 'success' },
            { label: '信息（info）', value: 'info' },
            { label: '警告（warning）', value: 'warning' },
            { label: '错误（danger）', value: 'danger' }
          ]}
        />
        <ProFormText
          name="cssClass"
          label="CSS Class"
          colProps={{ span: 24 }}
          placeholder="请输入 CSS Class"
        />
        <ProFormTextArea
          name="remark"
          label="备注"
          colProps={{ span: 24 }}
          placeholder="请输入内容"
          fieldProps={{ rows: 3 }}
        />
      </ModalForm>
    </>
  )
}

export default DictDataList
