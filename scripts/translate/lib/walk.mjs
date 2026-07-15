import { PROTECTED_KEYS, PROTECTED_PATHS } from './protected-fields.mjs';
import { pathToKey } from './path.mjs';

// Walks the English site-content object and returns a flat list of
// "translation units" — the same granularity as the Decap CMS field
// definitions in public/admin/config.yml (a string, a list of strings, or a
// list of objects). Arrays are never recursed into further than this: a
// list-of-objects is translated as a single unit so it always keeps the
// exact same shape/length as the English source.
export function collectUnits(node, path = []) {
  const units = [];

  if (Array.isArray(node)) {
    units.push({ path, value: node });
    return units;
  }

  if (node !== null && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      const childPath = [...path, key];
      if (PROTECTED_KEYS.has(key) || PROTECTED_PATHS.has(pathToKey(childPath))) {
        continue;
      }
      if (typeof value === 'string') {
        units.push({ path: childPath, value });
      } else if (Array.isArray(value)) {
        units.push({ path: childPath, value });
      } else if (value !== null && typeof value === 'object') {
        units.push(...collectUnits(value, childPath));
      }
    }
    return units;
  }

  return units;
}
