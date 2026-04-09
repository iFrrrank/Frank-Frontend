import React, { useState, useEffect } from 'react'
import { message, Form, Tooltip, Popconfirm } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import {
  ModalForm,
  ProFormText,
  ProFormTreeSelect,
  EditableProTable,
  ProColumns
} from '@ant-design/pro-components'
import {
  createBusinessStatus,
  updateBusinessStatus,
  getBusinessStatusType
} from '@/api/crm/businessStatus'
import { getSimpleDeptList } from '@/api/system/dept'
import { handleTreeData } from '@/utils/tree'
import { textConst } from '@/locales/zh-CN'
import { emptyTextStyle, tableActionStyle, deleteTextStyle } from '@/styles/common.style'

interface BusinessStatusFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

// 缓存部门下拉树
let deptOptionsCache: any[] | null = null

interface StageItem {
  id: string
  name: string
  percent?: number
}

const BusinessStatusForm: React.FC<BusinessStatusFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  id
}) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState<StageItem[]>([])
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([])

  useEffect(() => {
    if (visible && !isUpdate) {
      setDataSource([])
      setEditableRowKeys([])
    }
  }, [visible, isUpdate])

  const stageColumns: ProColumns<StageItem>[] = [
    {
      title: '阶段',
      dataIndex: 'index',
      readonly: true,
      width: 60,
      align: 'center',
      render: (_, __, index) => `${index + 1}`
    },
    {
      title: '阶段名称',
      dataIndex: 'name',
      width: 120,
      align: 'center',
      formItemProps: { rules: [{ required: true, message: '请输入阶段名称' }] },
      fieldProps: { placeholder: '请输入状态名称' }
    },
    {
      title: '赢单率(%)',
      dataIndex: 'percent',
      width: 120,
      align: 'center',
      valueType: 'digit',
      fieldProps: {
        min: 0,
        max: 100,
        controls: true,
        style: { width: '100%' },
        placeholder: '请输入赢单率'
      },
      formItemProps: { rules: [{ required: true, message: '请输入赢单率' }] }
    },
    {
      title: '操作',
      valueType: 'option',
      width: 120,
      align: 'center',
      render: (text, record, _, action) => (
        <div style={tableActionStyle}>
          <a
            key="update"
            onClick={() => {
              action?.startEditable?.(record.id)
            }}
          >
            {textConst.action.update}
          </a>
          <Popconfirm
            key="delete"
            title="确定要删除该阶段吗？"
            onConfirm={() => {
              setDataSource((prev) => prev.filter((item) => item.id !== record.id))
              setEditableRowKeys((prev) => prev.filter((key) => key !== record.id))
            }}
          >
            <a style={deleteTextStyle}>{textConst.action.delete}</a>
          </Popconfirm>
        </div>
      )
    }
  ]

  return (
    <ModalForm
      title={isUpdate ? textConst.action.update : textConst.action.create}
      open={visible}
      onOpenChange={setVisible}
      form={form}
      modalProps={{
        destroyOnHidden: true,
        onCancel: () => {
          form.resetFields()
          setDataSource([])
          setEditableRowKeys([])
          setVisible(false)
        }
      }}
      layout="horizontal"
      width={700}
      colon={false}
      labelAlign="right"
      labelCol={{ flex: '100px' }}
      wrapperCol={{ flex: 'auto' }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getBusinessStatusType({ id })
          if (resp.data) {
            const loadedStatuses = (resp.data.statuses || []).map((s: any) => ({
              id: s.id?.toString() || Date.now().toString() + Math.random(),
              name: s.name,
              percent: s.percent
            }))
            setDataSource(loadedStatuses)
            setEditableRowKeys(loadedStatuses.map((item) => item.id))
          }
          return resp.data as Record<string, any>
        }
        return {}
      }}
      onFinish={async (values) => {
        if (editableKeys.length > 0) {
          message.warning('请先保存正在编辑的阶段！')
          return false
        }
        if (dataSource.length === 0) {
          message.warning('请至少添加一个阶段！')
          return false
        }
        try {
          const submitData = {
            ...values,
            statuses: dataSource.map((item) => ({
              name: item.name,
              percent: item.percent
            }))
          }

          if (isUpdate) {
            await updateBusinessStatus({ id, ...submitData } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createBusinessStatus(submitData as any)
            message.success(textConst.msg.createSuccess)
          }
          onSuccess()
          return true
        } catch (e) {
          message.error(textConst.error.operationFail)
          return false
        }
      }}
    >
      <ProFormText
        name="name"
        label="状态组名"
        rules={[{ required: true, message: '请输入状态组名' }]}
        placeholder="请输入状态组名"
      />

      <ProFormTreeSelect
        name="deptIds"
        label={
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            应用部门
            <Tooltip title="选择适用该商机状态组的部门，为空则全公司适用">
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        }
        placeholder="请选择应用部门"
        request={async () => {
          if (deptOptionsCache) return deptOptionsCache
          const res = await getSimpleDeptList()
          if (res.data) {
            const flatData = res.data.map((item: any) => ({
              ...item,
              label: item.name,
              value: item.id,
              sort: item.sort || 0
            }))
            deptOptionsCache = handleTreeData(flatData, 0)
            return deptOptionsCache
          }
          return []
        }}
        fieldProps={{
          treeCheckable: true,
          showCheckedStrategy: 'SHOW_ALL',
          treeNodeFilterProp: 'label',
          showSearch: true
        }}
      />

      <EditableProTable<StageItem>
        rowKey="id"
        columns={stageColumns}
        value={dataSource}
        onChange={(value) => setDataSource(value as StageItem[])}
        recordCreatorProps={{
          position: 'bottom',
          record: () => ({ id: Date.now().toString(), name: '', percent: undefined }),
          creatorButtonText: editableKeys.length > 0 ? '请先保存当前行' : '添加阶段',
          disabled: editableKeys.length > 0
        }}
        editable={{
          type: 'multiple',
          editableKeys,
          onChange: setEditableRowKeys
        }}
        bordered
        locale={{
          emptyText: <div style={emptyTextStyle}>暂无数据</div>
        }}
      />
    </ModalForm>
  )
}

export default BusinessStatusForm
