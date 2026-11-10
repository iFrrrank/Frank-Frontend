import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space
} from 'antd'
import { fmsVoucherWordGetVoucherWordSimpleList } from '@/api/fms/config/voucherWord'
import FmsPrintPreview, {
  type FmsPrintPreviewRef
} from '../../components/print/FmsPrintPreview'
import { type FmsVoucherPrintLayoutType } from '../../utils/constants'
import {
  FMS_VOUCHER_PRINT_LAYOUT_PRESETS,
  buildVoucherPrintHtml,
  createDefaultVoucherPrintConfig,
  getVoucherPrintLayoutPreset,
  type FmsVoucherPrintConfig
} from './print'

export interface FmsVoucherPrintFormRef {
  open: (
    accountSetId: number,
    companyName: string,
    vouchers: API.FmsVoucherRespVO[]
  ) => void
  previewHtml: (html: string, title?: string) => void
}

/**
 * 凭证打印设置弹窗组件
 */
const FmsVoucherPrintForm = forwardRef<FmsVoucherPrintFormRef>((_, ref) => {
  const [visible, setVisible] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [vouchers, setVouchers] = useState<API.FmsVoucherRespVO[]>([])
  const [wordPrintTitleMap, setWordPrintTitleMap] = useState<Map<number, string>>(
    new Map()
  )
  const [config, setConfig] = useState<FmsVoucherPrintConfig>(
    createDefaultVoucherPrintConfig()
  )
  const printPreviewRef = useRef<FmsPrintPreviewRef>(null)

  useImperativeHandle(ref, () => ({
    open: async (accountSetId, currentCompanyName, voucherList) => {
      setCompanyName(currentCompanyName)
      setVouchers(voucherList)
      setVisible(true)
      const resp = await fmsVoucherWordGetVoucherWordSimpleList({ accountSetId })
      if (resp.code === 0) {
        setWordPrintTitleMap(
          new Map(
            (resp.data || []).map(
              (item) => [item.id, item.printTitle || ''] as [number, string]
            )
          )
        )
      }
    },
    previewHtml: (html: string, title = '打印预览') => {
      printPreviewRef.current?.printHtml(html, title)
    }
  }))

  const handleLayoutChange = (layout: FmsVoucherPrintLayoutType) => {
    const preset = getVoucherPrintLayoutPreset(layout)
    setConfig((prev) => ({
      ...prev,
      layout,
      printRowCount: preset.defaultRowCount
    }))
  }

  const handleConfirm = () => {
    const html = buildVoucherPrintHtml(
      companyName,
      vouchers,
      wordPrintTitleMap,
      config
    )
    setVisible(false)
    printPreviewRef.current?.printHtml(html, '凭证打印预览')
  }

  return (
    <>
      <Modal
        title="打印设置"
        open={visible}
        onCancel={() => setVisible(false)}
        width={620}
        destroyOnHidden
        footer={
          <Space>
            <Button onClick={() => setVisible(false)}>取消</Button>
            <Button type="primary" onClick={handleConfirm}>
              确定
            </Button>
          </Space>
        }
      >
        <Form
          labelCol={{ style: { width: 100 } }}
          colon={false}
          style={{ marginTop: 16 }}
        >
          <Form.Item label="选择版式">
            <Select
              value={config.layout}
              style={{ width: '100%' }}
              options={FMS_VOUCHER_PRINT_LAYOUT_PRESETS.map((item) => ({
                label: item.label,
                value: item.value
              }))}
              onChange={handleLayoutChange}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="打印行数">
                <Space>
                  <InputNumber
                    value={config.printRowCount}
                    min={5}
                    max={20}
                    controls={false}
                    style={{ width: 110 }}
                    onChange={(val) =>
                      setConfig((prev) => ({
                        ...prev,
                        printRowCount: Number(val || 5)
                      }))
                    }
                  />
                  <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
                    (5-20)
                  </span>
                </Space>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="字体大小">
                <Space>
                  <InputNumber
                    value={config.fontSize}
                    min={5}
                    max={20}
                    controls={false}
                    style={{ width: 110 }}
                    onChange={(val) =>
                      setConfig((prev) => ({
                        ...prev,
                        fontSize: Number(val || 9)
                      }))
                    }
                  />
                  <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
                    (5-20)
                  </span>
                </Space>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="上边距">
                <Space>
                  <InputNumber
                    value={config.topMargin}
                    min={0}
                    max={80}
                    controls={false}
                    style={{ width: 110 }}
                    onChange={(val) =>
                      setConfig((prev) => ({
                        ...prev,
                        topMargin: Number(val || 0)
                      }))
                    }
                  />
                  <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
                    毫米
                  </span>
                </Space>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="左边距">
                <Space>
                  <InputNumber
                    value={config.leftMargin}
                    min={0}
                    max={80}
                    controls={false}
                    style={{ width: 110 }}
                    onChange={(val) =>
                      setConfig((prev) => ({
                        ...prev,
                        leftMargin: Number(val || 0)
                      }))
                    }
                  />
                  <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
                    毫米
                  </span>
                </Space>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="打印选项">
            <Space size={24}>
              <Checkbox
                checked={config.printAuxiliary}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    printAuxiliary: e.target.checked
                  }))
                }
              >
                打印辅助核算项
              </Checkbox>
              <Checkbox
                checked={config.printQuantityAndPrice}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    printQuantityAndPrice: e.target.checked
                  }))
                }
              >
                打印数量/单价
              </Checkbox>
            </Space>
          </Form.Item>

          <Form.Item label="制单人">
            <Space>
              <Checkbox
                checked={config.showCreator}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    showCreator: e.target.checked
                  }))
                }
              >
                显示制单人
              </Checkbox>
              <Checkbox
                checked={config.customCreator}
                disabled={!config.showCreator}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    customCreator: e.target.checked
                  }))
                }
              >
                自定义
              </Checkbox>
              {config.showCreator && config.customCreator && (
                <Input
                  value={config.creatorName}
                  placeholder="请输入制单人"
                  style={{ width: 160 }}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      creatorName: e.target.value
                    }))
                  }
                />
              )}
            </Space>
          </Form.Item>

          <Form.Item label="审核人">
            <Space>
              <Checkbox
                checked={config.showReviewer}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    showReviewer: e.target.checked
                  }))
                }
              >
                显示审核人
              </Checkbox>
              <Checkbox
                checked={config.customReviewer}
                disabled={!config.showReviewer}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    customReviewer: e.target.checked
                  }))
                }
              >
                自定义
              </Checkbox>
              {config.showReviewer && config.customReviewer && (
                <Input
                  value={config.reviewerName}
                  placeholder="请输入审核人"
                  style={{ width: 160 }}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      reviewerName: e.target.value
                    }))
                  }
                />
              )}
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <FmsPrintPreview ref={printPreviewRef} />
    </>
  )
})

FmsVoucherPrintForm.displayName = 'FmsVoucherPrintForm'

export default FmsVoucherPrintForm
