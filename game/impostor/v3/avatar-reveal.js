/* Crossfade only the avatar's inner paint layers. The outer slide stays untouched. */
window.AvatarReveal = (() => {
  const loaded = new Map();
  const versions = new WeakMap();
  function prepare(src) {
    if (!loaded.has(src)) {
      loaded.set(src, new Promise(resolve => {
        const image = new Image();
        image.onload = async () => {
          try { if (image.decode) await image.decode(); } catch {}
          resolve(true);
        };
        image.onerror = () => resolve(false);
        image.src = src;
      }));
    }
    return loaded.get(src);
  }
  function mix(element, value) {
    element.style.setProperty('--avatar-progress', String(value));
    element.style.setProperty('--avatar-mix', element.dataset.crossfade === 'true' && element.dataset.alternateReady === 'true' ? String(value) : '0');
  }
  function set(element, base, alternate) {
    if (element.dataset.avatarBase === base && element.dataset.avatarAlternate === alternate) {
      mix(element, 0);
      return;
    }
    element.dataset.avatarBase = base;
    element.dataset.avatarAlternate = alternate;
    const version = (versions.get(element) || 0) + 1;
    versions.set(element, version);
    element.dataset.alternateReady = 'false';
    element.dataset.crossfade = String(base !== alternate);
    // Keep the base as a fallback until the two layers can be painted together.
    element.style.backgroundImage = `url("${base}")`;
    element.style.setProperty('--avatar-base', `url("${base}")`);
    element.style.setProperty('--avatar-alternate', `url("${alternate}")`);
    mix(element, 0);
    if (base === alternate) return;
    prepare(alternate).then(ok => {
      if (versions.get(element) !== version || !ok) return;
      element.dataset.alternateReady = 'true';
      mix(element, Number(element.style.getPropertyValue('--avatar-progress')) || 0);
    });
  }
  function clear(element) {
    delete element.dataset.avatarBase;
    delete element.dataset.avatarAlternate;
    versions.set(element, (versions.get(element) || 0) + 1);
    element.dataset.alternateReady = 'false';
    element.dataset.crossfade = 'false';
    element.style.backgroundImage = 'none';
    element.style.setProperty('--avatar-base', 'none');
    element.style.setProperty('--avatar-alternate', 'none');
    mix(element, 0);
  }
  return { set, mix, clear };
})();
