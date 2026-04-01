import React, { useState } from 'react'
import { message, Space } from 'antd'
import { ModalForm, ProFormSelect } from '@ant-design/pro-components'
import { assignRoleDataScope } from '@/api/system/permission'
import { textConst } from '@/locales/zh-CN'

export let handleOpenDataScope: (record: API.SystemRoleRespVO) => void

const AssignDataScopeForm: React.FC = () => {
  const [dataScopeVisible, setDataScopeVisible] = useState(false)
  const [dataScopeRole, setDataScopeRole] = useState<API.SystemRoleRespVO | null>(null)

  handleOpenDataScope = (record: API.SystemRoleRespVO) => {
    setDataScopeRole(record)
    setDataScopeVisible(true)
  }

  return (
    <ModalForm
      title="数据权限"
      width={500}
      open={dataScopeVisible}
      onOpenChange={(visible) => {
        setDataScopeVisible(visible)
        if (!visible) setDataScopeRole(null)
      }}
      initialValues={{ dataScope: 1 }} // 默认全部数据权限
      colon={false}
      modalProps={{
        destroyOnClose: true
      }}
      onFinish={async (values) => {
        try {
          if (dataScopeRole) {
            const resp = await assignRoleDataScope({
              roleId: dataScopeRole.id,
              dataScope: values.dataScope,
              dataScopeDeptIds: [] // TODO: 处理自定义部门
            })
            if (resp.code === 0) {
              message.success('数据权限分配成功')
              return true
            }
            message.error(resp.msg || '数据权限分配失败')
          }
          return false
        } catch {
          message.error('数据权限分配失败')
          return false
        }
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <Space size={32}>
          <div>
            <span style={{ color: '#555', marginRight: 16 }}>角色名称</span>
            <span
              style={{
                color: '#1890ff',
                background: '#e6f7ff',
                padding: '2px 8px',
                borderRadius: '4px'
              }}
            >
              {dataScopeRole?.name}
            </span>
          </div>
          <div style={{ marginTop: 12 }}>
            <span style={{ color: '#555', marginRight: 16 }}>角色标识</span>
            <span
              style={{
                color: '#1890ff',
                background: '#e6f7ff',
                padding: '2px 8px',
                borderRadius: '4px'
              }}
            >
              {dataScopeRole?.code}
            </span>
          </div>
        </Space>
      </div>
      <ProFormSelect
        name="dataScope"
        label="权限范围"
        placeholder="请选择权限范围"
        options={[
          { label: '全部数据权限', value: 1 },
          { label: '自定数据权限', value: 2 },
          { label: '本部门数据权限', value: 3 },
          { label: '本部门及以下数据权限', value: 4 },
          { label: '仅本人数据权限', value: 5 }
        ]}
      />
    </ModalForm>
  )
}

export default AssignDataScopeForm
