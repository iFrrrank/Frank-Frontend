import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Card, Checkbox, Modal, Spin, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { history } from '@umijs/max'
import dayjs from 'dayjs'
import { fmsClosingSchemeGetClosingSchemeList } from '@/api/fms/closing/scheme'
import {
  fmsClosingVoucherGenerateClosingSchemeVoucher,
  fmsClosingVoucherGenerateClosingVoucherList,
  fmsClosingVoucherGenerateProfitLossVoucher
} from '@/api/fms/closing/voucher'
import { fmsSubjectGetSubjectSimpleList } from '@/api/fms/config/subject'
import { fmsVoucherWordGetVoucherWordSimpleList } from '@/api/fms/config/voucherWord'
import HasPermi from '@/directives/permission/HasPermi'
import { useFmsStore } from '@/pages/fms/store/fms'
import { FMS_CLOSING_TYPE } from '@/pages/fms/utils/constants'
import ClosingSchemeCard from './ClosingSchemeCard'
import ClosingSchemeForm, { type ClosingSchemeFormRef } from './ClosingSchemeForm'
import ClosingTemplateSelect, { type ClosingTemplateSelectRef } from './ClosingTemplateSelect'
import ProfitLossSettingsForm, {
  type ProfitLossSettingsFormRef
} from './ProfitLossSettingsForm'
import SpecialClosingSettingsForm, {
  type SpecialClosingSettingsFormRef
} from './SpecialClosingSettingsForm'

interface ClosingSchemeListProps {
  accountSetId: number
  month: string
  currentPeriod: boolean
  closed: boolean
  voucherCount: number
  profitLossBalance: number
  onSuccess?: () => void
}

const PROFIT_LOSS_SCHEME_ID = -1

const ClosingSchemeList: React.FC<ClosingSchemeListProps> = ({
  accountSetId,
  month,
  currentPeriod,
  closed,
  voucherCount,
  profitLossBalance,
  onSuccess
}) => {
  const fmsStore = useFmsStore()

  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [voucherWords, setVoucherWords] = useState<API.FmsVoucherWordRespVO[]>([])
  const [leafSubjects, setLeafSubjects] = useState<API.FmsSubjectRespVO[]>([])
  const [closingSchemes, setClosingSchemes] = useState<API.FmsClosingSchemeRespVO[]>([])
  const [selectedSchemeIds, setSelectedSchemeIds] = useState<number[]>([])

  const schemeFormRef = useRef<ClosingSchemeFormRef>(null)
  const closingTemplateSelectRef = useRef<ClosingTemplateSelectRef>(null)
  const profitLossSettingsFormRef = useRef<ProfitLossSettingsFormRef>(null)
  const specialClosingSettingsFormRef = useRef<SpecialClosingSettingsFormRef>(null)

  const monthLabel = useMemo(() => dayjs(`${month}-01`).format('YYYY年MM月'), [month])
  const otherSchemes = useMemo(
    () => closingSchemes.filter((item) => item.type !== FMS_CLOSING_TYPE.PROFIT_LOSS),
    [closingSchemes]
  )
  const profitLossScheme = useMemo(
    () => closingSchemes.find((item) => item.type === FMS_CLOSING_TYPE.PROFIT_LOSS),
    [closingSchemes]
  )
  const allSchemeIds = useMemo(
    () => [PROFIT_LOSS_SCHEME_ID, ...(otherSchemes.map((item) => item.id).filter(Boolean) as number[])],
    [otherSchemes]
  )
  const allSchemesChecked = useMemo(
    () =>
      allSchemeIds.length > 0 && allSchemeIds.every((id) => selectedSchemeIds.includes(id)),
    [allSchemeIds, selectedSchemeIds]
  )
  const someSchemesChecked = useMemo(
    () => selectedSchemeIds.length > 0 && !allSchemesChecked,
    [selectedSchemeIds, allSchemesChecked]
  )

  const getSchemeList = useCallback(async () => {
    if (!accountSetId || !month) return
    setLoading(true)
    try {
      const resp = await fmsClosingSchemeGetClosingSchemeList({
        accountSetId: String(accountSetId),
        month
      })
      if (resp.code === 0) {
        const list = resp.data || []
        setClosingSchemes(list)
        setSelectedSchemeIds((prev) =>
          prev.filter((id) =>
            [PROFIT_LOSS_SCHEME_ID, ...list.map((item) => item.id)].includes(id)
          )
        )
      }
    } finally {
      setLoading(false)
    }
  }, [accountSetId, month])

  useEffect(() => {
    const init = async () => {
      if (!accountSetId) return
      const [wordsResp, subjectResp] = await Promise.all([
        fmsVoucherWordGetVoucherWordSimpleList({ accountSetId }),
        fmsSubjectGetSubjectSimpleList({ accountSetId: String(accountSetId) })
      ])
      if (wordsResp.code === 0) setVoucherWords(wordsResp.data || [])
      if (subjectResp.code === 0) {
        const subjectList = subjectResp.data || []
        const parentSubjectIds = new Set(subjectList.map((item) => item.parentId))
        setLeafSubjects(subjectList.filter((item) => !parentSubjectIds.has(item.id)))
      }
    }
    init()
  }, [accountSetId])

  useEffect(() => {
    getSchemeList()
  }, [getSchemeList])

  const refresh = async () => {
    await getSchemeList()
    onSuccess?.()
  }

  const openVoucher = (voucherId: number) => {
    history.push(`/fms/voucher/create?id=${voucherId}`)
  }

  /** 生成结转损益凭证 */
  const generateProfitLoss = () => {
    if (!currentPeriod) {
      message.warning('只能生成当前会计期间的结转凭证')
      return
    }
    if (!profitLossScheme) {
      message.warning('请先完成结转损益参数设置')
      profitLossSettingsFormRef.current?.open()
      return
    }
    Modal.confirm({
      title: '系统提示',
      content: `确认生成 ${monthLabel} 的结转损益凭证吗？`,
      onOk: async () => {
        setGenerating(true)
        try {
          const resp = await fmsClosingVoucherGenerateProfitLossVoucher({
            accountSetId,
            month
          })
          if (resp.code === 0 && resp.data) {
            message.success('结转损益凭证已生成')
            await refresh()
            openVoucher(resp.data)
          }
        } finally {
          setGenerating(false)
        }
      }
    })
  }

  /** 生成指定结账方案凭证 */
  const generateScheme = (scheme: API.FmsClosingSchemeRespVO) => {
    if (!currentPeriod) return
    Modal.confirm({
      title: '系统提示',
      content: `确认生成 ${monthLabel} 的“${scheme.name}”凭证吗？`,
      onOk: async () => {
        setGenerating(true)
        try {
          const resp = await fmsClosingVoucherGenerateClosingSchemeVoucher({
            accountSetId,
            month,
            id: scheme.id!
          })
          if (resp.code === 0 && resp.data) {
            message.success('结转凭证已生成')
            await refresh()
            openVoucher(resp.data)
          }
        } finally {
          setGenerating(false)
        }
      }
    })
  }

  /** 批量生成选中的结账方案凭证 */
  const generateSelectedSchemes = () => {
    if (!currentPeriod) return
    const ids = selectedSchemeIds.length ? selectedSchemeIds : allSchemeIds
    const availableIds = ids.filter((id) => {
      if (id === PROFIT_LOSS_SCHEME_ID) {
        return profitLossBalance !== 0 || Boolean(profitLossScheme?.voucherIds?.length)
      }
      const scheme = otherSchemes.find((item) => item.id === id)
      return scheme?.balance !== 0 || Boolean(scheme?.voucherIds?.length)
    })
    if (!availableIds.length) {
      message.warning('当前没有需要生成凭证的结账方案')
      return
    }
    if (availableIds.includes(PROFIT_LOSS_SCHEME_ID) && !profitLossScheme) {
      message.warning('请先完成结转损益参数设置')
      profitLossSettingsFormRef.current?.open()
      return
    }
    Modal.confirm({
      title: '系统提示',
      content: `确认生成已选择的 ${availableIds.length} 个结账方案凭证吗？`,
      onOk: async () => {
        setGenerating(true)
        try {
          const resp = await fmsClosingVoucherGenerateClosingVoucherList({
            accountSetId,
            month,
            ids: availableIds.map((id) =>
              id === PROFIT_LOSS_SCHEME_ID ? profitLossScheme!.id! : id
            )
          })
          if (resp.code === 0) {
            const voucherIds = resp.data || []
            const skippedCount = availableIds.length - voucherIds.length
            message.success(
              skippedCount
                ? `已生成 ${voucherIds.length} 个结账方案凭证，${skippedCount} 个方案无需生成`
                : `已生成 ${voucherIds.length} 个结账方案凭证`
            )
            await refresh()
          }
        } finally {
          setGenerating(false)
        }
      }
    })
  }

  const changeSchemeChecked = (id: number, checked: boolean) => {
    setSelectedSchemeIds((prev) => {
      if (checked) {
        return prev.includes(id) ? prev : [...prev, id]
      }
      return prev.filter((item) => item !== id)
    })
  }

  const openSchemeSettings = (scheme: API.FmsClosingSchemeRespVO) => {
    if (scheme.type === FMS_CLOSING_TYPE.REGULAR) {
      schemeFormRef.current?.open(scheme)
      return
    }
    specialClosingSettingsFormRef.current?.open(scheme)
  }

  return (
    <>
      <Card>
        <div
          style={{
            marginBottom: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>期末结转方案</div>
            <div style={{ marginTop: 6, color: '#909399' }}>
              {monthLabel} 共录入凭证 {voucherCount || 0} 张
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {fmsStore.isAccountSetWritable && (
              <>
                <Checkbox
                  checked={allSchemesChecked}
                  indeterminate={someSchemesChecked}
                  onChange={(e) =>
                    setSelectedSchemeIds(e.target.checked ? [...allSchemeIds] : [])
                  }
                >
                  全选
                </Checkbox>
                <HasPermi value="fms:closing:profit-loss">
                  <Button
                    type="primary"
                    loading={generating}
                    disabled={closed || !currentPeriod}
                    onClick={generateSelectedSchemes}
                  >
                    生成凭证
                  </Button>
                </HasPermi>
              </>
            )}
          </div>
        </div>

        <Spin spinning={loading}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
              gap: 16
            }}
          >
            <ClosingSchemeCard
              name="结转损益"
              checked={selectedSchemeIds.includes(PROFIT_LOSS_SCHEME_ID)}
              balance={profitLossScheme?.balance ?? profitLossBalance}
              voucherIds={profitLossScheme?.voucherIds || []}
              generateDisabled={
                closed ||
                !currentPeriod ||
                (profitLossBalance === 0 && !profitLossScheme?.voucherIds?.length)
              }
              onCheckedChange={(checked) =>
                changeSchemeChecked(PROFIT_LOSS_SCHEME_ID, checked)
              }
              onSettings={() => profitLossSettingsFormRef.current?.open(profitLossScheme)}
              onGenerate={generateProfitLoss}
              onOpenVoucher={openVoucher}
            />
            {otherSchemes.map((scheme) => (
              <ClosingSchemeCard
                key={scheme.id}
                name={scheme.name || ''}
                checked={selectedSchemeIds.includes(scheme.id!)}
                balance={scheme.balance || 0}
                voucherIds={scheme.voucherIds || []}
                generateDisabled={
                  closed ||
                  !currentPeriod ||
                  ((scheme.balance || 0) === 0 && !scheme.voucherIds?.length)
                }
                onCheckedChange={(checked) => changeSchemeChecked(scheme.id!, checked)}
                onSettings={() => openSchemeSettings(scheme)}
                onGenerate={() => generateScheme(scheme)}
                onOpenVoucher={openVoucher}
              />
            ))}

            {fmsStore.isAccountSetWritable && (
              <HasPermi value="fms:closing:update">
                <button
                  type="button"
                  style={{
                    minHeight: 174,
                    display: 'flex',
                    cursor: 'pointer',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    borderRadius: 6,
                    border: '1px dashed #dcdfe6',
                    background: 'transparent',
                    color: '#909399'
                  }}
                  onClick={() => closingTemplateSelectRef.current?.open()}
                >
                  <PlusOutlined style={{ fontSize: 34 }} />
                  <span>期末结转凭证方案</span>
                </button>
              </HasPermi>
            )}
          </div>
        </Spin>
      </Card>

      <ClosingSchemeForm
        ref={schemeFormRef}
        accountSetId={accountSetId}
        subjects={leafSubjects}
        voucherWords={voucherWords}
        onSuccess={refresh}
      />
      <ClosingTemplateSelect
        ref={closingTemplateSelectRef}
        accountSetId={accountSetId}
        subjects={leafSubjects}
        onSelect={(template) => schemeFormRef.current?.open(undefined, template)}
      />
      <ProfitLossSettingsForm
        ref={profitLossSettingsFormRef}
        accountSetId={accountSetId}
        month={month}
        subjects={leafSubjects}
        voucherWords={voucherWords}
        onSuccess={refresh}
      />
      <SpecialClosingSettingsForm
        ref={specialClosingSettingsFormRef}
        accountSetId={accountSetId}
        subjects={leafSubjects}
        voucherWords={voucherWords}
        onSuccess={refresh}
      />
    </>
  )
}

export default ClosingSchemeList
