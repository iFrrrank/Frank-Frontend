import React, { useRef, useState } from 'react'
import { Col, Form, Input, Row, Tabs, message } from 'antd'
import {
  ModalForm,
  ProForm,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components'
import dayjs from 'dayjs'
import * as EmployeeApi from '@/api/hrm/employee'
import * as EmployeeConfigApi from '@/api/hrm/employee/config'
import { convertRecruitCandidateToEmployee } from '@/api/hrm/recruit/candidate'
import {
  HrmEmployeeEntryStatusEnum,
  HrmEmployeeIdTypeEnum,
  HrmEmployeeStatusEnum,
  HrmEmployeeTypeEnum,
  HRM_EMPLOYEE_CREATE_ENTRY_STATUS_VALUES,
  HRM_EMPLOYEE_NO_PROBATION_MONTHS
} from '@/utils/constants'
import {
  EMPLOYEE_ENTRY_STATUS_OPTIONS,
  EMPLOYEE_ID_TYPE_OPTIONS,
  EMPLOYEE_STATUS,
  EMPLOYEE_STATUS_OPTIONS,
  EMPLOYEE_TYPE_OPTIONS
} from '@/utils/constantsValue'
import { textConst } from '@/locales/zh-CN'
import { HRM_EMPLOYEE_NON_FORMAL_STATUS_VALUES } from './constants'
import { SEX_OPTIONS, getEducationOptions } from './utils'
import DeptSelect from './components/DeptSelect'
import UserSelect from './components/UserSelect'
import HrmEmployeeSelect from './components/HrmEmployeeSelect'
import RecruitChannelSelect from '@/pages/hrm/recruit/channel/components/RecruitChannelSelect'

// 表单类型：create 新增；update 修改；candidate 候选人转员工；confirm 确认入职；rehire 再入职
export type EmployeeFormType = 'create' | 'update' | 'candidate' | 'confirm' | 'rehire'

interface EmployeeFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  formType: EmployeeFormType
  id?: number
  // candidate 类型时传入候选人基础数据
  defaultData?: Partial<API.HrmEmployeeRespVO>
}

/** 创建默认表单数据 */
const createDefaultFormData = (): Partial<API.HrmEmployeeRespVO> => ({
  name: '',
  jobNumber: '',
  userId: undefined,
  mobile: '',
  country: '中国',
  nation: '',
  idType: HrmEmployeeIdTypeEnum.ID_CARD.idType,
  idNumber: '',
  sex: undefined,
  email: '',
  nativePlace: '',
  birthday: undefined,
  age: undefined,
  address: '',
  highestEducation: undefined,
  deptId: undefined,
  leaderEmployeeId: undefined,
  entryStatus: HrmEmployeeEntryStatusEnum.ACTIVE.entryStatus,
  status: undefined,
  type: HrmEmployeeTypeEnum.FORMAL.type,
  entryTime: undefined,
  probation: HRM_EMPLOYEE_NO_PROBATION_MONTHS,
  regularTime: undefined,
  leaveTime: undefined,
  postName: '',
  postLevel: '',
  workCity: '',
  workAddress: '',
  workDetailAddress: '',
  channelId: undefined,
  companyAgeStartTime: undefined,
  companyAge: undefined,
  candidateId: undefined,
  remark: ''
})

const FORM_TITLES: Record<EmployeeFormType, string> = {
  create: '新增员工',
  update: '修改员工',
  candidate: '候选人转员工',
  confirm: '确认入职',
  rehire: '办理再入职'
}

/** 员工表单主体：受 formType / entryStatus / 字段配置驱动渲染 */
const EmployeeFormContent: React.FC<{
  formType: EmployeeFormType
  fieldVisibleMap: Record<number, Set<string>>
}> = ({ formType, fieldVisibleMap }) => {
  const form = Form.useFormInstance()
  const entryStatus = Form.useWatch('entryStatus', form)
  const employeeType = Form.useWatch('type', form)
  const employeeId: number | undefined = Form.useWatch('id', form)
  const status = Form.useWatch('status', form)
  const candidateId = Form.useWatch('candidateId', form)

  /** 判断字段是否显示：修改时全部显示，其余按入职状态对应的字段配置过滤 */
  const isFieldVisible = (name: string): boolean => {
    if (formType === 'update') {
      return true
    }
    const visibleFields =
      fieldVisibleMap[entryStatus ?? HrmEmployeeEntryStatusEnum.ACTIVE.entryStatus]
    return !visibleFields || visibleFields.has(name)
  }

  /** 切换聘用形式：正式 / 非正式联动试用期与员工状态字段 */
  const handleTypeChange = (type?: number) => {
    if (type === HrmEmployeeTypeEnum.FORMAL.type) {
      // 正式员工：试用期默认 0；状态仅保留正式 / 试用，其余清空由后端计算
      form.setFieldsValue({
        probation: form.getFieldValue('probation') ?? HRM_EMPLOYEE_NO_PROBATION_MONTHS
      })
      const status = form.getFieldValue('status')
      if (
        status !== HrmEmployeeStatusEnum.REGULAR.status &&
        status !== HrmEmployeeStatusEnum.PROBATION.status
      ) {
        form.setFieldsValue({ status: undefined })
      }
    } else {
      // 非正式员工：无试用期概念，默认实习
      form.setFieldsValue({
        probation: undefined,
        regularTime: undefined,
        status: HRM_EMPLOYEE_NON_FORMAL_STATUS_VALUES.includes(form.getFieldValue('status'))
          ? form.getFieldValue('status')
          : HrmEmployeeStatusEnum.INTERN.status
      })
    }
  }

  // 非正式员工可选状态选项（正式员工状态由后端自动计算）
  const nonFormalStatusOptions = EMPLOYEE_STATUS_OPTIONS.filter((item) =>
    HRM_EMPLOYEE_NON_FORMAL_STATUS_VALUES.includes(item.value as number)
  )

  // 入职状态选项：新增 / 候选人转员工时仅允许选择在职、待入职
  const entryStatusOptions =
    formType === 'update'
      ? EMPLOYEE_ENTRY_STATUS_OPTIONS
      : EMPLOYEE_ENTRY_STATUS_OPTIONS.filter((item) =>
          HRM_EMPLOYEE_CREATE_ENTRY_STATUS_VALUES.includes(item.value as number)
        )

  // 确认入职 / 再入职不允许选择未来时间
  const disableFutureDate = (date: dayjs.Dayjs): boolean =>
    date.valueOf() > dayjs().endOf('day').valueOf()

  return (
    <Tabs
      defaultActiveKey="personal"
      items={[
        {
          key: 'personal',
          label: '个人信息',
          children: (
            <Row gutter={20}>
              <Col span={12}>
                <ProFormText
                  name="name"
                  label="员工姓名"
                  placeholder="请输入员工姓名"
                  fieldProps={{ maxLength: 255 }}
                  rules={[{ required: true, message: '员工姓名不能为空' }]}
                  hidden={!isFieldVisible('name')}
                />
              </Col>
              <Col span={12}>
                <ProForm.Item name="userId" label="绑定用户" hidden={!isFieldVisible('userId')}>
                  <UserSelect placeholder="请选择后台用户" />
                </ProForm.Item>
              </Col>
              <Col span={12}>
                <ProFormText
                  name="mobile"
                  label="手机号"
                  placeholder="请输入手机号"
                  fieldProps={{ maxLength: 11 }}
                  rules={[
                    { required: true, message: '手机号不能为空' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                  ]}
                  hidden={!isFieldVisible('mobile')}
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  name="email"
                  label="邮箱"
                  placeholder="请输入邮箱"
                  fieldProps={{ maxLength: 255 }}
                  rules={[{ type: 'email', message: '请输入正确的邮箱地址' }]}
                  hidden={!isFieldVisible('email')}
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  name="country"
                  label="国家或地区"
                  placeholder="请输入国家或地区"
                  fieldProps={{ maxLength: 64 }}
                  hidden={!isFieldVisible('country')}
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  name="nation"
                  label="民族"
                  placeholder="请输入民族"
                  fieldProps={{ maxLength: 64 }}
                  hidden={!isFieldVisible('nation')}
                />
              </Col>
              <Col span={12}>
                <ProFormSelect
                  name="idType"
                  label="证件类型"
                  placeholder="请选择证件类型"
                  options={EMPLOYEE_ID_TYPE_OPTIONS}
                  hidden={!isFieldVisible('idType')}
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  name="idNumber"
                  label="证件号码"
                  placeholder="请输入证件号码"
                  fieldProps={{ maxLength: 255 }}
                  hidden={!isFieldVisible('idNumber')}
                />
              </Col>
              <Col span={12}>
                <ProFormSelect
                  name="sex"
                  label="性别"
                  placeholder="请选择性别"
                  options={SEX_OPTIONS}
                  hidden={!isFieldVisible('sex')}
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  name="nativePlace"
                  label="籍贯"
                  placeholder="请输入籍贯"
                  fieldProps={{ maxLength: 128 }}
                  hidden={!isFieldVisible('nativePlace')}
                />
              </Col>
              <Col span={12}>
                <ProFormDateTimePicker
                  name="birthday"
                  label="出生时间"
                  placeholder="请选择出生时间"
                  hidden={!isFieldVisible('birthday')}
                />
              </Col>
              <Col span={12}>
                {/* 年龄由出生时间自动计算，只读展示 */}
                <ProFormDigit
                  name="age"
                  label="年龄"
                  placeholder="自动计算"
                  min={0}
                  max={200}
                  disabled
                  fieldProps={{ controls: false, precision: 0 }}
                  hidden={!isFieldVisible('age')}
                />
              </Col>
              <Col span={12}>
                <ProFormSelect
                  name="highestEducation"
                  label="最高学历"
                  placeholder="请选择最高学历"
                  request={getEducationOptions}
                  hidden={!isFieldVisible('highestEducation')}
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  name="address"
                  label="户籍地址"
                  placeholder="请输入户籍地址"
                  fieldProps={{ maxLength: 255 }}
                  hidden={!isFieldVisible('address')}
                />
              </Col>
            </Row>
          )
        },
        {
          key: 'entry',
          label: '入职信息',
          children: (
            <Row gutter={20}>
              <Col span={12}>
                <ProFormText
                  name="jobNumber"
                  label="工号"
                  placeholder="请输入工号"
                  fieldProps={{ maxLength: 64 }}
                  rules={[
                    {
                      validator: (_rule: any, value: any) => {
                        // 在职员工工号必填
                        if (
                          form.getFieldValue('entryStatus') ===
                            HrmEmployeeEntryStatusEnum.ACTIVE.entryStatus &&
                          !String(value || '').trim()
                        ) {
                          return Promise.reject(new Error('在职员工工号不能为空'))
                        }
                        return Promise.resolve()
                      }
                    }
                  ]}
                  hidden={!isFieldVisible('jobNumber')}
                />
              </Col>
              <Col span={12}>
                <ProFormSelect
                  name="entryStatus"
                  label="入职状态"
                  placeholder="请选择入职状态"
                  disabled={formType !== 'create' && formType !== 'candidate'}
                  options={entryStatusOptions}
                  rules={[{ required: true, message: '请选择入职状态' }]}
                  hidden={!isFieldVisible('entryStatus')}
                />
              </Col>
              <Col span={12}>
                <ProForm.Item name="deptId" label="部门" hidden={!isFieldVisible('deptId')}>
                  <DeptSelect placeholder="请选择部门" />
                </ProForm.Item>
              </Col>
              <Col span={12}>
                <ProFormText
                  name="postName"
                  label="岗位"
                  placeholder="请输入岗位"
                  fieldProps={{ maxLength: 255 }}
                  hidden={!isFieldVisible('postName')}
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  name="postLevel"
                  label="岗位职级"
                  placeholder="请输入岗位职级"
                  fieldProps={{ maxLength: 255 }}
                  hidden={!isFieldVisible('postLevel')}
                />
              </Col>
              <Col span={12}>
                {/* 直属上级不能选择员工自己 */}
                <ProForm.Item
                  name="leaderEmployeeId"
                  label="直属上级"
                  hidden={!isFieldVisible('leaderEmployeeId')}
                >
                  <HrmEmployeeSelect
                    disabledIds={employeeId ? [employeeId] : []}
                    placeholder="请选择直属上级"
                  />
                </ProForm.Item>
              </Col>
              <Col span={12}>
                <ProForm.Item
                  name="channelId"
                  label="招聘渠道"
                  hidden={!isFieldVisible('channelId')}
                >
                  <RecruitChannelSelect placeholder="请选择招聘渠道" />
                </ProForm.Item>
              </Col>
              <Col span={12}>
                <ProFormSelect
                  name="type"
                  label="聘用形式"
                  placeholder="请选择聘用形式"
                  disabled={formType === 'update'}
                  options={EMPLOYEE_TYPE_OPTIONS}
                  fieldProps={{ onChange: handleTypeChange }}
                  rules={[{ required: true, message: '请选择聘用形式' }]}
                  hidden={!isFieldVisible('type')}
                />
              </Col>
              <Col span={12}>
                {employeeType === HrmEmployeeTypeEnum.FORMAL.type ? (
                  // 正式员工状态由后端按试用期自动计算，这里只读展示
                  <ProForm.Item label="员工状态" hidden={!isFieldVisible('status')}>
                    <Input
                      disabled
                      value={status != null ? (EMPLOYEE_STATUS[status]?.text ?? status) : undefined}
                      placeholder="保存后自动计算"
                    />
                  </ProForm.Item>
                ) : (
                  <ProFormSelect
                    name="status"
                    label="员工状态"
                    placeholder="请选择员工状态"
                    disabled={formType === 'update'}
                    options={nonFormalStatusOptions}
                    rules={[
                      {
                        validator: (_rule: any, value: any) => {
                          if (
                            form.getFieldValue('type') === HrmEmployeeTypeEnum.INFORMAL.type &&
                            value == null
                          ) {
                            return Promise.reject(new Error('请选择员工状态'))
                          }
                          return Promise.resolve()
                        }
                      }
                    ]}
                    hidden={!isFieldVisible('status')}
                  />
                )}
              </Col>
              <Col span={12}>
                <ProFormDateTimePicker
                  name="entryTime"
                  label="入职时间"
                  placeholder="请选择入职时间"
                  fieldProps={{
                    disabledDate:
                      formType === 'confirm' || formType === 'rehire'
                        ? disableFutureDate
                        : undefined
                  }}
                  rules={[{ required: true, message: '请选择入职时间' }]}
                  hidden={!isFieldVisible('entryTime')}
                />
              </Col>
              <Col span={12}>
                <ProFormDigit
                  name="probation"
                  label="试用期（月）"
                  placeholder="请输入试用期"
                  min={0}
                  max={6}
                  disabled={formType === 'update'}
                  fieldProps={{ controls: false, precision: 0 }}
                  extra="0 表示无试用期；转正时间按入职时间 + 试用期月数计算"
                  rules={[
                    {
                      validator: (_rule: any, value: any) => {
                        if (
                          form.getFieldValue('type') === HrmEmployeeTypeEnum.FORMAL.type &&
                          value == null
                        ) {
                          return Promise.reject(new Error('请输入试用期'))
                        }
                        return Promise.resolve()
                      }
                    }
                  ]}
                  hidden={
                    !isFieldVisible('probation') || employeeType !== HrmEmployeeTypeEnum.FORMAL.type
                  }
                />
              </Col>
              <Col span={12}>
                <ProFormDateTimePicker
                  name="regularTime"
                  label="转正时间"
                  placeholder="保存后自动计算"
                  disabled
                  hidden={!isFieldVisible('regularTime')}
                />
              </Col>
              <Col span={12}>
                <ProFormDateTimePicker
                  name="leaveTime"
                  label="离职时间"
                  placeholder="由离职流程维护"
                  disabled
                  hidden={!isFieldVisible('leaveTime')}
                />
              </Col>
              <Col span={12}>
                <ProFormDateTimePicker
                  name="companyAgeStartTime"
                  label="司龄起算时间"
                  placeholder="默认使用入职时间"
                  hidden={!isFieldVisible('companyAgeStartTime')}
                />
              </Col>
              <Col span={12}>
                <ProFormDigit
                  name="companyAge"
                  label="司龄（年）"
                  placeholder="自动计算"
                  min={0}
                  disabled
                  fieldProps={{ controls: false, precision: 0 }}
                  hidden={!isFieldVisible('companyAge')}
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  name="workCity"
                  label="工作城市"
                  placeholder="请输入工作城市"
                  fieldProps={{ maxLength: 64 }}
                  hidden={!isFieldVisible('workCity')}
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  name="workAddress"
                  label="工作地点"
                  placeholder="请输入工作地点"
                  fieldProps={{ maxLength: 255 }}
                  hidden={!isFieldVisible('workAddress')}
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  name="workDetailAddress"
                  label="工作详细地址"
                  placeholder="请输入工作详细地址"
                  fieldProps={{ maxLength: 255 }}
                  hidden={!isFieldVisible('workDetailAddress')}
                />
              </Col>
              <Col span={12}>
                {/* 招聘候选人由招聘转入时自动关联，只读展示 */}
                <ProForm.Item label="招聘候选人" hidden={!isFieldVisible('candidateId')}>
                  <Input disabled value={candidateId} placeholder="由招聘转入时自动关联" />
                </ProForm.Item>
              </Col>
              <Col span={24}>
                <ProFormTextArea
                  name="remark"
                  label="备注"
                  placeholder="请输入备注"
                  fieldProps={{ rows: 3, maxLength: 500, showCount: true }}
                  hidden={!isFieldVisible('remark')}
                />
              </Col>
            </Row>
          )
        }
      ]}
    />
  )
}

/** 新建 / 修改员工档案（含候选人转员工、确认入职、再入职） */
const EmployeeForm: React.FC<EmployeeFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  formType,
  id,
  defaultData
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  // 新建员工字段配置：key 为入职状态，value 为可见字段集合
  const fieldVisibleMapRef = useRef<Record<number, Set<string>>>({})
  const [fieldVisibleMap, setFieldVisibleMap] = useState<Record<number, Set<string>>>({})

  /** 加载新建员工字段配置（在职 / 待入职两个入职状态） */
  const loadCreateFieldConfig = async () => {
    const [activeFields, pendingEntryFields] = await Promise.all([
      EmployeeConfigApi.getEmployeeCreateFieldConfigList({
        entryStatus: HrmEmployeeEntryStatusEnum.ACTIVE.entryStatus
      }),
      EmployeeConfigApi.getEmployeeCreateFieldConfigList({
        entryStatus: HrmEmployeeEntryStatusEnum.PENDING_ENTRY.entryStatus
      })
    ])
    const map: Record<number, Set<string>> = {
      [HrmEmployeeEntryStatusEnum.ACTIVE.entryStatus]: new Set(
        (activeFields.data || []).filter((field) => field.visible).map((field) => field.name)
      ),
      [HrmEmployeeEntryStatusEnum.PENDING_ENTRY.entryStatus]: new Set(
        (pendingEntryFields.data || []).filter((field) => field.visible).map((field) => field.name)
      )
    }
    fieldVisibleMapRef.current = map
    setFieldVisibleMap(map)
  }

  /** 按当前字段配置构造提交数据，避免隐藏字段旧值随请求提交 */
  const buildSubmitData = (formData: Record<string, any>): Record<string, any> => {
    if (formType === 'update') {
      return formData
    }
    const entryStatus = formData.entryStatus ?? HrmEmployeeEntryStatusEnum.ACTIVE.entryStatus
    const visibleFields = fieldVisibleMapRef.current[entryStatus]
    if (!visibleFields) {
      return formData
    }
    const submitData: Record<string, any> = {}
    Object.entries(formData).forEach(([name, value]) => {
      if (visibleFields.has(name)) {
        submitData[name] = value
      }
    })
    if (formType === 'confirm' || formType === 'rehire') {
      submitData.id = formData.id
    } else if (formType === 'candidate') {
      submitData.candidateId = formData.candidateId
    }
    return submitData
  }

  return (
    <ModalForm
      title={FORM_TITLES[formType]}
      open={visible}
      onOpenChange={setVisible}
      form={form}
      layout="horizontal"
      colon={false}
      labelAlign="right"
      width={1040}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
      modalProps={{ destroyOnHidden: true, onCancel: () => form.resetFields() }}
      loading={loading}
      request={async () => {
        setLoading(true)
        try {
          // 非修改类型需要加载新建员工字段配置，控制字段显隐
          if (formType !== 'update') {
            await loadCreateFieldConfig()
          }
          if (id) {
            const resp = await EmployeeApi.getEmployee({ id })
            const data = { ...(resp.data || {}) }
            if (formType === 'confirm') {
              // 确认入职：入职状态固定为在职，入职时间为空或未来时取当前时间
              data.entryStatus = HrmEmployeeEntryStatusEnum.ACTIVE.entryStatus
              if (!data.entryTime || dayjs(data.entryTime).valueOf() > Date.now()) {
                const entryTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
                data.entryTime = entryTime
                data.regularTime = undefined
                if (
                  !data.companyAgeStartTime ||
                  dayjs(data.companyAgeStartTime).valueOf() > dayjs(entryTime).valueOf()
                ) {
                  data.companyAgeStartTime = entryTime
                }
              }
            } else if (formType === 'rehire') {
              // 再入职：重置入职相关字段
              const entryTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
              data.entryStatus = HrmEmployeeEntryStatusEnum.ACTIVE.entryStatus
              data.entryTime = entryTime
              data.companyAgeStartTime = entryTime
              data.regularTime = undefined
              data.leaveTime = undefined
              data.probation = HRM_EMPLOYEE_NO_PROBATION_MONTHS
            }
            return data as Record<string, any>
          }
          if (defaultData) {
            return { ...createDefaultFormData(), ...defaultData } as Record<string, any>
          }
          return createDefaultFormData() as Record<string, any>
        } finally {
          setLoading(false)
        }
      }}
      onFinish={async (values) => {
        try {
          const submitData = buildSubmitData(values)
          if (formType === 'create') {
            await EmployeeApi.createEmployee(submitData as API.HrmEmployeeSaveReqVO)
            message.success(textConst.msg.createSuccess)
          } else if (formType === 'candidate') {
            // 候选人转员工走招聘接口，成功后关闭弹窗
            await convertRecruitCandidateToEmployee(submitData as API.HrmRecruitCandidateEntryReqVO)
            message.success(textConst.msg.createSuccess)
          } else if (formType === 'confirm') {
            await EmployeeApi.confirmEmployeeEntry(submitData as API.HrmEmployeeConfirmEntryReqVO)
            message.success('已确认入职')
          } else if (formType === 'rehire') {
            await EmployeeApi.rehireEmployee({
              ...submitData,
              employeeId: values.id
            } as API.HrmEmployeeRehireReqVO)
            message.success('再入职办理成功')
          } else {
            await EmployeeApi.updateEmployee({ ...submitData, id } as API.HrmEmployeeSaveReqVO)
            message.success(textConst.msg.updateSuccess)
          }
          onSuccess()
          return true
        } catch {
          message.error(textConst.msg.saveError)
          return false
        }
      }}
    >
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="candidateId" hidden>
        <Input />
      </Form.Item>
      <EmployeeFormContent formType={formType} fieldVisibleMap={fieldVisibleMap} />
    </ModalForm>
  )
}

export default EmployeeForm
