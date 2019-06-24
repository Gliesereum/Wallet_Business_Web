import React from 'react';
import bem from 'bem-join';
import { Link } from 'react-router-dom';

import { Button } from 'antd';

import EmptyStateSVG from '../../assets/emptyState.svg';

import './index.scss';

const b = bem('emptyList');

const EmptyState = ({
  title,
  descrText,
  addItemText,
  addItemHandler,
  linkToData = {},
}) => (
  <div className={b()}>
    <div className={b('content')}>
      <h1 className={b('content-title')}>{title}</h1>
      <img src={EmptyStateSVG} alt="empty logo" />
      <p className={b('content-descr')}>
        {descrText}
      </p>
      {
        addItemHandler ? (
          <Button
            type="primary"
            onClick={addItemHandler(null, true)}
            className={b('content-btn')}
          >
            {addItemText}
          </Button>
        ) : (
          <Link to={linkToData}>
            <Button
              type="primary"
              className={b('content-btn')}
            >
              {addItemText}
            </Button>
          </Link>
        )
      }
    </div>
  </div>
);

export default EmptyState;
