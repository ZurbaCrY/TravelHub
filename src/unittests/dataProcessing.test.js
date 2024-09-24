// __tests__/dataProcessing.test.js
import { fetchData, updateVisitedCountry, updateOrCreateVisitedCountry } from '../screens/MapScreen';
import { fetchCountries, fetchCities, fetchPlaces, isFavourite } from '../screens/MapScreen';
import { mock } from 'jest-mock-extended';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key');

jest.mock('../path/to/your/module', () => ({
  fetchCountries: jest.fn(),
  fetchCities: jest.fn(),
  fetchPlaces: jest.fn(),
  isFavourite: jest.fn(),
}));

describe('Data Processing', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetchData should fetch and process data correctly', async () => {
    const mockCountries = [{ Country_ID: 1, Countryname: 'Country1' }];
    const mockCities = [{ City_ID: 1, Cityname: 'City1', Country_ID: 1 }];
    const mockAttractions = [{ Attraction_ID: 1, Attraction_Name: 'Place1', City_ID: 1 }];
    const mockIsFavourite = jest.fn().mockResolvedValue(true);

    fetchCountries.mockResolvedValue(mockCountries);
    fetchCities.mockResolvedValue(mockCities);
    fetchPlaces.mockResolvedValue(mockAttractions);
    isFavourite.mockImplementation(mockIsFavourite);

    await fetchData();

    expect(fetchCountries).toHaveBeenCalled();
    expect(fetchCities).toHaveBeenCalled();
    expect(fetchPlaces).toHaveBeenCalled();
    expect(mockIsFavourite).toHaveBeenCalledWith(1, expect.anything());
  });

  test('updateOrCreateVisitedCountry should update existing entry if not verified', async () => {
    const mockData = { VisitedCountries_ID: 1, verified: false };
    supabase.from().select().eq().eq().single.mockResolvedValue({ data: mockData, error: null });
    supabase.from().update.mockResolvedValue({ data: [{ ...mockData, verified: true }], error: null });
    const result = await updateOrCreateVisitedCountry(1, 1);
    expect(result).toEqual([{ ...mockData, verified: true }]);
  });

  test('updateOrCreateVisitedCountry should create new entry if none exists', async () => {
    supabase.from().select().eq().eq().single.mockResolvedValue({ data: null, error: null });
    supabase.from().insert.mockResolvedValue({ data: [{ Country_ID: 1, user_id: 1, verified: true }], error: null });
    const result = await updateOrCreateVisitedCountry(1, 1);
    expect(result).toEqual([{ Country_ID: 1, user_id: 1, verified: true }]);
  });
});
