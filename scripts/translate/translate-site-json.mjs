import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

import { collectUnits } from './lib/walk.mjs';
import { getPath, setPath, pathToKey } from './lib/path.mjs';
import { hashValue } from './lib/hash.mjs';
import { translateJson } from './lib/openai.mjs';
import { TARGET_LOCALES } from './lib/languages.mjs';

const I18N_DIR = path.resolve('src/content/i18n');
const CACHE_PATH = path.join(I18N_DIR, '.translation-cache.json');

async function readJson(filePath, fallback = {}) {
  if (!existsSync(filePath)) return fallback;
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function writeJson(filePath, data) {
  await writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

// English (src/content/i18n/en.json) is the single source of truth. This
// diffs every leaf field against a hash cache and only re-translates fields
// that actually changed since the last run — untouched fields, and any
// existing hand-edits in a target locale for fields that haven't changed in
// English, are left alone.
export async function translateSiteJson() {
  const enPath = path.join(I18N_DIR, 'en.json');
  const en = await readJson(enPath);
  const units = collectUnits(en);
  const cache = await readJson(CACHE_PATH);

  let anyChanged = false;

  for (const locale of TARGET_LOCALES) {
    const localePath = path.join(I18N_DIR, `${locale}.json`);
    const localeData = await readJson(localePath);

    const toTranslate = {};
    for (const unit of units) {
      const key = pathToKey(unit.path);
      const hash = hashValue(unit.value);
      const cachedHash = cache[key];
      const existingValue = getPath(localeData, unit.path);
      // Needs translation if the English source changed since last run, or
      // this locale has never had this field translated at all yet (e.g. a
      // newly added language).
      const needsTranslation = cachedHash !== hash || existingValue === undefined;
      if (needsTranslation) {
        toTranslate[key] = unit.value;
      }
    }

    const keys = Object.keys(toTranslate);
    if (keys.length === 0) continue;

    console.log(`[${locale}] translating ${keys.length} changed field(s)...`);
    const translated = await translateJson(toTranslate, locale);

    for (const key of keys) {
      const unitPath = key.split('.');
      const value = translated[key];
      if (value === undefined) {
        console.warn(`[${locale}] missing translation for "${key}", skipping.`);
        continue;
      }
      setPath(localeData, unitPath, value);
    }

    await writeJson(localePath, localeData);
    anyChanged = true;
  }

  // Only mark English hashes as "done" after every target locale above has
  // been processed, so a failure partway through doesn't mark a field as
  // translated when some locales never actually got the update.
  for (const unit of units) {
    cache[pathToKey(unit.path)] = hashValue(unit.value);
  }
  await writeJson(CACHE_PATH, cache);

  return anyChanged;
}
