import React, { PureComponent } from 'react';
import bem from 'bem-join';

import {
  Row,
  Col,
  Input,
  Form,
  Select,
} from 'antd';

import AvatarAndCoverUploader from '../../AvatarAndCoverUploader';

import { checkInputHandler } from '../../../utils';

const b = bem('corporationForm');

class CorporationForm extends PureComponent {
  render() {
    const {
      form,
      chosenCorporation,
      readOnlyMode,
      defaultLanguage,
      phrases,
      onLoadCover,
      onLoadLogo,
    } = this.props;

    return (
      <Form
        className={b()}
        colon={false}
      >
        <Row gutter={32}>
          <Col lg={8}>
            <Form.Item label={phrases['company.pageCreate.form.inputNameCompany.label'][defaultLanguage.isoKey]}>
              {form.getFieldDecorator('name', {
                initialValue: chosenCorporation ? chosenCorporation.name : '',
                rules: [
                  { required: true, message: 'Поле обязательное для заполнения' },
                  { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                ],
              })(<Input placeholder="ТОВ “Автомийки карваш”" readOnly={readOnlyMode} />)}
            </Form.Item>
            <Form.Item label={phrases['core.form.inputPhone.label'][defaultLanguage.isoKey]}>
              {form.getFieldDecorator('phone', {
                initialValue: chosenCorporation ? chosenCorporation.phone : '',
                getValueFromEvent: checkInputHandler('phone', form),
                rules: [
                  { required: true, message: 'Поле обязательное для заполнения' },
                  { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                  { pattern: new RegExp(/^[\d ]{12}$/), message: 'Номер введен неверно. Повторите попытку' },
                ],
              })(<Input placeholder="380 99 888 88 88" readOnly={readOnlyMode} />)}
            </Form.Item>
            <Form.Item label={phrases['core.form.inputDetails.label'][defaultLanguage.isoKey]}>
              {form.getFieldDecorator('description', {
                initialValue: chosenCorporation ? chosenCorporation.description : '',
                rules: [
                  { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                ],
              })(<Input placeholder="Текст..." readOnly={readOnlyMode} />)}
            </Form.Item>
          </Col>
          <Col lg={16}>
            <AvatarAndCoverUploader
              cover={chosenCorporation ? chosenCorporation.coverUrl : null}
              logo={chosenCorporation ? chosenCorporation.logoUrl : null}
              onLoadCover={onLoadCover}
              onLoadLogo={onLoadLogo}
              withCoverUploader
              maxSize={2}
              readOnlyMode={readOnlyMode}
            />
          </Col>
        </Row>

        <Row gutter={32}>
          <Col lg={8}>
            <Form.Item label={phrases['company.pageCreate.form.inputCountry.label'][defaultLanguage.isoKey]}>
              {form.getFieldDecorator('country', {
                initialValue: chosenCorporation ? chosenCorporation.country : undefined,
                rules: [
                  { required: true, message: 'Поле обязательное для заполнения' },
                  { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                ],
              })(
                !readOnlyMode ? (
                  <Select placeholder="Выбрать страну">
                    <Select.Option value="Украина">Украина</Select.Option>
                    <Select.Option value="Россия">Россия</Select.Option>
                  </Select>
                ) : <Input placeholder="Выбрать страну" readOnly={readOnlyMode} />
              )}
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item label={phrases['company.pageCreate.form.inputCity.label'][defaultLanguage.isoKey]}>
              {form.getFieldDecorator('city', {
                initialValue: chosenCorporation ? chosenCorporation.city : '',
                rules: [
                  { required: true, message: 'Поле обязательное для заполнения' },
                  { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                ],
              })(<Input placeholder="Название города..." readOnly={readOnlyMode} />)}
            </Form.Item>
          </Col>
          <Col lg={6}>
            <Form.Item label={phrases['company.pageCreate.form.inputStreet.label'][defaultLanguage.isoKey]}>
              {form.getFieldDecorator('street', {
                initialValue: chosenCorporation ? chosenCorporation.street : '',
                rules: [
                  { required: true, message: 'Поле обязательное для заполнения' },
                  { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                ],
              })(<Input placeholder="Название улицы..." readOnly={readOnlyMode} />)}
            </Form.Item>
          </Col>
          <Col lg={2}>
            <Form.Item label={phrases['company.pageCreate.form.inputHome.label'][defaultLanguage.isoKey]}>
              {form.getFieldDecorator('buildingNumber', {
                initialValue: chosenCorporation ? chosenCorporation.buildingNumber : '',
                rules: [
                  { required: true, message: 'Поле обязательное для заполнения' },
                  { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                ],
              })(<Input placeholder="88" readOnly={readOnlyMode} />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create({})(CorporationForm);
