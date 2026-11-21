import React from 'react'
import { Form, message } from 'antd'
import {
  ModalForm,
  ProFormDatePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormTreeSelect
} from '@ant-design/pro-components'
import dayjs from 'dayjs'
import {
  createPerformanceConfig,
  getPerformanceConfig,
  updatePerformanceConfig
} from '@/api/crm/performanceConfig'
import { getSimpleDeptList } from '@/api/system/dept'
import { getSimpleUserList } from '@/api/system/user'
import { buildTreeData } from '@/utils/tree'
import { textConst } from '@/locales/zh-CN'

interface PerformanceConfigFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

// 对象类型：2 部门，3 员工
export const OBJECT_TYPE_OPTIONS = [
  { label: '部门', value: 2 },
  { label: '员工', value: 3 }
]

// 业绩业务类型：1 合同金额，2 回款金额
export const BIZ_TYPE_OPTIONS = [
  { label: '合同金额', value: 1 },
  { label: '回款金额', value: 2 }
]

const MONTHS: { name: string; label: string }[] = [
  { name: 'januaryTargetPrice', label: '一月' },
  { name: 'februaryTargetPrice', label: '二月' },
  { name: 'marchTargetPrice', label: '三月' },
  { name: 'aprilTargetPrice', label: '四月' },
  { name: 'mayTargetPrice', label: '五月' },
  { name: 'juneTargetPrice', label: '六月' },
  { name: 'julyTargetPrice', label: '七月' },
  { name: 'augustTargetPrice', label: '八月' },
  { name: 'septemberTargetPrice', label: '九月' },
  { name: 'octoberTargetPrice', label: '十月' },
  { name: 'novemberTargetPrice', label: '十一月' },
  { name: 'decemberTargetPrice', label: '十二月' }
]

// 业绩目标配置表单：按部门或员工、按年设置逐月目标金额
const PerformanceConfigForm: React.FC<PerformanceConfigFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  id
}) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()

  return (
    <ModalForm
      title={isUpdate ? '编辑业绩目标' : '新增业绩目标'}
      open={visible}
      colon={false}
      onOpenChange={(val) => {
        setVisible(val)
        if (!val) {
          form.resetFields()
        }
      }}
      form={form}
      layout="horizontal"
      grid={true}
      rowProps={{ gutter: 24 }}
      labelAlign="right"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      width={760}
      request={async () => {
        if (id !== undefined) {
          const resp = await getPerformanceConfig({ id })
          const data = resp.data as any
          // 年份以日期控件承载（仅取年份）
          return { ...data, yearDate: data?.year ? dayjs(String(data.year)) : undefined }
        }
        return { objectType: 3, bizType: 1, yearDate: dayjs() }
      }}
      onFinish={async (values) => {
        const submitData = {
          ...values,
          year: values.yearDate ? dayjs(values.yearDate).year() : dayjs().year(),
          yearDate: undefined
        }
        try {
          if (isUpdate) {
            await updatePerformanceConfig({ id, ...submitData } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createPerformanceConfig(submitData as any)
            message.success(textConst.msg.createSuccess)
          }
          onSuccess()
          return true
        } catch {
          message.error(textConst.error.operationFail)
          return false
        }
      }}
    >
      <ProFormRadio.Group
        name="objectType"
        label="目标对象"
        rules={[{ required: true, message: '请选择目标对象' }]}
        options={OBJECT_TYPE_OPTIONS}
        colProps={{ span: 12 }}
      />
      <ProFormDependency name={['objectType']}>
        {({ objectType }) =>
          objectType === 2 ? (
            <ProFormTreeSelect
              name="objectId"
              label="部门"
              rules={[{ required: true, message: '请选择部门' }]}
              placeholder="请选择部门"
              colProps={{ span: 12 }}
              request={async () => {
                const resp = await getSimpleDeptList()
                return buildTreeData((resp.data as any[]) || []) as any
              }}
            />
          ) : (
            <ProFormSelect
              name="objectId"
              label="员工"
              rules={[{ required: true, message: '请选择员工' }]}
              placeholder="请选择员工"
              colProps={{ span: 12 }}
              request={async () => {
                const resp = await getSimpleUserList()
                return (
                  (resp.data as any[])?.map((item: any) => ({
                    label: item.nickname,
                    value: item.id
                  })) || []
                )
              }}
            />
          )
        }
      </ProFormDependency>
      <ProFormDatePicker.Year
        name="yearDate"
        label="年份"
        rules={[{ required: true, message: '请选择年份' }]}
        colProps={{ span: 12 }}
        fieldProps={{ style: { width: '100%' } }}
      />
      <ProFormRadio.Group
        name="bizType"
        label="业绩类型"
        rules={[{ required: true, message: '请选择业绩类型' }]}
        options={BIZ_TYPE_OPTIONS}
        colProps={{ span: 12 }}
      />
      {/* 逐月目标金额（元） */}
      {MONTHS.map((month) => (
        <ProFormDigit
          key={month.name}
          name={month.name}
          label={`${month.label}目标`}
          placeholder="请输入目标金额"
          colProps={{ span: 8 }}
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
          fieldProps={{ precision: 2, min: 0 }}
        />
      ))}
    </ModalForm>
  )
}

export default PerformanceConfigForm
