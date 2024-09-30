import { findMiddleCoordinate, haversineDistance, deg2rad } from '../services/MapMathematics';


/**
 * Findet die nächste Stadt basierend auf der aktuellen Region.
 *
 * @param {Object} region - Die Region der Karte (mit latitude und longitude).
 * @param {Array} continentsData - Array mit allen Kontinent-Daten.
 * @returns {Object} - Die nächste Stadt.
 */
export const findNearestCity = (region, continentsData) => {
    let nearestCity = null;
    let minDistance = Infinity;

    continentsData.forEach(continent => {
        continent.countries.forEach(country => {
            country.cities.forEach(city => {
                const distance = haversineDistance(
                    region.latitude,
                    region.longitude,
                    city.coordinates[0].latitude,
                    city.coordinates[0].longitude
                );

                if (distance < minDistance) {
                    minDistance = distance;
                    nearestCity = city;
                }
            });
        });
    });

    return nearestCity;
};

/**
 * Findet das Land, dem eine Stadt zugeordnet ist.
 *
 * @param {Object} city - Die Stadt, für die das Land gesucht wird.
 * @param {Array} continentsData - Array mit allen Kontinent-Daten.
 * @returns {Object} - Das Land, dem die Stadt angehört.
 */
export const findCountry = (city, continentsData) => {
  let country = null;

  continentsData.forEach(continent => {
    continent.countries.forEach(c => {
      const foundCity = c.cities.find(cityObj => cityObj.name === city.name);
      if (foundCity) {
        country = c;
        return; // Beende die Schleife, wenn die Stadt gefunden wurde
      }
    });
  });

  return country;
};
