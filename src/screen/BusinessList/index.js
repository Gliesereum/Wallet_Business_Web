import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { List, Card } from "antd";

class BusinessList extends Component {
  render() {
    const { business } = this.props;

    const businessList = business && business.map(bsItem => ({
      name: bsItem.name,
      description: bsItem.description,
      businessType: bsItem.businessCategory.businessType,
      businessCategory: bsItem.businessCategory.description,
      id: bsItem.id,
    }));

    return (
      <div>
        <List
          size="large"
          grid={{ gutter: 16, xs: 1, sm: 2, lg: 3, xxl: 4 }}
          dataSource={businessList}
          renderItem={bsItem => (
            <List.Item>
              <Link to={`/business/${bsItem.id}`}>
                <Card title={bsItem.name}>
                  <p>{bsItem.description}</p>
                  <span>{`${bsItem.businessType} - ${bsItem.businessCategory}`}</span>
                </Card>
              </Link>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  business: state.business.business,
});

export default connect(mapStateToProps)(BusinessList);
