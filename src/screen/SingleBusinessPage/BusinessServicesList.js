import React, { Component } from "react";

import {
  List,
  Card,
  notification,
} from "antd";

import {
  asyncRequest,
  withToken,
} from "../../utils";

const serviceTabList = [
  {
    tab: "mainInfo",
    key: "mainInfo",
  },
  {
    tab: "additional",
    key: "additional"
  },
  {
    tab: "classes",
    key: "classes",
  },
];

class BusinessServicesList extends Component {
  state = {
    serviceTypes: [],
    filters: [],
    classes: [],
  };

  async componentDidMount() {
    const { singleBusiness } = this.props;

    const serviceTypesUrl = `service/by-business-category?businessCategoryId=${singleBusiness.businessCategoryId}`;
    const filtersUrl = `filter/by-business-category?businessCategoryId=${singleBusiness.businessCategoryId}`;
    const classesUrl = "class";

    try {
      const [serviseTypesList, classesList, filtersList] = await Promise
        .all([
          withToken(asyncRequest)({ url: serviceTypesUrl, moduleUrl: "karma" }),
          withToken(asyncRequest)({ url: filtersUrl, moduleUrl: "karma" }),
          withToken(asyncRequest)({ url: classesUrl, moduleUrl: "karma" }),
      ]);

      this.setState(() => ({
        serviceTypes: serviseTypesList || [],
        filters: filtersList || [],
        classes: classesList || [],
      }));
    } catch (error) {
      notification.error(error.message || "Ошибка");
    }
  }

  updateBusinessServices = e => {
    e.preventDefault();

    const { form, dataLoading } = this.props;

    form.validateFields(async (err, values) => {
      if (!err) {
        await dataLoading(true);

        try {
          console.log(values)
        } catch (error) {
          notification.error(error.message || "Ошибка");
        } finally {
          await dataLoading(false);
        }
      }
    })
  };

  goToServiceHandler = () => {
    this.props.history.push("/service");
  };

  render() {
    const { singleBusiness, servicePrices } = this.props;

    const services = servicePrices[singleBusiness.id];

    return (
      <>
        <List
          itemLayout="horizontal"
          dataSource={services}
          renderItem={item => (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <List.Item actions={[<a>Удалить услугу</a>]}>
              <List.Item.Meta
                onClick={this.goToServiceHandler}
                title={item.name}
                description={item.description}
              />
            </List.Item>
          )}
        />
        <Card
          tabList={serviceTabList}
        >

        </Card>
      </>
    )
  }
}

export default BusinessServicesList;
