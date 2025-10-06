import { marked, type Tokens } from "marked";

// Configure marked for better parsing
marked.use({
  breaks: true,
  gfm: true,
  // Ensure links preserve their text and open in a new tab for external URLs
  renderer: {
    link(this: any, { href, title, tokens }: Tokens.Link) {
      const safeHref = href || "";
      const isExternal =
        /^https?:/i.test(safeHref) && !safeHref.startsWith("/");
      const titleAttr = title ? ` title="${title}"` : "";
      const relAttr = isExternal ? ' rel="noopener noreferrer"' : "";
      const targetAttr = isExternal ? ' target="_blank"' : "";
      const text = this.parser?.parseInline(tokens) || "";
      return `<a href="${safeHref}"${titleAttr}${targetAttr}${relAttr}>${text}</a>`;
    },
  },
});

export { marked };
