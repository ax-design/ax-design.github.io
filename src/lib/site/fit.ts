// A Svelte action for an <ax-scroll-view> that is as tall as its content: the viewport of a scroll
// view is absolutely positioned, so the element does not size itself from what is inside. The
// action gives it the height of its first child, and keeps it as that changes. Before the
// element is defined (the prerendered page, or scripts off), the host is a plain block that
// scrolls natively, see the :not(:defined) rule of the styles that use it.
export function fit(host: HTMLElement) {
  const content = host.firstElementChild as HTMLElement | null;
  if (!content || typeof ResizeObserver === 'undefined') return {};
  const update = () => {
    host.style.height = `${content.offsetHeight}px`;
  };
  update();
  const observer = new ResizeObserver(update);
  observer.observe(content);
  return { destroy: () => observer.disconnect() };
}
