import React, { useState } from 'react'
import { Button, Modal, Result, Space } from 'antd'
import { history, useLocation } from '@umijs/max'
import HasPermi, { useHasPermi } from '@/directives/permission/HasPermi'
import { useFmsStore } from '../../store/fms'
import FmsAccountSetForm from '../../config/account-set/FmsAccountSetForm'

/**
 * 账套初始化引导弹窗（当用户进入 FMS 页面且尚无可用账套时自动引导）
 */
const FmsAccountSetGuide: React.FC = () => {
  const location = useLocation()
  const hasPermi = useHasPermi()
  const fmsStore = useFmsStore()
  const [formVisible, setFormVisible] = useState(false)

  console.log(location.pathname)
  console.log(fmsStore.accountSetListLoaded)
  console.log(fmsStore.accountSetId)

  const isGuideVisible =
    location.pathname.startsWith('/fms') &&
    location.pathname !== '/fms/config/account-set' &&
    fmsStore.accountSetListLoaded &&
    !fmsStore.accountSetId

  const canCreate = hasPermi('fms:account-set:create')
  const canQuery = hasPermi('fms:account-set:query')

  const handleCreateSuccess = async () => {
    await fmsStore.loadAccountSetList()
  }

  return (
    <>
      <Modal
        open={isGuideVisible && !formVisible}
        title="未检测到可用账套"
        width={480}
        closable={false}
        maskClosable={false}
        keyboard={false}
        footer={null}
      >
        <Result
          status="warning"
          title="请先创建账套后再使用财务管理功能"
          subTitle={
            canCreate
              ? '创建账套后，系统会自动为您预置会计科目、币种、凭证字、报表公式等基础数据。'
              : '当前账号暂无账套使用权限，请联系管理员分配账套成员权限或创建账套。'
          }
          extra={
            <Space>
              <HasPermi value="fms:account-set:create">
                <Button type="primary" onClick={() => setFormVisible(true)}>
                  立即创建账套
                </Button>
              </HasPermi>
              {canQuery && (
                <Button onClick={() => history.push('/fms/config/account-set')}>
                  前往账套管理
                </Button>
              )}
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

