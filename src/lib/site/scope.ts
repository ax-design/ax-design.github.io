// Scopes the CSS of an example to its preview box: every selector gets the box's selector in
// front, and `:root` or `body` become the box itself. @media and @supports blocks are scoped
// inside, @keyframes and @font-face are left as they are.
export function scopeCss(css: string, scope: string): string {
  let out = '';
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf('{', i);
    if (open < 0) break;
    const head = css.slice(i, open).trim();
    const close = matching(css, open);
    const body = css.slice(open + 1, close);
    if (/^@(media|supports|container|layer)\b/.test(head)) out += `${head} {${scopeCss(body, scope)}}\n`;
    else if (head.startsWith('@')) out += `${head} {${body}}\n`;
    else {
      const selectors = head
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => (s === ':root' || s === 'body' ? scope : `${scope} ${s}`));
      out += `${selectors.join(', ')} {${body}}\n`;
    }
    i = close + 1;
  }
  return out;
}

function matching(css: string, open: number): number {
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}' && --depth === 0) return i;
  }
  return css.length - 1;
}
