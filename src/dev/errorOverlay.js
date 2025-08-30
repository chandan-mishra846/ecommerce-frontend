// Simple runtime error overlay for development
// Appends a fixed banner to the page showing the most recent error message
function createOverlay() {
  const id = 'dev-error-overlay';
  if (document.getElementById(id)) return;
  const container = document.createElement('div');
  container.id = id;
  container.style.position = 'fixed';
  container.style.left = '12px';
  container.style.right = '12px';
  container.style.bottom = '12px';
  container.style.zIndex = 2147483647;
  container.style.background = 'rgba(0,0,0,0.85)';
  container.style.color = 'white';
  container.style.padding = '12px 16px';
  container.style.borderRadius = '8px';
  container.style.fontFamily = 'system-ui,Segoe UI,Roboto,Helvetica,Arial';
  container.style.maxHeight = '40vh';
  container.style.overflow = 'auto';
  container.style.boxShadow = '0 8px 24px rgba(0,0,0,0.5)';
  container.style.fontSize = '13px';
  container.style.lineHeight = '1.35';
  container.style.display = 'none';
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(container));

  return {
    show(message) {
      container.style.display = 'block';
      container.textContent = message;
    },
    hide() {
      container.style.display = 'none';
    }
  };
}

const overlay = createOverlay();

function formatError(e) {
  try {
    if (!e) return 'Unknown error';
    if (typeof e === 'string') return e;
    if (e instanceof Error) return e.message + '\n' + (e.stack || '');
    if (e.reason) return formatError(e.reason);
    return JSON.stringify(e, Object.getOwnPropertyNames(e));
  } catch (err) {
    return String(e);
  }
}

window.addEventListener('error', (ev) => {
  const msg = `Error: ${ev.message} at ${ev.filename}:${ev.lineno}:${ev.colno}\n` + (ev.error && ev.error.stack ? ev.error.stack : '');
  console.error('Global error captured by overlay:', ev.error || ev.message || ev);
  overlay && overlay.show(msg);
});

window.addEventListener('unhandledrejection', (ev) => {
  const msg = `Unhandled Promise Rejection: ${formatError(ev.reason)}`;
  console.error('Unhandled rejection captured by overlay:', ev.reason);
  overlay && overlay.show(msg);
});

// allow hiding overlay on escape
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    overlay && overlay.hide();
  }
});

export {};
