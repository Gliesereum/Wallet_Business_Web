import React from 'react';
import bem from 'bem-join';

const b = bem('errorScreen');

const ErrorScreen = ({ status, statusTitle }) => (
  <div className={b()}>
    <h1 className={b('title')}>{status}</h1>
    <div className={b('message')}>
      <span>{statusTitle}</span>
    </div>
    <div className={b('button')}>
      <button type="button" onClick={() => window.location.reload()}>
        Reload
      </button>
    </div>
  </div>
);

export default ErrorScreen;
