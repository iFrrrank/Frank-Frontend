import React from 'react'
import { Form, message } from 'antd'
import {
  ModalForm,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components'
import {
  createRecruitCandidate,
  getRecruitCandidate,
  updateRecruitCandidate
} from '@/api/hrm/recruit/candidate'
import { getRecruitPostSimpleList } from '@/api/hrm/recruit/post'
import { getRecruitChannelSimpleList } from '@/api/hrm/recruit/channel'
import { textConst } from '@/locales/zh-CN'
import { RECRUIT_CANDIDATE_EDUCATION_OPTIONS, SEX_OPTIONS } from '@/utils/constantsValue'

interface CandidateFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const CandidateForm: React.FC<CandidateFormProps> = ({ visible, setVisible, onSuccess, id }) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()

  return (
    <ModalForm
      title={isUpdate ? '修改候选人' : '新增候选人'}
      open={visible}
      onOpenChange={setVisible}
      form={form}
      layout="horizontal"
      grid={true}
      colon={false}
      labelAlign="right"
      width={860}
      rowProps={{ gutter: 24 }}
      colProps={{ span: 12 }}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      modalProps={{
        destroyOnHidden: true,
        onCancel: () => form.resetFields()
      }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getRecruitCandidate({ id })
          return (resp.data || {}) as Record<string, any>
        }
        return { sex: 1 }
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateRecruitCandidate({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createRecruitCandidate(values as any)
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
      <ProFormText
        name="name"
        label="候选人姓名"
        placeholder="请输入候选人姓名"
        rules={[{ required: true, message: '请输入候选人姓名' }]}
      />
      <ProFormText
        name="mobile"
        label="手机号码"
        placeholder="请输入手机号码"
        rules={[{ required: true, message: '请输入手机号码' }]}
      />
      <ProFormRadio.Group
        name="sex"
        label="性别"
        options={SEX_OPTIONS}
        rules={[{ required: true, message: '请选择性别' }]}
      />
      <ProFormDigit
        name="age"
        label="年龄"
        placeholder="请输入年龄"
        fieldProps={{ precision: 0, min: 0, max: 99 }}
      />
      <ProFormText name="email" label="邮箱" placeholder="请输入邮箱" />
      <ProFormSelect
        name="postId"
        label="应聘职位"
        placeholder="请选择应聘职位"
        showSearch
        rules={[{ required: true, message: '请选择应聘职位' }]}
        request={async () => {
          const resp = await getRecruitPostSimpleList()
          return resp.data?.map((item) => ({ label: item.postName, value: item.id })) || []
        }}
      />
      <ProFormDigit
        name="workTime"
        label="工作年限"
        placeholder="请输入工作年限"
        fieldProps={{ precision: 0, min: 0, max: 60, addonAfter: '年' }}
      />
      <ProFormSelect
        name="education"
        label="学历"
        placeholder="请选择学历"
        options={RECRUIT_CANDIDATE_EDUCATION_OPTIONS}
        rules={[{ required: true, message: '请选择学历' }]}
      />
      <ProFormText name="graduateSchool" label="毕业院校" placeholder="请输入毕业院校" />
      <ProFormText name="latestWorkPlace" label="最近工作单位" placeholder="请输入最近工作单位" />
      <ProFormSelect
        name="channelId"
        label="招聘渠道"
        placeholder="请选择招聘渠道"
        showSearch
        request={async () => {
          const resp = await getRecruitChannelSimpleList()
          return resp.data?.map((item) => ({ label: item.name, value: item.id })) || []
        }}
      />
      <ProFormTextArea
        name="remark"
        label="备注"
        placeholder="请输入备注"
        fieldProps={{ rows: 3 }}
        colProps={{ span: 24 }}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
      />
    </ModalForm>
  )
}

export default CandidateForm
