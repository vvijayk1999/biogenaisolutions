import { translateSiteJson } from './translate-site-json.mjs';
import { translateNews } from './translate-news.mjs';

const siteChanged = await translateSiteJson();
const newsChanged = await translateNews();

if (!siteChanged && !newsChanged) {
  console.log('Nothing to translate — English content is unchanged.');
} else {
  console.log('Translation complete.');
}
