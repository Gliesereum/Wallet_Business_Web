import React, { PureComponent } from 'react';

import {
  Row,
  Col,
  Form,
  Input,
  Button,
} from 'antd';

const { Item: FormItem } = Form;

class AdminPanelPhrasesForm extends PureComponent {
  render() {
    const {
      form,
      savePhrase,
      chosenPhrase,
      chosenPhraseLocalisation,
      changeChosenPhrase,
    } = this.props;

    return (
      <Form onSubmit={savePhrase}>
        <Row>
          <Row>
            <Col lg={24}>
              <FormItem label="module">
                {
                  form.getFieldDecorator('module', {
                    initialValue: 'coupler-web',
                  })(<Input readOnly />)
                }
              </FormItem>
              <FormItem label="direction">
                {
                  form.getFieldDecorator('direction', {
                    initialValue: 'rtl',
                  })(<Input readOnly />)
                }
              </FormItem>
              <FormItem label="code">
                {
                  form.getFieldDecorator('code', {
                    initialValue: chosenPhrase || '',
                  })(<Input />)
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col lg={8}>
              <FormItem label="en-isoKey">
                {
                  form.getFieldDecorator('en-isoKey', {
                    initialValue: 'en',
                  })(<Input readOnly />)
                }
              </FormItem>
              <FormItem label="en-label">
                {
                  form.getFieldDecorator('en-label', {
                    initialValue: 'English',
                  })(<Input readOnly />)
                }
              </FormItem>
              <FormItem label="en-text">
                {
                  form.getFieldDecorator('en-text', {
                    initialValue: chosenPhraseLocalisation ? chosenPhraseLocalisation.en : '',
                  })(<Input />)
                }
              </FormItem>
            </Col>
            <Col lg={8}>
              <FormItem label="ua-isoKey">
                {
                  form.getFieldDecorator('ua-isoKey', {
                    initialValue: 'ua',
                  })(<Input readOnly />)
                }
              </FormItem>
              <FormItem label="ua-label">
                {
                  form.getFieldDecorator('ua-label', {
                    initialValue: 'Українська',
                  })(<Input readOnly />)
                }
              </FormItem>
              <FormItem label="ua-text">
                {
                  form.getFieldDecorator('ua-text', {
                    initialValue: chosenPhraseLocalisation ? chosenPhraseLocalisation.ua : '',
                  })(<Input />)
                }
              </FormItem>
            </Col>
            <Col lg={8}>
              <FormItem label="ru-isoKey">
                {
                  form.getFieldDecorator('ru-isoKey', {
                    initialValue: 'ru',
                  })(<Input readOnly />)
                }
              </FormItem>
              <FormItem label="ru-label">
                {
                  form.getFieldDecorator('ru-label', {
                    initialValue: 'Русский',
                  })(<Input readOnly />)
                }
              </FormItem>
              <FormItem label="ru-text">
                {
                  form.getFieldDecorator('ru-text', {
                    initialValue: chosenPhraseLocalisation ? chosenPhraseLocalisation.ru : '',
                  })(<Input />)
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Button onClick={changeChosenPhrase(null)}>
                Назад к списку
              </Button>
            </Col>
            <Col lg={12}>
              <Button
                htmlType="submit"
                type="primary"
              >
                Add Phrase
              </Button>
            </Col>
          </Row>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(AdminPanelPhrasesForm);
