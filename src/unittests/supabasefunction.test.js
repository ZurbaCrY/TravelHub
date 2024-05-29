// __tests__/supabaseFunctions.test.js
import { supabase } from '../User-Auth/supabase';

export async function fetchDataFromSupabase() {
  const { data, error } = await supabase.from('posts').select('*');
  if (error) {
    throw new Error('Failed to fetch data from Supabase');
  }
  return data;
}

jest.mock('../User-Auth/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn(),
  },
}));

describe('fetchDataFromSupabase', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('throws an error if fetching data fails', async () => {
    const errorMessage = 'Failed to fetch data from Supabase';
    supabase.from().select.mockResolvedValue({ error: new Error(errorMessage) });
    await expect(fetchDataFromSupabase()).rejects.toThrow(errorMessage);
  });
  
});
