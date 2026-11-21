import React, { useRef, useState } from 'react'
import { Button, Drawer, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  ActionType,
  EditableProTable,
  ModalForm,
  ProColumns,
  ProFormDatePicker,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
  ProTable
} from '@ant-design/pro-components'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete, handleBatchDelete } from '@/components/Delete'
import { handleExport } from '@/components/Export'
import {
  createDemo03Course,
  createDemo03Grade,
  createDemo03Student,
  deleteDemo03Course,
  deleteDemo03Grade,
  deleteDemo03Student,
  deleteDemo03StudentList,
  exportDemo03Student,
  getDemo03CoursePage,
  getDemo03GradePage,
  getDemo03Student,
  getDemo03StudentPage,
  updateDemo03Course,
  updateDemo03Grade,
  updateDemo03Student,
  type Demo03Variant
} from '@/api/infra/demo03'
import { SEX_OPTIONS } from '../../demo01/Demo01ContactForm'
import dayjs from 'dayjs'

interface Demo03StudentPageProps {
  variant: Demo03Variant
  title: string
}

interface CourseRow {
  id: string
  name?: string
  score?: number
}

// 示例学生（主子表示例）：erp 变体子表独立 CRUD；inner/normal 变体子表随学生一并提交
const Demo03StudentPage: React.FC<Demo03StudentPageProps> = ({ variant, title }) => {
  const isErp = variant === 'erp'
  const actionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [courses, setCourses] = useState<CourseRow[]>([])
  const [courseEditableKeys, setCourseEditableKeys] = useState<React.Key[]>([])
  const [subDrawerStudent, setSubDrawerStudent] = useState<any>()

  const columns: ProColumns<any>[] = [
    { title: '编号', dataIndex: 'id', align: 'center', width: 80, hideInSearch: true },
    {
      title: '名字',
      dataIndex: 'name',
      align: 'center',
      width: 140,
      fieldProps: { placeholder: '请输入名字' }
    },
    {
      title: '性别',
      dataIndex: 'sex',
      align: 'center',
      width: 90,
      valueType: 'select',
      fieldProps: { options: SEX_OPTIONS },
      render: (_, record) => SEX_OPTIONS.find((o) => o.value === record.sex)?.label || '-'
    },
    {
      title: '出生日期',
      dataIndex: 'birthday',
      align: 'center',
      width: 120,
      hideInSearch: true,
      render: (_, record) =>
        record.birthday ? dayjs(record.birthday).format('YYYY-MM-DD') : '-'
    },
    {
      title: '简介',
      dataIndex: 'description',
      align: 'center',
      ellipsis: true,
      hideInSearch: true,
      render: (_, record) => <span>{record.description || '-'}</span>
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 170,
      valueType: 'dateRange'
    },
    {
      title: textConst.table.action,
      valueType: 'option',
      width: isErp ? 200 : 120,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          {isErp && <a onClick={() => setSubDrawerStudent(record)}>课程/班级</a>}
          <a
            onClick={() => {
              setCurrentId(record.id)
              setFormVisible(true)
            }}
          >
            {textConst.action.update}
          </a>
          <a
            style={deleteTextStyle}
            onClick={() =>
              handleDelete(record, (params: any) => deleteDemo03Student(variant, params), () =>
                actionRef.current?.reload()
              )
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
      <ProTable<any>
        headerTitle={title}
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        search={{ labelWidth: 'auto', span: 6 }}
        request={async (params: Record<string, any>) => {
          const { current, pageSize, createTime, ...rest } = params
          const resp = await getDemo03StudentPage(variant, {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...rest,
            createTime:
              createTime?.length === 2
                ? [
                    dayjs(createTime[0]).format('YYYY-MM-DD 00:00:00'),
                    dayjs(createTime[1]).format('YYYY-MM-DD 23:59:59')
                  ]
                : undefined
          } as any)
          return {
            data: resp.data?.list || [],
            success: true,
            total: resp.data?.total || 0
          }
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys)
        }}
        scroll={{ x: 'max-content' }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            onClick={() => {
              setCurrentId(undefined)
              setFormVisible(true)
            }}
          >
            <PlusOutlined /> {textConst.action.create}
          </Button>,
          <Button
            key="batchDelete"
            danger
            disabled={selectedRowKeys.length === 0}
            onClick={() =>
              handleBatchDelete(
                selectedRowKeys,
                (params: any) => deleteDemo03StudentList(variant, params),
                () => setSelectedRowKeys([]),
                () => actionRef.current?.reload()
              )
            }
          >
            {textConst.action.batchDelete}
          </Button>,
          <Button
            key="export"
            onClick={() =>
              handleExport({
                exportApi: (params: any) => exportDemo03Student(variant, params),
                exportParams: {},
                fileName: '示例学生.xls'
              })
            }
          >
            {textConst.action.export}
          </Button>
        ]}
        pagination={{ align: 'center', showSizeChanger: true }}
      />

      {/* 学生表单：inner/normal 变体附带课程行编辑与班级字段 */}
      <ModalForm
        title={currentId !== undefined ? '编辑示例学生' : '新增示例学生'}
        open={formVisible}
        onOpenChange={(val) => {
          setFormVisible(val)
          if (!val) {
            setCourses([])
            setCourseEditableKeys([])
          }
        }}
        width={640}
        modalProps={{ destroyOnHidden: true }}
        request={async () => {
          if (currentId !== undefined) {
            const resp = await getDemo03Student(variant, { id: currentId })
            const data = resp.data as any
            if (data) {
              if (!isErp) {
                setCourses(
                  (data.demo03courses || []).map((course: any, index: number) => ({
                    ...course,
                    id: course.id ? String(course.id) : `course_${index}`
                  }))
                )
              }
              return {
                ...data,
                birthday: data.birthday ? dayjs(data.birthday) : undefined,
                gradeName: data.demo03grade?.name,
                gradeTeacher: data.demo03grade?.teacher,
                gradeId: data.demo03grade?.id
              }
            }
          }
          return { sex: 1 }
        }}
        onFinish={async (values) => {
          if (!isErp && courseEditableKeys.length > 0) {
            message.warning('请先保存正在编辑的课程行')
            return false
          }
          const body: any = {
            name: values.name,
            sex: values.sex,
            birthday: values.birthday
              ? dayjs(values.birthday).format('YYYY-MM-DD HH:mm:ss')
              : undefined,
            description: values.description
          }
          if (!isErp) {
            body.demo03courses = courses.map((course) => ({
              id: /^\d+$/.test(course.id) ? Number(course.id) : undefined,
              name: course.name,
              score: course.score
            }))
            if (values.gradeName || values.gradeTeacher) {
              body.demo03grade = {
                id: values.gradeId,
                name: values.gradeName,
                teacher: values.gradeTeacher
              }
            }
          }
          try {
            if (currentId !== undefined) {
              await updateDemo03Student(variant, { ...body, id: currentId })
              message.success(textConst.msg.updateSuccess)
            } else {
              await createDemo03Student(variant, body)
              message.success(textConst.msg.createSuccess)
            }
            actionRef.current?.reload()
            return true
          } catch {
            message.error(textConst.error.operationFail)
            return false
          }
        }}
      >
        <ProFormText
          name="name"
          label="名字"
          rules={[{ required: true, message: '请输入名字' }]}
        />
        <ProFormRadio.Group name="sex" label="性别" options={SEX_OPTIONS} />
        <ProFormDatePicker
          name="birthday"
          label="出生日期"
          fieldProps={{ style: { width: '100%' } }}
        />
        <ProFormTextArea name="description" label="简介" fieldProps={{ rows: 3 }} />
        {!isErp && (
          <>
            <EditableProTable<CourseRow>
              rowKey="id"
              headerTitle="学生课程"
              value={courses}
              onChange={(value) => setCourses([...value])}
              recordCreatorProps={false}
              columns={[
                {
                  title: '课程名称',
                  dataIndex: 'name',
                  formItemProps: { rules: [{ required: true, message: '请输入课程名称' }] }
                },
                {
                  title: '分数',
                  dataIndex: 'score',
                  valueType: 'digit',
                  width: 120,
                  fieldProps: { precision: 0, min: 0, max: 100 }
                },
                {
                  title: '操作',
                  valueType: 'option',
                  width: 120,
                  render: (_text, record, _index, action) => [
                    <a key="edit" onClick={() => action?.startEditable?.(record.id)}>
                      编辑
                    </a>,
                    <a
                      key="delete"
                      style={{ color: '#ff4d4f' }}
                      onClick={() => setCourses(courses.filter((c) => c.id !== record.id))}
                    >
                      删除
                    </a>
                  ]
                }
              ]}
              editable={{
                type: 'multiple',
                editableKeys: courseEditableKeys,
                onChange: setCourseEditableKeys,
                actionRender: (row, config, dom) => [dom.save, dom.cancel]
              }}
              toolBarRender={() => [
                <Button
                  key="add"
                  type="primary"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    const rowId = `course_new_${Date.now()}`
                    setCourses([...courses, { id: rowId }])
                    setCourseEditableKeys([...courseEditableKeys, rowId])
                  }}
                >
                  添加课程
                </Button>
              ]}
            />
            <ProFormText name="gradeName" label="班级名称" />
            <ProFormText name="gradeTeacher" label="班主任" />
            <ProFormDigit name="gradeId" hidden />
          </>
        )}
      </ModalForm>

      {/* erp 变体：课程/班级子表抽屉（独立 CRUD） */}
      <Drawer
        title={subDrawerStudent ? `${subDrawerStudent.name} 的课程与班级` : ''}
        open={!!subDrawerStudent}
        onClose={() => setSubDrawerStudent(undefined)}
        width={760}
        destroyOnHidden
      >
        {subDrawerStudent && (
          <>
            <SubCrudTable
              title="学生课程"
              studentId={subDrawerStudent.id}
              loadPage={getDemo03CoursePage}
              createFn={createDemo03Course}
              updateFn={updateDemo03Course}
              deleteFn={deleteDemo03Course}
              columns={[
                { title: '课程名称', dataIndex: 'name' },
                { title: '分数', dataIndex: 'score', width: 100, align: 'center' }
              ]}
              formFields={[
                { name: 'name', label: '课程名称', required: true },
                { name: 'score', label: '分数', type: 'digit' }
              ]}
            />
            <div style={{ height: 24 }} />
            <SubCrudTable
              title="学生班级"
              studentId={subDrawerStudent.id}
              loadPage={getDemo03GradePage}
              createFn={createDemo03Grade}
              updateFn={updateDemo03Grade}
              deleteFn={deleteDemo03Grade}
              columns={[
                { title: '班级名称', dataIndex: 'name' },
                { title: '班主任', dataIndex: 'teacher', width: 140 }
              ]}
              formFields={[
                { name: 'name', label: '班级名称', required: true },
                { name: 'teacher', label: '班主任' }
              ]}
            />
          </>
        )}
      </Drawer>
    </>
  )
}

// erp 子表通用 CRUD 表（课程/班级）
const SubCrudTable: React.FC<{
  title: string
  studentId: number
  loadPage: (params: any) => Promise<any>
  createFn: (body: any) => Promise<any>
  updateFn: (body: any) => Promise<any>
  deleteFn: (params: any) => Promise<any>
  columns: ProColumns<any>[]
  formFields: { name: string; label: string; required?: boolean; type?: 'digit' }[]
}> = ({ title, studentId, loadPage, createFn, updateFn, deleteFn, columns, formFields }) => {
  const subActionRef = useRef<ActionType>(undefined)
  const [formVisible, setFormVisible] = useState(false)
  const [editing, setEditing] = useState<any>()

  const fullColumns: ProColumns<any>[] = [
    ...columns,
    {
      title: textConst.table.action,
      valueType: 'option',
      width: 110,
      align: 'center',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a
            onClick={() => {
              setEditing(record)
              setFormVisible(true)
            }}
          >
            {textConst.action.update}
          </a>
          <a
            style={deleteTextStyle}
            onClick={() => handleDelete(record, deleteFn, () => subActionRef.current?.reload())}
          >
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<any>
        headerTitle={title}
        actionRef={subActionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={fullColumns}
        search={false}
        options={false}
        request={async (params: Record<string, any>) => {
          const resp = await loadPage({
            pageNo: params.current || 1,
            pageSize: params.pageSize || 10,
            studentId
          })
          return {
            data: resp.data?.list || [],
            success: true,
            total: resp.data?.total || 0
          }
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            size="small"
            onClick={() => {
              setEditing(undefined)
              setFormVisible(true)
            }}
          >
            <PlusOutlined /> {textConst.action.create}
          </Button>
        ]}
        pagination={{ align: 'center', pageSize: 5 }}
      />
      <ModalForm
        title={editing ? `编辑${title}` : `新增${title}`}
        open={formVisible}
        onOpenChange={setFormVisible}
        width={440}
        modalProps={{ destroyOnHidden: true, zIndex: 1100 }}
        initialValues={editing}
        onFinish={async (values) => {
          try {
            if (editing?.id) {
              await updateFn({ ...values, id: editing.id, studentId })
              message.success(textConst.msg.updateSuccess)
            } else {
              await createFn({ ...values, studentId })
              message.success(textConst.msg.createSuccess)
            }
            subActionRef.current?.reload()
            return true
          } catch {
            message.error(textConst.error.operationFail)
            return false
          }
        }}
      >
        {formFields.map((field) =>
          field.type === 'digit' ? (
            <ProFormDigit
              key={field.name}
              name={field.name}
              label={field.label}
              fieldProps={{ style: { width: '100%' } }}
            />
          ) : (
            <ProFormText
              key={field.name}
              name={field.name}
              label={field.label}
              rules={
                field.required ? [{ required: true, message: `请输入${field.label}` }] : undefined
              }
            />
          )
        )}
      </ModalForm>
    </>
  )
}

export default Demo03StudentPage
