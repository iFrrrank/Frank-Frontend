import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, Col, Input, Modal, Row, Space, Spin, Tag, message } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons'
import {
  fmsAuxiliaryTypeDeleteAuxiliaryType,
  fmsAuxiliaryTypeGetAuxiliaryTypeSimpleList
} from '@/api/fms/config/auxiliaryType'
import HasPermi, { useHasPermi } from '@/directives/permission/HasPermi'
import { textConst } from '@/locales/zh-CN'
import { useFmsStore } from '../../store/fms'
import { FMS_AUXILIARY_TYPE } from '../../utils/constants'
import FmsAuxiliaryItemPanel from './FmsAuxiliaryItemPanel'
import FmsAuxiliaryTypeForm from './FmsAuxiliaryTypeForm'

/**
 * 辅助核算管理页面（左侧辅助核算类别树，右侧辅助核算项目表）
 */
const AuxiliaryPage: React.FC = () => {
  const hasPermi = useHasPermi()
  const fmsStore = useFmsStore()

  const [typeLoading, setTypeLoading] = useState(false)
  const [typeList, setTypeList] = useState<API.FmsAuxiliaryTypeRespVO[]>([])
  const [typeKeyword, setTypeKeyword] = useState('')
  const [selectedTypeId, setSelectedTypeId] = useState<number | undefined>()
  const [typeFormVisible, setTypeFormVisible] = useState(false)
  const [editTypeRow, setEditTypeRow] = useState<API.FmsAuxiliaryTypeRespVO | undefined>()

  const loadTypeList = useCallback(async () => {
    if (!fmsStore.accountSetId) {
      setTypeList([])
      setSelectedTypeId(undefined)
      return
    }
    setTypeLoading(true)
    try {
      const resp = await fmsAuxiliaryTypeGetAuxiliaryTypeSimpleList({
        accountSetId: fmsStore.accountSetId
      })
      if (resp.code === 0) {
        const list = resp.data || []
        setTypeList(list)
        setSelectedTypeId((prev) =>
          list.some((item) => item.id === prev) ? prev : list[0]?.id
        )
      }
    } finally {
      setTypeLoading(false)
    }
  }, [fmsStore.accountSetId])

  useEffect(() => {
    loadTypeList()
  }, [loadTypeList])

  const filteredTypeList = useMemo(() => {
    const kw = typeKeyword.trim().toLowerCase()
    if (!kw) return typeList
    return typeList.filter((item) => item.name.toLowerCase().includes(kw))
  }, [typeList, typeKeyword])

  const currentType = useMemo(
    () => typeList.find((item) => item.id === selectedTypeId),
    [typeList, selectedTypeId]
  )

  const departmentTypeId = useMemo(
    () => typeList.find((item) => item.type === FMS_AUXILIARY_TYPE.DEPARTMENT)?.id,
    [typeList]
  )

  const handleDeleteType = (row: API.FmsAuxiliaryTypeRespVO) => {
    if (!fmsStore.accountSetId) return
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除辅助核算类别 "${row.name}"？`,
      onOk: async () => {
        const resp = await fmsAuxiliaryTypeDeleteAuxiliaryType({
          accountSetId: fmsStore.accountSetId!,
          id: row.id
        })
        if (resp.code === 0) {
          message.success(textConst.msg.delSuccess)
          await loadTypeList()
        }
      }
    })
  }

  return (
    <Row gutter={16}>
      {/* 左侧辅助核算类别栏 */}
      <Col xs={24} md={6} lg={5}>
        <Card
          title="辅助核算类别"
          variant="borderless"
          extra={
            fmsStore.isAccountSetWritable && (
              <HasPermi value="fms:auxiliary-type:create">
                <Button
                  type="primary"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditTypeRow(undefined)
                    setTypeFormVisible(true)
                  }}
                >
                  新增
                </Button>
              </HasPermi>
            )
          }
        >
          <Input
            value={typeKeyword}
            onChange={(e) => setTypeKeyword(e.target.value)}
            allowClear
            prefix={<SearchOutlined />}
            placeholder="请输入类别名称"
            style={{ marginBottom: 12 }}
          />
          <Spin spinning={typeLoading}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {filteredTypeList.map((item) => {
                const isSelected = item.id === selectedTypeId
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedTypeId(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      border: `1px solid ${isSelected ? '#91caff' : '#f0f0f0'}`,
                      backgroundColor: isSelected ? '#e6f4ff' : '#fff',
                      color: isSelected ? '#1677ff' : 'rgba(0,0,0,0.88)',
                      fontWeight: isSelected ? 600 : 400
                    }}
                  >
                    <Space size={6}>
                      <span>{item.name}</span>
                      {item.type === FMS_AUXILIARY_TYPE.CUSTOM && (
                        <Tag color="default" style={{ margin: 0 }}>
                          自定义
                        </Tag>
                      )}
                    </Space>
                    {fmsStore.isAccountSetWritable && item.type === FMS_AUXILIARY_TYPE.CUSTOM && (
                      <Space size={4} onClick={(e) => e.stopPropagation()}>
                        {hasPermi('fms:auxiliary-type:update') && (
                          <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined style={{ color: '#1677ff' }} />}
                            onClick={() => {
                              setEditTypeRow(item)
                              setTypeFormVisible(true)
                            }}
                          />
                        )}
                        {hasPermi('fms:auxiliary-type:delete') && (
                          <Button
                            type="text"
                            size="small"
                            icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                            onClick={() => handleDeleteType(item)}
                          />
                        )}
                      </Space>
                    )}
                  </div>
                )
              })}
            </div>
          </Spin>
        </Card>
      </Col>

      {/* 右侧辅助核算项目列表 */}
      <Col xs={24} md={18} lg={19}>
        <FmsAuxiliaryItemPanel
          auxiliaryType={currentType}
          departmentTypeId={departmentTypeId}
        />
      </Col>

      {fmsStore.accountSetId && (
        <FmsAuxiliaryTypeForm
          visible={typeFormVisible}
          setVisible={setTypeFormVisible}
          accountSetId={fmsStore.accountSetId}
          row={editTypeRow}
          onSuccess={loadTypeList}
        />
      )}
    </Row>
  )
}

export default AuxiliaryPage

