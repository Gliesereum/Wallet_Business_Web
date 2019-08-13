import React, { Component } from 'react';
import { connect } from 'react-redux';
import bem from 'bem-join';

// import { OrdersList, OrdersChart } from '../../components';

const b = bem('ordersPage');

class OrdersPage extends Component {
  state ={

  };

  render() {
    return (
      <div className={b()}>OrdersPage</div>
    );
  }
}

const mapStateToProps = state => ({
  corporations: state.corporations.corporations,
});

export default connect(mapStateToProps)(OrdersPage);
