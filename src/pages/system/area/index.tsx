import React, { useEffect, useState } from 'react'
import { Button, Card, message, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { SearchOutlined } from '@ant-design/icons'
import { ModalForm, PageContainer, ProFormText } from '@ant-design/pro-components'
import { getAreaByIp, getAreaTree } from '@/api/system/area'
import { textConst } from '@/locales/zh-CN'

// 地区管理：上方是 IP 查询入口，下方是地区树（与 yudao 页面结构一致）
const AreaManagement: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [treeData, setTreeData] = useState<API.SystemAreaNodeRespVO[]>([])
  const [ipModalVisible, setIpModalVisible] = useState(false)
  // IP 查询结果（地区名），在弹窗内回显
  const [ipResult, setIpResult] = useState<string>('')

  const loadTree = async () => {
    setLoading(true)
    try {
      const resp = await getAreaTree()
      if (resp.code === 0) {
        setTreeData(resp.data || [])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTree()
  }, [])

  const columns: ColumnsType<API.SystemAreaNodeRespVO> = [
    {
      title: '编号',
      dataIndex: 'id',
      width: 400
    },
    {
      title: '地名',
      dataIndex: 'name',
      width: 200
    }
  ]

  return (
    <PageContainer>
      <Card style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<SearchOutlined />} onClick={() => setIpModalVisible(true)}>
          IP 查询
        </Button>
      </Card>
      <Card>
        {/* 地区数据量较大，关闭分页、用树形表格整体展示 */}
        <Table<API.SystemAreaNodeRespVO>
          columns={columns}
          dataSource={treeData}
          loading={loading}
          rowKey="id"
          pagination={false}
          scroll={{ y: 640 }}
        />
      </Card>

      {/* IP 查询弹窗：输入 IP 后调用 get-by-ip 接口回显地区名 */}
      <ModalForm
        title="IP 查询"
        width={400}
        open={ipModalVisible}
        onOpenChange={(visible) => {
          setIpModalVisible(visible)
          if (!visible) {
            setIpResult('')
          }
        }}
        layout="horizontal"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        colon={false}
        modalProps={{
          destroyOnHidden: true
        }}
        submitter={{
          searchConfig: {
            submitText: '查询',
            resetText: textConst.common.cancel
          }
        }}
        onFinish={async (values: { ip: string }) => {
          try {
            const resp = await getAreaByIp({ ip: values.ip })
            if (resp.code === 0) {
              setIpResult(resp.data || '')
            } else {
              message.error(resp.msg || '查询失败')
            }
          } catch {
            message.error('查询失败')
          }
          // 不关闭弹窗，把查询结果留在弹窗内展示
          return false
        }}
      >
        <ProFormText
          name="ip"
          label="IP 地址"
          colProps={{ span: 24 }}
          placeholder="请输入 IP 地址"
          rules={[{ required: true, message: 'IP 地址不能为空' }]}
        />
        {ipResult && (
          <div style={{ marginLeft: 84, marginBottom: 8 }}>
            <span style={{ color: '#888', marginRight: 8 }}>地区</span>
            <span>{ipResult}</span>
          </div>
        )}
      </ModalForm>
    </PageContainer>
  )
}

export default AreaManagement
