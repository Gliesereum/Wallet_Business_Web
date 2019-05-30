import React, { Component } from 'react';
import { connect } from 'react-redux';
import bem from 'bem-join';

import {
  Row,
  Col,
  // List,
  // Card,
  notification,
  // Button,
} from 'antd';

import { CorporationsList, BusinessesList } from '../../components';
// import { Modal } from '../../components';
// import { CorporationForm } from '../../components/Forms';

import { asyncRequest, withToken } from '../../utils';
import { actions } from '../../state';

import './index.scss';

const b = bem('corporationsContainer');

class CorporationsContainer extends Component {
  state = {
    chosenCorp: this.props.corporations[0],
  //   editModal: false,
  //   deleteModal: false,
  //   addModal: false,
  //   corporation: {},
  };

  // handleToggleModal = (modal, bool, corporation) => {
  //   this.setState({
  //     [modal]: bool,
  //     corporation,
  //   });
  // };

  // handleUpdateCorporation = async (newCorp) => {
  //   const { dataLoading, updateCorporation } = this.props;
  //   await dataLoading(true);
  //
  //   const url = 'corporation';
  //   const body = newCorp;
  //   const method = 'PUT';
  //   try {
  //     const updatedCorporation = await withToken(asyncRequest)({ url, method, body });
  //     await updateCorporation(updatedCorporation);
  //   } catch (err) {
  //     notification.error({
  //       duration: 5,
  //       message: err.message || 'Ошибка',
  //       description: 'Возникла ошибка',
  //     });
  //   } finally {
  //     this.setState({
  //       editModal: false,
  //     },
  //     async () => await dataLoading(false));
  //   }
  // };

  // handleAddCorporation = async (newCorp) => {
  //   const { dataLoading, addCorporation } = this.props;
  //   await dataLoading(true);
  //
  //   const url = 'corporation';
  //   const body = newCorp;
  //   const method = 'POST';
  //
  //   try {
  //     const newCorporation = await withToken(asyncRequest)({ url, method, body });
  //     await addCorporation(newCorporation);
  //   } catch (err) {
  //     notification.error({
  //       duration: 5,
  //       message: err.message || 'Ошибка',
  //       description: 'Возникла ошибка',
  //     });
  //   } finally {
  //     this.setState({
  //       addModal: false,
  //     },
  //     async () => await dataLoading(false),);
  //   }
  // };

  handleDeleteCorporation = async (corp) => {
    const { deleteCorporation, dataLoading } = this.props;
    await dataLoading(true);

    const corpId = corp.fullItemData.id;
    const url = `corporation/${corpId}`;
    const method = 'DELETE';
    try {
      await withToken(asyncRequest)({ url, method });
      await deleteCorporation(corpId);
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    } finally {
      this.setState({
        // deleteModal: false,
      },
      async () => await dataLoading(false),);
    }
  };

  chooseCorporation = (corpId) => {
    const [chosenCorp] = this.props.corporations.filter(item => item.id === corpId);
    this.setState({ chosenCorp });
  };

  render() {
    // const {
    //   editModal,
    //   deleteModal,
    //   addModal,
    //   corporation,
    // } = this.state;
    const { corporations } = this.props;
    const { chosenCorp } = this.state;
    // const corpList = corporations && corporations.map(corpItem => ({
    //   name: corpItem.name,
    //   description: corpItem.description,
    //   country: corpItem.country,
    //   city: corpItem.city,
    //   street: corpItem.street,
    //   buildingNumber: corpItem.buildingNumber,
    //   fullItemData: corpItem,
    // }));

    return (
      <Row className={b()}>
        <Col lg={8} className={b('col')}>
          <CorporationsList
            chooseCorporation={this.chooseCorporation}
            corporations={corporations}
          />
        </Col>
        <Col lg={16} className={b('col')}>
          <BusinessesList
            chosenCorp={chosenCorp}
          />
        </Col>
      </Row>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  updateCorporation: corporation => dispatch(actions.corporations.$updateCorporation(corporation)),
  addCorporation: corporation => dispatch(actions.corporations.$addCorporation(corporation)),
  deleteCorporation: id => dispatch(actions.corporations.$deleteCorporation(id)),
  dataLoading: bool => dispatch(actions.app.$dataLoading(bool)),
});

const mapStateToProps = state => ({
  corporations: state.corporations.corporations,
  businesses: state.business.businesses,
});

export default connect(mapStateToProps, mapDispatchToProps)(CorporationsContainer);
// <div>
//   <div className="karma-app-profile-addButton">
//     <Button
//       onClick={() => this.handleToggleModal('addModal', true)}
//       type="primary"
//     >
//       Добавить компанию
//     </Button>
//   </div>
//   <List
//     size="large"
//     grid={{
//       gutter: 16, xs: 1, sm: 2, lg: 3, xxl: 4,
//     }}
//     dataSource={corpList}
//     renderItem={corp => (
//       <List.Item
//         actions={[
//           <div
//             onClick={() => this.handleToggleModal('editModal', true, corp)}
//           >
//             Edit
//           </div>,
//           <div
//             onClick={() => this.handleToggleModal('deleteModal', true, corp)}
//           >
//             Delete
//           </div>,
//         ]}
//       >
//         <Card title={corp.name}>
//           <p>
//             {corp.description}
//           </p>
//           <span>
//                   {corp.country && `${corp.country}, `}
//             {corp.city && `${corp.city}, `}
//             {corp.street && `${corp.street}, `}
//             {corp.buildingNumber && `${corp.buildingNumber}`}
//                 </span>
//         </Card>
//       </List.Item>
//     )}
//   />
//   {
//     editModal && (
//       <Modal
//         title="Редактирование компании"
//         visible={editModal}
//         footer={null}
//         isOutsideClickable={false}
//         handleCancel={this.handleToggleModal}
//         closable={false}
//       >
//         <CorporationForm
//           corporation={corporation.fullItemData}
//           onSubmit={this.handleUpdateCorporation}
//           onCancelClick={this.handleToggleModal}
//           cancelText="Отмена"
//           okText="Сохранить"
//         />
//       </Modal>
//     )
//   }
//   {
//     deleteModal && (
//       <Modal
//         title="Удаление компании"
//         visible={deleteModal}
//         okText="Удалить"
//         cancelText="Отмена"
//         isOutsideClickable={false}
//         closable={false}
//         handleOk={() => this.handleDeleteCorporation(corporation)}
//         handleCancel={() => this.handleToggleModal('deleteModal', false)}
//       >
//               <span>
//                 {`Вы действительно хотите удалить компанию ${corporation.name} cо своего аккаунта?`}
//               </span>
//       </Modal>
//     )
//   }
//   {
//     addModal && (
//       <Modal
//         title="Добавление компании"
//         visible={addModal}
//         footer={null}
//         isOutsideClickable={false}
//         handleCancel={this.handleToggleModal}
//         closable={false}
//       >
//         <CorporationForm
//           onSubmit={this.handleAddCorporation}
//           onCancelClick={this.handleToggleModal}
//           cancelText="Отмена"
//           okText="Добавить"
//         />
//       </Modal>
//     )
// {/*  }*/}
// {/*</div>*/}
