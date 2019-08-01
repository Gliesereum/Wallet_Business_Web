import React from 'react';
import bem from 'bem-join';

import {
  Button,
  Icon,
  Modal,
} from 'antd';

const b = bem('deleteModal');

const DeleteModal = ({
  visible,
  okText,
  cancelText,
  onOk,
  onCancel,
  deletedName,
  deletedItem,
}) => (
  <Modal
    className={b()}
    title="Подтверждение удаления"
    visible={visible}
    closable={false}
    maskClosable={false}
    centered
    width={400}
    footer={[
      <Button
        className={b('controlBtns-btn backBtn')}
        onClick={onCancel}
        key={cancelText}
      >
        {cancelText}
      </Button>,
      <Button
        className={b('controlBtns-btn')}
        onClick={onOk}
        type="primary"
        key={okText}
      >
        {okText}
      </Button>,
    ]}
  >
    <Icon type="close-circle" style={{ fontSize: '32px', color: '#A4AEB8' }} />
    <div className={b('content-text')}>
      <p>{`Вы действительно хотите удалить ${deletedItem}`}</p>
      <p>{deletedName}</p>
    </div>
  </Modal>
);

export default DeleteModal;
