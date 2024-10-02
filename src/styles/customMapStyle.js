export const customMapStyle = [
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#3d52d5" } // Farbe für Wasser (3d52d5)
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#d4d2c8" // Farbe der Straßen
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off" // Straßenbezeichnungen ausblenden
      }
    ]
  },
  {
    "featureType": "transit.line",
    "stylers": [
      {
        "visibility": "off" // Symbole für den öffentlichen Nahverkehr ausblenden
      }
    ]
  },
  {
    "featureType": "transit.station.bus",
    "stylers": [
      { "visibility": "off" } // Busstationen ausblenden
    ]
  },
  {
    "featureType": "transit.station.rail",
    "stylers": [
      { "visibility": "off" } // Zugstationen ausblenden
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off" // Alle vordefinierten POIs ausblenden (z. B. Parkplatzsymbole, etc.)
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#fffdf3" } // Farbe für offizielle Grünflächen (wie Städte)
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#6dbd63" } // Farbe für Parks (Grün)
    ]
  }
];
