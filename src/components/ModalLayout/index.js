import React from "react";

import { Modal } from "antd";

const ModalLayout = ({
                       title,
                       visible,
                       handleOk,
                       handleCancel,
                       okText,
                       cancelText,
                       isOutsideClickable = false,
                       footer,
                       closable,
                       children,
                     }) => (
  <Modal
    title={title}
    visible={visible}
    onOk={handleOk}
    onCancel={handleCancel}
    cancelText={cancelText}
    okText={okText}
    footer={footer}
    maskClosable={isOutsideClickable}
    closable={closable}
  >
    {children}
  </Modal>
);

export default ModalLayout;
