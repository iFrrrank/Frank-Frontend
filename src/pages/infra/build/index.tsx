import React, { useState } from 'react'
import {
  Button,
  Card,
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
  Space,
  Switch
} from 'antd'
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined
} from '@ant-design/icons'

// 表单构建器示例：左侧组件库点击添加，中间画布排序，右侧编辑字段属性，可预览与导出规则 JSON
interface BuildField {
  id: string
  type: string
  label: string
  field: string
  required?: boolean
  placeholder?: string
  options?: { label: string; value: string }[]
}

const PALETTE: { type: string; label: string }[] = [
  { type: 'input', label: '单行文本' },
  { type: 'textarea', label: '多行文本' },
  { type: 'number', label: '数字输入' },
  { type: 'select', label: '下拉选择' },
  { type: 'radio', label: '单选框组' },
  { type: 'checkbox', label: '复选框组' },
  { type: 'date', label: '日期选择' },
  { type: 'switch', label: '开关' }
]

const HAS_OPTIONS = ['select', 'radio', 'checkbox']

const renderControl = (field: BuildField) => {
  switch (field.type) {
    case 'textarea':
      return <Input.TextArea rows={3} placeholder={field.placeholder} />
    case 'number':
      return <InputNumber style={{ width: '100%' }} placeholder={field.placeholder} />
    case 'select':
      return <Select options={field.options} placeholder={field.placeholder} />
    case 'radio':
      return <Radio.Group options={field.options} />
    case 'checkbox':
      return <Checkbox.Group options={field.options} />
    case 'date':
      return <DatePicker style={{ width: '100%' }} />
    case 'switch':
      return <Switch />
    default:
      return <Input placeholder={field.placeholder} />
  }
}

const FormBuild: React.FC = () => {
  const [fields, setFields] = useState<BuildField[]>([])
  const [selectedId, setSelectedId] = useState<string>()
  const [previewVisible, setPreviewVisible] = useState(false)
  const [jsonVisible, setJsonVisible] = useState(false)

  const selected = fields.find((f) => f.id === selectedId)

  const addField = (type: string) => {
    const id = `field_${Date.now()}`
    const label = PALETTE.find((p) => p.type === type)?.label || '字段'
    const field: BuildField = {
      id,
      type,
      label,
      field: `field${fields.length + 1}`,
      placeholder: `请输入${label}`,
      options: HAS_OPTIONS.includes(type)
        ? [
            { label: '选项一', value: '1' },
            { label: '选项二', value: '2' }
          ]
        : undefined
    }
    setFields([...fields, field])
    setSelectedId(id)
  }

  const updateSelected = (patch: Partial<BuildField>) => {
    if (!selected) return
    setFields(fields.map((f) => (f.id === selected.id ? { ...f, ...patch } : f)))
  }

  const move = (index: number, offset: number) => {
    const target = index + offset
    if (target < 0 || target >= fields.length) return
    const next = [...fields]
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
    setFields(next)
  }

  // 导出规则：与主流表单设计器的 rule 结构对齐（type/field/title/props）
  const rules = fields.map((f) => ({
    type: f.type,
    field: f.field,
    title: f.label,
    props: {
      placeholder: f.placeholder,
      options: f.options
    },
    validate: f.required ? [{ required: true, message: `${f.label}不能为空` }] : []
  }))

  return (
    <Card
      title="表单构建"
      extra={
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => setPreviewVisible(true)}>
            预览
          </Button>
          <Button onClick={() => setJsonVisible(true)}>查看 JSON</Button>
          <Button
            danger
            onClick={() => {
              setFields([])
              setSelectedId(undefined)
            }}
          >
            清空
          </Button>
        </Space>
      }
    >
      <Row gutter={16}>
        <Col span={5}>
          <Card size="small" title="组件库">
            <Space direction="vertical" style={{ width: '100%' }}>
              {PALETTE.map((item) => (
                <Button
                  key={item.type}
                  block
                  icon={<PlusOutlined />}
                  onClick={() => addField(item.type)}
                >
                  {item.label}
                </Button>
              ))}
            </Space>
          </Card>
        </Col>
        <Col span={11}>
          <Card size="small" title="设计区">
            {fields.length === 0 ? (
              <div style={{ color: '#8c8c8c', textAlign: 'center', padding: 32 }}>
                从左侧组件库添加字段
              </div>
            ) : (
              <Form layout="horizontal" labelCol={{ span: 5 }} wrapperCol={{ span: 17 }}>
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    onClick={() => setSelectedId(field.id)}
                    style={{
                      padding: '8px 8px 0',
                      border: selectedId === field.id ? '1px solid #1677ff' : '1px dashed #d9d9d9',
                      borderRadius: 6,
                      marginBottom: 8,
                      position: 'relative'
                    }}
                  >
                    <Form.Item label={field.label} required={field.required}>
                      {renderControl(field)}
                    </Form.Item>
                    {selectedId === field.id && (
                      <Space style={{ position: 'absolute', right: 6, top: 6 }}>
                        <Button
                          size="small"
                          type="text"
                          icon={<ArrowUpOutlined />}
                          onClick={(e) => {
                            e.stopPropagation()
                            move(index, -1)
                          }}
                        />
                        <Button
                          size="small"
                          type="text"
                          icon={<ArrowDownOutlined />}
                          onClick={(e) => {
                            e.stopPropagation()
                            move(index, 1)
                          }}
                        />
                        <Button
                          size="small"
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={(e) => {
                            e.stopPropagation()
                            setFields(fields.filter((f) => f.id !== field.id))
                            setSelectedId(undefined)
                          }}
                        />
                      </Space>
                    )}
                  </div>
                ))}
              </Form>
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" title="属性设置">
            {selected ? (
              <Form layout="vertical">
                <Form.Item label="标题">
                  <Input
                    value={selected.label}
                    onChange={(e) => updateSelected({ label: e.target.value })}
                  />
                </Form.Item>
                <Form.Item label="字段名">
                  <Input
                    value={selected.field}
                    onChange={(e) => updateSelected({ field: e.target.value })}
                  />
                </Form.Item>
                <Form.Item label="占位提示">
                  <Input
                    value={selected.placeholder}
                    onChange={(e) => updateSelected({ placeholder: e.target.value })}
                  />
                </Form.Item>
                <Form.Item label="必填">
                  <Switch
                    checked={!!selected.required}
                    onChange={(required) => updateSelected({ required })}
                  />
                </Form.Item>
                {HAS_OPTIONS.includes(selected.type) && (
                  <Form.Item label="选项（每行一个，格式：标签=值）">
                    <Input.TextArea
                      rows={4}
                      value={(selected.options || [])
                        .map((o) => `${o.label}=${o.value}`)
                        .join('\n')}
                      onChange={(e) =>
                        updateSelected({
                          options: e.target.value
                            .split('\n')
                            .filter((line) => line.trim())
                            .map((line) => {
                              const [label, value] = line.split('=')
                              return { label: label.trim(), value: (value || label).trim() }
                            })
                        })
                      }
                    />
                  </Form.Item>
                )}
              </Form>
            ) : (
              <div style={{ color: '#8c8c8c' }}>请选择设计区中的字段</div>
            )}
          </Card>
        </Col>
      </Row>

      <Modal
        title="表单预览"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={560}
        destroyOnHidden
      >
        <Form layout="horizontal" labelCol={{ span: 5 }} wrapperCol={{ span: 17 }}>
          {fields.map((field) => (
            <Form.Item key={field.id} label={field.label} required={field.required}>
              {renderControl(field)}
            </Form.Item>
          ))}
        </Form>
      </Modal>

      <Modal
        title="表单规则 JSON"
        open={jsonVisible}
        onCancel={() => setJsonVisible(false)}
        footer={null}
        width={640}
        destroyOnHidden
      >
        <pre style={{ background: '#f6f8fa', padding: 12, overflow: 'auto', maxHeight: 480 }}>
          {JSON.stringify(rules, null, 2)}
        </pre>
      </Modal>
    </Card>
  )
}

export default FormBuild
