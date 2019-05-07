import React from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

const Map = ({ location, onSelect }) =>
  <GoogleMap
    defaultZoom={10}
    center={{ lat: location.lat, lng:location.lng }}
  >
    <Marker draggable={true} onDragEnd={onSelect} position={{ lat: location.lat, lng: location.lng }} />
  </GoogleMap>;

export default withScriptjs(withGoogleMap(Map));

