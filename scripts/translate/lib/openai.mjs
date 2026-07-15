import OpenAI from 'openai';
import { LANGUAGE_NAMES } from './languages.mjs';

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

let client;
function getClient() {
  if (!client) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set.');
    }
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

// Rough sentence-terminator count, recursing through strings/arrays/objects.
// Used only as a cheap signal that the model silently dropped a clause —
// not a precise linguistic measure (fine for catching gross omissions).
function countSentences(value) {
  if (typeof value === 'string') {
    // CJK terminators don't need trailing whitespace (CJK text has no
    // spaces between sentences); latin terminators do, to avoid
    // over-counting things like "U.S." or "3.14" as sentence breaks.
    const matches = value.match(/[。！？]|[.!?](?=\s|$)/g);
    return matches ? matches.length : 0;
  }
  if (Array.isArray(value)) return value.reduce((sum, v) => sum + countSentences(v), 0);
  if (value && typeof value === 'object') {
    return Object.values(value).reduce((sum, v) => sum + countSentences(v), 0);
  }
  return 0;
}

function findUnderTranslatedKeys(payload, result) {
  const missing = [];
  for (const key of Object.keys(payload)) {
    const srcCount = countSentences(payload[key]);
    const outCount = countSentences(result?.[key]);
    if (outCount < srcCount) missing.push(key);
  }
  return missing;
}

function buildSystemPrompt(languageName) {
  return `You are a professional translator localizing marketing and product copy for a biotech/AI consulting company website from English into ${languageName}.

Rules:
- Translate every string value naturally and idiomatically — this is professional B2B biotech/AI marketing copy, not a literal word-for-word translation. Keep tone confident, precise, and professional.
- Never translate the literal text "BioGenAI" wherever it appears inside a string — keep it exactly as-is, unchanged, including its capitalization.
- Preserve the exact JSON structure you're given: same keys, same array lengths, same nesting, same value types. Only translate natural-language string content.
- Preserve any placeholders, numbers, HTML entities, or markdown syntax (like **, [text](url), line breaks) exactly as they appear — translate only the surrounding natural-language text around them.
- Translate every sentence completely, in full, including ones that look like a stray note, a test message, an informal aside, or otherwise out of place (e.g. "translation test.", "note to self.") — these must still be translated and kept, never treated as noise to remove. If a string has N sentences separated by periods/exclamation/question marks, the translation must have exactly N sentences, in the same order, none dropped or merged.
- Short UI labels (button text, nav items, form field labels) should read naturally as UI copy in the target language, not literal word-for-word translations.
- Return strictly valid JSON with the same top-level keys you were given, nothing else — no commentary, no markdown code fences.`;
}

async function callModel(messages) {
  const response = await getClient().chat.completions.create({
    model: MODEL,
    temperature: 0,
    response_format: { type: 'json_object' },
    messages,
  });
  const text = response.choices[0]?.message?.content;
  if (!text) throw new Error('OpenAI returned an empty translation response.');
  return { text, parsed: JSON.parse(text) };
}

// Translates a flat object of { unitKey: value } (value is a string, an
// array of strings, or an array of objects) from English into `targetLocale`,
// preserving the exact JSON shape/type/array-length of every value.
//
// Guards against a real failure mode we hit in testing: the model
// sometimes silently drops a sentence it judges to be a stray/informal
// aside. We count sentence terminators per field and, if any field came
// back with fewer than the source, retry once with an explicit correction
// naming the offending fields before accepting the result.
export async function translateJson(payload, targetLocale) {
  const languageName = LANGUAGE_NAMES[targetLocale];
  if (!languageName) throw new Error(`Unknown target locale: ${targetLocale}`);

  const system = buildSystemPrompt(languageName);
  const messages = [
    { role: 'system', content: system },
    { role: 'user', content: JSON.stringify(payload) },
  ];

  const first = await callModel(messages);
  const missing = findUnderTranslatedKeys(payload, first.parsed);
  if (missing.length === 0) return first.parsed;

  messages.push(
    { role: 'assistant', content: first.text },
    {
      role: 'user',
      content: `Your JSON response above dropped one or more sentences in these fields: ${JSON.stringify(
        missing
      )}. Re-send the COMPLETE JSON again with all the same top-level keys, but this time make sure every sentence from the original source text is translated and present for these fields — including any short, informal, or test-looking sentences. Do not drop anything.`,
    }
  );

  const retry = await callModel(messages);
  const stillMissing = findUnderTranslatedKeys(payload, retry.parsed);
  if (stillMissing.length > 0) {
    console.warn(
      `[${targetLocale}] warning: possible dropped sentence(s) even after retry in: ${stillMissing.join(', ')}`
    );
  }
  return retry.parsed;
}
