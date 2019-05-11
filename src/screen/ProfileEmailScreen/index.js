import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
  Form,
  Input,
  Button,
  notification,
  Card,
} from 'antd';

import {
  asyncRequest,
  withToken,
} from '../../utils';

import {actions} from '../../state';

import './index.scss';

class ProfileEmailScreen extends Component {
  state = {
    gotCode: false,
    editMode: !this.props.email || false,
  };

  getCode = async () => {
    const {dataLoading, form} = this.props;

    form.validateFields(async (error, values) => {
      if (!error) {
        dataLoading(true);
        const url = `email/code?email=${values.email}`

        try {
          await withToken(asyncRequest)({url});
          this.setState({gotCode: true});
          form.setFieldsValue({email: values.email});
        } catch (error) {
          notification.error(error.message || 'Ошибка');
        } finally {
          dataLoading(false);
        }
      }
    });
  };

  sendCode = (mode = 'add') => {
    const {dataLoading, verifyUserEmail, form} = this.props;

    form.validateFields(async (error, values) => {
      if (!error) {
        dataLoading(true);

        const {email, code} = values;
        const url = 'email';
        const body = {code, email};
        const method = mode === 'update' ? 'PUT' : 'POST';

        try {
          const newEmail = await withToken(asyncRequest)({url, method, body});
          await verifyUserEmail(newEmail);
          this.setState({gotCode: false, editMode: false})
        } catch (e) {
          notification.error({
            duration: 5,
            message: e.message || 'Ошибка',
            description: 'Возникла ошибка',
          });
        } finally {
          dataLoading(false);
        }
      }
    });

  };

  toggleEditMode = () => {
    this.setState({editMode: !this.state.editMode, gotCode: false});
  };

  renderEmailForm = () => {
    const {form, email} = this.props;
    const {gotCode, editMode} = this.state;

    return (
      <Form
        className="karma-app-profile-emailScreen-form"
        wrapperCol={{span: 11}}
        labelCol={{span: 9}}
      >
        <Form.Item label="Почта">
          {
            form.getFieldDecorator('email', {
              initialValue: email ? email.email : '',
              rules: [
                {required: true, message: 'Поле обязательное для заполнения'},
                {type: 'email', message: 'Введите валидный E-mail!'},
              ],
            })(<Input placeholder="Email"/>)
          }
        </Form.Item>
        {gotCode ? (
          <>
            <Form.Item label="Введите код отправленный на указанную почту">
              {
                form.getFieldDecorator('code', {
                  getValueFromEvent: e => {
                    const codeNumber = Number(e.currentTarget.value);
                    if (isNaN(codeNumber)) {
                      return form.getFieldValue('code') ? Number(form.getFieldValue('code')) : '';
                    } else {
                      return codeNumber;
                    }
                  },
                  rules: [
                    {required: true, message: 'Поле обязательное для заполнения'},
                    {pattern: new RegExp(/^[\d ]{6}$/), message: 'Нужно ввести все 6 цифр!'},
                    {type: 'number', message: 'Код состоит только с цифр'},
                  ]
                })(<Input placeholder="Code"/>)
              }
            </Form.Item>
            <div className="karma-app-profile-emailScreen-buttons">
              <Button onClick={this.toggleEditMode}>Отменить</Button>
              <Button
                type="primary"
                onClick={editMode ?
                  () => this.sendCode('update')
                  : () => this.sendCode('add')
                }
                className="karma-app-profile-emailScreen-form-addButton"
              >
                {editMode ? 'Изменить почту' : 'Добавить email'}
              </Button>
            </div>
          </>
        ) : (
          <div className="karma-app-profile-emailScreen-buttons">
            <Button onClick={this.toggleEditMode}>Отменить</Button>
            <Button
              type="primary"
              onClick={this.getCode}
            >
              Получить код
            </Button>
          </div>
        )}
      </Form>
    )
  };

  renderEmailList = (email) => {
    return (
      <div className="karma-app-profile-emailScreen-list">
        <div className="karma-app-profile-emailScreen-list-email">{email}</div>
        <Button type="primary" onClick={this.toggleEditMode}>Изменить почту</Button>
      </div>
    )
  };

  render() {
    const {email} = this.props;
    const {editMode} = this.state;

    return (
      <Card
        size="default"
        title={editMode ? 'Изменить почту' : 'Текущая почта'}
      >
        {editMode ? this.renderEmailForm() : this.renderEmailList(email.email)}
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  email: state.auth.email,
});

const mapDispatchToProps = (dispatch) => ({
  verifyUserEmail: email => dispatch(actions.auth.$verifyUserEmail(email)),
  dataLoading: bool => dispatch(actions.app.$dataLoading(bool)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ProfileEmailScreen));
