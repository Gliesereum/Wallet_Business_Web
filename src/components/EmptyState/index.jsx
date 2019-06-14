import React from 'react';
import bem from 'bem-join';

import { Button } from 'antd';

import EmptyStateSVG from '../../assets/emptyState.svg';

import './index.scss';

const b = bem('emptyList');

const EmptyState = ({
  title,
  descrText,
  addItemText,
  addItemHandler,
}) => (
  <div className={b()}>
    <div className={b('content')}>
      <h1 className={b('content-title')}>{title}</h1>
      <img src={EmptyStateSVG} alt="empty logo" />
      <p className={b('content-descr')}>
        {descrText}
      </p>
      <Button
        type="primary"
        onClick={addItemHandler(null, true)}
        className={b('content-btn')}
      >
        {addItemText}
      </Button>
    </div>
  </div>
);

export default EmptyState;
