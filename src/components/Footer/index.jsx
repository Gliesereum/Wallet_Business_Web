import React from 'react';
import bem from 'bem-join';

import {
  Divider,
  Select,
} from 'antd';

const b = bem('footer');
const { Option } = Select;

const Footer = ({
  defaultLanguage,
  phrases,
  langPack,
  setLanguage,
}) => (
  <footer
    className={b()}
  >
    <div className={b('links')}>
      <a target="_blank" href="https://coupler.app/terms">
        {phrases['footer.copyright.link.terms'][defaultLanguage.isoKey]}
      </a>
      <Divider type="vertical" />
      <a target="_blank" href="https://coupler.app/policy">
        {phrases['footer.copyright.link.policy'][defaultLanguage.isoKey]}
      </a>
      <Divider type="vertical" />
      <div className={b('lang_box')}>
        <Select
          defaultValue={JSON.stringify(defaultLanguage)}
          className={b('lang_box-selector')}
          onChange={setLanguage}
          showArrow={false}
        >
          {langPack.map(lang => (
            <Option
              key={lang.isoKey}
              value={JSON.stringify(lang)}
            >
              {lang.label}
            </Option>
          ))}
        </Select>
      </div>
    </div>
    <div className={b('copyright')}>
      <div className={b('copyright-text')}>{phrases['footer.copyright'][defaultLanguage.isoKey]}</div>
      <a
        className={b('copyright-text')}
        href="https://www.gliesereum.com/"
        target="_blank"
      >
        {phrases['footer.copyright.company'][defaultLanguage.isoKey]}
      </a>
    </div>
  </footer>
);

export default Footer;
