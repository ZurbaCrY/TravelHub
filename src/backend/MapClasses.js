/**
 * Definitionen der Klassen für die Map nach OOP
 *
 */

class Continent {
  constructor(name, countries) {
    this.name = name;
    this.countries = countries;
    this.locked = true; // Annahme: alle Kontinente sind zu Beginn gesperrt
  }
}

class Country {
  constructor(countryId, name, cities) {
    this.countryId = countryId;
    this.name = name;
    this.cities = cities;
    this.locked = true; // Annahme: alle Länder sind zu Beginn gesperrt
  }
}

class City {
  constructor(cityId, name, coordinates, places) {
    this.cityId = cityId;
    this.name = name;
    this.coordinates = coordinates;
    this.priceLevel = 1; // z.B. preisliche Einordnung der Stadt
    this.places = places; // Array von Orten in der Stadt
    this.locked = true; // Annahme: alle Städte sind zu Beginn entsperrt
  }
}

class Place {
  constructor(placeId, name, coordinates, type, description, link, fave) {
    this.placeId = placeId;
    this.name = name;
    this.coordinates = coordinates;
    this.type = type; // Der Ortstyp (z.B. 'Sehenswürdigkeit', 'Restaurant', 'Einkaufsladen', 'Aussichtspunkt')
    this.favourite = fave;
    this.description = description;
    this.link = link;
  }
  // Methode zum Aktualisieren des Favoritenstatus
  toggleFavourite() {
    this.favourite = !this.favourite;
  }
}

class SightseeingSpot extends Place {
  constructor(placeId, name, coordinates, description, entranceFee, link, fave) {
    super(placeId, name, coordinates, description, link, fave);
    this.type = 'Sehenswürdigkeit';
    this.entranceFee = entranceFee; // Eintrittsgebühr für Sehenswürdigkeiten
  }
}

class Restaurant extends Place {
  constructor(placeId, name, coordinates, description, priceLevel, cuisineType, link, fave) {
    super(placeId, name, coordinates, description, link, fave);
    this.type = 'Restaurant';
    this.priceLevel = priceLevel; // Preisniveau des Restaurants
    this.cuisineType = cuisineType; // Art der Küche im Restaurant
  }
}

class ShoppingStore extends Place {
  constructor(placeId, name, coordinates, description, category, isOpen, link, fave) {
    super(placeId, name, coordinates, description, link, fave);
    this.type = 'Einkaufsladen';
    this.category = category; // Kategorie des Geschäfts (z.B. Bekleidung, Souvenirs, Lebensmittel)
    this.isOpen = isOpen; // Gibt an, ob der Laden geöffnet ist oder nicht
  }
}

class Viewpoint extends Place {
  constructor(placeId, name, coordinates, description, viewpointType, height, link, fave) {
    super(placeId, name, coordinates, description, link, fave);
    this.type = 'Aussichtspunkt';
    this.viewpointType = viewpointType; // Art des Aussichtspunkts (z.B. Berggipfel, Wolkenkratzer, Aussichtsturm)
    this.height = height; // Höhe des Aussichtspunkts über dem Meeresspiegel oder der umgebenden Landschaft
  }
}

export { Continent, Country, City, Place, SightseeingSpot, Restaurant, ShoppingStore, Viewpoint };
