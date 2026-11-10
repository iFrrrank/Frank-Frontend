import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Modal, Tag, message } from 'antd'
import {
  DeleteOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  UploadOutlined
} from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import {
  fmsAuxiliaryItemDeleteAuxiliaryItemList,
  fmsAuxiliaryItemExportAuxiliaryItemExcel,
  fmsAuxiliaryItemGetAuxiliaryItemPage
} from '@/api/fms/config/auxiliaryItem'
import HasPermi, { useHasPermi } from '@/directives/permission/HasPermi'
import { textConst } from '@/locales/zh-CN'
import { deleteTextStyle, tableActionStyle } from '@/styles/common.style'
import { CommonStatusEnum } from '@/utils/constants'
import { COMMON_STATUS_OPTIONS } from '@/utils/constantsValue'
import download from '@/utils/download'
import { useFmsStore } from '../../store/fms'
import { FMS_AUXILIARY_TYPE } from '../../utils/constants'
import FmsAuxiliaryItemForm from './item/FmsAuxiliaryItemForm'
import FmsAuxiliaryItemImportForm from './item/FmsAuxiliaryItemImportForm'

interface FmsAuxiliaryItemPanelProps {
  auxiliaryType?: API.FmsAuxiliaryTypeRespVO
  departmentTypeId?: number
}

/**
 * 辅助核算项目管理面板组件
 */
const FmsAuxiliaryItemPanel: React.FC<FmsAuxiliaryItemPanelProps> = ({
  auxiliaryType,
  departmentTypeId
}) => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const hasPermi = useHasPermi()
  const fmsStore = useFmsStore()

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [formVisible, setFormVisible] = useState(false)
  const [editId, setEditId] = useState<number | undefined>()
  const [importVisible, setImportVisible] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)

  useEffect(() => {
    setSelectedRowKeys([])
    actionRef.current?.reloadAndRest?.()
  }, [fmsStore.accountSetId, auxiliaryType?.id])

  const handleDelete = (row: API.FmsAuxiliaryItemRespVO) => {
    if (!fmsStore.accountSetId || !auxiliaryType) return
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除${auxiliaryType.name} "${row.name}"？`,
      onOk: async () => {
        const resp = await fmsAuxiliaryItemDeleteAuxiliaryItemList({
          accountSetId: fmsStore.accountSetId!,
          ids: [row.id]
        })
        if (resp.code === 0) {
          message.success(textConst.msg.delSuccess)
          actionRef.current?.reload()
        }
      }
    })
  }

  const handleBatchDelete = () => {
    if (!fmsStore.accountSetId || !auxiliaryType || !selectedRowKeys.length) return
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除选中的 ${selectedRowKeys.length} 个${auxiliaryType.name}？`,
      onOk: async () => {
        const resp = await fmsAuxiliaryItemDeleteAuxiliaryItemList({
          accountSetId: fmsStore.accountSetId!,
          ids: selectedRowKeys.map(Number)
        })
        if (resp.code === 0) {
          message.success(textConst.msg.delSuccess)
          setSelectedRowKeys([])
          actionRef.current?.reloadAndRest?.()
        }
      }
    })
  }

  const handleExport = () => {
    if (!fmsStore.accountSetId || !auxiliaryType) return
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined />,
      content: textConst.msg.exportMsg,
      onOk: async () => {
        setExportLoading(true)
        try {
          const values = formRef.current?.getFieldsValue() || {}
          const data = await fmsAuxiliaryItemExportAuxiliaryItemExcel(
            {
              accountSetId: String(fmsStore.accountSetId!),
              auxiliaryTypeId: String(auxiliaryType.id),
              pageNo: '1',
              pageSize: '100',
              ...values
            },
            { responseType: 'blob' }
          )
          download.excel(data, `${auxiliaryType.name}.xls`)
          message.success(textConst.msg.exportSuccess)
        } finally {
          setExportLoading(false)
        }
      }
    })
  }

  const columns = useMemo<ProColumns<API.FmsAuxiliaryItemRespVO>[]>(() => {
    const currentType = auxiliaryType?.type
    const isPartner =
      currentType === FMS_AUXILIARY_TYPE.CUSTOMER || currentType === FMS_AUXILIARY_TYPE.SUPPLIER
    const isEmployee = currentType === FMS_AUXILIARY_TYPE.EMPLOYEE
    const isDepartment = currentType === FMS_AUXILIARY_TYPE.DEPARTMENT
    const isProject = currentType === FMS_AUXILIARY_TYPE.PROJECT
    const isInventory = currentType === FMS_AUXILIARY_TYPE.INVENTORY

    const cols: ProColumns<API.FmsAuxiliaryItemRespVO>[] = [
      {
        title: '编码',
        dataIndex: 'code',
        align: 'center',
        width: 120,
        fieldProps: { placeholder: '请输入编码' }
      },
      {
        title: '名称',
        dataIndex: 'name',
        align: 'center',
        minWidth: 160,
        fieldProps: { placeholder: '请输入名称' }
      }
    ]

    if (isPartner) {
      cols.push(
        {
          title: currentType === FMS_AUXILIARY_TYPE.CUSTOMER ? '客户类别' : '供应商类别',
          dataIndex: 'category',
          align: 'center',
          hideInSearch: true,
          width: 120
        },
        {
          title: '经营地址',
          dataIndex: 'address',
          align: 'center',
          hideInSearch: true,
          minWidth: 180,
          ellipsis: true
        },
        {
          title: '联系人',
          dataIndex: 'contactName',
          align: 'center',
          hideInSearch: true,
          width: 110
        },
        {
          title: '手机',
          dataIndex: 'contactMobile',
          align: 'center',
          hideInSearch: true,
          width: 130
        },
        {
          title: '税号',
          dataIndex: 'taxNo',
          align: 'center',
          hideInSearch: true,
          width: 180
        }
      )
    }

    if (isEmployee) {
      cols.push(
        {
          title: '性别',
          dataIndex: 'sex',
          align: 'center',
          hideInSearch: true,
          width: 80,
          render: (_, record: any) => (record.sex === 1 ? '男' : record.sex === 2 ? '女' : '-')
        },
        {
          title: '部门编码',
          dataIndex: 'departmentCode',
          align: 'center',
          hideInSearch: true,
          width: 110
        },
        {
          title: '部门名称',
          dataIndex: 'departmentName',
          align: 'center',
          hideInSearch: true,
          width: 120
        },
        {
          title: '职务',
          dataIndex: 'jobTitle',
          align: 'center',
          hideInSearch: true,
          width: 120
        },
        {
          title: '手机',
          dataIndex: 'contactMobile',
          align: 'center',
          hideInSearch: true,
          width: 130
        },
        {
          title: '出生日期',
          dataIndex: 'birthDate',
          align: 'center',
          hideInSearch: true,
          width: 120
        },
        {
          title: '入职日期',
          dataIndex: 'entryDate',
          align: 'center',
          hideInSearch: true,
          width: 120
        },
        {
          title: '离职日期',
          dataIndex: 'leaveDate',
          align: 'center',
          hideInSearch: true,
          width: 120
        }
      )
    }

    if (isDepartment) {
      cols.push(
        {
          title: '部门负责人',
          dataIndex: 'managerName',
          align: 'center',
          hideInSearch: true,
          width: 120
        },
        {
          title: '手机',
          dataIndex: 'contactMobile',
          align: 'center',
          hideInSearch: true,
          width: 130
        },
        {
          title: '成立日期',
          dataIndex: 'startDate',
          align: 'center',
          hideInSearch: true,
          width: 120
        },
        {
          title: '撤销日期',
          dataIndex: 'endDate',
          align: 'center',
          hideInSearch: true,
          width: 120
        }
      )
    }

    if (isProject) {
      cols.push(
        {
          title: '负责部门/人',
          dataIndex: 'managerName',
          align: 'center',
          hideInSearch: true,
          width: 130
        },
        {
          title: '手机',
          dataIndex: 'contactMobile',
          align: 'center',
          hideInSearch: true,
          width: 130
        },
        {
          title: '开始日期',
          dataIndex: 'startDate',
          align: 'center',
          hideInSearch: true,
          width: 120
        },
        {
          title: '结束日期',
          dataIndex: 'endDate',
          align: 'center',
          hideInSearch: true,
          width: 120
        }
      )
    }

    if (isInventory) {
      cols.push(
        {
          title: '规格型号',
          dataIndex: 'specification',
          align: 'center',
          hideInSearch: true,
          width: 130
        },
        {
          title: '存货类别',
          dataIndex: 'category',
          align: 'center',
          hideInSearch: true,
          width: 120
        },
        {
          title: '计量单位',
          dataIndex: 'unit',
          align: 'center',
          hideInSearch: true,
          width: 100
        },
        {
          title: '启用日期',
          dataIndex: 'startDate',
          align: 'center',
          hideInSearch: true,
          width: 120
        },
        {
          title: '停用日期',
          dataIndex: 'endDate',
          align: 'center',
          hideInSearch: true,
          width: 120
        }
      )
    }

    cols.push(
      {
        title: '备注',
        dataIndex: 'remark',
        align: 'center',
        hideInSearch: true,
        minWidth: 160,
        ellipsis: true
      },
      {
        title: '状态',
        dataIndex: 'status',
        align: 'center',
        width: 90,
        valueType: 'select',
        fieldProps: {
          options: COMMON_STATUS_OPTIONS,
          placeholder: '请选择状态'
        },
        render: (_, record) => (
          <Tag color={record.status === CommonStatusEnum.ENABLE.status ? 'success' : 'default'}>
            {record.status === CommonStatusEnum.ENABLE.status ? '启用' : '停用'}
          </Tag>
        )
      },
      {
        title: textConst.form.operate,
        valueType: 'option',
        align: 'center',
        fixed: 'right',
        width: 140,
        hideInTable: !fmsStore.isAccountSetWritable,
        render: (_, record) => (
          <div style={tableActionStyle}>
            {hasPermi('fms:config:auxiliary:update') && (
              <a
                onClick={() => {
                  setEditId(record.id)
                  setFormVisible(true)
                }}
              >
                {textConst.action.update}
              </a>
            )}
            {hasPermi('fms:config:auxiliary:delete') && (
              <a style={deleteTextStyle} onClick={() => handleDelete(record)}>
                {textConst.action.delete}
              </a>
            )}
          </div>
        )
      }
    )

    return cols
  }, [auxiliaryType?.type, fmsStore.isAccountSetWritable, hasPermi])

  return (
    <>
      <ProTable<API.FmsAuxiliaryItemRespVO>
        headerTitle={`${auxiliaryType?.name || '辅助核算'}项目列表`}
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        columns={columns}
        scroll={{ x: 'max-content' }}
        cardBordered
        form={{ colon: false }}
        search={{ labelWidth: 'auto', span: 6 }}
        options={false}
        pagination={{ align: 'center', showSizeChanger: true }}
        rowSelection={
          fmsStore.isAccountSetWritable
            ? {
                selectedRowKeys,
                onChange: setSelectedRowKeys
              }
            : false
        }
        request={async (params) => {
          if (!fmsStore.accountSetId || !auxiliaryType?.id) {
            return { data: [], success: true, total: 0 }
          }
          const { current, pageSize, ...rest } = params
          const resp = await fmsAuxiliaryItemGetAuxiliaryItemPage({
            accountSetId: String(fmsStore.accountSetId),
            auxiliaryTypeId: String(auxiliaryType.id),
            pageNo: String(current || 1),
            pageSize: String(pageSize || 10),
            ...rest
          })
          return {
            data: resp.data?.list || [],
            success: resp.code === 0,
            total: resp.data?.total || 0
          }
        }}
        toolBarRender={() => [
          fmsStore.isAccountSetWritable && (
            <HasPermi key="create" value="fms:config:auxiliary:create">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                disabled={!auxiliaryType}
                onClick={() => {
                  setEditId(undefined)
                  setFormVisible(true)
                }}
              >
                {textConst.action.create}
              </Button>
            </HasPermi>
          ),
          fmsStore.isAccountSetWritable && (
            <HasPermi key="import" value="fms:config:auxiliary:import">
              <Button
                color="green"
                variant="outlined"
                icon={<UploadOutlined />}
                disabled={!auxiliaryType}
                onClick={() => setImportVisible(true)}
              >
                {textConst.action.import}
              </Button>
            </HasPermi>
          ),
          <HasPermi key="export" value="fms:config:auxiliary:export">
            <Button
              color="volcano"
              variant="outlined"
              icon={<DownloadOutlined />}
              disabled={!auxiliaryType}
              loading={exportLoading}
              onClick={handleExport}
            >
              {textConst.action.export}
            </Button>
          </HasPermi>,
          fmsStore.isAccountSetWritable && (
            <HasPermi key="batchDelete" value="fms:config:auxiliary:delete">
              <Button
                danger
                type="primary"
                icon={<DeleteOutlined />}
                disabled={selectedRowKeys.length === 0}
                onClick={handleBatchDelete}
              >
                {textConst.action.batchDelete}
              </Button>
            </HasPermi>
          )
        ]}
      />

      {fmsStore.accountSetId && (
        <>
          <FmsAuxiliaryItemForm
            visible={formVisible}
            setVisible={setFormVisible}
            accountSetId={fmsStore.accountSetId}
            auxiliaryType={auxiliaryType}
            departmentTypeId={departmentTypeId}
            id={editId}
            onSuccess={() => actionRef.current?.reload()}
          />

          <FmsAuxiliaryItemImportForm
            visible={importVisible}
            setVisible={setImportVisible}
            accountSetId={fmsStore.accountSetId}
            auxiliaryType={auxiliaryType}
            onSuccess={() => actionRef.current?.reload()}
          />
        </>
      )}
    </>
  )
}

export default FmsAuxiliaryItemPanel
