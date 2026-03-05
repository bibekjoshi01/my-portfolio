/** Convert Markdown-style inline code into safe markup without leaking backticks. */
export function renderInlineCode(text: string): string {
  if (!text) {
    return "";
  }

  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const inlineCodePattern = /`([^`]+)`/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let html = "";

  while ((match = inlineCodePattern.exec(text)) !== null) {
    html += escapeHtml(text.slice(lastIndex, match.index));
    html += `<code>${escapeHtml(match[1])}</code>`;
    lastIndex = match.index + match[0].length;
  }

  html += escapeHtml(text.slice(lastIndex));
  return html;
}
