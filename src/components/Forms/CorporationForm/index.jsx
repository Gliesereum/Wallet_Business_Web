import React from 'react';
import bem from 'bem-join';

import {
  Row,
  Col,
  Input,
  Form,
  Select,
  Upload,
} from 'antd';

import { checkInputHandler } from '../../../utils';
import { AddIcon } from '../../../assets/iconComponents';

const { Dragger: UploadDragger } = Upload;
const b = bem('corporationForm');

const CorporationForm = (props) => {
  const {
    form,
    chosenCorporation,
    readOnlyMode,
    corporationLogoUrl,
    isError,
    uploadCorporationImage,
  } = props;

  return (
    <Form
      className={b()}
      colon={false}
    >
      <Row gutter={31}>
        <Col lg={12}>
          <Form.Item label="Название компании">
            {form.getFieldDecorator('name', {
              initialValue: chosenCorporation ? chosenCorporation.name : '',
              rules: [
                { required: true, message: 'Поле обязательное для заполнения' },
                { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
              ],
            })(<Input placeholder="ТОВ “Автомийки карваш”" readOnly={readOnlyMode} />)}
          </Form.Item>
          <Form.Item label="Страна">
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
        <Col lg={12}>
          <UploadDragger
            disabled={readOnlyMode}
            className={b('uploader')}
            name="file"
            listType="picture-card"
            showUploadList={false}
            customRequest={uploadCorporationImage}
          >
            <div className={b('uploader-container')}>
              {
                corporationLogoUrl && (
                  <img
                    className={b('uploader-image')}
                    src={corporationLogoUrl}
                    alt="uploaded_image"
                  />
                )
              }
              {
                !readOnlyMode && (
                  <div className={b('uploader-inside')}>
                    <AddIcon
                      className={b('uploader-inside-icon', { errorView: isError })}
                      size={{
                        x: isError ? 32 : 48,
                        y: isError ? 32 : 48,
                      }}
                    />
                    <h1 className={b('uploader-inside-header')}>добавить изображение</h1>
                    {
                      isError && (
                        <p className={b('uploader-inside-error')}>
                          Файл не должен превышать 2 МБ и должен быть у формате PNG | JPG | JPEG
                        </p>
                      )
                    }
                  </div>
                )
              }
            </div>
          </UploadDragger>
        </Col>
      </Row>
      <Row gutter={31}>
        <Col lg={12}>
          <Form.Item label="Телефонный номер">
            {form.getFieldDecorator('phone', {
              initialValue: chosenCorporation ? chosenCorporation.phone : '',
              getValueFromEvent: checkInputHandler('phone', form),
              rules: [
                { required: true, message: 'Поле обязательное для заполнения' },
                { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                { pattern: new RegExp(/^\+[\d ]{12}$/), message: 'Invalid phone number!' },
              ],
            })(<Input placeholder="+380 99 888 88 88" readOnly={readOnlyMode} />)}
          </Form.Item>
        </Col>
        <Col lg={12}>
          <Form.Item label="Город">
            {form.getFieldDecorator('city', {
              initialValue: chosenCorporation ? chosenCorporation.city : '',
              rules: [
                { required: true, message: 'Поле обязательное для заполнения' },
                { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
              ],
            })(<Input placeholder="Название города..." readOnly={readOnlyMode} />)}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={31}>
        <Col lg={12}>
          <Form.Item label="Описание">
            {form.getFieldDecorator('description', {
              initialValue: chosenCorporation ? chosenCorporation.description : '',
              rules: [
                { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
              ],
            })(<Input placeholder="Текст..." readOnly={readOnlyMode} />)}
          </Form.Item>
        </Col>
        <Col lg={8}>
          <Form.Item label="Улица">
            {form.getFieldDecorator('street', {
              initialValue: chosenCorporation ? chosenCorporation.street : '',
              rules: [
                { required: true, message: 'Поле обязательное для заполнения' },
                { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
              ],
            })(<Input placeholder="Название улицы..." readOnly={readOnlyMode} />)}
          </Form.Item>
        </Col>
        <Col lg={4}>
          <Form.Item label="Дом">
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
};

export default Form.create({})(CorporationForm);
