import React from 'react';

const configDefault = {
  loader: true,
  filter: () => true,
};

const actionDefault = () => Promise.resolve();

export default (action = actionDefault, config = configDefault) => Component => class FetchDecorator extends React.Component {
    static displayName = `Fetch(${Component.displayName || Component.name})`;

    state = {
      loading: config.filter(this.props),
      injectedProps: {},
    };

    fetchId = undefined;

    componentDidMount() {
      this.startFetch();
    }

    startFetch = () => {
      if (!this.state.loading) return;

      this.fetchId = Math.random();
      this.fetch(this.fetchId);
    };

    fetch = async (fetchId) => {
      action(this.props)
        .then((fetchedData = {}) => {
          if (fetchId !== this.fetchId) return;

          this.setState({
            loading: false,
            injectedProps: fetchedData,
          });
        })
        .catch((error) => {
          if (fetchId !== this.fetchId) return;
          console.error(error);

          this.setState({ loading: false });
        });
    };

    render() {
      const { loading, injectedProps } = this.state;

      if (loading) return '...loading';

      return (
        <Component
          loading={loading}
          {...{ ...injectedProps, ...this.props }}
        />
      );
    }
};
