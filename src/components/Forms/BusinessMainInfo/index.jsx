// @flow

import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import compose from 'recompose/compose';
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
import ProneInput from '../../ProneInput';

import {
  asyncRequest,
  withToken,
} from '../../../utils';
import config from '../../../config';
import { defaultGeoPosition } from '../../Map/mapConfig';

import './index.scss';

const FormItem = Form.Item;
const b = bem('businessMainForm');

const translateBusinessType = {
  CAR: 'Машины',
};

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
      changeActiveTab,
      changeTabDisable,
    } = this.props;
    const { currentLocation } = this.state;

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
          if (isAddBusinessMode && !singleBusiness) {
            await addNewBusiness(newBusiness);
            changeTabDisable('services');
          } else {
            await updateBusiness(newBusiness);
          }
          changeActiveTab('services', newBusiness.id);
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

  handleRemoveBusiness = async () => {
    const { removeBusiness, singleBusiness, history } = this.props;
    const removeBusinessUrl = `business/${singleBusiness.id}`;

    try {
      await withToken(asyncRequest)({ url: removeBusinessUrl, method: 'DELETE', moduleUrl: 'karma' });
      history.replace('/corporations');
      await removeBusiness(singleBusiness.id);
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    }
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
      phonePrefix: singleBusiness.phone.match(),
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
        <div className={b('content')}>
          <Row
            gutter={40}
            className={b('outerRow')}
          >
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
            </Col>
          </Row>
          <Row
            gutter={40}
            className={b('outerRow')}
          >
            <Col lg={12}>
              <Row gutter={20}>
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
                </Col>
                <Col lg={12}>
                  <FormItem
                    label="Номер телефона"
                  >
                    {form.getFieldDecorator('phone', {
                      initialValue: formInitValues.phone,
                      rules: [
                        { required: true, message: 'Please enter your phone number!' },
                        { pattern: new RegExp(/^[\d ]{5,13}$/), message: 'Invalid phone number!' },
                      ],
                    })(
                      <ProneInput />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={20}>
                <Col lg={12}>
                  <FormItem
                    label="Категория бизнесса"
                  >
                    {form.getFieldDecorator('businessCategoryId', {
                      initialValue: formInitValues.businessCategory,
                      rules: [
                        { required: true, message: 'Поле обязательное для заполнения' },
                      ],
                    })(
                      <Select
                        disabled={!isAddBusinessMode}
                        placeholder="Выбрать..."
                      >
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
                </Col>
                <Col lg={12}>
                  <FormItem
                    label="Деловая активность"
                  >
                    {form.getFieldDecorator('serviceType', {
                      initialValue: formInitValues.businessType,
                      rules: [
                        { required: true, message: 'Поле обязательное для заполнения' },
                      ],
                    })(
                      <Select
                        placeholder="Выбрать..."
                        disabled={!isAddBusinessMode}
                      >
                        {businessTypes && businessTypes.map((businessType: string): React.Node => (
                          <Select.Option
                            key={businessType}
                            value={businessType}
                          >
                            {translateBusinessType[businessType]}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={40}>
                <Col lg={24}>
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
              </Row>
            </Col>
            <Col lg={12}>
              <Map
                containerElement={<div style={{ height: '272px', marginTop: '24px' }} />}
                mapElement={<div style={{ height: '100%' }} />}
                loadingElement={<div style={{ height: '100%' }} />}
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${config.googleAPIKey}&libraries=geometry,drawing,places`}
                currentLocation={currentLocation || formInitValues.currentLocationValue}
                onSelect={this.selectAddressByMarkerHandler}
                singlePin
              />
            </Col>
          </Row>
        </div>
        <Row
          gutter={40}
          className={b('controlBtns')}
        >
          <Col lg={isAddBusinessMode ? 12 : 8}>
            <Button className={b('controlBtns-btn backBtn')}>
              <Link to="/corporations">
                <Icon type="left" />
                Назад к списку
              </Link>
            </Button>
          </Col>
          {
            !isAddBusinessMode && (
              <Col lg={8}>
                <Button
                  className={b('controlBtns-btn deleteBtn')}
                  onClick={this.handleRemoveBusiness}
                >
                  Удалить бизнес
                </Button>
              </Col>
            )
          }
          <Col lg={isAddBusinessMode ? 12 : 8}>
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

export default compose(
  withRouter,
  Form.create({}),
)(BusinessMainInfo);
