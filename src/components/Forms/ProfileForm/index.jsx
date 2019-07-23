import React, { PureComponent } from 'react';
import bem from 'bem-join';

import {
  Form,
  Row,
  Col,
  Input,
  Select,
  Upload,
  Icon,
} from 'antd';

import ProfileEmail from '../ProfileEmail';

const b = bem('profileForm');

class ProfileForm extends PureComponent {
  render() {
    const {
      form,
      user,
      uploadAvatarImage,
      avatarImageUrl,
      isError,
      email,
      verifyUserEmail,
    } = this.props;

    return (
      <Form
        className={b()}
        colon={false}
      >
        <Row gutter={32}>
          <Col lg={8}>
            <Upload.Dragger
              className={b('uploader')}
              name="file"
              listType="picture-card"
              showUploadList={false}
              customRequest={uploadAvatarImage}
            >
              <div className={b('uploader-container')}>
                {
                  avatarImageUrl && (
                    <img
                      className={b('uploader-image')}
                      src={avatarImageUrl}
                      alt="uploaded_image"
                    />
                  )
                }
                <div className={b('uploader-inside')}>
                  <Icon className={b('uploader-inside-icon')} type="plus-circle" />
                  <h1 className={b('uploader-inside-header')}>добавить изображение</h1>
                  <p className={b('uploader-inside-text', { isError })}>
                    Аватар не должен превышать 2 МБ и должен быть у формате PNG | JPG | JPEG
                  </p>
                </div>
              </div>
            </Upload.Dragger>
          </Col>
          <Col lg={16}>
            <Row gutter={32}>
              <Col lg={12}>
                <Form.Item
                  label="Фамилия"
                >
                  {form.getFieldDecorator('lastName', {
                    initialValue: user.lastName || '',
                    rules: [
                      { required: true, message: 'Поле обязательное для заполнения' },
                      { min: 2, message: 'Минимальное количество символов: 2' },
                      { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                    ],
                  })(
                    <Input size="large" placeholder="Ввод..." />
                  )}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item
                  label="Страна проживания"
                >
                  {form.getFieldDecorator('country', {
                    initialValue: user.country || '',
                    rules: [
                      { required: true, message: 'Поле обязательное для заполнения' },
                      { min: 3, message: 'Минимальное количество символов: 3' },
                      { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                    ],
                  })(
                    <Input size="large" placeholder="Ввод..." />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={32}>
              <Col lg={12}>
                <Form.Item
                  label="Имя"
                >
                  {form.getFieldDecorator('firstName', {
                    initialValue: user.firstName || '',
                    rules: [
                      { required: true, message: 'Поле обязательное для заполнения' },
                      { min: 2, message: 'Минимальное количество символов: 2' },
                      { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                    ],
                  })(
                    <Input size="large" placeholder="Ввод..." />
                  )}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item
                  label="Город"
                >
                  {form.getFieldDecorator('city', {
                    initialValue: user.city || '',
                    rules: [
                      { required: true, message: 'Поле обязательное для заполнения' },
                      { min: 3, message: 'Минимальное количество символов: 3' },
                      { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                    ],
                  })(
                    <Input size="large" placeholder="Ввод..." />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={32}>
              <Col lg={12}>
                <Form.Item
                  label="Отчество"
                >
                  {form.getFieldDecorator('middleName', {
                    initialValue: user.middleName || '',
                    rules: [
                      { required: true, message: 'Поле обязательное для заполнения' },
                      { min: 3, message: 'Минимальное количество символов: 3' },
                      { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                    ],
                  })(
                    <Input size="large" placeholder="Ввод..." />
                  )}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item
                  label="Улица, дом"
                >
                  {form.getFieldDecorator('address', {
                    initialValue: user.address || '',
                    rules: [
                      { required: true, message: 'Поле обязательное для заполнения' },
                      { min: 6, message: 'Минимальное количество символов: 6' },
                      { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                    ],
                  })(
                    <Input size="large" placeholder="Ввод..." />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={32}>
          <Col lg={16}>
            <ProfileEmail
              email={email}
              verifyUserEmail={verifyUserEmail}
            />
          </Col>
          <Col lg={8}>
            <Form.Item
              label="Пол"
            >
              {form.getFieldDecorator('gender', {
                initialValue: user.gender || 'UNKNOWN',
              })(
                <Select size="large">
                  <Select.Option value="UNKNOWN" key="UNKNOWN">Не указано</Select.Option>
                  <Select.Option value="MALE" key="MALE">Мужской</Select.Option>
                  <Select.Option value="FEMALE" key="FEMALE">Женский</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(ProfileForm);
