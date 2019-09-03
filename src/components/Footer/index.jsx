import React from 'react';
import bem from 'bem-join';

import {
  Divider,
  Select,
} from 'antd';

const b = bem('footer');
const { Option } = Select;

const Footer = ({
  background, defaultLanguage, language, langPack, setLanguage,
}) => (
  <footer
    className={b()}
    style={{
      backgroundColor: background || 'transparent',
    }}
  >
    <div className={b('links')}>
      <a target="_blank" href="https://coupler.app/terms">
        {language.phrases['footer.copyright.link.terms'][defaultLanguage.isoKey]}
      </a>
      <Divider type="vertical" />
      <a target="_blank" href="https://coupler.app/policy">
        {language.phrases['footer.copyright.link.policy'][defaultLanguage.isoKey]}
      </a>
      <Divider type="vertical" />
      <div className={b('lang_box')}>
        <Select
          defaultValue={JSON.stringify(defaultLanguage)}
          className={b('lang_box-selector')}
          onChange={setLanguage}
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
    <div>
      <span className={b('text')}>{language.phrases['footer.copyright'][defaultLanguage.isoKey]}</span>
      <a
        className={b('text')}
        href="https://www.gliesereum.com/"
        target="_blank"
      >
        {language.phrases['footer.copyright.company'][defaultLanguage.isoKey]}
      </a>
    </div>
  </footer>
);

export default Footer;
