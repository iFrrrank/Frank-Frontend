import React, { useEffect, useState } from 'react'
import { Form, Input, Modal, Switch, message } from 'antd'
import {
  createSalarySlipTemplate,
  getSalarySlipTemplate,
  updateSalarySlipTemplate
} from '@/api/hrm/salary/slipTemplate'
import { getSalaryOptionSimpleList } from '@/api/hrm/salary/option'
import { textConst } from '@/locales/zh-CN'
import SalaryOptionSelect from '../../config/option/components/SalaryOptionSelect'
import SalarySlipTemplateOptionEditor, {
  SlipTemplateOption
} from './SalarySlipTemplateOptionEditor'
import {
  HrmSalaryOptionCategoryCode,
  HrmSalaryOptionCode,
  HrmSalarySlipTemplateOptionType
} from '../../constants'

interface SalarySlipTemplateFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  id?: number
  onSuccess: (id?: number) => void
}

const SalarySlipTemplateForm: React.FC<SalarySlipTemplateFormProps> = ({
  visible,
  setVisible,
  id,
  onSuccess
}) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [salaryOptionAllList, setSalaryOptionAllList] = useState<API.HrmSalaryOptionRespVO[]>([])
  const [selectedCodes, setSelectedCodes] = useState<number[]>([HrmSalaryOptionCode.REAL_PAY])
  const [options, setOptions] = useState<SlipTemplateOption[]>([])

  // 加载全量薪资项数据用于分类归属
  useEffect(() => {
    if (visible) {
      getSalaryOptionSimpleList({}).then((resp) => {
        setSalaryOptionAllList(resp.data || [])
      })
    }
  }, [visible])

  // 初始化数据
  useEffect(() => {
    if (!visible) {
      form.resetFields()
      setOptions([])
      setSelectedCodes([HrmSalaryOptionCode.REAL_PAY])
      return
    }

    if (id) {
      setLoading(true)
      getSalarySlipTemplate({ id })
        .then((resp) => {
          const data = resp.data || {}
          form.setFieldsValue({
            name: data.name,
            hideEmpty: data.hideEmpty ?? false
          })

          const mappedOptions: SlipTemplateOption[] = (data.options || []).map((item) => ({
            ...item,
            type: item.type || 2,
            parentCode:
              item.parentCode === HrmSalaryOptionCategoryCode.ROOT ? undefined : item.parentCode
          }))
          setOptions(mappedOptions)

          const codes = mappedOptions
            .filter((item) => item.type !== HrmSalarySlipTemplateOptionType.CATEGORY)
            .map((item) => item.code)
            .filter((code): code is number => code !== undefined)

          if (!codes.includes(HrmSalaryOptionCode.REAL_PAY)) {
            codes.push(HrmSalaryOptionCode.REAL_PAY)
          }
          setSelectedCodes(codes)
        })
        .finally(() => setLoading(false))
    } else {
      form.setFieldsValue({
        name: '',
        hideEmpty: false
      })
      // 默认包含实发工资
      const defaultOptions: SlipTemplateOption[] = [
        {
          name: '其他',
          type: HrmSalarySlipTemplateOptionType.CATEGORY,
          code: -1,
          parentCode: HrmSalaryOptionCategoryCode.ROOT,
          hidden: false,
          sort: 1
        },
        {
          name: '实发工资',
          type: HrmSalarySlipTemplateOptionType.ITEM,
          code: HrmSalaryOptionCode.REAL_PAY,
          parentCode: -1,
          hidden: false,
          sort: 2
        }
      ]
      setOptions(defaultOptions)
      setSelectedCodes([HrmSalaryOptionCode.REAL_PAY])
    }
  }, [visible, id, form])

  // 薪资项变动同步
  const handleSelectedCodesChange = (codes: number[]) => {
    // 实发工资必须在列表中
    const safeCodes = codes.includes(HrmSalaryOptionCode.REAL_PAY)
      ? codes
      : [...codes, HrmSalaryOptionCode.REAL_PAY]
    setSelectedCodes(safeCodes)

    // 过滤掉已被移除的项
    let nextOptions = options.filter(
      (item) =>
        item.type === HrmSalarySlipTemplateOptionType.CATEGORY ||
        (item.code !== undefined && safeCodes.includes(item.code))
    )

    let nextSort = Math.max(0, ...nextOptions.map((i) => i.sort || 0)) + 1

    safeCodes.forEach((code) => {
      const exists = nextOptions.some(
        (item) => item.type === HrmSalarySlipTemplateOptionType.ITEM && item.code === code
      )
      if (exists) return

      const opt = salaryOptionAllList.find((item) => item.code === code)
      const categoryCode = opt?.parentCode || HrmSalaryOptionCategoryCode.ROOT

      // 确保分类存在
      if (categoryCode && categoryCode !== HrmSalaryOptionCategoryCode.ROOT) {
        const catExists = nextOptions.some(
          (item) =>
            item.type === HrmSalarySlipTemplateOptionType.CATEGORY && item.code === categoryCode
        )
        if (!catExists) {
          const parentOpt = salaryOptionAllList.find((item) => item.code === categoryCode)
          nextOptions.push({
            name: parentOpt?.name || '其他',
            type: HrmSalarySlipTemplateOptionType.CATEGORY,
            code: categoryCode,
            parentCode: HrmSalaryOptionCategoryCode.ROOT,
            hidden: false,
            sort: nextSort++
          })
        }
      }

      nextOptions.push({
        name: opt?.name || '未知薪资项',
        type: HrmSalarySlipTemplateOptionType.ITEM,
        code,
        parentCode: categoryCode === HrmSalaryOptionCategoryCode.ROOT ? undefined : categoryCode,
        hidden: false,
        sort: nextSort++
      })
    })

    setOptions(nextOptions)
  }

  // 规范化明细选项
  const getNormalizedOptions = (): SlipTemplateOption[] => {
    return options.map((item, index) => ({
      ...item,
      sort: index + 1,
      parentCode:
        item.type === HrmSalarySlipTemplateOptionType.CATEGORY
          ? HrmSalaryOptionCategoryCode.ROOT
          : item.parentCode || HrmSalaryOptionCategoryCode.ROOT
    }))
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()

      // 校验选项
      if (!options.length) {
        message.warning('请配置工资条明细')
        return
      }
      const emptyNameOption = options.find((item) => !item.name?.trim())
      if (emptyNameOption) {
        message.warning('工资条明细项名称不能为空')
        return
      }
      const hasRealPay = options.some(
        (item) =>
          item.type === HrmSalarySlipTemplateOptionType.ITEM &&
          item.code === HrmSalaryOptionCode.REAL_PAY
      )
      if (!hasRealPay) {
        message.warning('工资条必须包含【实发工资】项')
        return
      }

      setLoading(true)
      const payload: API.HrmSalarySlipTemplateSaveReqVO = {
        id,
        name: values.name,
        hideEmpty: values.hideEmpty,
        options: getNormalizedOptions() as any
      }

      let templateId = id
      if (isUpdate) {
        await updateSalarySlipTemplate(payload)
        message.success(textConst.msg.updateSuccess)
      } else {
        const resp = await createSalarySlipTemplate(payload)
        templateId = resp.data
        message.success(textConst.msg.createSuccess)
      }

      setVisible(false)
      onSuccess(templateId)
    } catch {
      // Form error
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={isUpdate ? '修改工资条模板' : '新增工资条模板'}
      open={visible}
      onOk={handleOk}
      onCancel={() => setVisible(false)}
      confirmLoading={loading}
      width={1000}
      destroyOnClose
    >
      <Form form={form} layout="horizontal" labelCol={{ span: 3 }}>
        <Form.Item
          label="模板名称"
          name="name"
          rules={[{ required: true, message: '请输入模板名称' }]}
        >
          <Input placeholder="请输入模板名称" maxLength={64} />
        </Form.Item>

        <Form.Item label="隐藏空项" name="hideEmpty" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item label="工资项">
          <SalaryOptionSelect
            value={selectedCodes}
            onChange={handleSelectedCodesChange}
            disabledCodes={[HrmSalaryOptionCode.REAL_PAY]}
            placeholder="请选择工资条项目"
          />
        </Form.Item>

        <Form.Item label="模板明细">
          <SalarySlipTemplateOptionEditor
            value={options}
            onChange={(next) => {
              setOptions(next)
              // 同步 selectedCodes
              const codes = next
                .filter((item) => item.type !== HrmSalarySlipTemplateOptionType.CATEGORY)
                .map((item) => item.code)
                .filter((code): code is number => code !== undefined)
              setSelectedCodes(codes)
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default SalarySlipTemplateForm
