import React from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';
import compose from 'recompose/compose';

import { mapConfig } from './mapConfig';

const Map = props => (
  <GoogleMap
    options={mapConfig}
    defaultZoom={15}
    center={{ lat: props.currentLocation.lat, lng: props.currentLocation.lng }}
  >
    <Marker
      draggable={props.draggable}
      onDragEnd={props.onSelect}
      position={{ lat: props.currentLocation.lat, lng: props.currentLocation.lng }}
      icon={undefined}
    />
  </GoogleMap>
);

export default compose(
  withScriptjs,
  withGoogleMap,
)(Map);
