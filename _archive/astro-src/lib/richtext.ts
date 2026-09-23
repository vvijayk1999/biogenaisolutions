/**
 * Inline markdown for CMS-authored copy.
 *
 * The source Word documents carry real emphasis — bold lead-ins on bullets
 * ("**Classification** — Disease, patient…"), bold terms mid-sentence
 * ("**Explainable AI (XAI)**"), bold closing clauses — so editors write
 * markdown in the CMS and it renders here. Deliberately inline-only: block
 * structure (paragraphs, lists, chips, flows) comes from the block type,
 * not from markdown, so an editor can never break a card's layout by typing.
 *
 * Input is escaped first, so CMS text can never inject markup.
 */
const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
};

export function inlineMarkdown(source: unknown): string {
  if (typeof source !== 'string' || source === '') return '';
  return source
    .replace(/[&<>"]/g, (c) => ESCAPES[c])
    // **bold** first — otherwise the single-asterisk rule would eat the pairs.
    .replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*\w])\*(?=\S)([^*]*?\S)\*(?!\*)/g, '$1<em>$2</em>')
    // Underscores only when they stand alone, so snake_case names survive.
    .replace(/(^|[\s(])_(?=\S)([^_]*?\S)_(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>');
}

/** Plain text for attributes and aria labels — strips the markers, no HTML. */
export function stripMarkdown(source: unknown): string {
  if (typeof source !== 'string') return '';
  return source.replace(/\*\*|\*|_/g, '');
}
