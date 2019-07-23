import React, { Component } from 'react';
import bem from 'bem-join';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/dist/style.css';

const b = bem('phoneInput');

class PhoneInput extends Component {
  state = {
    phone: this.props.value,
  };

  handleChangeInput = (value) => {
    const { onChange } = this.props;
    const phone = value.replace(/[()\s+]/g, '');

    this.setState({ phone });

    if (onChange) {
      onChange(phone);
    }
  };

  render() {
    return (
      <div className={b()}>
        <ReactPhoneInput
          inputClass={b('inputClass', { readOnly: this.props.readOnly })}
          onlyCountries={['ua', 'ru', 'by', 'de', 'en', 'es']}
          defaultCountry="ua"
          value={this.state.phone}
          onChange={this.handleChangeInput}
        />
      </div>
    );
  }
}

export default PhoneInput;
