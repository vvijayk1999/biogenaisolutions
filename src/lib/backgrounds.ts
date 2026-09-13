import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

/**
 * Optimised CSS for a full-bleed section background.
 *
 * These backgrounds are set through inline styles rather than <img>, so they
 * can't go through <Image>. getImage() still runs them through the build:
 * the source PNGs are 570–960KB each, and AVIF at this size lands around a
 * twentieth of that.
 *
 * Two declarations are returned. The first is a plain WebP url() that every
 * target browser understands; the second overrides it with an image-set()
 * so browsers that support AVIF take the smaller file. A browser that does
 * not understand image-set simply ignores the second declaration.
 */
export async function backgroundStyle(
  source: ImageMetadata | string | undefined,
  width = 1920
): Promise<string> {
  // A background chosen in the CMS arrives as a path under /uploads and has
  // not been through the build, so it is used as-is.
  if (typeof source === 'string') {
    return source ? `background-image: url('${source}');` : '';
  }
  if (!source) return '';

  const [avif, webp] = await Promise.all([
    getImage({ src: source, format: 'avif', width, quality: 45 }),
    getImage({ src: source, format: 'webp', width, quality: 68 }),
  ]);

  return (
    `background-image: url("${webp.src}");` +
    `background-image: image-set(url("${avif.src}") type("image/avif"), url("${webp.src}") type("image/webp"));`
  );
}
