import React, { useState } from 'react'
import { message } from 'antd'
import {
  ModalForm,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components'
import { createDictData, updateDictData } from '@/api/system/dictData'
import { textConst } from '@/locales/zh-CN'

export let handleCreateDictData: (dictType: string) => void
export let handleEditDictData: (record: any) => void

interface SaveDictDataModalProps {
  onSuccess: () => void
}

const SaveDictDataForm: React.FC<SaveDictDataModalProps> = ({ onSuccess }) => {
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editingDictData, setEditingDictData] = useState<any | null>(null)

  handleCreateDictData = (dictType: string) => {
    setEditingDictData({ dictType })
    setCreateModalVisible(true)
  }

  handleEditDictData = (record: any) => {
    setEditingDictData(record)
    setCreateModalVisible(true)
  }

  return (
    <ModalForm<any>
      title={editingDictData?.id ? textConst.action.update : textConst.action.create}
      width={600}
      open={createModalVisible}
      onOpenChange={(visible) => {
        setCreateModalVisible(visible)
        if (!visible) {
          setEditingDictData(null)
        }
      }}
      initialValues={
        editingDictData?.id
          ? {
              ...editingDictData
            }
          : {
              dictType: editingDictData?.dictType || '',
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
          if (editingDictData?.id) {
            resp = await updateDictData({ ...values, id: editingDictData.id } as any)
          } else {
            resp = await createDictData({ ...values, dictType: editingDictData?.dictType } as any)
          }
          if (resp.code === 0) {
            message.success(
              editingDictData?.id ? textConst.msg.updateSuccess : textConst.msg.createSuccess
            )
            onSuccess()
            return true
          } else {
            message.error(
              resp.msg ||
                (editingDictData?.id ? textConst.msg.updateError : textConst.msg.createError)
            )
            return false
          }
        } catch {
          message.error(editingDictData?.id ? textConst.msg.updateError : textConst.msg.createError)
          return false
        }
      }}
    >
      <ProFormText
        name="dictType"
        label="字典类型"
        colProps={{ span: 24 }}
        placeholder="请输入字典类型"
        readonly // 页面上一般是不可修改或者就是下拉选择
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
        rules={[{ required: true, message: '请输入状态' }]}
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
  )
}

export default SaveDictDataForm
