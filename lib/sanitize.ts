// lib/sanitize.ts
import createDOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string) {
  const purify = createDOMPurify(typeof window !== 'undefined' ? window : undefined);
  return purify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'a', 'img', 'strong', 'em', 'u', 's',
      'ul', 'ol', 'li',
      'blockquote', 'code', 'pre', 'br',
      'span', 'div',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel', 'class', 'style'],
  });
}
