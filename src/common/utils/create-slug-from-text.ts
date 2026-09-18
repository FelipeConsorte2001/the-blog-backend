import { slugify } from './slugify';

export function createSlugFromText(text: string) {
  return slugify(text);
}
