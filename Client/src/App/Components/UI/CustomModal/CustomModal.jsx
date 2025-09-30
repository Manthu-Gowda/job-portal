import React from "react";
import { Modal } from "antd";

const CustomModal = ({
  title,
  visible,
  onOk,
  onCancel,
  centered = true,
  children,
  okText = "Ok",
  confirmLoading = false,
}) => {
  return (
    <Modal
      title={title}
      centered={centered}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      okText={okText}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
