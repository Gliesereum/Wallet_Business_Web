import React from 'react';
import bem from 'bem-join';

import {
  Select,
  Input,
  Button,
} from 'antd';

const b = bem('periodSelector');
const { Option } = Select;
const { Group: InputGroup } = Input;

const PeriodSelector = ({
  from,
  to,
  isCustomPeriod,
}) => {
  console.log(from, to, isCustomPeriod);
  return (
    <div className={b()}>
      <div className={b('title')}>Список заказов</div>
      <Select value="Month" className={b('selector')}>
        <Option value="Month">Month</Option>
      </Select>
      <InputGroup compact className={b('customPeriodInput')}>
        <Input
          placeholder="from"
          className={b('customPeriodInput-from')}
        />
        <Input
          placeholder="|"
          className={b('customPeriodInput-divider')}
          disabled
        />
        <Input
          placeholder="to"
          className={b('customPeriodInput-to')}
        />
      </InputGroup>
      <Button className={b('confirmBtn')}>OK</Button>
    </div>
  );
};

export default PeriodSelector;
