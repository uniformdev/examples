/**
 * Mesh SDK init + identity delegation (same flow as mesh-bulk-publish _app.tsx),
 * then drives HTMX 4 to load the compositions table partial.
 */
import { initializeUniformMeshSDK } from '@uniformdev/mesh-sdk';

function showEl(id, visible) {
  const el = document.getElementById(id);
  if (el) {
    el.hidden = !visible;
  }
}

async function checkActive() {
  const res = await fetch('/api/status');
  if (!res.ok) {
    return false;
  }
  const body = await res.json();
  return body.status === 'active';
}

async function onSessionToken(sessionToken) {
  const res = await fetch('/api/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionToken }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    let detail = text;
    try {
      detail = JSON.parse(text).error ?? text;
    } catch {
      /* not JSON */
    }
    throw new Error(detail || `Session exchange failed (${res.status})`);
  }
}

function updateSelectedCount() {
  const n = document.querySelectorAll('input[name="compositionIds"]:checked').length;
  const el = document.getElementById('selected-count');
  if (el) {
    el.textContent = String(n);
  }
}

async function acquireDelegation(sdk) {
  const isActive = await checkActive();
  if (isActive) {
    return;
  }

  const sessionToken = await sdk.getSessionToken();
  if (!sessionToken) {
    throw new Error('__DELEGATION_DISABLED__');
  }
  await onSessionToken(sessionToken);
}

function setErrorMessage(message) {
  const pre = document.querySelector('#delegation-error pre');
  if (pre) {
    pre.textContent = message;
  }
}

async function main() {
  showEl('delegation-loading', true);
  showEl('delegation-disabled', false);
  showEl('delegation-error', false);
  showEl('bulk-app', false);

  let sdk;
  try {
    sdk = await initializeUniformMeshSDK();
  } catch (e) {
    showEl('delegation-loading', false);
    showEl('delegation-error', true);
    setErrorMessage(e instanceof Error ? e.message : String(e));
    return;
  }

  try {
    await acquireDelegation(sdk);
  } catch (e) {
    showEl('delegation-loading', false);
    if (e instanceof Error && e.message === '__DELEGATION_DISABLED__') {
      showEl('delegation-disabled', true);
      return;
    }
    showEl('delegation-error', true);
    setErrorMessage(e instanceof Error ? e.message : String(e));
    return;
  }

  const loc = sdk.getCurrentLocation();
  const projectId = loc.metadata?.projectId;
  if (!projectId) {
    showEl('delegation-loading', false);
    showEl('delegation-error', true);
    setErrorMessage('Missing projectId in mesh location metadata.');
    return;
  }

  const input = document.getElementById('mesh-project-id');
  if (input && 'value' in input) {
    input.value = projectId;
  }

  showEl('delegation-loading', false);
  showEl('bulk-app', true);

  document.body.dispatchEvent(new CustomEvent('mesh:ready'));
}

void main();

document.body.addEventListener('htmx:afterSwap', () => {
  updateSelectedCount();
});

document.body.addEventListener('change', (e) => {
  const t = e.target;
  if (t && typeof t.matches === 'function' && t.matches('input[name="compositionIds"]')) {
    updateSelectedCount();
  }
});

document.body.addEventListener('click', async (e) => {
  const target = e.target && e.target.closest ? e.target.closest('button') : null;
  if (!target) {
    return;
  }
  if (target.id === 'select-all-btn') {
    document.querySelectorAll('.comp-check').forEach((x) => {
      x.checked = true;
    });
    updateSelectedCount();
    return;
  }
  if (target.id === 'deselect-all-btn') {
    document.querySelectorAll('.comp-check').forEach((x) => {
      x.checked = false;
    });
    updateSelectedCount();
    return;
  }
  if (target.id === 'publish-btn') {
    const projectInput = document.getElementById('mesh-project-id');
    const projectId = projectInput && 'value' in projectInput ? projectInput.value : '';
    const ids = [...document.querySelectorAll('input[name="compositionIds"]:checked')].map((el) => el.value);
    const msg = document.getElementById('publish-message');
    if (!projectId) {
      if (msg) {
        msg.hidden = false;
        msg.textContent = 'Missing project id.';
        msg.className = 'mesh-message mesh-error';
      }
      return;
    }
    if (ids.length === 0) {
      if (msg) {
        msg.hidden = false;
        msg.textContent = 'Select at least one composition.';
        msg.className = 'mesh-message mesh-error';
      }
      return;
    }
    target.disabled = true;
    if (msg) {
      msg.hidden = true;
    }
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, compositionIds: ids }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok && res.status !== 207) {
        throw new Error(body.error ?? `Publish failed (${res.status})`);
      }
      if (msg) {
        msg.hidden = false;
        if (res.status === 207 && body.failed && body.failed.length > 0) {
          msg.className = 'mesh-message mesh-warn';
          msg.textContent = `Partial publish: ${body.failed.length} failed.`;
        } else {
          msg.className = 'mesh-message mesh-ok';
          msg.textContent = `Published ${body.published ?? ids.length} composition(s).`;
        }
      }
      if (window.htmx) {
        window.htmx.trigger(document.body, 'refreshCompositions');
      }
    } catch (err) {
      if (msg) {
        msg.hidden = false;
        msg.className = 'mesh-message mesh-error';
        msg.textContent = err instanceof Error ? err.message : 'Publish failed';
      }
    } finally {
      target.disabled = false;
    }
  }
});
