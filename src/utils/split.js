/*
 * Text splitting helpers.
 * Original text is preserved for screen readers (aria-label on the parent,
 * aria-hidden on every generated node) so animations never hide content.
 */

function wrapFragment(fragment, className) {
  const el = document.createElement('span');
  el.className = className;
  el.setAttribute('aria-hidden', 'true');
  el.textContent = fragment;
  return el;
}

export function splitChars(element, options = {}) {
  const { className = 'split-char', keepSpaces = true, slot = false } = options;
  if (!element) return [];
  if (element.dataset.split === 'chars') {
    return Array.from(element.querySelectorAll(`.${className}`));
  }

  /* Capture source content first: clearing textContent would drop <br />. */
  const segments = [];
  element.childNodes.forEach((child) => {
    if (child.nodeName === 'BR') segments.push({ br: true });
    else segments.push({ text: child.textContent });
  });
  element.setAttribute(
    'aria-label',
    segments.map((seg) => (seg.br ? ' ' : seg.text)).join('').trim()
  );
  element.textContent = '';

  const chars = [];
  let chunk = null;
  const flush = () => {
    if (chunk) element.appendChild(chunk);
    chunk = null;
  };
  const pushChar = (char) => {
    if (!chunk) {
      chunk = document.createElement('span');
      chunk.className = 'split-chunk';
      chunk.setAttribute('aria-hidden', 'true');
    }
    const node = wrapFragment(char, className);
    if (slot) {
      const holder = document.createElement('span');
      holder.className = 'split-char-slot';
      holder.setAttribute('aria-hidden', 'true');
      holder.appendChild(node);
      chunk.appendChild(holder);
    } else {
      chunk.appendChild(node);
    }
    chars.push(node);
  };

  segments.forEach((segment) => {
    if (segment.br) {
      flush();
      element.appendChild(document.createElement('br'));
      return;
    }
    segment.text.split(/(\s+)/).forEach((token) => {
      if (!token) return;
      if (/^\s+$/.test(token)) {
        flush();
        if (keepSpaces) element.appendChild(document.createTextNode(' '));
        return;
      }
      token.split('').forEach(pushChar);
    });
  });
  flush();

  element.dataset.split = 'chars';
  return chars;
}

export function splitWords(element, { className = 'split-word' } = {}) {
  if (!element) return [];
  if (element.dataset.split === 'words') {
    return Array.from(element.querySelectorAll(`.${className}__inner`));
  }
  const text = element.textContent.trim();
  element.setAttribute('aria-label', text);
  element.textContent = '';

  const words = [];
  text.split(/\s+/).forEach((word, index, list) => {
    const mask = wrapFragment(word, className);
    const inner = document.createElement('span');
    inner.className = `${className}__inner`;
    inner.setAttribute('aria-hidden', 'true');
    inner.textContent = word;
    mask.textContent = '';
    mask.appendChild(inner);
    element.appendChild(mask);
    words.push(inner);
    if (index < list.length - 1) element.appendChild(document.createTextNode(' '));
  });

  element.dataset.split = 'words';
  return words;
}

/* Splits a block into hard lines only when the browser reports a line break. */
export function splitLines(element, { className = 'split-line' } = {}) {
  if (!element || element.dataset.split === 'lines') return [];
  const words = splitWords(element, { className: 'split-word' });
  if (!words.length) return [];

  const tops = new Map();
  words.forEach((word) => {
    const top = Math.round(word.parentElement.getBoundingClientRect().top);
    if (!tops.has(top)) tops.set(top, []);
    tops.get(top).push(word.parentElement);
  });

  const lines = [];
  element.textContent = '';
  element.setAttribute('aria-label', element.getAttribute('aria-label') || '');
  [...tops.entries()]
    .sort((a, b) => a[0] - b[0])
    .forEach(([, group]) => {
      const line = document.createElement('span');
      line.className = className;
      line.setAttribute('aria-hidden', 'true');
      group.forEach((word, i) => {
        line.appendChild(word);
        if (i < group.length - 1) line.appendChild(document.createTextNode(' '));
      });
      element.appendChild(line);
      lines.push(line);
    });

  element.dataset.split = 'lines';
  return lines;
}
