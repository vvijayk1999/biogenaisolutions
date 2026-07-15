import { readFile, writeFile, readdir, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

import { hashValue } from './lib/hash.mjs';
import { translateJson } from './lib/openai.mjs';
import { TARGET_LOCALES } from './lib/languages.mjs';

const NEWS_DIR = path.resolve('src/content/news');
const CACHE_PATH = path.join(NEWS_DIR, '.translation-cache.json');

async function readCache() {
  if (!existsSync(CACHE_PATH)) return {};
  return JSON.parse(await readFile(CACHE_PATH, 'utf8'));
}

async function writeCache(cache) {
  await writeFile(CACHE_PATH, JSON.stringify(cache, null, 2) + '\n', 'utf8');
}

async function readAllPosts() {
  const files = (await readdir(NEWS_DIR)).filter((f) => f.endsWith('.md'));
  const posts = [];
  for (const file of files) {
    const filePath = path.join(NEWS_DIR, file);
    const raw = await readFile(filePath, 'utf8');
    const parsed = matter(raw);
    posts.push({ id: file.replace(/\.md$/, ''), filePath, data: parsed.data, body: parsed.content });
  }
  return posts;
}

async function writePost(post) {
  const raw = matter.stringify(post.body, post.data);
  await writeFile(post.filePath, raw, 'utf8');
}

// English news articles are the source of truth. Each English post gets a
// `translationKey` (defaults to its own slug) that links it to its
// translated siblings across all TARGET_LOCALES. Create/edit/draft-toggle/
// delete on the English article all propagate to every other language.
export async function translateNews() {
  const posts = await readAllPosts();
  const cache = await readCache();

  const englishPosts = posts.filter((p) => (p.data.lang ?? 'en') === 'en');
  let changed = false;

  // Backfill translationKey for English posts that don't have one yet.
  for (const post of englishPosts) {
    if (!post.data.translationKey) {
      post.data.translationKey = post.id;
      await writePost(post);
      changed = true;
    }
  }

  const postsByKey = new Map();
  for (const post of posts) {
    const key = post.data.translationKey || ((post.data.lang ?? 'en') === 'en' ? post.id : null);
    if (!key) continue;
    if (!postsByKey.has(key)) postsByKey.set(key, {});
    postsByKey.get(key)[post.data.lang ?? 'en'] = post;
  }

  // --- Propagate deletions: an English post that existed last run but is
  // gone now means its translated siblings should be removed too.
  const currentKeys = new Set(englishPosts.map((p) => p.data.translationKey));
  for (const key of Object.keys(cache)) {
    if (!currentKeys.has(key)) {
      const group = postsByKey.get(key) || {};
      for (const locale of TARGET_LOCALES) {
        const sibling = group[locale];
        if (sibling && existsSync(sibling.filePath)) {
          await unlink(sibling.filePath);
          changed = true;
        }
      }
      delete cache[key];
    }
  }

  for (const enPost of englishPosts) {
    const key = enPost.data.translationKey;
    const group = postsByKey.get(key) || {};
    const enHash = hashValue({ title: enPost.data.title, summary: enPost.data.summary, body: enPost.body });
    const cachedEntry = cache[key] || {};

    for (const locale of TARGET_LOCALES) {
      const existing = group[locale];

      // Draft/unpublish sync: mirror English draft state onto the sibling
      // without spending an API call, even if the English text is unchanged.
      if (existing && existing.data.draft !== enPost.data.draft) {
        existing.data.draft = enPost.data.draft;
        await writePost(existing);
        changed = true;
      }

      const needsTranslation = cachedEntry.hash !== enHash || !existing;
      if (!needsTranslation) continue;

      console.log(`[news:${locale}] translating "${enPost.data.title}"...`);
      const translated = await translateJson(
        { title: enPost.data.title, summary: enPost.data.summary, body: enPost.body },
        locale
      );

      const data = {
        title: translated.title,
        date: enPost.data.date,
        summary: translated.summary,
        lang: locale,
        draft: enPost.data.draft,
        translationKey: key,
      };
      if (enPost.data.thumbnail) data.thumbnail = enPost.data.thumbnail;

      const filePath = existing ? existing.filePath : path.join(NEWS_DIR, `${enPost.id}-${locale}.md`);
      await writePost({ filePath, data, body: translated.body });
      changed = true;
    }

    cache[key] = { hash: enHash };
  }

  await writeCache(cache);
  return changed;
}
