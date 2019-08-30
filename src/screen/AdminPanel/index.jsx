import React, { PureComponent } from 'react';
import compose from 'recompose/compose';

import {
  Row,
  Col,
  Form,
  Input,
  Button,
} from 'antd';

import { fetchDecorator } from '../../utils';
import { fetchAction } from '../../fetches';

const { Item: FormItem } = Form;

class AdminPanel extends PureComponent {
  savePhrase = (e) => {
    e.preventDefault();

    const { form, data } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        const languages = ['en', 'ua', 'ru'];

        const bodies = languages.map((lang) => {
          const { id: packageId } = data.packages.find(packageItem => packageItem.isoKey === lang);
          const phrases = [];
          for (const key in data.phrases) {
            if (Object.prototype.hasOwnProperty.call(data.phrases, key)) {
              phrases.push({ key, label: data.phrases[key][lang] });
            }
          }

          return ({
            id: packageId || null,
            module: values.module,
            direction: values.direction,
            isoKey: values[`${lang}-isoKey`],
            label: values[`${lang}-label`],
            phrases: [
              ...phrases,
              {
                key: values.code,
                label: values[`${lang}-text`],
              },
            ],
          });
        });

        bodies.forEach(body => fetchAction({
          url: 'package',
          method: 'PUT',
          moduleUrl: 'language',
          body,
        })());
      }
    });
  };

  render() {
    const { form } = this.props;

    return (
      <Form
        onSubmit={this.savePhrase}
        style={{
          flex: 1,
          padding: '32px',
        }}
      >
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

                  })(<Input />)
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col lg={24}>
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

export default compose(
  fetchDecorator({
    actions: [fetchAction({
      url: 'package/map/by-module?module=coupler-web',
      fieldName: 'data',
      fieldType: {},
      moduleUrl: 'language',
    })],
    config: { loader: true },
  }),
  Form.create(),
)(AdminPanel);
