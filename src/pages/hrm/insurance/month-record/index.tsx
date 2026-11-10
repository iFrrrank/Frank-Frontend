import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, DatePicker, Modal, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { history } from '@umijs/max'
import {
  createNextMonthRecord1,
  deleteMonthRecord1,
  getLastMonthRecord1,
  getMonthRecordList
} from '@/api/hrm/insurance/monthRecord'
import { textConst } from '@/locales/zh-CN'
import { deleteTextStyle } from '@/styles/common.style'
import { HrmInsuranceMonthStatus } from '../constants'
import { formatHrmMoney } from '../utils'
import InsuranceFirstMonthForm from './InsuranceFirstMonthForm'

const money = (value?: number) => formatHrmMoney(value)

const DETAIL_PATH = '/hrm/insurance/month-record/detail'

const InsuranceMonthRecordPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [createLoading, setCreateLoading] = useState<boolean>(false)
  const [queryYear, setQueryYear] = useState<number>(new Date().getFullYear())
  const [list, setList] = useState<API.HrmInsuranceMonthRecordRespVO[]>([])
  const [latestRecord, setLatestRecord] = useState<API.HrmInsuranceMonthRecordRespVO | undefined>()
  const [firstMonthVisible, setFirstMonthVisible] = useState<boolean>(false)

  /** 获得月度社保表列表；首次进入时定位到最近一张社保表所在年份 */
  const getList = useCallback(async (year: number, useLatestYear = false) => {
    setLoading(true)
    try {
      const latestResp = await getLastMonthRecord1()
      const latest = latestResp.data || undefined
      setLatestRecord(latest)
      let targetYear = year
      if (useLatestYear && latest?.year) {
        targetYear = latest.year
        setQueryYear(targetYear)
      }
      const resp = await getMonthRecordList({ year: targetYear })
      setList(resp.data || [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    getList(new Date().getFullYear(), true)
  }, [getList])

  const openDetail = (id?: number) => {
    if (!id) return
    history.push(`${DETAIL_PATH}?id=${id}`)
  }

  /** 新建次月社保表；新建后当月数据归档不可再改，需二次确认 */
  const handleCreateNext = () => {
    Modal.confirm({
      title: textConst.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '新建次月社保后，本月数据将不可修改。请确认要新建次月社保吗？',
      okText: textConst.common.ok,
      cancelText: textConst.common.cancel,
      onOk: async () => {
        setCreateLoading(true)
        try {
          const resp = await createNextMonthRecord1()
          message.success('新建成功')
          openDetail(resp.data)
        } catch {
          message.error(textConst.msg.createError)
        } finally {
          setCreateLoading(false)
        }
      }
    })
  }

  /** 没有任何社保表时先创建首月，否则创建次月 */
  const handleCreate = () => {
    if (!latestRecord) {
      setFirstMonthVisible(true)
      return
    }
    handleCreateNext()
  }

  const handleDelete = (row: API.HrmInsuranceMonthRecordRespVO) => {
    Modal.confirm({
      title: textConst.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: `确认删除“${row.title}”吗？`,
      okText: textConst.common.ok,
      cancelText: textConst.common.cancel,
      onOk: async () => {
        try {
          await deleteMonthRecord1({ id: row.id })
          message.success('删除成功')
          await getList(queryYear)
        } catch {
          message.error(textConst.msg.delError)
        }
      }
    })
  }

  /** 仅最近一张且未归档的社保表允许删除 */
  const isLatestEditableRecord = (row: API.HrmInsuranceMonthRecordRespVO) =>
    row.id === latestRecord?.id && row.status === HrmInsuranceMonthStatus.UNARCHIVED

  const columns: ColumnsType<API.HrmInsuranceMonthRecordRespVO> = [
    {
      title: '社保表',
      dataIndex: 'title',
      fixed: 'left',
      width: 190,
      ellipsis: true,
      render: (_, row) => <a onClick={() => openDetail(row.id)}>{row.title}</a>
    },
    { title: '参保人数', dataIndex: 'insuredEmployeeCount', align: 'center', width: 100 },
    { title: '停保人数', dataIndex: 'stoppedEmployeeCount', align: 'center', width: 100 },
    {
      title: '个人社保',
      align: 'right',
      width: 120,
      render: (_, row) => money(row.personalInsuranceAmount)
    },
    {
      title: '公司社保',
      align: 'right',
      width: 120,
      render: (_, row) => money(row.corporateInsuranceAmount)
    },
    {
      title: '个人公积金',
      align: 'right',
      width: 130,
      render: (_, row) => money(row.personalProvidentFundAmount)
    },
    {
      title: '公司公积金',
      align: 'right',
      width: 130,
      render: (_, row) => money(row.corporateProvidentFundAmount)
    },
    {
      title: textConst.table.action,
      align: 'center',
      fixed: 'right',
      width: 80,
      render: (_, row) =>
        isLatestEditableRecord(row) ? (
          <a style={deleteTextStyle} onClick={() => handleDelete(row)}>
            {textConst.action.delete}
          </a>
        ) : null
    }
  ]

  return (
    <Card variant="borderless">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16
        }}
      >
        <DatePicker
          picker="year"
          allowClear={false}
          style={{ width: 140 }}
          format="YYYY 年"
          value={dayjs(String(queryYear), 'YYYY')}
          onChange={(date) => {
            const year = date.year()
            setQueryYear(year)
            getList(year)
          }}
        />
        <Button
          type="primary"
          ghost
          icon={<PlusOutlined />}
          loading={createLoading}
          onClick={handleCreate}
        >
          {latestRecord ? '新建次月社保表' : '新建首月社保表'}
        </Button>
      </div>
      <Table<API.HrmInsuranceMonthRecordRespVO>
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={list}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
      <InsuranceFirstMonthForm
        visible={firstMonthVisible}
        setVisible={setFirstMonthVisible}
        onSuccess={(year) => {
          setFirstMonthVisible(false)
          setQueryYear(year)
          getList(year)
        }}
      />
    </Card>
  )
}

export default InsuranceMonthRecordPage
