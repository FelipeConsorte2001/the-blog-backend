import { generateRandomSuffix } from './generate-random-suffix';

export function slugify(text: string): string {
  const slug = text
    .normalize('NFKD')
    .toLocaleLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, '-');

  return `${slug}-${generateRandomSuffix()}`;
}
