import React, { PureComponent } from 'react';
import bem from 'bem-join';

import {
  Form,
  Row,
  Col,
  Input,
  Select,
  Upload,
  Spin,
} from 'antd';

import ProfileEmail from '../ProfileEmail';
import { AddIcon } from '../../../assets/iconComponents';
import { genders } from '../../../mocks';


const { Dragger: UploadDragger } = Upload;
const b = bem('profileForm');

class ProfileForm extends PureComponent {
  render() {
    const {
      form,
      user,
      readOnlyMode,
      logoUrl,
      isError,
      loading,
      email,
      verifyUserEmail,
      onChange,
      uploadAvatarImage,
    } = this.props;

    return (
      <Form
        className={b()}
        colon={false}
      >
        <Row gutter={32}>
          <Col lg={8}>
            <UploadDragger
              disabled={readOnlyMode}
              className={b('uploader')}
              name="file"
              listType="picture-card"
              showUploadList={false}
              onChange={onChange}
              customRequest={uploadAvatarImage}
            >
              <div className={b('uploader-container')}>
                {
                  loading ? (
                    <Spin size="large" />
                  ) : (
                    <>
                      {
                        logoUrl && (
                          <img
                            className={b('uploader-image')}
                            src={logoUrl}
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
                            <h1 className={b('uploader-inside-header')}>
                              {
                                user.avatarUrl ? 'загрузить новое изображение' : 'добавить изображение'
                              }
                            </h1>
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
                    </>
                  )
                }
              </div>
            </UploadDragger>
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
                    <Input
                      size="large"
                      placeholder="Ввод..."
                      readOnly={readOnlyMode}
                    />
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
                    <Input
                      size="large"
                      placeholder="Ввод..."
                      readOnly={readOnlyMode}
                    />
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
                    <Input
                      size="large"
                      placeholder="Ввод..."
                      readOnly={readOnlyMode}
                    />
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
                    <Input
                      size="large"
                      placeholder="Ввод..."
                      readOnly={readOnlyMode}
                    />
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
                    <Input
                      size="large"
                      placeholder="Ввод..."
                      readOnly={readOnlyMode}
                    />
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
                    <Input
                      size="large"
                      placeholder="Ввод..."
                      readOnly={readOnlyMode}
                    />
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
              readOnly={readOnlyMode}
            />
          </Col>
          <Col lg={8}>
            <Form.Item
              label="Пол"
            >
              {form.getFieldDecorator('gender', {
                initialValue: (!readOnlyMode ? user.gender : genders[user.gender])
                  || (!readOnlyMode ? 'UNKNOWN' : genders.UNKNOWN),
              })(
                !readOnlyMode ? (
                  <Select size="large">
                    <Select.Option value="UNKNOWN" key="UNKNOWN">{genders.UNKNOWN}</Select.Option>
                    <Select.Option value="MALE" key="MALE">{genders.MALE}</Select.Option>
                    <Select.Option value="FEMALE" key="FEMALE">{genders.FEMALE}</Select.Option>
                  </Select>
                ) : (
                  <Input readOnly={readOnlyMode} />
                )
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(ProfileForm);
