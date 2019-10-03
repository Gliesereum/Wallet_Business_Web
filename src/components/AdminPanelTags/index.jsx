import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Input,
  Button,
  Icon,
  notification,
} from 'antd';

import { fetchAction } from '../../fetches';

const b = bem('adminPanelTags');

class AdminPanelTags extends Component {
  state = {
    chosenTag: null,
    inputValue: '',
    isAddNewTagMode: false,
  };

  changeChosenTag = tag => () => this.setState({ chosenTag: tag, isAddNewTagMode: false, inputValue: tag.name });

  isAddNewTagModeToggle = () => this.setState(prevState => ({
    ...prevState,
    isAddNewTagMode: !prevState.isAddNewTagMode,
    inputValue: '',
  }));

  handleInputChange = (e) => {
    const { value } = e.target;

    this.setState({ inputValue: value });
  };

  addAndUpdateTagHandler = () => {
    const { addTag, updateTag } = this.props;
    const { inputValue, isAddNewTagMode, chosenTag } = this.state;

    const body = {
      ...chosenTag,
      name: inputValue,
    };

    try {
      fetchAction({
        url: 'tag',
        method: isAddNewTagMode ? 'POST' : 'PUT',
        body,
        reduxAction: isAddNewTagMode ? addTag : updateTag,
      })();
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Ошибка',
      });
    }
  };

  deleteTagHandler = tag => async (e) => {
    e.stopPropagation();

    const { deleteTag } = this.props;

    try {
      await fetchAction({
        url: `tag/${tag.id}`,
        method: 'DELETE',
      })();
      await deleteTag(tag);
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Ошибка',
      });
    }
  };

  render() {
    const { tags } = this.props;
    const { chosenTag, inputValue, isAddNewTagMode } = this.state;

    return (
      <div className={b()}>
        <div className={b('listBlock')}>
          <h1 className="title">Tags list</h1>
          <div className={b('list-container')}>
            {
              tags.map(tag => (
                <div
                  key={tag.id}
                  className={b('list-container-item', { active: chosenTag && (chosenTag.name === tag.name) })}
                  onClick={this.changeChosenTag(tag)}
                >
                  <div
                    className={b('list-container-item-deleteIcon')}
                    onClick={this.deleteTagHandler(tag)}
                  >
                    <Icon type="delete" />
                  </div>
                  {tag.name}
                </div>
              ))
            }
          </div>
          <Button
            type="primary"
            onClick={this.isAddNewTagModeToggle}
          >
            Add new tag
          </Button>
        </div>
        {
          (chosenTag || isAddNewTagMode) && (
            <div className={b('editorBlock')}>
              <h1 className="title">Tag editor</h1>
              <div className={b('editorContainer')}>
                <Input
                  value={inputValue}
                  placeholder="Add your new tag here"
                  onChange={this.handleInputChange}
                />
              </div>
              <Button
                type="primary"
                onClick={this.addAndUpdateTagHandler}
              >
                Save
              </Button>
            </div>
          )
        }
      </div>
    );
  }
}

export default AdminPanelTags;
