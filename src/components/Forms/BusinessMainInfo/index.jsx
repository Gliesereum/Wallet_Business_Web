// @flow

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import bem from 'bem-join';

import {
  Form,
  Row,
  Col,
  Input,
  AutoComplete,
  Select,
  Button,
  notification,
  Icon,
} from 'antd';

import Map from '../../Map';

import {
  asyncRequest,
  withToken,
} from '../../../utils';
import config from '../../../config';
import { defaultGeoPosition } from '../../Map/mapConfig';

import './index.scss';

const FormItem = Form.Item;
const b = bem('businessMainForm');

type Prop = {
  singleBusiness: {},
  businessTypes: string[],
  businessCategories: {}[],
  form: Form,
  corporations: {}[],
  isAddBusinessMode: boolean,
}

type State = {
  addressNodes: React.Node[],
  currentAddress: {},
  currentLocation: {},
}

const initialFieldValues = (chosenCorpId: {} = undefined): {} => ({
  corporationId: chosenCorpId,
  name: '',
  description: '',
  phone: '',
  businessType: undefined,
  businessCategory: undefined,
  currentAddressValue: '',
  currentLocationValue: defaultGeoPosition,
});

class BusinessMainInfo extends Component<Prop, State> {
  state = {
    disabled: false,
    addressNodes: [],
    currentAddress: null,
    currentLocation: defaultGeoPosition,
  };

  searchAddressHandler = (value: string) => {
    if (value.length >= 2) {
      const autoCompleteUrl = `https://maps.googleapis.com/maps/api/place/queryautocomplete/json?input=${value}&key=${config.googleAPIKey}`;
      fetch(config.corsUrl + autoCompleteUrl)
        .then((data: Response): object => data.json())
        .then(({ predictions }: { predictions: {}[] }) => {
          const addressNodes = predictions.map((item: object): React.Node => (
            <AutoComplete.Option
              key={item.description}
              value={item.description}
              address={item}
            >
              {item.description}
            </AutoComplete.Option>
          ));
          this.setState((prevState: State): {} => ({
            ...prevState,
            addressNodes,
          }));
        });
    }
  };

  getPlaceInfo = async (id: string): {} => {
    const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${id}&fields=geometry&key=${config.googleAPIKey}`;
    const request = await fetch(config.corsUrl + placeDetailsUrl);
    return request.json();
  };

  selectAddressByInputHandler = async (value: string, addressObj: {}) => {
    const { result } = await this.getPlaceInfo(addressObj.props.address.place_id);
    this.setState((prevState: State): {} => ({
      ...prevState,
      currentAddress: value,
      currentLocation: result.geometry.location,
    }));
  };

  // TODO: change type for return
  selectAddressByMarkerHandler = async ({ latLng }: { latLng: {} }): any => {
    const { form } = this.props;
    const location = {
      lat: latLng.lat(),
      lng: latLng.lng(),
    };

    const addressUrl = `${config.corsUrl}https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&sensor=true&key=${config.googleAPIKey}`;
    const request = await fetch(addressUrl);
    const { results } = await request.json();
    const address = results[0].formatted_address;
    this.setState((prevState: State): {} => ({
      ...prevState,
      currentAddress: address,
      currentLocation: location,
    }));
    form.setFieldsValue({ address });
  };

  handleSubmit = (e: SyntheticEvent<>) => {
    e.preventDefault();

    const {
      form,
      updateBusiness,
      isAddBusinessMode,
      addNewBusiness,
      singleBusiness,
    } = this.props;
    const { currentLocation } = this.state;
    const businessHandler = isAddBusinessMode && !singleBusiness ? addNewBusiness : updateBusiness;

    form.validateFields(async (error: {}, values: {}) => {
      if (!error) {
        const businessUrl = 'business';
        const method = isAddBusinessMode && !singleBusiness ? 'POST' : 'PUT';
        const moduleUrl = 'karma';
        const body = {
          ...singleBusiness,
          ...values,
          latitude: currentLocation ? currentLocation.lat : singleBusiness.latitude,
          longitude: currentLocation ? currentLocation.lng : singleBusiness.longitude,
          timeZone: singleBusiness ? singleBusiness.timeZone : -new Date().getTimezoneOffset(),
        };

        try {
          const newBusiness = await withToken(asyncRequest)({
            url: businessUrl, method, moduleUrl, body,
          });
          await businessHandler(newBusiness);
        } catch (err) {
          notification.error({
            duration: 5,
            message: err.message || 'Ошибка',
            description: 'Возникла ошибка',
          });
        }
      }
    });
  };

  render(): React.Node {
    const {
      singleBusiness,
      businessTypes,
      businessCategories,
      form,
      corporations,
      isAddBusinessMode,
      chosenCorpId,
    } = this.props;
    const {
      addressNodes, currentLocation, currentAddress,
    } = this.state;

    const formInitValues = singleBusiness ? {
      corporationId: corporations.filter((corp: {}): {} => corp.id === singleBusiness.corporationId)[0].id,
      name: singleBusiness.name,
      description: singleBusiness.description,
      phone: singleBusiness.phone,
      businessType: singleBusiness.businessCategory.businessType,
      businessCategory: singleBusiness.businessCategory.id,
      currentAddressValue: singleBusiness.address,
      currentLocationValue: {
        lat: singleBusiness.latitude,
        lng: singleBusiness.longitude,
      },
    } : initialFieldValues(chosenCorpId);

    return (
      <Form
        onSubmit={this.handleSubmit}
        className={b()}
      >
        <Row gutter={40}>
          <Col lg={12}>
            <FormItem
              label="Компания"
            >
              {form.getFieldDecorator('corporationId', {
                initialValue: formInitValues.corporationId,
                rules: [
                  { required: true, message: 'Поле обязательное для заполнения' },
                ],
              })(
                <Select placeholder="Выбрать компанию...">
                  {corporations && corporations.map((corporation: {}): React.Node => (
                    <Select.Option
                      key={corporation.name}
                      value={corporation.id}
                    >
                      {corporation.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <Row gutter={40}>
              <Col lg={12}>
                <FormItem
                  label="Название бизнеса"
                >
                  {form.getFieldDecorator('name', {
                    initialValue: formInitValues.name,
                    rules: [
                      { required: true, message: 'Поле обязательное для заполнения' },
                      { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                    ],
                  })(<Input placeholder="Название бизнесса" />)}
                </FormItem>
                {
                  isAddBusinessMode ? (
                    <FormItem
                      label="Деловая активность"
                    >
                      {form.getFieldDecorator('serviceType', {
                        initialValue: formInitValues.businessType,
                        rules: [
                          { required: true, message: 'Поле обязательное для заполнения' },
                        ],
                      })(
                        <Select placeholder="Выбрать...">
                          {businessTypes && businessTypes.map((businessType: string): React.Node => (
                            <Select.Option
                              key={businessType}
                              value={businessType}
                            >
                              {businessType}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  ) : (
                    <div style={{ marginBottom: '40px' }}>
                      <span>Деловая активность</span>
                      <p>{formInitValues.businessType}</p>
                    </div>
                  )
                }
              </Col>
              <Col lg={12}>
                <FormItem
                  label="Номер телефона"
                >
                  {form.getFieldDecorator('phone', {
                    initialValue: formInitValues.phone,
                    rules: [
                      { required: true, message: 'Please enter your phone number!' },
                      { pattern: new RegExp(/^\+[\d ]{12}$/), message: 'Invalid phone number!' },
                    ],
                  })(
                    <Input
                      size="large"
                      placeholder="+ 380 88 888 88 88"
                    />
                  )}
                </FormItem>
                {
                  isAddBusinessMode ? (
                    <FormItem
                      label="Категория бизнесса"
                    >
                      {form.getFieldDecorator('businessCategoryId', {
                        initialValue: formInitValues.businessCategory,
                        rules: [
                          { required: true, message: 'Поле обязательное для заполнения' },
                        ],
                      })(
                        <Select placeholder="Выбрать...">
                          {businessCategories && businessCategories.map((corporation: {}): React.Node => (
                            <Select.Option
                              key={corporation.name}
                              value={corporation.id}
                            >
                              {corporation.name}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  ) : (
                    <div style={{ marginBottom: '40px' }}>
                      <span>Категория бизнесса</span>
                      <p>{formInitValues.businessCategory}</p>
                    </div>
                  )
                }
              </Col>
            </Row>
            <FormItem
              label="Оприделение бизнеса (описание)"
            >
              {form.getFieldDecorator('description', {
                initialValue: formInitValues.description,
                rules: [
                  { required: true, message: 'Поле обязательное для заполнения' },
                  { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                ],
              })(<Input placeholder="Описание бизнесса" />)}
            </FormItem>
          </Col>
          <Col lg={12}>
            <FormItem
              label="Адрес"
            >
              {form.getFieldDecorator('address', {
                initialValue: currentAddress || formInitValues.currentAddressValue,
                rules: [
                  { required: true, message: 'Поле обязательное для заполнения' },
                ],
              })(
                <AutoComplete
                  placeholder="Адрес"
                  onSearch={this.searchAddressHandler}
                  dataSource={addressNodes}
                  onSelect={this.selectAddressByInputHandler}
                />
              )}
            </FormItem>
            <Map
              containerElement={<div style={{ height: '272px', marginTop: '64px' }} />}
              mapElement={<div style={{ height: '100%' }} />}
              loadingElement={<div style={{ height: '100%' }} />}
              googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${config.googleAPIKey}&libraries=geometry,drawing,places`}
              currentLocation={currentLocation || formInitValues.currentLocationValue}
              onSelect={this.selectAddressByMarkerHandler}
              singlePin
            />
          </Col>
        </Row>
        <Row
          gutter={40}
          className={b('controlBtns')}
        >
          <Col lg={12}>
            <Button className={b('controlBtns-btn backBtn')}>
              <Link to="/corporations">
                <Icon type="left" />
                Назад
              </Link>
            </Button>
          </Col>
          <Col lg={12}>
            <Button
              className={b('controlBtns-btn')}
              htmlType="submit"
              type="primary"
            >
              {isAddBusinessMode ? 'Сохранить' : 'Далее'}
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create({})(BusinessMainInfo);
