import React, { useEffect, useState } from 'react'
import {
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  TreeSelect,
  message
} from 'antd'
import type { TreeDataNode } from 'antd'
import dayjs from 'dayjs'
import { createRecruitPost, getRecruitPost, updateRecruitPost } from '@/api/hrm/recruit/post'
import { getRecruitPostTypeList } from '@/api/hrm/recruit/postType'
import { CommonStatusEnum } from '@/utils/constants'
import {
  HrmEmployeeEntryStatusEnum,
  HrmRecruitEmergencyLevelEnum,
  HrmRecruitJobNatureEnum,
  HrmRecruitPostEducationEnum,
  HrmRecruitSalaryUnitEnum,
  HrmRecruitWorkTimeEnum,
  RECRUIT_AGE_UNLIMITED_VALUE,
  RECRUIT_SALARY_NEGOTIABLE_UNIT_VALUE,
  RECRUIT_SALARY_NEGOTIABLE_VALUE
} from '@/utils/constants'
import {
  RECRUIT_EMERGENCY_LEVEL_OPTIONS,
  RECRUIT_JOB_NATURE_OPTIONS,
  RECRUIT_POST_EDUCATION_OPTIONS,
  RECRUIT_SALARY_UNIT_OPTIONS,
  RECRUIT_WORK_TIME_OPTIONS
} from '@/utils/constantsValue'
import { textConst } from '@/locales/zh-CN'
import AreaSelect from '@/pages/hrm/insurance/components/AreaSelect'
import DeptSelect from '@/pages/hrm/employee/components/DeptSelect'
import HrmEmployeeSelect from '@/pages/hrm/employee/components/HrmEmployeeSelect'

interface RecruitPostFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  id?: number
  onSuccess: () => void
}

/** 构建职位类型树结构 */
const buildTreeNodes = (nodes: API.HrmRecruitPostTypeRespVO[]): TreeDataNode[] => {
  const map = new Map<number, any>()
  const roots: any[] = []

  nodes.forEach((item) => {
    map.set(item.id!, {
      key: item.id,
      value: item.id,
      title: item.name,
      children: []
    })
  })

  nodes.forEach((item) => {
    const parentId = item.parentId
    const current = map.get(item.id!)
    if (parentId && map.has(parentId)) {
      map.get(parentId).children.push(current)
    } else {
      roots.push(current)
    }
  })

  const cleanEmptyChildren = (list: any[]) => {
    list.forEach((node) => {
      if (node.children?.length) {
        cleanEmptyChildren(node.children)
      } else {
        delete node.children
      }
    })
  }
  cleanEmptyChildren(roots)
  return roots
}

const RecruitPostForm: React.FC<RecruitPostFormProps> = ({
  visible,
  setVisible,
  id,
  onSuccess
}) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [salaryNegotiable, setSalaryNegotiable] = useState(false)
  const [ageUnlimited, setAgeUnlimited] = useState(false)
  const [postTypeTree, setPostTypeTree] = useState<TreeDataNode[]>([])

  // 加载职位类型树
  useEffect(() => {
    if (visible) {
      getRecruitPostTypeList({ status: CommonStatusEnum.ENABLE.status })
        .then((resp) => {
          setPostTypeTree(buildTreeNodes(resp.data || []))
        })
        .catch(() => setPostTypeTree([]))
    }
  }, [visible])

  // 打开弹窗初始化数据
  useEffect(() => {
    if (!visible) {
      form.resetFields()
      setSalaryNegotiable(false)
      setAgeUnlimited(false)
      return
    }

    if (id) {
      setLoading(true)
      getRecruitPost({ id })
        .then((resp) => {
          const data = resp.data || {}
          const isNegotiable =
            data.salaryUnit === RECRUIT_SALARY_NEGOTIABLE_UNIT_VALUE ||
            (data.minSalary === RECRUIT_SALARY_NEGOTIABLE_VALUE &&
              data.maxSalary === RECRUIT_SALARY_NEGOTIABLE_VALUE)
          const isAgeUnlimit =
            data.minAge === RECRUIT_AGE_UNLIMITED_VALUE &&
            data.maxAge === RECRUIT_AGE_UNLIMITED_VALUE

          setSalaryNegotiable(isNegotiable)
          setAgeUnlimited(isAgeUnlimit)

          form.setFieldsValue({
            ...data,
            minSalary: isNegotiable ? undefined : data.minSalary,
            maxSalary: isNegotiable ? undefined : data.maxSalary,
            salaryUnit: isNegotiable
              ? HrmRecruitSalaryUnitEnum.MONTH.salaryUnit
              : data.salaryUnit || HrmRecruitSalaryUnitEnum.MONTH.salaryUnit,
            minAge: isAgeUnlimit ? undefined : data.minAge,
            maxAge: isAgeUnlimit ? undefined : data.maxAge,
            latestEntryTime: data.latestEntryTime ? dayjs(data.latestEntryTime) : undefined,
            interviewEmployeeIds: data.interviewEmployeeIds || []
          })
        })
        .finally(() => setLoading(false))
    } else {
      setSalaryNegotiable(false)
      setAgeUnlimited(false)
      form.setFieldsValue({
        jobNature: HrmRecruitJobNatureEnum.FULL_TIME.jobNature,
        workTime: HrmRecruitWorkTimeEnum.UNLIMITED.workTime,
        educationRequire: HrmRecruitPostEducationEnum.UNLIMITED.educationRequire,
        salaryUnit: HrmRecruitSalaryUnitEnum.MONTH.salaryUnit,
        emergencyLevel: HrmRecruitEmergencyLevelEnum.URGENT.emergencyLevel,
        interviewEmployeeIds: []
      })
    }
  }, [visible, id, form])

  const handleSalaryNegotiableChange = (checked: boolean) => {
    setSalaryNegotiable(checked)
    if (checked) {
      form.setFieldsValue({ minSalary: undefined, maxSalary: undefined })
    }
  }

  const handleAgeUnlimitedChange = (checked: boolean) => {
    setAgeUnlimited(checked)
    if (checked) {
      form.setFieldsValue({ minAge: undefined, maxAge: undefined })
    }
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const payload: API.HrmRecruitPostSaveReqVO = {
        ...values,
        id,
        minSalary: salaryNegotiable ? RECRUIT_SALARY_NEGOTIABLE_VALUE : values.minSalary,
        maxSalary: salaryNegotiable ? RECRUIT_SALARY_NEGOTIABLE_VALUE : values.maxSalary,
        salaryUnit: salaryNegotiable ? RECRUIT_SALARY_NEGOTIABLE_UNIT_VALUE : values.salaryUnit,
        minAge: ageUnlimited ? RECRUIT_AGE_UNLIMITED_VALUE : values.minAge,
        maxAge: ageUnlimited ? RECRUIT_AGE_UNLIMITED_VALUE : values.maxAge,
        latestEntryTime: values.latestEntryTime
          ? dayjs(values.latestEntryTime).valueOf()
          : undefined
      }

      if (isUpdate) {
        await updateRecruitPost(payload)
        message.success(textConst.msg.updateSuccess)
      } else {
        await createRecruitPost(payload)
        message.success(textConst.msg.createSuccess)
      }

      setVisible(false)
      onSuccess()
    } catch {
      // Form validation failed or API failed
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={isUpdate ? '修改招聘职位' : '新增招聘职位'}
      open={visible}
      onCancel={() => setVisible(false)}
      onOk={handleOk}
      confirmLoading={loading}
      width={960}
      destroyOnClose
      okText={textConst.common.ok}
      cancelText={textConst.common.cancel}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        colon={false}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="postName"
              label="职位名称"
              rules={[{ required: true, message: '请输入职位名称' }]}
            >
              <Input placeholder="请输入职位名称" maxLength={255} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="deptId" label="用人部门">
              <DeptSelect placeholder="请选择用人部门" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="jobNature"
              label="工作性质"
              rules={[{ required: true, message: '请选择工作性质' }]}
            >
              <Select placeholder="请选择工作性质" options={RECRUIT_JOB_NATURE_OPTIONS} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="areaId" label="工作城市">
              <AreaSelect placeholder="请选择工作城市" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="recruitNum" label="招聘人数">
              <InputNumber
                min={0}
                placeholder="请输入招聘人数"
                style={{ width: '100%' }}
                precision={0}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="reason" label="招聘原因">
              <Input placeholder="请输入招聘原因" maxLength={255} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="workTime" label="工作经验">
              <Select placeholder="请选择工作经验" options={RECRUIT_WORK_TIME_OPTIONS} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="educationRequire" label="学历要求">
              <Select placeholder="请选择学历要求" options={RECRUIT_POST_EDUCATION_OPTIONS} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="薪资范围"
              rules={[
                {
                  validator: async () => {
                    if (salaryNegotiable) return Promise.resolve()
                    const min = form.getFieldValue('minSalary')
                    const max = form.getFieldValue('maxSalary')
                    if (min !== undefined && max !== undefined && min > max) {
                      return Promise.reject(new Error('最低薪资不能大于最高薪资'))
                    }
                    return Promise.resolve()
                  }
                }
              ]}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Form.Item name="minSalary" noStyle>
                  <InputNumber
                    min={0}
                    max={99999999.99}
                    precision={2}
                    disabled={salaryNegotiable}
                    placeholder="最低薪资"
                    style={{ flex: 1 }}
                  />
                </Form.Item>
                <span style={{ color: '#8c8c8c' }}>至</span>
                <Form.Item name="maxSalary" noStyle>
                  <InputNumber
                    min={0}
                    max={99999999.99}
                    precision={2}
                    disabled={salaryNegotiable}
                    placeholder="最高薪资"
                    style={{ flex: 1 }}
                  />
                </Form.Item>
                <Form.Item name="salaryUnit" noStyle>
                  <Select
                    disabled={salaryNegotiable}
                    options={RECRUIT_SALARY_UNIT_OPTIONS}
                    style={{ width: 90 }}
                  />
                </Form.Item>
                <Checkbox
                  checked={salaryNegotiable}
                  onChange={(e) => handleSalaryNegotiableChange(e.target.checked)}
                >
                  面议
                </Checkbox>
              </div>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="latestEntryTime" label="最迟到岗时间">
              <DatePicker
                showTime
                placeholder="请选择最迟到岗时间"
                style={{ width: '100%' }}
                format="YYYY-MM-DD HH:mm:ss"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="年龄要求"
              rules={[
                {
                  validator: async () => {
                    if (ageUnlimited) return Promise.resolve()
                    const min = form.getFieldValue('minAge')
                    const max = form.getFieldValue('maxAge')
                    if (min !== undefined && max !== undefined && min > max) {
                      return Promise.reject(new Error('最小年龄不能大于最大年龄'))
                    }
                    return Promise.resolve()
                  }
                }
              ]}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Form.Item name="minAge" noStyle>
                  <InputNumber
                    min={0}
                    max={99}
                    precision={0}
                    disabled={ageUnlimited}
                    placeholder="最小年龄"
                    style={{ flex: 1 }}
                  />
                </Form.Item>
                <span style={{ color: '#8c8c8c' }}>至</span>
                <Form.Item name="maxAge" noStyle>
                  <InputNumber
                    min={0}
                    max={99}
                    precision={0}
                    disabled={ageUnlimited}
                    placeholder="最大年龄"
                    style={{ flex: 1 }}
                  />
                </Form.Item>
                <Checkbox
                  checked={ageUnlimited}
                  onChange={(e) => handleAgeUnlimitedChange(e.target.checked)}
                >
                  不限
                </Checkbox>
              </div>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="emergencyLevel" label="紧急程度">
              <Radio.Group options={RECRUIT_EMERGENCY_LEVEL_OPTIONS} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="ownerEmployeeId" label="招聘负责人">
              <HrmEmployeeSelect
                entryStatus={HrmEmployeeEntryStatusEnum.ACTIVE.entryStatus}
                placeholder="请选择招聘负责人"
                title="选择招聘负责人"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="postTypeId" label="职位类型">
              <TreeSelect
                treeData={postTypeTree}
                placeholder="请选择职位类型"
                allowClear
                treeDefaultExpandAll
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="interviewEmployeeIds" label="面试官">
              <HrmEmployeeSelect
                entryStatus={HrmEmployeeEntryStatusEnum.ACTIVE.entryStatus}
                multiple
                placeholder="请选择面试官"
                title="选择面试官"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="description" label="职位描述">
              <Input.TextArea rows={4} maxLength={4000} showCount placeholder="请输入职位描述" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default RecruitPostForm
