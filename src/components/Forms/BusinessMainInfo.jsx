// @flow

import React, { Component } from 'react';

import {
  Form,
  Input,
  AutoComplete,
  Select,
  Button,
  notification,
} from 'antd';

import Map from '../Map';

import {
  asyncRequest,
  withToken,
} from '../../utils';
import config from '../../config';

const FormItem = Form.Item;

type Prop = {
  singleBusiness: {},
  businessTypes: string[],
  businessCategories: {}[],
  form: Form,
  corporations: {}[],
  isAddMode: boolean,
  onToggleModal: Function,
}

type State = {
  addressNodes: React.Node[],
  currentAddress: {},
  currentLocation: {},
}

const initialFieldValues = {
  corporationId: '',
  name: '',
  description: '',
  businessType: '',
  businessCategory: '',
  currentAddressValue: '',
  currentLocationValue: {
    lat: 50.4220293,
    lng: 30.4747438,
  },
};

class BusinessMainInfo extends Component<Prop, State> {
  state = {
    addressNodes: [],
    currentAddress: null,
    currentLocation: null,
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
      form, dataLoading, updateBusiness, isAddMode, addNewBusiness, singleBusiness,
    } = this.props;
    const { currentLocation } = this.state;
    const businessHandler = isAddMode ? addNewBusiness : updateBusiness;

    form.validateFields(async (error: {}, values: {}) => {
      if (!error) {
        await dataLoading(true);
        const businessUrl = 'business';
        const method = isAddMode ? 'POST' : 'PUT';
        const moduleUrl = 'karma';
        const body = {
          ...singleBusiness,
          ...values,
          latitude: currentLocation ? currentLocation.lat : singleBusiness.latitude,
          longitude: currentLocation ? currentLocation.lng : singleBusiness.longitude,
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
        } finally {
          await dataLoading(false);
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
      isAddMode = false,
      onToggleModal,
    } = this.props;

    const { addressNodes, currentLocation, currentAddress } = this.state;

    const formInitValues = singleBusiness ? {
      corporationId: corporations.filter((corp: {}): {} => corp.id === singleBusiness.corporationId)[0].id,
      name: singleBusiness.name,
      description: singleBusiness.description,
      businessType: singleBusiness.businessCategory.businessType,
      businessCategory: singleBusiness.businessCategory.description,
      currentAddressValue: singleBusiness.address,
      currentLocationValue: {
        lat: singleBusiness.latitude,
        lng: singleBusiness.longitude,
      },
    } : initialFieldValues;

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          label="Компания"
        >
          {form.getFieldDecorator('corporationId', {
            initialValue: formInitValues.corporationId,
          })(
            <Select placeholder="Компания">
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
        <FormItem
          label="Название"
        >
          {form.getFieldDecorator('name', {
            initialValue: formInitValues.name,
            rules: [
              { required: true, message: 'Поле обязательное для заполнения' },
              { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
            ],
          })(<Input placeholder="Название бизнесса" />)}
        </FormItem>
        <FormItem
          label="Описание"
        >
          {form.getFieldDecorator('description', {
            initialValue: formInitValues.description,
            rules: [
              { required: true, message: 'Поле обязательное для заполнения' },
              { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
            ],
          })(<Input placeholder="Описание бизнесса" />)}
        </FormItem>

        {
          isAddMode ? (
            <>
              <FormItem
                label="Телефон"
              >
                {form.getFieldDecorator('phone', {
                  rules: [
                    { required: true, message: 'Please enter your phone number!' },
                    { pattern: new RegExp(/^[\d ]{12}$/), message: 'Invalid phone number!' },
                  ],
                })(
                  <Input
                    size="large"
                    placeholder="380501234567"
                  />
                )}
              </FormItem>
              <FormItem
                label="Деловая активность"
              >
                {form.getFieldDecorator('serviceType', {
                  initialValue: '',
                })(
                  <Select placeholder="Деловая активность">
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
              <FormItem
                label="Категория бизнесса"
              >
                {form.getFieldDecorator('businessCategoryId', {
                  initialValue: '',
                })(
                  <Select placeholder="Категория бизнесса">
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
            </>
          ) : (
            <>
              <div>
                <span>Деловая активность</span>
                <span>{formInitValues.businessType}</span>
              </div>
              <div>
                <span>Категория бизнесса</span>
                <span>{formInitValues.businessCategory}</span>
              </div>
            </>
          )
        }
        {/* <Form.Item */}
        {/*  label="Количество боксов" */}
        {/* > */}
        {/*  {form.getFieldDecorator("spaces", { */}
        {/*    initialValue: spaces ? spaces.length : 0, */}
        {/*  })(<InputNumber placeholder="Количество боксов"/>)} */}
        {/* </Form.Item> */}
        <FormItem
          label="Адрес"
        >
          {form.getFieldDecorator('address', {
            initialValue: currentAddress || formInitValues.currentAddressValue,
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
          containerElement={<div style={{ height: '400px' }} />}
          mapElement={<div style={{ height: '100%' }} />}
          loadingElement={<div style={{ height: '100%' }} />}
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${config.googleAPIKey}&libraries=geometry,drawing,places`}
          location={currentLocation || formInitValues.currentLocationValue}
          onSelect={this.selectAddressByMarkerHandler}
        />

        <Button
          htmlType="submit"
          type="primary"
        >
          {isAddMode ? 'Создать бизнесс' : 'Сохранить изменения'}
        </Button>
        {
          isAddMode && (
            <Button onClick={onToggleModal}>Отмена</Button>
          )
        }
      </Form>
    );
  }
}

export default Form.create({})(BusinessMainInfo);
