import React from 'react';

import ScreenLoading from '../components/ScreenLoading';

const configDefault = {
  loader: false,
  filter: () => true,
};

const actionDefault = [() => Promise.resolve()];

export default ({ actions = actionDefault, config = configDefault }) => Component => class FetchDecorator extends React.Component {
    static displayName = `Fetch(${Component.displayName || Component.name})`;

    state = {
      loading: true,
      injectedProps: {},
    };

    componentDidMount() {
      this.fetch();
    }

  fetch = async () => {
    if (!this.state.loading) return;
    // delay for testing
    // const delay = time => result => new Promise(resolve => setTimeout(() => resolve(result), time));
    // usage:  - await func(this.props).then(delay(time));
    await Promise.all(actions.map(async (func) => {
      try {
        const fetchedData = await func(this.props);
        if (fetchedData) {
          this.setState(state => ({
            ...state,
            injectedProps: {
              ...state.injectedProps,
              [fetchedData.fieldName]: fetchedData.data,
            },
          }));
        }
      } catch (e) {
        console.error(e);
      }
    }));

    this.setState({ loading: false });
  };

  render() {
    const { loading, injectedProps } = this.state;

    if (loading && config.loader) return <ScreenLoading />;
    return (
      <Component
        {...injectedProps}
        {...this.props}
        loading={loading}
        fetch={(mutated = {}) => {
          this.setState(state => ({
            loading: config.loader,
            injectedProps: { ...state.injectedProps, ...mutated },
          }), this.fetch);
        }}
        mutate={(mutated = {}) => {
          this.setState(state => ({
            injectedProps: { ...state.injectedProps, ...mutated },
          }));
        }}
      />
    );
  }
};
