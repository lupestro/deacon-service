import { modifier } from 'ember-modifier';

export default modifier((element, [offset]) => {
  if (element) {
    const height = Math.max(
      document.documentElement ? document.documentElement.clientHeight : 0,
      window.innerHeight || 0
    );
    element.style.height = `${height - offset}px`;
  }
});
