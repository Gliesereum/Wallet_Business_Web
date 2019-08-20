import React, { useEffect, useState } from 'react';
import bem from 'bem-join';

import {
  Drawer,
  List,
  Row,
  Col,
} from 'antd';

import { scheduleListDefault, dayTranslate } from '../../mocks';
import FromToInput from '../FromToInput';

const b = bem('workerInfoDrawer');

const renderMainPart = worker => [
  {
    lineTitle: 'Имя:',
    lineContent: `${worker.user.lastName} ${worker.user.firstName} ${worker.user.middleName}`,
  },
  {
    lineTitle: 'Пол',
    lineContent: worker.user.gender || 'Неизвестно',
  },
  {
    lineTitle: 'Должность:',
    lineContent: worker.position,
  },
  {
    lineTitle: 'Номер телефона:',
    lineContent: worker.user.phone,
  },
  {
    lineTitle: 'Профайл создан:',
    lineContent: worker.user.createDate || 'Неизвестно',
  },
  {
    lineTitle: 'Последняя сессия:',
    lineContent: worker.user.lastSignIn || 'Неизвестно',
  },
  {
    lineTitle: 'Последняя активность:',
    lineContent: worker.user.lastActivity || 'Неизвестно',
  },
];

const WorkerInfoDrawer = ({
  visible,
  worker,
  onClose,
}) => {
  const [scheduleList, setScheduleList] = useState([]);

  useEffect(() => {
    const { workTimes } = worker || { workTimes: [] };
    const initDaysList = scheduleListDefault.reduce((acc, day) => {
      const initDay = workTimes.find(item => item.dayOfWeek === day.dayOfWeek);
      acc.push({ ...day, ...initDay });
      return acc;
    }, []);
    setScheduleList(initDaysList);
  }, []);

  return (
    <Drawer
      visible={visible}
      className={b()}
      width={448}
      mask
      maskClosable={false}
      onClose={onClose}
      placement="right"
      title="Профайл работника"
    >
      <h1 className={b('title')}>Основная информация</h1>
      <List className={b('list')}>
        {
          renderMainPart(worker).map(item => (
            <Row
              gutter={16}
              className={b('list-item')}
              key={item.lineTitle}
            >
              <Col
                lg={12}
                className={b('list-item-title')}
              >
                {item.lineTitle}
              </Col>
              <Col
                lg={12}
                className={b('list-item-data')}
              >
                {item.lineContent}
              </Col>
            </Row>
          ))
        }
      </List>

      <h1 className={b('title')}>Дни и часы работы</h1>
      {
        scheduleList.map(day => (
          <Row
            className={b('schedule')}
            key={day.dayOfWeek}
          >
            <Col lg={10}>
              <div>{dayTranslate[day.dayOfWeek]}</div>
            </Col>
            <Col
              lg={14}
              className={b('schedule-workHours')}
            >
              <div>Время работы</div>
              <FromToInput
                value={{ from: day.from, to: day.to }}
                asText
              />
            </Col>
          </Row>
        ))
      }
    </Drawer>
  );
};

export default WorkerInfoDrawer;
