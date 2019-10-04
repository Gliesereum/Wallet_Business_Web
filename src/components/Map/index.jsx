import React from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';
import compose from 'recompose/compose';

import ScreenLoading from '../ScreenLoading';

import { mapConfig } from './mapConfig';

const Map = props => (
  <GoogleMap
    options={mapConfig}
    defaultZoom={15}
    center={{ lat: props.currentLocation.lat, lng: props.currentLocation.lng }}
  >
    {props.loading && (
      <ScreenLoading backgroundStyles={{ backgroundColor: 'rgba(0, 0, 0, 0.24)' }} />
    )}
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
