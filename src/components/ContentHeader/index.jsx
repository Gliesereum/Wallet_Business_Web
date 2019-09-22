import React from 'react';
import bem from 'bem-join';

const b = bem('contentHeader');

const ContentHeader = ({
  title,
  titleCentered = false,
  content = null,
  controlBtn = null,
  reverseDirection = false,
}) => (
  <div className={b({ withContent: content, titleCentered, reverseDirection })}>
    {title && <h1 className={b('title')}>{title}</h1>}
    {controlBtn}
    {content}
  </div>
);

export default ContentHeader;
