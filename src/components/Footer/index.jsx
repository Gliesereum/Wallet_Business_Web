import React from 'react';
import bem from 'bem-join';

import {
  Divider,
  Select,
} from 'antd';

import {
  Facebook,
  Telegram,
  YouTube,
} from '../../assets/iconComponents';

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
    <div className={b('networks')}>
      <h1 className={b('networks-title')}>{phrases['footer.followUs'][defaultLanguage.isoKey]}</h1>
      <div className={b('networks-icons')}>
        <a
          href="https://t.me/coupler_public"
          className={b('networks-icon')}
          target="_blank"
        >
          <Telegram />
        </a>
        <a
          href="https://www.facebook.com/coupler.platform"
          className={b('networks-icon')}
          target="_blank"
        >
          <Facebook />
        </a>
        <a
          href="https://www.youtube.com/channel/UCOvMGeaG-MmcvAbrrn56ekQ"
          className={b('networks-icon')}
          target="_blank"
        >
          <YouTube />
        </a>
      </div>
    </div>
    <div className={b('links')}>
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
      <Divider type="vertical" />
      <a target="_blank" href="https://coupler.app/terms">
        {phrases['footer.copyright.link.terms'][defaultLanguage.isoKey]}
      </a>
      <Divider type="vertical" />
      <a target="_blank" href="https://coupler.app/policy">
        {phrases['footer.copyright.link.policy'][defaultLanguage.isoKey]}
      </a>
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
