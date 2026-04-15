import React, { useRef, useState } from 'react'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Button } from 'antd'
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons'
import { getCluePage } from '@/api/crm/clue'
import { CLUE_TRANSFER_STATUS, SCENE_TYPE } from '@/utils/constantsValue'
import { textConst } from '@/locales/zh-CN'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'

const ClueList: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [sceneType, setSceneType] = useState<number>(1)

  const columns: ProColumns<API.CrmClueRespVO>[] = [
    {
      title: '线索名称',
      dataIndex: 'name',
      align: 'center',
      fieldProps: {
        placeholder: '请输入线索名称'
      }
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
      title: '电话',
      dataIndex: 'telephone',
      align: 'center',
      fieldProps: {
        placeholder: '请输入电话'
      }
    },
    {
      title: '线索来源',
      dataIndex: 'source',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '手机',
      dataIndex: 'mobile',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '地址',
      dataIndex: 'detailAddress',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '客户行业',
      dataIndex: 'industryId',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '客户级别',
      dataIndex: 'level',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '下次联系时间',
      dataIndex: 'contactNextTime',
      valueType: 'dateTime',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '最后跟进时间',
      dataIndex: 'contactLastTime',
      valueType: 'dateTime',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 120,
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a key="edit">{textConst.action.update}</a>
          <a key="delete" style={deleteTextStyle}>
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <ProTable<API.CrmClueRespVO>
      columns={columns}
      actionRef={actionRef}
      rowKey="id"
      search={{
        labelWidth: 'auto',
        span: 6
      }}
      form={{ colon: false }}
      options={false}
      toolbar={{
        actions: [
          <Button key="add" type="primary" icon={<PlusOutlined />}>
            {textConst.action.create}
          </Button>,
          <Button key="export" color="volcano" variant="outlined" icon={<DownloadOutlined />}>
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
        const res = await getCluePage({ pageVO: req })
        return {
          data: res.data?.list || [],
          success: res.code === 0,
          total: res.data?.total || 0
        }
      }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true
      }}
    />
  )
}

export default ClueList
