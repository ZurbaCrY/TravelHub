/**
 * Definitionen der Klassen für die Map nach OOP
 *
 */

class Continent {
  constructor(name, countries) {
    this.name = name;
    this.countries = countries;
    this.locked = true;
  }
}

class Country {
  constructor(countryId, name, cities) {
    this.countryId = countryId;
    this.name = name;
    this.cities = cities;
    this.locked = true;
  }
}

class City {
  constructor(cityId, name, coordinates, places) {
    this.cityId = cityId;
    this.name = name;
    this.coordinates = coordinates;
    this.priceLevel = 1;
    this.places = places;
    this.locked = true;
  }
}

class Place {
  constructor(placeId, name, coordinates, type, description, link, fave) {
    this.placeId = placeId;
    this.name = name;
    this.coordinates = coordinates;
    this.type = type;
    this.favourite = fave;
    this.description = description;
    this.link = link;
  }
  toggleFavourite() {
    this.favourite = !this.favourite;
  }
}

class SightseeingSpot extends Place {
  constructor(placeId, name, coordinates, description, entranceFee, link, fave) {
    super(placeId, name, coordinates, description, link, fave);
    this.type = 'Sehenswürdigkeit';
    this.entranceFee = entranceFee;
  }
}

class Restaurant extends Place {
  constructor(placeId, name, coordinates, description, priceLevel, cuisineType, link, fave) {
    super(placeId, name, coordinates, description, link, fave);
    this.type = 'Restaurant';
    this.priceLevel = priceLevel;
    this.cuisineType = cuisineType;
  }
}

class ShoppingStore extends Place {
  constructor(placeId, name, coordinates, description, category, isOpen, link, fave) {
    super(placeId, name, coordinates, description, link, fave);
    this.type = 'Einkaufsladen';
    this.category = category;
    this.isOpen = isOpen;
  }
}

class Viewpoint extends Place {
  constructor(placeId, name, coordinates, description, viewpointType, height, link, fave) {
    super(placeId, name, coordinates, description, link, fave);
    this.type = 'Aussichtspunkt';
    this.viewpointType = viewpointType;
    this.height = height;
  }
}

export { Continent, Country, City, Place, SightseeingSpot, Restaurant, ShoppingStore, Viewpoint };
