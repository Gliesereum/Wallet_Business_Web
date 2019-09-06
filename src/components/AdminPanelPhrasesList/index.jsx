import React, { Component } from 'react';

import {
  Row,
  Col,
  Button,
  List,
} from 'antd';

class AdminPanelPhrasesList extends Component {
  state = {
    phrasesList: [],
  };

  componentDidMount() {
    const { phrases = [] } = this.props;
    const phrasesList = [];

    for (const key in phrases) {
      if (Object.prototype.hasOwnProperty.call(phrases, key)) {
        phrasesList.push(key);
      }
    }

    this.setState({ phrasesList });
  }

  render() {
    const { phrasesList } = this.state;
    const { phrases, changeChosenPhrase } = this.props;

    return (
      <div style={{ flex: 1 }}>
        <List
          style={{ maxHeight: '500px', overflowY: 'scroll' }}
          size="large"
          bordered
          dataSource={phrasesList}
          renderItem={phrase => (
            <List.Item onClick={changeChosenPhrase(phrase)}>
              <Row style={{ width: '100%' }}>
                <Col
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    borderBottom: '2px solid',
                    borderBottomColor: '#93bbdc',
                    paddingBottom: '5px',
                    marginBottom: '5px',
                  }}
                  lg={24}
                >
                  {phrase}
                </Col>
                <Col lg={8}>
                  {phrases[phrase].ua}
                </Col>
                <Col lg={8}>
                  {phrases[phrase].ru}
                </Col>
                <Col lg={8}>
                  {phrases[phrase].en}
                </Col>
              </Row>
            </List.Item>
          )}
        />
        <Button
          style={{ marginTop: '50px' }}
          type="primary"
          onClick={changeChosenPhrase(null, true)}
        >
          Добавить новую фразу
        </Button>
      </div>
    );
  }
}

export default AdminPanelPhrasesList;
