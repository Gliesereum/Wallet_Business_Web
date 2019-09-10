import React from 'react';
import bem from 'bem-join';

const b = bem('contentHeader');

const ContentHeader = ({ title, titleCentered = false, content = null }) => (
  <div className={b({ withContent: content, titleCentered })}>
    <h1 className={b('title')}>{title}</h1>
    {content}
  </div>
);

export default ContentHeader;
