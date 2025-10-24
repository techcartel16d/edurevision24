export const removeHtmlTags = str => {
  if (!str) return '';

  return str
    .replace(/<img[^>]*>/g, '') // Removes <img> tags
    .replace(/<[^>]*>/g, '') // Removes all other HTML tags
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&zwnj;/g, '')
    .replace(/&ndash;/g, '-')
    .replace(/&mdash;/g, '—')
    .replace(/&#39;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/<[^>]*>/g, '')
    .replace(/&hellip;/g, '...');

};
