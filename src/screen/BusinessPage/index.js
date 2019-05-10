import React from 'react';
import {Link, withRouter} from 'react-router-dom';

import {Button, Icon} from 'antd';

import './index.scss';

const BusinessPage = (props) => {
  const isAddPage = props.location.pathname.match('/add');

  return (
    <div className="karma-app-business">
      <div className="karma-app-business-header">
        {!isAddPage && (
          <div className="karma-app-business-header-addBtn">
            <Button type="primary">
              <Link to="business/add" className="karma-app-business-header-addBtn-link">
                <Icon type="plus"/>
                <span className="karma-app-business-header-addBtn-text">Добавить бизнесс</span>
              </Link>
            </Button>
          </div>
        )}
      </div>
      <div className="karma-app-business-contentBox">
        {props.children}
      </div>
    </div>
  );
};

export default withRouter(BusinessPage);
