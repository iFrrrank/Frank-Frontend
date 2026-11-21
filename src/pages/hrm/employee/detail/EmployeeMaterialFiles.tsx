import React, { useEffect, useState } from 'react'
import { Button, Card, List, message, Modal, Space, Upload } from 'antd'
import { FolderOpenOutlined, UploadOutlined } from '@ant-design/icons'
import { getEmployeeFileList, saveEmployeeFiles } from '@/api/hrm/employee/file'
import { getAccessToken } from '@/utils/auth'
import { textConst } from '@/locales/zh-CN'

interface EmployeeMaterialFilesProps {
  employeeId: number
}

// 材料附件分类（与后端附件类型枚举一致）
const FILE_GROUPS: { label: string; options: { label: string; value: number }[] }[] = [
  {
    label: '员工基本资料',
    options: [
      { label: '身份证原件照片', value: 11 },
      { label: '学历证明', value: 12 },
      { label: '个人证件照', value: 13 },
      { label: '身份证复印件', value: 14 },
      { label: '工资银行卡', value: 15 },
      { label: '社保卡', value: 16 },
      { label: '公积金卡', value: 17 },
      { label: '获奖证书', value: 18 },
      { label: '其他', value: 19 }
    ]
  },
  {
    label: '员工档案资料',
    options: [
      { label: '劳动合同', value: 21 },
      { label: '入职简历', value: 22 },
      { label: '入职登记表', value: 23 },
      { label: '入职体检单', value: 24 },
      { label: '上家公司离职证明', value: 25 },
      { label: '转正申请表', value: 26 },
      { label: '其他', value: 27 }
    ]
  },
  {
    label: '员工离职资料',
    options: [
      { label: '离职审批', value: 31 },
      { label: '离职证明', value: 32 },
      { label: '其他', value: 33 }
    ]
  }
]

const fileName = (url: string) => url.split('/').pop() || url

// 材料附件：按分类维护文件地址列表，上传走 infra 文件服务
const EmployeeMaterialFiles: React.FC<EmployeeMaterialFilesProps> = ({ employeeId }) => {
  const [files, setFiles] = useState<API.HrmEmployeeFileRespVO[]>([])
  const [dialogType, setDialogType] = useState<{ label: string; value: number }>()
  const [dialogUrls, setDialogUrls] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const resp = await getEmployeeFileList({ employeeId } as any)
    if (resp.code === 0) {
      setFiles(resp.data || [])
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId])

  const urlsOf = (type: number) => files.filter((f) => f.type === type).map((f) => f.url)

  const handleSave = async () => {
    if (!dialogType) return
    setSaving(true)
    try {
      await saveEmployeeFiles({ employeeId, type: dialogType.value, fileUrls: dialogUrls } as any)
      message.success(textConst.msg.updateSuccess)
      setDialogType(undefined)
      load()
    } catch {
      message.error(textConst.error.operationFail)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {FILE_GROUPS.map((group) => (
        <Card title={group.label} key={group.label} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {group.options.map((option) => (
              <Button
                key={option.value}
                style={{ height: 72, width: 180 }}
                onClick={() => {
                  setDialogType(option)
                  setDialogUrls(urlsOf(option.value))
                }}
              >
                <Space direction="vertical" size={2}>
                  <FolderOpenOutlined style={{ fontSize: 22 }} />
                  <span>
                    {option.label}（{urlsOf(option.value).length}）
                  </span>
                </Space>
              </Button>
            ))}
          </div>
        </Card>
      ))}

      <Modal
        title={dialogType?.label}
        open={!!dialogType}
        onCancel={() => setDialogType(undefined)}
        onOk={handleSave}
        confirmLoading={saving}
        width={620}
        destroyOnHidden
      >
        <Upload
          action="http://localhost:9001/admin-api/infra/file/upload"
          headers={{ Authorization: `Bearer ${getAccessToken()}` }}
          accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.xls,.xlsx"
          showUploadList={false}
          onChange={(info) => {
            if (info.file.status === 'done') {
              const url = (info.file.response as any)?.data
              if (url) {
                setDialogUrls((prev) => [...prev, url])
                message.success('上传成功')
              }
            } else if (info.file.status === 'error') {
              message.error('上传失败')
            }
          }}
        >
          <Button icon={<UploadOutlined />}>上传文件</Button>
        </Upload>
        <List
          style={{ marginTop: 12 }}
          size="small"
          bordered
          dataSource={dialogUrls}
          locale={{ emptyText: '暂无附件' }}
          renderItem={(url) => (
            <List.Item
              actions={[
                <a
                  key="del"
                  onClick={() => setDialogUrls((prev) => prev.filter((u) => u !== url))}
                >
                  删除
                </a>
              ]}
            >
              <a href={url} target="_blank" rel="noreferrer">
                {fileName(url)}
              </a>
            </List.Item>
          )}
        />
      </Modal>
    </>
  )
}

export default EmployeeMaterialFiles
