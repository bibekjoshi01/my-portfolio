const WORDS_PER_MINUTE = 220;

export function getReadingTime(rawContent: string): string {
  const sanitized = rawContent
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[\n\r]+/g, ' ')
    .trim();

  const words = sanitized ? sanitized.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));

  return `${minutes} min read`;
}
