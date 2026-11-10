import React, { useMemo, useState } from 'react'
import { Button, Divider, Input, Modal, Space } from 'antd'
import FmsAuxiliaryItemSelect from '../auxiliary/components/FmsAuxiliaryItemSelect'

export interface FmsInitialAssistFormRef {
  open: (subject: API.FmsInitialBalanceRespVO) => void
}

interface FmsInitialAssistFormProps {
  onSuccess: (combinations: API.FmsAuxiliaryItemRespVO[][]) => void
}

/**
 * 辅助核算期初明细新增弹窗
 */
const FmsInitialAssistForm = React.forwardRef<
  FmsInitialAssistFormRef,
  FmsInitialAssistFormProps
>(({ onSuccess }, ref) => {
  const [visible, setVisible] = useState(false)
  const [subject, setSubject] = useState<API.FmsInitialBalanceRespVO | undefined>()
  const [selectedIdsMap, setSelectedIdsMap] = useState<Record<number, number[]>>({})
  const [selectedItemsMap, setSelectedItemsMap] = useState<
    Record<number, API.FmsAuxiliaryItemRespVO[]>
  >({})

  React.useImperativeHandle(ref, () => ({
    open: (currentSubject) => {
      setSubject(currentSubject)
      setSelectedIdsMap({})
      setSelectedItemsMap({})
      setVisible(true)
    }
  }))

  const configs = subject?.auxiliaryConfigs || []

  const canConfirm = useMemo(
    () =>
      configs.length > 0 &&
      configs.every(
        (cfg) => (selectedIdsMap[cfg.auxiliaryTypeId] || []).length > 0
      ),
    [configs, selectedIdsMap]
  )

  const buildCombinations = (itemGroups: API.FmsAuxiliaryItemRespVO[][]) =>
    itemGroups.reduce<API.FmsAuxiliaryItemRespVO[][]>(
      (combinations, items) =>
        combinations.flatMap((combination) =>
          items.map((item) => [...combination, item])
        ),
      [[]]
    )

  const handleSubmit = () => {
    if (!subject || !canConfirm) return
    const itemGroups = configs.map(
      (cfg) => selectedItemsMap[cfg.auxiliaryTypeId] || []
    )
    const combinations = buildCombinations(itemGroups)
    onSuccess(combinations)
    setVisible(false)
  }

  return (
    <Modal
      title="添加明细"
      open={visible}
      onCancel={() => setVisible(false)}
      width={520}
      destroyOnHidden
      footer={
        <Space>
          <Button onClick={() => setVisible(false)}>取消</Button>
          <Button type="primary" disabled={!canConfirm} onClick={handleSubmit}>
            确定
          </Button>
        </Space>
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
        <div style={{ width: 90, fontWeight: 500 }}>科目：</div>
        <Input
          value={
            subject ? `${subject.subjectCode} ${subject.subjectName}` : ''
          }
          disabled
          style={{ flex: 1 }}
        />
      </div>

      <Divider orientation="left" style={{ margin: '16px 0' }}>
        辅助核算
      </Divider>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {configs.map((config) => (
          <div
            key={config.auxiliaryTypeId}
            style={{ display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <div style={{ width: 90, fontWeight: 500 }}>{config.name}：</div>
            <FmsAuxiliaryItemSelect
              auxiliaryTypeId={config.auxiliaryTypeId}
              mode="multiple"
              value={selectedIdsMap[config.auxiliaryTypeId]}
              placeholder={`请选择${config.name}`}
              style={{ flex: 1 }}
              onChange={(val, options) => {
                const nextIds = Array.isArray(val)
                  ? val
                  : val !== undefined
                    ? [val]
                    : []
                const nextOptions = Array.isArray(options)
                  ? options
                  : options
                    ? [options]
                    : []
                setSelectedIdsMap((prev) => ({
                  ...prev,
                  [config.auxiliaryTypeId]: nextIds
                }))
                setSelectedItemsMap((prev) => ({
                  ...prev,
                  [config.auxiliaryTypeId]: nextOptions
                }))
              }}
            />
          </div>
        ))}
      </div>
    </Modal>
  )
})

FmsInitialAssistForm.displayName = 'FmsInitialAssistForm'

export default FmsInitialAssistForm
