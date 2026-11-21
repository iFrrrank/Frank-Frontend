import { history } from '@umijs/max'
import React, { useRef, useState } from 'react'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable, ProFormInstance } from '@ant-design/pro-components'
import { Button, message, Modal, Tag } from 'antd'
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons'
import { deleteClue, getCluePage, exportClueExcel, transformClue } from '@/api/crm/clue'
import {
  CLUE_TRANSFER_STATUS,
  CUSTOMER_LEVEL,
  CUSTOMER_SOURCE,
  INDUSTRY_LIST,
  SCENE_TYPE
} from '@/utils/constantsValue'
import { textConst } from '@/locales/zh-CN'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { handleExport } from '@/components/Export'
import { handleDelete } from '@/components/Delete'
import ClueForm from './ClueForm'

// 线索列表：场景页签（我负责的/我参与的/下属负责的）、新增/编辑/删除、转化客户、导出
const ClueList: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const [sceneType, setSceneType] = useState<number>(1)
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [formId, setFormId] = useState<number | undefined>(undefined)

  const handleExportBtnClick = () => {
    // 获取表单当前的值
    const formValues = formRef.current?.getFieldsValue?.() || {}
    handleExport({
      exportApi: exportClueExcel,
      exportParams: { ...formValues },
      fileName: '线索.xlsx'
    })
  }

  // 线索转化为客户
  const handleTransform = (record: API.CrmClueRespVO) => {
    Modal.confirm({
      title: '确认转化',
      content: `确定要将线索「${record.name}」转化为客户吗？`,
      okText: '转化',
      cancelText: '取消',
      onOk: async () => {
        const resp = await transformClue({ id: record.id } as any)
        if (resp.code === 0) {
          message.success('转化成功')
          actionRef.current?.reload()
        } else {
          message.error(resp.msg || '转化失败')
        }
      }
    })
  }

  const columns: ProColumns<API.CrmClueRespVO>[] = [
    {
      title: '线索名称',
      dataIndex: 'name',
      align: 'center',
      fieldProps: {
        placeholder: '请输入线索名称'
      },
      render: (_, record) => (
        <a onClick={() => history.push('/crm/clue/detail?id=' + record.id)}>{record.name}</a>
      )
    },
    {
      title: '转化状态',
      dataIndex: 'transformStatus',
      valueType: 'select',
      align: 'center',
      hideInTable: true,
      valueEnum: CLUE_TRANSFER_STATUS,
      fieldProps: {
        placeholder: '请选择转化状态'
      }
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      align: 'center',
      hideInTable: true,
      fieldProps: {
        placeholder: '请输入手机号'
      }
    },
    {
      title: '线索来源',
      dataIndex: 'source',
      align: 'center',
      hideInSearch: true,
      valueEnum: CUSTOMER_SOURCE
    },
    {
      title: '手机',
      dataIndex: 'mobile',
      align: 'center',
      hideInSearch: true,
      render: (_, record) => <span>{record.mobile || '-'}</span>
    },
    {
      title: '电话',
      dataIndex: 'telephone',
      align: 'center',
      hideInSearch: true,
      render: (_, record) => <span>{record.telephone || '-'}</span>
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      align: 'center',
      hideInSearch: true,
      render: (_, record) => <span>{record.email || '-'}</span>
    },
    {
      title: '线索等级',
      dataIndex: 'level',
      align: 'center',
      hideInSearch: true,
      valueEnum: CUSTOMER_LEVEL
    },
    {
      title: '所属行业',
      dataIndex: 'industryId',
      align: 'center',
      hideInSearch: true,
      valueEnum: INDUSTRY_LIST
    },
    {
      title: '负责人',
      dataIndex: 'ownerUserName',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '转化状态',
      dataIndex: 'transformStatus',
      align: 'center',
      hideInSearch: true,
      render: (_, record) =>
        record.transformStatus ? <Tag color="green">已转化</Tag> : <Tag>未转化</Tag>
    },
    {
      title: '最后跟进时间',
      dataIndex: 'contactLastTime',
      valueType: 'dateTime',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 170,
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a
            key="edit"
            onClick={() => {
              setFormId(record.id)
              setFormVisible(true)
            }}
          >
            {textConst.action.update}
          </a>
          {!record.transformStatus && (
            <a key="transform" onClick={() => handleTransform(record)}>
              转化
            </a>
          )}
          <a
            key="delete"
            style={deleteTextStyle}
            onClick={() =>
              handleDelete(record, deleteClue, () => actionRef.current?.reload())
            }
          >
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<API.CrmClueRespVO>
        columns={columns}
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          span: 6
        }}
        form={{ colon: false }}
        options={false}
        scroll={{ x: 'max-content' }}
        toolbar={{
          actions: [
            <Button
              key="add"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setFormId(undefined)
                setFormVisible(true)
              }}
            >
              {textConst.action.create}
            </Button>,
            <Button
              key="export"
              color="volcano"
              variant="outlined"
              icon={<DownloadOutlined />}
              onClick={handleExportBtnClick}
            >
              {textConst.action.export}
            </Button>
          ],
          menu: {
            type: 'tab',
            activeKey: sceneType.toString(),
            items: Object.entries(SCENE_TYPE).map(([key, value]) => ({
              key: key,
              label: value.text
            })),
            onChange: (key) => {
              setSceneType(Number(key))
              actionRef.current?.reload()
            }
          }
        }}
        request={async (params) => {
          const { current, pageSize, ...rest } = params
          const req = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            sceneType,
            ...rest
          }
          const res = await getCluePage({ pageVO: req } as any)
          return {
            data: res.data?.list || [],
            success: res.code === 0,
            total: res.data?.total || 0
          }
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          align: 'center'
        }}
      />

      <ClueForm
        visible={formVisible}
        setVisible={setFormVisible}
        onSuccess={() => {
          setFormVisible(false)
          setFormId(undefined)
          actionRef.current?.reload()
        }}
        id={formId}
      />
    </>
  )
}

export default ClueList
