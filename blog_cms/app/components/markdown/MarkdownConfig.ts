import { marked } from "marked";

// Configure marked for better parsing
marked.use({
  breaks: true,
  gfm: true,
});

export { marked };
