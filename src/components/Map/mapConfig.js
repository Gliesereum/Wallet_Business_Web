export const mapConfig = {
  styles: [
    {
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#444444' }],
    },
    {
      featureType: 'administrative.country',
      elementType: 'labels.text',
      stylers: [{ color: '#ff0000' }, { visibility: 'off' }],
    },
    {
      featureType: 'administrative.province',
      elementType: 'all',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'administrative.province',
      elementType: 'labels.text',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'administrative.province',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#ff0000' }],
    },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text',
      stylers: [{ weight: '0.01' }, { visibility: 'off' }],
    },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ visibility: 'simplified' }, { color: '#a2a2a2' }, { weight: '0.52' }],
    },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.stroke',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'administrative.neighborhood',
      elementType: 'labels.text',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'administrative.neighborhood',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#aaaaaa' }],
    },
    {
      featureType: 'landscape',
      elementType: 'all',
      stylers: [{ color: '#f2f2f2' }],
    },
    {
      featureType: 'poi',
      elementType: 'all',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'road',
      elementType: 'all',
      stylers: [{ saturation: -100 }, { lightness: 45 }],
    },
    {
      featureType: 'road.highway',
      elementType: 'all',
      stylers: [{ visibility: 'simplified' }],
    },
    {
      featureType: 'road.arterial',
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      elementType: 'all',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'water',
      elementType: 'all',
      stylers: [{ color: '#46bcec' }, { visibility: 'on' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [{ color: '#b1c2c8' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#ff0000' }, { visibility: 'off' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#ffffff' }],
    },
  ],
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

export const defaultGeoPosition = {
  lat: 50.4220293,
  lng: 30.4747438,
};
