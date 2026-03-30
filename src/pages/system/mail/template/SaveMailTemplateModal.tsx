import React, { useState } from 'react';
import { message } from 'antd';
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormRadio,
  ProFormTextArea,
  ProForm
} from '@ant-design/pro-components';
import { Editor } from '@/components/Editor';
import { createMailTemplate, updateMailTemplate } from '@/api/system/mailTemplate';

export let handleCreateMailTemplate: () => void;
export let handleEditMailTemplate: (record: API.SystemMailTemplateRespVO) => void;

interface SaveMailTemplateModalProps {
  onSuccess: () => void;
  accountOptions: { label: string; value: number }[];
}

const SaveMailTemplateModal: React.FC<SaveMailTemplateModalProps> = ({
  onSuccess,
  accountOptions
}) => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editingMailTemplate, setEditingMailTemplate] = useState<API.SystemMailTemplateRespVO | null>(null);

  handleCreateMailTemplate = () => {
    setEditingMailTemplate(null);
    setCreateModalVisible(true);
  };

  handleEditMailTemplate = (record: API.SystemMailTemplateRespVO) => {
    setEditingMailTemplate(record);
    setCreateModalVisible(true);
  };

  return (
    <ModalForm<API.SystemMailTemplateSaveReqVO>
      title={editingMailTemplate ? '修改' : '新增'}
      width={900}
      open={createModalVisible}
      onOpenChange={(visible) => {
        setCreateModalVisible(visible);
        if (!visible) {
          setEditingMailTemplate(null);
        }
      }}
      initialValues={editingMailTemplate ? { ...editingMailTemplate } : { status: 0 }}
      layout="horizontal"
      labelCol={{ span: 3 }}
      wrapperCol={{ span: 20 }}
      colon={false}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false
      }}
      onFinish={async (values) => {
        try {
          let resp;
          if (editingMailTemplate) {
            resp = await updateMailTemplate({ ...values, id: editingMailTemplate.id });
          } else {
            resp = await createMailTemplate(values);
          }

          if (resp.code === 0) {
            message.success(editingMailTemplate ? '修改成功' : '新增成功');
            onSuccess();
            return true;
          } else {
            message.error(resp.msg || (editingMailTemplate ? '修改失败' : '新增失败'));
            return false;
          }
        } catch {
          message.error(editingMailTemplate ? '修改失败' : '新增失败');
          return false;
        }
      }}
    >
      <ProFormSelect
        name="accountId"
        label="邮箱账号"
        placeholder="请选择邮箱账号"
        rules={[{ required: true, message: '请选择邮箱账号' }]}
        options={accountOptions}
        showSearch
      />
      <ProFormText
        name="code"
        label="模板编码"
        placeholder="请输入模板编码"
        rules={[{ required: true, message: '请输入模板编码' }]}
      />
      <ProFormText
        name="name"
        label="模板名称"
        placeholder="请输入模板名称"
        rules={[{ required: true, message: '请输入模板名称' }]}
      />
      <ProFormText name="nickname" label="发送人名称" placeholder="请输入发送人名称" />
      <ProFormText
        name="title"
        label="模板标题"
        placeholder="请输入模板标题"
        rules={[{ required: true, message: '请输入模板标题' }]}
      />
      <ProForm.Item
        name="content"
        label="模板内容"
        rules={[{ required: true, message: '请输入模板内容' }]}
        wrapperCol={{ span: 20 }}
      >
        <Editor height={100} />
      </ProForm.Item>
      <ProFormRadio.Group
        name="status"
        label="开启状态"
        rules={[{ required: true, message: '请选择开启状态' }]}
        options={[
          { label: '开启', value: 0 },
          { label: '关闭', value: 1 }
        ]}
      />
      <ProFormTextArea name="remark" label="备注" placeholder="请输入备注" />
    </ModalForm>
  );
};

export default SaveMailTemplateModal;
