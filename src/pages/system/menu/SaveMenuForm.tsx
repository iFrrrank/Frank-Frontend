import React, { useState } from 'react'
import { message } from 'antd'
import {
  ModalForm,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTreeSelect
} from '@ant-design/pro-components'
import { createMenu, getMenuList, updateMenu } from '@/api/system/menu'
import { textConstants } from '@/locales/zh-CN'

export let handleCreateMenu: (parentId?: number) => void
export let handleEditMenu: (record: any) => void

interface SaveMenuModalProps {
  onSuccess: () => void
}

// 将扁平菜单数据转换为树形结构
const handleTreeData = (data: any[], parentId: number = 0): any[] => {
  const tree: any[] = []
  data.forEach((item) => {
    if (item.parentId === parentId) {
      const children = handleTreeData(data, item.id)
      if (children.length > 0) {
        item.children = children
      }
      tree.push(item)
    }
  })
  return tree.sort((a, b) => a.sort - b.sort) // 排序
}

const SaveMenuForm: React.FC<SaveMenuModalProps> = ({ onSuccess }) => {
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editingMenu, setEditingMenu] = useState<any>(null)

  handleCreateMenu = (parentId?: number) => {
    setEditingMenu({ parentId: parentId || 0 })
    setCreateModalVisible(true)
  }

  handleEditMenu = (record: any) => {
    setEditingMenu(record)
    setCreateModalVisible(true)
  }

  return (
    <ModalForm
      title={editingMenu?.id ? '修改菜单' : '新增菜单'}
      width={680}
      open={createModalVisible}
      onOpenChange={(visible) => {
        setCreateModalVisible(visible)
        if (!visible) setEditingMenu(null)
      }}
      // 处理回显数据
      initialValues={
        editingMenu?.id
          ? {
              ...editingMenu
            }
          : {
              parentId: editingMenu?.parentId || 0,
              type: 1, // 默认菜单
              sort: 0,
              status: 0,
              visible: true,
              alwaysShow: true,
              keepAlive: true
            }
      }
      layout="horizontal"
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
      grid={true}
      rowProps={{ gutter: [16, 0] }}
      modalProps={{
        destroyOnClose: true,
        bodyStyle: { paddingBottom: 0 }
      }}
      colon={false}
      onFinish={async (values) => {
        try {
          let resp
          if (editingMenu?.id) {
            resp = await updateMenu({ ...values, id: editingMenu.id } as any)
          } else {
            resp = await createMenu(values as any)
          }

          if (resp.code === 0) {
            message.success(
              editingMenu?.id ? textConstants.msg.updateSuccess : textConstants.msg.createSuccess
            )
            onSuccess()
            return true
          } else {
            message.error(
              resp.msg ||
                (editingMenu?.id ? textConstants.msg.updateError : textConstants.msg.createError)
            )
            return false
          }
        } catch {
          message.error(
            editingMenu?.id ? textConstants.msg.updateError : textConstants.msg.createError
          )
          return false
        }
      }}
    >
      <ProFormTreeSelect
        name="parentId"
        label="上级菜单"
        colProps={{ span: 24 }}
        placeholder="请选择上级菜单"
        request={async () => {
          // 拉取全量菜单用于树形选择
          const resp = await getMenuList({} as any)
          const list = resp.code === 0 ? resp.data || [] : []
          const tree = handleTreeData(list, 0)
          return [{ value: 0, title: '主类目', children: tree }]
        }}
        fieldProps={{
          fieldNames: { label: 'name', value: 'id' },
          treeDefaultExpandAll: true
        }}
        rules={[{ required: true, message: '请输入上级菜单' }]}
      />

      <ProFormText
        name="name"
        label="菜单名称"
        colProps={{ span: 24 }}
        placeholder="请输入菜单名称"
        rules={[{ required: true, message: '请输入菜单名称' }]}
      />

      <ProFormRadio.Group
        name="type"
        label="菜单类型"
        colProps={{ span: 24 }}
        radioType="button"
        options={[
          { label: '目录', value: 0 },
          { label: '菜单', value: 1 },
          { label: '按钮', value: 2 }
        ]}
      />

      <ProFormDependency name={['type']}>
        {({ type }) => {
          return (
            <>
              {/* === 目录 & 菜单 共有的 === */}
              {(type === 0 || type === 1) && (
                <ProFormText
                  name="icon"
                  label="菜单图标"
                  colProps={{ span: 24 }}
                  placeholder="请输入菜单图标"
                  fieldProps={{
                    addonAfter: <AntdIcons.UserOutlined /> // 示意性图标后置
                  }}
                />
              )}

              {(type === 0 || type === 1) && (
                <ProFormText
                  name="path"
                  label="路由地址"
                  colProps={{ span: 24 }}
                  placeholder="请输入路由地址"
                  tooltip="访问的路由地址，如：`user`，如外网地址需内链访问则以 `http(s)://` 开头"
                  rules={[{ required: true, message: '请输入路由地址' }]}
                />
              )}

              {/* === 菜单独有的 === */}
              {type === 1 && (
                <>
                  <ProFormText
                    name="component"
                    label="组件地址"
                    colProps={{ span: 24 }}
                    placeholder="请输入组件地址"
                  />
                  <ProFormText
                    name="componentName"
                    label="组件名字"
                    colProps={{ span: 24 }}
                    placeholder="请输入组件名字"
                  />
                </>
              )}

              {/* === 菜单 & 按钮 共有的 === */}
              {(type === 1 || type === 2) && (
                <ProFormText
                  name="permission"
                  label="权限标识"
                  colProps={{ span: 24 }}
                  placeholder="请输入权限标识"
                  tooltip="控制器中定义的权限字符，如：system:user:list"
                />
              )}

              {/* === 所有的类型共有 === */}
              <ProFormDigit
                name="sort"
                label="显示排序"
                colProps={{ span: 24 }}
                placeholder="请输入排序"
                rules={[{ required: true, message: '请输入显示排序' }]}
                fieldProps={{ min: 0 }}
              />

              <ProFormRadio.Group
                name="status"
                label="菜单状态"
                colProps={{ span: 24 }}
                options={[
                  { label: '开启', value: 0 },
                  { label: '关闭', value: 1 }
                ]}
              />

              {/* === 目录 & 菜单 共有状态 === */}
              {(type === 0 || type === 1) && (
                <>
                  <ProFormRadio.Group
                    name="visible"
                    label="显示状态"
                    colProps={{ span: 24 }}
                    tooltip="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
                    options={[
                      { label: '显示', value: true },
                      { label: '隐藏', value: false }
                    ]}
                  />
                  <ProFormRadio.Group
                    name="alwaysShow"
                    label="总是显示"
                    colProps={{ span: 24 }}
                    tooltip="选择不是则当该菜单只有一个子菜单时，不显示自己，直接显示子菜单"
                    options={[
                      { label: '总是', value: true },
                      { label: '不是', value: false }
                    ]}
                  />
                </>
              )}

              {/* === 菜单独有的状态 === */}
              {type === 1 && (
                <ProFormRadio.Group
                  name="keepAlive"
                  label="缓存状态"
                  colProps={{ span: 24 }}
                  tooltip="选择缓存则该路由会被 `<keep-alive>` 缓存"
                  options={[
                    { label: '缓存', value: true },
                    { label: '不缓存', value: false }
                  ]}
                />
              )}
            </>
          )
        }}
      </ProFormDependency>
    </ModalForm>
  )
}

export default SaveMenuForm
