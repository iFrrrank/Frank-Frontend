import React, { useEffect, useState } from 'react'
import { Col, Form, Input, Modal, Row, message } from 'antd'
import { updateMonthEmployeeRecord } from '@/api/hrm/insurance/monthEmployeeRecord'
import { getScheme } from '@/api/hrm/insurance/scheme'
import InsuranceSchemeSelect from '../../scheme/components/InsuranceSchemeSelect'
import ProjectUpdateTable, { buildProjectUpdateList } from './ProjectUpdateTable'
import type { EditableProject } from './ProjectUpdateTable'

interface InsuranceBatchEmployeeRecordFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  ids: number[]
}

/** 批量调整参保方案 */
const InsuranceBatchEmployeeRecordForm: React.FC<InsuranceBatchEmployeeRecordFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  ids
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [schemeType, setSchemeType] = useState<number | undefined>(undefined)
  const [projectList, setProjectList] = useState<EditableProject[]>([])

  useEffect(() => {
    if (visible) {
      form.resetFields()
      setSchemeType(undefined)
      setProjectList([])
    }
  }, [visible, form])

  /** 切换参保方案：加载方案下的项目作为调整基础 */
  const handleSchemeChange = async (_value?: number, scheme?: API.HrmInsuranceSchemeRespVO) => {
    if (!scheme?.id) {
      setProjectList([])
      setSchemeType(undefined)
      return
    }
    const resp = await getScheme({ id: scheme.id })
    const detail = resp.data
    setSchemeType(detail?.type)
    setProjectList(
      (detail?.projectList || []).map((project) => ({ ...project, schemeProjectId: project.id }))
    )
  }

  const handleOk = async () => {
    const values = await form.validateFields()
    const schemeId = values.schemeId as number
    const projects = buildProjectUpdateList(projectList, schemeType)
    setLoading(true)
    try {
      // 逐个员工提交，统计成功 / 失败数量
      const results = await Promise.allSettled(
        ids.map((id) => updateMonthEmployeeRecord({ id, schemeId, projects }))
      )
      const successCount = results.filter((result) => result.status === 'fulfilled').length
      const failureCount = results.length - successCount
      const content = `操作完成：成功 ${successCount} 个，失败 ${failureCount} 个`
      if (failureCount === 0) {
        message.success(content)
      } else if (successCount > 0) {
        message.warning(content)
      } else {
        message.error(content)
      }
      if (successCount > 0) {
        onSuccess()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="批量调整参保方案"
      open={visible}
      width={960}
      maskClosable={false}
      forceRender
      okText="确 定"
      cancelText="取 消"
      confirmLoading={loading}
      onOk={handleOk}
      onCancel={() => setVisible(false)}
    >
      <Form form={form} colon={false} labelAlign="right" labelCol={{ flex: '86px' }}>
        <Row gutter={20}>
          <Col span={8}>
            <Form.Item label="已选员工">
              <Input value={`${ids.length} 人`} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="schemeId"
              label="社保方案"
              rules={[{ required: true, message: '请选择社保方案' }]}
            >
              <InsuranceSchemeSelect placeholder="请选择方案" onChange={handleSchemeChange} />
            </Form.Item>
          </Col>
        </Row>
        <ProjectUpdateTable projects={projectList} schemeType={schemeType} onChange={setProjectList} />
      </Form>
    </Modal>
  )
}

export default InsuranceBatchEmployeeRecordForm
