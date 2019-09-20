import React, { Component } from 'react';
import bem from 'bem-join';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/dist/style.css';

const b = bem('phoneInput');

class PhoneInput extends Component {
  handleChangeInput = (value, data) => {
    const { onChange, setDialCode } = this.props;
    const phone = value.replace(/[()\s+]/g, '');

    if (onChange) {
      onChange(phone);
      setDialCode && setDialCode(data.dialCode.length);
    }
  };

  render() {
    const { value } = this.props;

    return (
      <div className={b()}>
        <ReactPhoneInput
          inputClass={b('inputClass', { readOnly: this.props.readOnly })}
          defaultCountry="ua"
          value={value}
          onChange={this.handleChangeInput}
        />
      </div>
    );
  }
}

export default PhoneInput;
