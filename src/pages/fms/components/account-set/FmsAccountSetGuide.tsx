import React, { useState } from 'react'
import { Button, Modal, Result, Space } from 'antd'
import { history, useLocation } from '@umijs/max'
import { useHasPermi } from '@/directives/permission/HasPermi'
import { useFmsStore } from '../../store/fms'
import FmsAccountSetForm from '../../config/account-set/FmsAccountSetForm'

/**
 * 账套初始化引导弹窗（当用户进入 FMS 页面且尚无可用或已初始化账套时自动引导）
 */
const FmsAccountSetGuide: React.FC = () => {
  const location = useLocation()
  const hasPermi = useHasPermi()
  const fmsStore = useFmsStore()
  const [formVisible, setFormVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // 处于 FMS 路由且不是账套管理页面自身时检测
  const isFmsRoute =
    location.pathname.startsWith('/fms') &&
    location.pathname !== '/fms/config/account-set'

  // 是否存在账套但未初始化
  const hasUninitializedSets =
    fmsStore.accountSetList.length > 0 &&
    !fmsStore.accountSetList.some((item) => item.initialized)

  const isGuideVisible =
    isFmsRoute &&
    fmsStore.accountSetListLoaded &&
    !fmsStore.accountSetId &&
    !dismissed

  const canCreate = hasPermi('fms:config:account-set:create')
  const canQuery = hasPermi('fms:config:account-set:query')
  const canInit = hasPermi('fms:config:account-set:initialize')

  const handleCreateSuccess = async () => {
    setFormVisible(false)
    await fmsStore.loadAccountSetList()
  }

  // 引导文案与标题判定
  const title = hasUninitializedSets ? '当前账套尚未初始化' : '未检测到可用账套'
  const subTitle = hasUninitializedSets
    ? canInit
      ? '已检测到账套，但尚未完成初始化（会计准则与科目规则）。请前往【账套管理】点击【开始记账】完成初始化。'
      : '当前账套尚未初始化，请联系账套管理员完成初始化设置后再使用财务管理功能。'
    : canCreate
      ? '当前账号下暂无关联账套。创建账套后，系统会自动为您预置会计科目、币种、凭证字、报表公式等基础数据。'
      : '当前账号暂无账套使用权限。如数据库已录入账套，请联系管理员在【账套成员】中关联当前账号，或分配账套创建权限。'

  return (
    <>
      <Modal
        open={isGuideVisible && !formVisible}
        title={title}
        width={520}
        onCancel={() => setDismissed(true)}
        footer={null}
        destroyOnHidden
      >
        <Result
          status="warning"
          title={title}
          subTitle={subTitle}
          extra={
            <Space wrap>
              {!hasUninitializedSets && canCreate && (
                <Button type="primary" onClick={() => setFormVisible(true)}>
                  立即创建账套
                </Button>
              )}
              {canQuery && (
                <Button
                  type={hasUninitializedSets ? 'primary' : 'default'}
                  onClick={() => {
                    setDismissed(true)
                    history.push('/fms/config/account-set')
                  }}
                >
                  前往账套管理
                </Button>
              )}
              <Button onClick={() => setDismissed(true)}>
                {canCreate || canInit ? '稍后处理' : '我知道了'}
              </Button>
            </Space>
          }
        />
      </Modal>

      <FmsAccountSetForm
        visible={formVisible}
        setVisible={setFormVisible}
        onSuccess={handleCreateSuccess}
      />
    </>
  )
}

export default FmsAccountSetGuide
