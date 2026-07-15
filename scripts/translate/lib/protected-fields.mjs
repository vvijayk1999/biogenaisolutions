// Object keys that must never be translated, wherever they appear in the
// site JSON (e.g. solutions.items[].icon is a lookup key for an icon asset,
// research.items[].url is a hyperlink, stats[].value is a numeral like "25+",
// general.brandName/brandAccent together form the literal company name
// "BioGenAI Solutions").
export const PROTECTED_KEYS = new Set([
  'icon',
  'url',
  'number',
  'value',
  'email',
  'backgroundImage',
  'brandName',
  'brandAccent',
]);

// Full dotted paths to exclude, for cases a bare key name is too broad to
// safely blanket-exclude everywhere it appears.
export const PROTECTED_PATHS = new Set([]);
