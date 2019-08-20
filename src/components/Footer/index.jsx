import React from 'react';
import bem from 'bem-join';

import { Divider } from 'antd';

const b = bem('footer');

const Footer = ({
  background, defaultLanguage, language, langPack, setLanguage,
}) => (
  <div
    className={b()}
    style={{
      backgroundColor: background || 'transparent',
    }}
  >
    <div className={b('links')}>
      <a target="_blank" href="https://coupler.app/terms">{language.phrases['footer.copyright.link.terms'][defaultLanguage.isoKey]}</a>
      <Divider type="vertical" />
      <a target="_blank" href="https://coupler.app/policy">{language.phrases['footer.copyright.link.policy'][defaultLanguage.isoKey]}</a>
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
    <div className={b('lang_box')}>
      {langPack.map(lang => <div style={{ color: defaultLanguage.isoKey === lang.isoKey ? '#9ca6e2' : '#444' }} onClick={() => setLanguage(lang)} key={lang.isoKey}>{lang.label}</div>)}
    </div>
  </div>
);

export default Footer;
