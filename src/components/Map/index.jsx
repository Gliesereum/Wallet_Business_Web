import React from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';
import compose from 'recompose/compose';

import { fetchDecorator } from '../../utils';
import { fetchGetNearbyBusinesses } from '../../fetches';

import { mapConfig } from './mapConfig';

class Map extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.currentLocation.lat === nextProps.currentLocation.lat) return;

    this.props.fetch();
  }

  render() {
    const {
      currentLocation, draggable, icon, nearbyBusinesses, onSelect,
    } = this.props;

    return (
      <GoogleMap
        options={mapConfig}
        defaultZoom={15}
        center={{ lat: currentLocation.lat, lng: currentLocation.lng }}
      >
        <Marker
          draggable={draggable}
          onDragEnd={onSelect}
          position={{ lat: currentLocation.lat, lng: currentLocation.lng }}
          icon={undefined}
        />
        {nearbyBusinesses.length && nearbyBusinesses.map(business => (
          <Marker
            key={business.id}
            draggable={draggable}
            position={{ lat: business.latitude, lng: business.longitude }}
            icon={icon}
          />
        ))}
      </GoogleMap>
    );
  }
}

export default compose(
  withScriptjs,
  withGoogleMap,
  fetchDecorator({ actions: [fetchGetNearbyBusinesses], config: { loader: true } })
)(Map);
