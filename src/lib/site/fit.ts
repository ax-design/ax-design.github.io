// A Svelte action for an <ax-scroll-view> that is as tall as its content: the viewport of a scroll
// view is absolutely positioned, so the element does not size itself from what is inside. The
// action gives it the height of its first child, and keeps it as that changes. Before the
// element is defined (the prerendered page, or scripts off), the host is a plain block that
// scrolls natively, see the :not(:defined) rule of the styles that use it.
//
// The height comes from the ResizeObserver entry, which the browser measures after layout. It is
// never read from offsetHeight: a page mounts many of these at once, and a read per block would
// force a layout per block.
export function fit(host: HTMLElement) {
  const content = host.firstElementChild as HTMLElement | null;
  if (!content || typeof ResizeObserver === 'undefined') return {};
  const observer = new ResizeObserver((entries) => {
    const entry = entries[entries.length - 1];
    const box = entry.borderBoxSize?.[0];
    const height = box ? box.blockSize : entry.contentRect.height;
    host.style.height = `${height}px`;
  });
  observer.observe(content, { box: 'border-box' });
  return { destroy: () => observer.disconnect() };
}
