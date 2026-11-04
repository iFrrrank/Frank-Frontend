import React, { useEffect, useState } from 'react'
import { Col, Form, Input, Modal, Row, Spin, Tag, message } from 'antd'
import { getMonthEmployeeRecord, updateMonthEmployeeRecord } from '@/api/hrm/insurance/monthEmployeeRecord'
import { getScheme } from '@/api/hrm/insurance/scheme'
import { textConst } from '@/locales/zh-CN'
import { HRM_INSURANCE_EMP_STATUS_LABELS, HrmInsuranceEmployeeStatus } from '../../constants'
import InsuranceSchemeSelect from '../../scheme/components/InsuranceSchemeSelect'
import ProjectUpdateTable, { buildProjectUpdateList } from './ProjectUpdateTable'
import type { EditableProject } from './ProjectUpdateTable'

interface InsuranceEmployeeRecordFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  /** 员工月度社保记录 Id */
  id?: number
}

/** 调整单个员工的月度参保方案 */
const InsuranceEmployeeRecordForm: React.FC<InsuranceEmployeeRecordFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  id
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [detail, setDetail] = useState<API.HrmInsuranceMonthEmployeeRecordRespVO>({})
  const [schemeType, setSchemeType] = useState<number | undefined>(undefined)
  const [projectList, setProjectList] = useState<EditableProject[]>([])

  useEffect(() => {
    if (!visible || !id) {
      return
    }
    form.resetFields()
    setLoading(true)
    getMonthEmployeeRecord({ id })
      .then((resp) => {
        const data = resp.data || {}
        setDetail(data)
        setSchemeType(data.schemeType)
        form.setFieldsValue({ schemeId: data.schemeId })
        setProjectList(
          [...(data.socialSecurityProjectList || []), ...(data.providentFundProjectList || [])].map(
            (project) => ({ ...project })
          )
        )
      })
      .finally(() => setLoading(false))
  }, [visible, id, form])

  /** 切换参保方案：用新方案的项目替换当前项目 */
  const handleSchemeChange = async (_value?: number, scheme?: API.HrmInsuranceSchemeRespVO) => {
    if (!scheme?.id) {
      setProjectList([])
      return
    }
    const resp = await getScheme({ id: scheme.id })
    setSchemeType(resp.data?.type)
    setProjectList(
      (resp.data?.projectList || []).map((project) => ({ ...project, schemeProjectId: project.id }))
    )
  }

  const handleOk = async () => {
    const values = await form.validateFields()
    if (!detail.id) return
    setLoading(true)
    try {
      await updateMonthEmployeeRecord({
        id: detail.id,
        schemeId: values.schemeId,
        projects: buildProjectUpdateList(projectList, schemeType)
      })
      message.success(textConst.msg.updateSuccess)
      onSuccess()
    } catch {
      message.error(textConst.msg.updateError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="调整参保方案"
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
      <Spin spinning={loading}>
        <Form form={form} colon={false} labelAlign="right" labelCol={{ flex: '86px' }}>
          <Row gutter={20}>
            <Col span={8}>
              <Form.Item label="员工">
                <Input
                  value={`${detail.employeeName || ''}${detail.jobNumber ? ' / ' + detail.jobNumber : ''}`}
                  disabled
                />
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
            <Col span={8}>
              <Form.Item label="状态">
                {detail.status !== undefined && (
                  <Tag
                    color={detail.status === HrmInsuranceEmployeeStatus.NORMAL ? 'success' : 'default'}
                  >
                    {HRM_INSURANCE_EMP_STATUS_LABELS[detail.status]}
                  </Tag>
                )}
              </Form.Item>
            </Col>
          </Row>
          <ProjectUpdateTable
            projects={projectList}
            schemeType={schemeType}
            onChange={setProjectList}
          />
        </Form>
      </Spin>
    </Modal>
  )
}

export default InsuranceEmployeeRecordForm
