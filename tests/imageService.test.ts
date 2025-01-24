import { getSupabaseFileUrl } from "@/services/imageService";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;

// TODO
describe('getSupabaseFileUrl', () => {
  it('gets the file URI in the correct form', () => {
    test('long file path', () => {
      const path = 'abcdefgh';
      const result = getSupabaseFileUrl(path);
      const expected = `${supabaseUrl}/storage/v1/object/public/${path}`;
      expect(result).toEqual(expected);
    })
  });
});