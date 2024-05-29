const { Continent, Country, City, Place, SightseeingSpot, Restaurant, ShoppingStore, Viewpoint } = require('../screens/MapScreen');

describe('Class Definitions for Map in OOP', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize Continent class correctly', () => {
    const countries = [new Country(1, 'Germany', [])];
    const europe = new Continent('Europe', countries);

    expect(europe.name).toBe('Europe');
    expect(europe.countries).toBe(countries);
    expect(europe.locked).toBe(true);
  });

  it('should initialize Country class correctly', () => {
    const cities = [new City(1, 'Berlin', [52.52, 13.405], [])];
    const germany = new Country(1, 'Germany', cities);

    expect(germany.countryId).toBe(1);
    expect(germany.name).toBe('Germany');
    expect(germany.cities).toBe(cities);
    expect(germany.locked).toBe(true);
  });

  it('should initialize City class correctly', () => {
    const places = [new Place(1, 'Brandenburg Gate', [52.5163, 13.3777], 'Sehenswürdigkeit', 'Famous landmark', 'https://example.com', false)];
    const berlin = new City(1, 'Berlin', [52.52, 13.405], places);

    expect(berlin.cityId).toBe(1);
    expect(berlin.name).toBe('Berlin');
    expect(berlin.coordinates).toEqual([52.52, 13.405]);
    expect(berlin.priceLevel).toBe(1);
    expect(berlin.places).toBe(places);
    expect(berlin.locked).toBe(true);
  });

  it('should initialize Place class correctly and toggleFavourite method should work', () => {
    const place = new Place(1, 'Brandenburg Gate', [52.5163, 13.3777], 'Sehenswürdigkeit', 'Famous landmark', 'https://example.com', false);

    expect(place.placeId).toBe(1);
    expect(place.name).toBe('Brandenburg Gate');
    expect(place.coordinates).toEqual([52.5163, 13.3777]);
    expect(place.type).toBe('Sehenswürdigkeit');
    expect(place.description).toBe('Famous landmark');
    expect(place.link).toBe('https://example.com');
    expect(place.favourite).toBe(false);

    place.toggleFavourite();
    expect(place.favourite).toBe(true);
  });

  it('should initialize SightseeingSpot class correctly', () => {
    const spot = new SightseeingSpot(1, 'Eiffel Tower', [48.8584, 2.2945], 'Iconic tower in Paris', 25, 'https://example.com', false);

    expect(spot.placeId).toBe(1);
    expect(spot.name).toBe('Eiffel Tower');
    expect(spot.coordinates).toEqual([48.8584, 2.2945]);
    expect(spot.type).toBe('Sehenswürdigkeit');
    expect(spot.description).toBe('Iconic tower in Paris');
    expect(spot.entranceFee).toBe(25);
    expect(spot.link).toBe('https://example.com');
    expect(spot.favourite).toBe(false);
  });

  it('should initialize Restaurant class correctly', () => {
    const restaurant = new Restaurant(1, 'Chez Pierre', [48.8566, 2.3522], 'French cuisine in Paris', 3, 'French', 'https://example.com', false);

    expect(restaurant.placeId).toBe(1);
    expect(restaurant.name).toBe('Chez Pierre');
    expect(restaurant.coordinates).toEqual([48.8566, 2.3522]);
    expect(restaurant.type).toBe('Restaurant');
    expect(restaurant.description).toBe('French cuisine in Paris');
    expect(restaurant.priceLevel).toBe(3);
    expect(restaurant.cuisineType).toBe('French');
    expect(restaurant.link).toBe('https://example.com');
    expect(restaurant.favourite).toBe(false);
  });

  it('should initialize ShoppingStore class correctly', () => {
    const store = new ShoppingStore(1, 'Galeries Lafayette', [48.8698, 2.3426], 'Department store in Paris', 'Clothing', true, 'https://example.com', false);

    expect(store.placeId).toBe(1);
    expect(store.name).toBe('Galeries Lafayette');
    expect(store.coordinates).toEqual([48.8698, 2.3426]);
    expect(store.type).toBe('Einkaufsladen');
    expect(store.description).toBe('Department store in Paris');
    expect(store.category).toBe('Clothing');
    expect(store.isOpen).toBe(true);
    expect(store.link).toBe('https://example.com');
    expect(store.favourite).toBe(false);
  });

  it('should initialize Viewpoint class correctly', () => {
    const viewpoint = new Viewpoint(1, 'Montmartre', [48.8867, 2.3431], 'Hill in Paris', 'Hilltop', 130, 'https://example.com', false);

    expect(viewpoint.placeId).toBe(1);
    expect(viewpoint.name).toBe('Montmartre');
    expect(viewpoint.coordinates).toEqual([48.8867, 2.3431]);
    expect(viewpoint.type).toBe('Aussichtspunkt');
    expect(viewpoint.description).toBe('Hill in Paris');
    expect(viewpoint.viewpointType).toBe('Hilltop');
    expect(viewpoint.height).toBe(130);
    expect(viewpoint.link).toBe('https://example.com');
    expect(viewpoint.favourite).toBe(false);
  });
});
