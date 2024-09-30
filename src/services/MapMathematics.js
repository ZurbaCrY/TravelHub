/**
 * Berechnet die mittlere Koordinate einer Liste von Koordinaten.
 *
 * @param {Array} coordinates - Array von Koordinatenobjekten mit latitude und longitude
 * @returns {Object|null} - Die mittlere Koordinate oder null, wenn das Array leer ist
 */
export const findMiddleCoordinate = (coordinates) => {
    if (coordinates.length === 0) {
        return null;
    }

    let sumLat = 0;
    let sumLng = 0;

    for (const coord of coordinates) {
        sumLat += coord.latitude;
        sumLng += coord.longitude;
    }

    const avgLat = sumLat / coordinates.length;
    const avgLng = sumLng / coordinates.length;

    return { latitude: avgLat, longitude: avgLng };
};

/**
 * Berechnet die Entfernung zwischen zwei Koordinaten mithilfe der Haversine-Formel.
 *
 * @param {number} lat1 - Breitengrad der ersten Koordinate
 * @param {number} lon1 - Längengrad der ersten Koordinate
 * @param {number} lat2 - Breitengrad der zweiten Koordinate
 * @param {number} lon2 - Längengrad der zweiten Koordinate
 * @returns {number} - Entfernung zwischen den zwei Koordinaten in Kilometern
 */
export const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius der Erde in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
};

/**
 * Konvertiert Grad in Bogenmaß.
 *
 * @param {number} deg - Der Wert in Grad
 * @returns {number} - Der Wert in Bogenmaß
 */
export const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
};
