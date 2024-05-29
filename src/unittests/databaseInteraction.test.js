// __tests__/databaseInteractions.test.js
import { fetchCountries, fetchCities, fetchPlaces, isFavourite, updateFavourite, deleteFavourite } from '../screens/MapScreen';
import { mock } from 'jest-mock-extended';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key');

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
  })),
}));

describe('Database Interactions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetchCountries should fetch countries data', async () => {
    const mockData = [{ Country_ID: 1, Countryname: 'Country1' }];
    supabase.from().select.mockResolvedValue({ data: mockData, error: null });
    const data = await fetchCountries();
    expect(data).toEqual(mockData);
  });

  test('fetchCities should fetch cities data', async () => {
    const mockData = [{ City_ID: 1, Cityname: 'City1', Country_ID: 1 }];
    supabase.from().select.mockResolvedValue({ data: mockData, error: null });
    const data = await fetchCities();
    expect(data).toEqual(mockData);
  });

  test('fetchPlaces should fetch places data', async () => {
    const mockData = [{ Attraction_ID: 1, Attraction_Name: 'Place1', City_ID: 1 }];
    supabase.from().select.mockResolvedValue({ data: mockData, error: null });
    const data = await fetchPlaces();
    expect(data).toEqual(mockData);
  });

  test('isFavourite should return true if a favourite exists', async () => {
    supabase.from().select().eq().eq().single.mockResolvedValue({ data: { Attractions_ID: 1 }, error: null });
    const result = await isFavourite(1, 1);
    expect(result).toBe(true);
  });

  test('updateFavourite should insert a new favourite if it does not exist', async () => {
    supabase.from().select().eq().eq().single.mockResolvedValue({ data: null, error: null });
    supabase.from().insert.mockResolvedValue({ data: { Desired_Destination_ID: 1 }, error: null });
    const result = await updateFavourite(1, 1);
    expect(result).toEqual({ Desired_Destination_ID: 1 });
  });

  test('deleteFavourite should delete a favourite', async () => {
    supabase.from().delete().eq().eq().mockResolvedValue({ data: [], error: null });
    const result = await deleteFavourite(1, 1);
    expect(result).toEqual([]);
  });
});
