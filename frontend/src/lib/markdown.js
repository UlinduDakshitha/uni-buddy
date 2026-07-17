/**
 * Minimal, safe markdown renderer for assistant replies.
 * Escapes raw HTML first (so the model can never inject markup), then
 * converts a small, deliberate subset of markdown: **bold**, "- "/"* "
 * bullet lists, and paragraphs. This is a chat assistant, not a full
 * markdown engine, so the surface area is kept intentionally small.
 */
function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inlineFormat(text) {
  return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

export function renderMarkdown(raw) {
  const escaped = escapeHtml(raw || "");
  const lines = escaped.split("\n");

  let html = "";
  let inList = false;

  for (const line of lines) {
    const bulletMatch = line.match(/^\s*[-*]\s+(.*)/);
    if (bulletMatch) {
      if (!inList) {
        html += '<ul class="list-disc pl-5 space-y-1 my-1.5">';
        inList = true;
      }
      html += `<li>${inlineFormat(bulletMatch[1])}</li>`;
    } else {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      if (line.trim() === "") {
        continue;
      }
      html += `<p class="mb-1.5 last:mb-0">${inlineFormat(line)}</p>`;
    }
  }
  if (inList) html += "</ul>";
  return html;
}
