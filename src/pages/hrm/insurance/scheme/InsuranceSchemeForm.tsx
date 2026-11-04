import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Alert,
  Button,
  Checkbox,
  Col,
  Divider,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Spin,
  Table,
  message
} from 'antd'
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import {
  createScheme,
  getScheme,
  updateScheme
} from '@/api/hrm/insurance/scheme'
import { getStandardProjectList, getStandardTypeList } from '@/api/hrm/insurance/standard'
import { textConst } from '@/locales/zh-CN'
import { deleteTextStyle } from '@/styles/common.style'
import AreaSelect from '../components/AreaSelect'
import { HrmInsuranceProjectType, HrmInsuranceSchemeType } from '../constants'
import {
  formatHrmMoney,
  getInsuranceProjectTypeName,
  isCustomInsuranceProject
} from '../utils'

interface InsuranceSchemeFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

/** 表单内的项目行，uid 仅用于前端渲染 key，提交时剔除 */
type ProjectRow = API.HrmInsuranceSchemeProjectSaveReqVO & { uid: string }

type ProjectSectionKey = 'social' | 'providentFund'

const SOCIAL_PROJECT_TYPES: number[] = [
  HrmInsuranceProjectType.ENDOWMENT,
  HrmInsuranceProjectType.MEDICAL,
  HrmInsuranceProjectType.UNEMPLOYMENT,
  HrmInsuranceProjectType.EMPLOYMENT_INJURY,
  HrmInsuranceProjectType.MATERNITY,
  HrmInsuranceProjectType.SUPPLEMENTARY_MEDICAL,
  HrmInsuranceProjectType.SUPPLEMENTARY_ENDOWMENT,
  HrmInsuranceProjectType.DISABILITY
]
const PROVIDENT_FUND_PROJECT_TYPES: number[] = [HrmInsuranceProjectType.PROVIDENT_FUND]

let uidSeed = 0
const nextUid = () => `project-${++uidSeed}`

/** 是否为社保项目：类型小于公积金即为社保 */
const isSocialProject = (type?: number) =>
  type !== undefined && type < HrmInsuranceProjectType.PROVIDENT_FUND

/** 是否为公积金项目 */
const isProvidentFundProject = (type?: number) =>
  type !== undefined && type >= HrmInsuranceProjectType.PROVIDENT_FUND

/** 创建参保项目；自定义项目名称由用户填写，标准项目取类型名称 */
const createProject = (type: number): ProjectRow => ({
  uid: nextUid(),
  type,
  name: isCustomInsuranceProject(type) ? '' : getInsuranceProjectTypeName(type),
  baseAmount: 0,
  corporateRate: 0,
  personalRate: 0,
  corporateAmount: 0,
  personalAmount: 0
})

/** 默认项目：五险一金 */
const createDefaultProjects = (): ProjectRow[] =>
  [
    HrmInsuranceProjectType.ENDOWMENT,
    HrmInsuranceProjectType.MEDICAL,
    HrmInsuranceProjectType.UNEMPLOYMENT,
    HrmInsuranceProjectType.EMPLOYMENT_INJURY,
    HrmInsuranceProjectType.MATERNITY,
    HrmInsuranceProjectType.PROVIDENT_FUND
  ].map(createProject)

/** 比例模式下：金额 = 基数 × 比例 × 0.01 */
const calculateAmount = (project: ProjectRow, type: 'corporate' | 'personal') => {
  const proportion = type === 'corporate' ? project.corporateRate : project.personalRate
  return Number(project.baseAmount || 0) * Number(proportion || 0) * 0.01
}

interface ProjectEditorProps {
  value?: ProjectRow[]
  onChange?: (value: ProjectRow[]) => void
  schemeType?: number
}

/** 社保 / 公积金项目编辑器（受 Form.Item 控制） */
const ProjectEditor: React.FC<ProjectEditorProps> = ({ value = [], onChange, schemeType }) => {
  const [openKey, setOpenKey] = useState<ProjectSectionKey | undefined>(undefined)
  const isProportion = schemeType === HrmInsuranceSchemeType.PROPORTION

  const updateRow = (uid: string, patch: Partial<ProjectRow>) =>
    onChange?.(value.map((item) => (item.uid === uid ? { ...item, ...patch } : item)))

  const addProject = (type: number) => onChange?.([...value, createProject(type)])

  const removeProject = (uid: string) => onChange?.(value.filter((item) => item.uid !== uid))

  /** 勾选或取消标准参保项目 */
  const handleProjectChecked = (checked: boolean, type: number) => {
    const project = value.find((item) => item.type === type)
    if (checked) {
      if (!project) {
        addProject(type)
      }
      return
    }
    if (project) {
      removeProject(project.uid)
    }
  }

  const sections = [
    {
      key: 'social' as const,
      label: '社保',
      projects: value.filter((item) => isSocialProject(item.type)),
      typeOptions: SOCIAL_PROJECT_TYPES,
      customType: HrmInsuranceProjectType.CUSTOM_SOCIAL_SECURITY
    },
    {
      key: 'providentFund' as const,
      label: '公积金',
      projects: value.filter((item) => isProvidentFundProject(item.type)),
      typeOptions: PROVIDENT_FUND_PROJECT_TYPES,
      customType: HrmInsuranceProjectType.CUSTOM_PROVIDENT_FUND
    }
  ]

  const renderAmountInput = (
    row: ProjectRow,
    field: 'baseAmount' | 'corporateAmount' | 'personalAmount'
  ) => (
    <InputNumber
      style={{ width: '100%' }}
      controls={false}
      min={0}
      precision={2}
      value={row[field]}
      onChange={(val) => updateRow(row.uid, { [field]: val ?? undefined })}
    />
  )

  const renderRateInput = (row: ProjectRow, field: 'corporateRate' | 'personalRate') => (
    <InputNumber
      style={{ width: '100%' }}
      controls={false}
      min={0}
      max={100}
      precision={2}
      suffix="%"
      value={row[field]}
      onChange={(val) => updateRow(row.uid, { [field]: val ?? undefined })}
    />
  )

  const buildColumns = () => {
    const columns: any[] = [
      {
        title: '项目名称',
        dataIndex: 'name',
        width: 150,
        render: (_: unknown, row: ProjectRow) =>
          isCustomInsuranceProject(row.type) ? (
            <Input
              maxLength={64}
              placeholder="请输入项目名称"
              value={row.name}
              onChange={(e) => updateRow(row.uid, { name: e.target.value })}
            />
          ) : (
            <span>{getInsuranceProjectTypeName(row.type)}</span>
          )
      },
      {
        title: '默认基数',
        dataIndex: 'baseAmount',
        width: 140,
        render: (_: unknown, row: ProjectRow) => renderAmountInput(row, 'baseAmount')
      }
    ]
    if (isProportion) {
      columns.push(
        {
          title: '公司缴纳比例',
          dataIndex: 'corporateRate',
          width: 140,
          render: (_: unknown, row: ProjectRow) => renderRateInput(row, 'corporateRate')
        },
        {
          title: '个人缴纳比例',
          dataIndex: 'personalRate',
          width: 140,
          render: (_: unknown, row: ProjectRow) => renderRateInput(row, 'personalRate')
        }
      )
    }
    columns.push(
      {
        title: '公司金额',
        dataIndex: 'corporateAmount',
        width: 140,
        render: (_: unknown, row: ProjectRow) =>
          isProportion
            ? formatHrmMoney(calculateAmount(row, 'corporate'))
            : renderAmountInput(row, 'corporateAmount')
      },
      {
        title: '个人金额',
        dataIndex: 'personalAmount',
        width: 140,
        render: (_: unknown, row: ProjectRow) =>
          isProportion
            ? formatHrmMoney(calculateAmount(row, 'personal'))
            : renderAmountInput(row, 'personalAmount')
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        width: 80,
        render: (_: unknown, row: ProjectRow) => (
          <a style={deleteTextStyle} onClick={() => removeProject(row.uid)}>
            删除
          </a>
        )
      }
    )
    return columns
  }

  /** 合计行：比例模式按基数×比例计算，金额模式直接累加 */
  const renderSummary = (data: readonly ProjectRow[]) => {
    const total = (type: 'corporate' | 'personal') =>
      formatHrmMoney(
        data.reduce(
          (sum, project) =>
            sum +
            (isProportion
              ? calculateAmount(project, type)
              : Number(project[type === 'corporate' ? 'corporateAmount' : 'personalAmount'] || 0)),
          0
        )
      )
    const leading = isProportion ? 4 : 2
    return (
      <Table.Summary fixed>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0}>总计</Table.Summary.Cell>
          {Array.from({ length: leading - 1 }).map((_, index) => (
            <Table.Summary.Cell key={index} index={index + 1} />
          ))}
          <Table.Summary.Cell index={leading}>{total('corporate')}</Table.Summary.Cell>
          <Table.Summary.Cell index={leading + 1}>{total('personal')}</Table.Summary.Cell>
          <Table.Summary.Cell index={leading + 2} />
        </Table.Summary.Row>
      </Table.Summary>
    )
  }

  return (
    <div style={{ width: '100%' }}>
      {sections.map((section, sectionIndex) => (
        <div key={section.key} style={{ marginTop: sectionIndex === 0 ? 0 : 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              margin: '8px 0 12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 16, fontWeight: 600 }}>
              <span
                style={{
                  width: 4,
                  height: 18,
                  borderRadius: 2,
                  marginRight: 10,
                  background: '#1677ff'
                }}
              />
              {section.label}
            </div>
            {/* 添加项目：勾选标准项目即添加/移除，点击“其他”添加自定义项目并关闭下拉 */}
            <Dropdown
              trigger={['click']}
              open={openKey === section.key}
              onOpenChange={(open) => setOpenKey(open ? section.key : undefined)}
              popupRender={() => (
                <div
                  style={{
                    background: '#fff',
                    borderRadius: 8,
                    boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
                    padding: '4px 0',
                    maxHeight: 280,
                    overflowY: 'auto'
                  }}
                >
                  {section.typeOptions.map((type) => (
                    <div key={type} style={{ padding: '5px 12px' }}>
                      <Checkbox
                        checked={value.some((item) => item.type === type)}
                        onChange={(e) => handleProjectChecked(e.target.checked, type)}
                      >
                        {getInsuranceProjectTypeName(type)}
                      </Checkbox>
                    </div>
                  ))}
                  <Divider style={{ margin: '4px 0' }} />
                  <div
                    style={{ padding: '5px 12px', cursor: 'pointer' }}
                    onClick={() => {
                      setOpenKey(undefined)
                      addProject(section.customType)
                    }}
                  >
                    <PlusOutlined style={{ marginRight: 5 }} />
                    其他
                  </div>
                </div>
              )}
            >
              <Button icon={<PlusOutlined />}>添加项目</Button>
            </Dropdown>
          </div>
          <Table<ProjectRow>
            rowKey="uid"
            size="small"
            bordered
            pagination={false}
            dataSource={section.projects}
            columns={buildColumns()}
            summary={renderSummary}
          />
        </div>
      ))}
    </div>
  )
}

const InsuranceSchemeForm: React.FC<InsuranceSchemeFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  id
}) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [standardLoading, setStandardLoading] = useState<boolean>(false)
  const [insuranceTypeList, setInsuranceTypeList] = useState<API.HrmInsuranceStandardTypeRespVO[]>(
    []
  )
  const schemeType = Form.useWatch('type', form)
  // 防止快速切换地区 / 方案时，旧请求的结果覆盖新选择
  const latestSelection = useRef<{ areaId?: number; householdType?: string }>({})

  /** 查询标准参保方案（户籍类型）列表 */
  const loadInsuranceTypeList = async (areaId: number) => {
    setStandardLoading(true)
    try {
      const resp = await getStandardTypeList({ reqVO: { areaId } })
      if (latestSelection.current.areaId !== areaId) {
        return
      }
      const data = resp.data || []
      setInsuranceTypeList(data)
      // 兼容历史数据：householdType 存的是名称而不是编码时，换成对应的编码
      const householdType = form.getFieldValue('householdType')
      const selectedType = data.find((item) => item.name === householdType && item.code !== householdType)
      if (selectedType) {
        form.setFieldValue('householdType', selectedType.code)
      }
    } finally {
      setStandardLoading(false)
    }
  }

  useEffect(() => {
    if (!visible) {
      return
    }
    form.resetFields()
    setInsuranceTypeList([])
    latestSelection.current = {}
    form.setFieldsValue({
      name: '',
      areaId: undefined,
      householdType: '',
      type: HrmInsuranceSchemeType.PROPORTION,
      projectList: createDefaultProjects()
    })
    if (id === undefined) {
      return
    }
    setLoading(true)
    getScheme({ id })
      .then(async (resp) => {
        const data = resp.data
        if (!data) return
        form.setFieldsValue({
          ...data,
          projectList: (data.projectList || []).map((project) => ({
            ...project,
            uid: nextUid()
          }))
        })
        latestSelection.current = { areaId: data.areaId, householdType: data.householdType }
        if (data.areaId) {
          await loadInsuranceTypeList(data.areaId)
        }
      })
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, id])

  /** 清空标准参保项目金额（切换地区后标准数据不再适用），自定义项目保留 */
  const resetStandardProjectValues = () => {
    const list: ProjectRow[] = form.getFieldValue('projectList') || []
    form.setFieldValue(
      'projectList',
      list.map((project) =>
        isCustomInsuranceProject(project.type)
          ? project
          : {
              ...project,
              baseAmount: 0,
              corporateRate: 0,
              personalRate: 0,
              corporateAmount: 0,
              personalAmount: 0
            }
      )
    )
  }

  /** 切换参保城市 */
  const handleAreaChange = async (areaId?: number) => {
    latestSelection.current = { areaId, householdType: '' }
    form.setFieldValue('householdType', '')
    setInsuranceTypeList([])
    resetStandardProjectValues()
    if (areaId) {
      await loadInsuranceTypeList(areaId)
    }
  }

  /** 切换标准参保方案：用标准项目替换现有标准项目，自定义项目保留 */
  const handleHouseTypeChange = async (typeCode?: string) => {
    const areaId = form.getFieldValue('areaId')
    latestSelection.current = { ...latestSelection.current, householdType: typeCode }
    if (!areaId || !typeCode) {
      return
    }
    setStandardLoading(true)
    try {
      const resp = await getStandardProjectList({ reqVO: { areaId, typeCode } })
      if (
        latestSelection.current.areaId !== areaId ||
        latestSelection.current.householdType !== typeCode
      ) {
        return
      }
      const customProjects = ((form.getFieldValue('projectList') as ProjectRow[]) || []).filter(
        (project) => isCustomInsuranceProject(project.type)
      )
      form.setFieldValue('projectList', [
        ...(resp.data || []).map((project) => ({
          ...project,
          uid: nextUid(),
          id: undefined,
          schemeId: undefined,
          name: getInsuranceProjectTypeName(project.type)
        })),
        ...customProjects
      ])
    } finally {
      setStandardLoading(false)
    }
  }

  const doSubmit = async (values: Record<string, any>) => {
    const projectList = ((values.projectList || []) as ProjectRow[]).map(
      ({ uid: _uid, ...project }) => project
    )
    setLoading(true)
    try {
      const body = { ...values, id, projectList } as API.HrmInsuranceSchemeSaveReqVO
      if (isUpdate) {
        await updateScheme(body)
        message.success(textConst.msg.updateSuccess)
      } else {
        await createScheme(body)
        message.success(textConst.msg.createSuccess)
      }
      onSuccess()
    } catch {
      message.error(textConst.error.operationFail)
    } finally {
      setLoading(false)
    }
  }

  const handleOk = async () => {
    const values = await form.validateFields()
    if (!isUpdate) {
      await doSubmit(values)
      return
    }
    Modal.confirm({
      title: textConst.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '编辑参保方案后，不会变更现有参保信息，确定提交吗？',
      okText: textConst.common.ok,
      cancelText: textConst.common.cancel,
      onOk: () => doSubmit(values)
    })
  }

  const householdOptions = useMemo(
    () => insuranceTypeList.map((item) => ({ label: item.name, value: item.code })),
    [insuranceTypeList]
  )

  return (
    <Modal
      title={isUpdate ? textConst.action.update : textConst.action.create}
      open={visible}
      width={1120}
      forceRender
      maskClosable={false}
      okText="确 定"
      cancelText="取 消"
      confirmLoading={loading}
      onOk={handleOk}
      onCancel={() => setVisible(false)}
      styles={{ body: { maxHeight: 'calc(100vh - 210px)', overflowY: 'auto', paddingTop: 8 } }}
      style={{ top: '4vh' }}
    >
      <Spin spinning={loading || standardLoading}>
        <Form
          form={form}
          layout="horizontal"
          colon={false}
          labelAlign="right"
          labelCol={{ flex: '118px' }}
          onValuesChange={(changed) => {
            if ('areaId' in changed) {
              handleAreaChange(changed.areaId)
            }
            if ('householdType' in changed) {
              handleHouseTypeChange(changed.householdType)
            }
          }}
        >
          <Row gutter={20}>
            <Col span={8}>
              <Form.Item
                name="name"
                label="方案名称"
                rules={[{ required: true, message: '方案名称不能为空' }]}
              >
                <Input maxLength={64} placeholder="请输入方案名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="areaId"
                label="参保城市"
                rules={[{ required: true, message: '参保城市不能为空' }]}
              >
                <AreaSelect selectableLevels={[2, 3]} placeholder="请选择参保城市" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="householdType" label="可选参保方案">
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  loading={standardLoading}
                  placeholder="请选择参保方案"
                  options={householdOptions}
                  onClear={() => form.setFieldValue('householdType', '')}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="type"
            label="方案类型"
            rules={[{ required: true, message: '方案类型不能为空' }]}
          >
            <Radio.Group buttonStyle="outline" optionType="button">
              <Radio.Button value={HrmInsuranceSchemeType.PROPORTION}>
                设置参保基数和比例
              </Radio.Button>
              <Radio.Button value={HrmInsuranceSchemeType.AMOUNT}>仅设置参保金额</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Alert
            style={{ marginBottom: 16 }}
            type="info"
            showIcon
            message="比例模式：公司或个人缴纳金额 = 参保基数 × 对应比例；金额模式直接填写公司和个人缴纳金额。"
          />
          <Form.Item
            name="projectList"
            wrapperCol={{ span: 24 }}
            rules={[
              {
                validator: (_rule, value?: ProjectRow[]) => {
                  if (!value?.some((project) => isSocialProject(project.type))) {
                    return Promise.reject(new Error('请至少添加一个社保项目'))
                  }
                  if (value.some((project) => !project.name?.trim())) {
                    return Promise.reject(new Error('参保项目名称不能为空'))
                  }
                  return Promise.resolve()
                }
              }
            ]}
          >
            <ProjectEditor schemeType={schemeType} />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  )
}

export default InsuranceSchemeForm
