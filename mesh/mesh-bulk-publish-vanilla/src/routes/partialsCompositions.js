/**
 * GET /partials/compositions — HTML table for HTMX (htmx 4).
 */
import { escapeHtml } from '../htmlEscape.js';
import { loadCompositionList } from '../services/compositionList.js';

function parseOffset(req) {
  const raw = req.query.offset;
  if (typeof raw !== 'string') {
    return 0;
  }
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export async function getPartialsCompositions(req, res) {
  const projectId = typeof req.query.projectId === 'string' ? req.query.projectId : undefined;
  if (!projectId) {
    res.status(400).type('html').send('<p class="mesh-error">projectId query param is required</p>');
    return;
  }

  const offset = parseOffset(req);
  const result = await loadCompositionList(projectId, req.headers.cookie, offset);
  if (!result.ok) {
    res
      .status(result.status)
      .type('html')
      .send(`<p class="mesh-error">${escapeHtml(result.error)}</p>`);
    return;
  }

  if (result.setCookieHeader) {
    res.setHeader('Set-Cookie', result.setCookieHeader);
  }

  const { items, pageSize, hasMore } = result;
  const rangeStart = items.length === 0 ? 0 : offset + 1;
  const rangeEnd = offset + items.length;
  const prevOffset = Math.max(0, offset - pageSize);
  const nextOffset = offset + pageSize;

  const rows = items
    .map((c) => {
      const stateLabel = c.state === 64 ? 'Published' : 'Draft';
      const icon = c.componentTypeIcon ? `${escapeHtml(c.componentTypeIcon)} ` : '';
      const path = c.projectMapPath ?? '—';
      return `<tr>
  <td><input class="comp-check" type="checkbox" name="compositionIds" value="${escapeHtml(c.id)}" /></td>
  <td>${escapeHtml(c.name)}</td>
  <td title="${escapeHtml(c.componentTypeId)}">${icon}${escapeHtml(c.componentTypeName)}</td>
  <td>${escapeHtml(stateLabel)}</td>
  <td>${escapeHtml(path)}</td>
</tr>`;
    })
    .join('\n');

  const prevDisabled = offset === 0;
  const nextDisabled = !hasMore;

  const html = `<div class="compositions-toolbar">
  <p><span id="composition-count">${items.length === 0 ? 'No compositions on this page.' : `Compositions ${rangeStart}–${rangeEnd} (page size ${pageSize}).`}</span> <span id="selected-count">0</span> selected.</p>
  <div class="btn-row">
    <button type="button" id="select-all-btn">Select all</button>
    <button type="button" id="deselect-all-btn">Deselect all</button>
    <button type="button" id="publish-btn">Publish selected</button>
  </div>
  <div class="compositions-pagination btn-row">
    <button type="button" class="page-prev-btn" hx-get="/partials/compositions" hx-target="#compositions-root" hx-swap="innerHTML" hx-include="#mesh-project-id" hx-vals='{"offset":${prevOffset}}' ${prevDisabled ? 'disabled' : ''}>Previous page</button>
    <button type="button" class="page-next-btn" hx-get="/partials/compositions" hx-target="#compositions-root" hx-swap="innerHTML" hx-include="#mesh-project-id" hx-vals='{"offset":${nextOffset}}' ${nextDisabled ? 'disabled' : ''}>Next page</button>
  </div>
  <p id="publish-message" class="mesh-message" hidden></p>
</div>
<table class="compositions-table">
  <thead>
    <tr>
      <th style="width:2rem"></th>
      <th>Name</th>
      <th>Type</th>
      <th>State</th>
      <th>Path</th>
    </tr>
  </thead>
  <tbody>
${rows}
  </tbody>
</table>
<input type="hidden" id="compositions-offset" name="offset" value="${offset}" hx-swap-oob="true" />`;

  res.type('html').send(html);
}
