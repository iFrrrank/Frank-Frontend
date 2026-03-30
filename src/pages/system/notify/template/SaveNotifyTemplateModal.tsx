import React, { useState } from 'react';
import { message } from 'antd';
import { ModalForm, ProFormRadio, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { createNotifyTemplate, updateNotifyTemplate } from '@/api/system/notifyTemplate';

export let handleCreateNotifyTemplate: () => void;
export let handleEditNotifyTemplate: (record: API.SystemNotifyTemplateRespVO) => void;

interface SaveNotifyTemplateModalProps {
  onSuccess: () => void;
}

const SaveNotifyTemplateModal: React.FC<SaveNotifyTemplateModalProps> = ({ onSuccess }) => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<API.SystemNotifyTemplateRespVO | null>(null);

  handleCreateNotifyTemplate = () => {
    setEditingTemplate(null);
    setCreateModalVisible(true);
  };

  handleEditNotifyTemplate = (record: API.SystemNotifyTemplateRespVO) => {
    setEditingTemplate(record);
    setCreateModalVisible(true);
  };

  return (
    <ModalForm<API.SystemNotifyTemplateSaveReqVO>
      title={editingTemplate ? '修改' : '新增'}
      width={600}
      open={createModalVisible}
      onOpenChange={(visible) => {
        setCreateModalVisible(visible);
        if (!visible) {
          setEditingTemplate(null);
        }
      }}
      initialValues={
        editingTemplate
          ? { ...editingTemplate }
          : { status: 0 } // default layout: open
      }
      layout="horizontal"
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 18 }}
      colon={false}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false
      }}
      onFinish={async (values) => {
        try {
          let resp;
          if (editingTemplate) {
            resp = await updateNotifyTemplate({ ...values, id: editingTemplate.id } as any);
          } else {
            resp = await createNotifyTemplate(values as any);
          }
          if (resp.code === 0) {
            message.success(editingTemplate ? '修改成功' : '创建成功');
            onSuccess();
            return true;
          } else {
            message.error(resp.msg || (editingTemplate ? '修改失败' : '创建失败'));
            return false;
          }
        } catch {
          message.error(editingTemplate ? '修改失败' : '创建失败');
          return false;
        }
      }}
    >
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
      <ProFormText
        name="nickname"
        label="发件人名称"
        placeholder="请输入发件人名称"
        rules={[{ required: true, message: '请输入发件人名称' }]}
      />
      <ProFormTextArea
        name="content"
        label="模板内容"
        placeholder="请输入模板内容"
        rules={[{ required: true, message: '请输入模板内容' }]}
        fieldProps={{ rows: 3 }}
      />
      <ProFormSelect
        name="type"
        label="类型"
        placeholder="请选择类型"
        rules={[{ required: true, message: '请选择类型' }]}
        options={[
          { label: '系统通知', value: 1 },
          { label: '业务通知', value: 2 },
          { label: '会议通知', value: 3 }
        ]}
      />
      <ProFormRadio.Group
        name="status"
        label="开启状态"
        rules={[{ required: true, message: '请选择开启状态' }]}
        options={[
          { label: '开启', value: 0 },
          { label: '关闭', value: 1 }
        ]}
      />
      <ProFormText
        name="remark"
        label="备注"
        placeholder="请输入备注"
      />
    </ModalForm>
  );
};

export default SaveNotifyTemplateModal;
