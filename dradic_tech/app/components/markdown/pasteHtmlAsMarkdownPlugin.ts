import {
  realmPlugin,
  createRootEditorSubscription$,
  insertMarkdown$,
} from "@mdxeditor/editor";
import { PASTE_COMMAND, COMMAND_PRIORITY_HIGH } from "lexical";
import TurndownService from "turndown";

// Remove erroneous global declarations for ClipboardEvent/InputEvent as interfaces cannot be constructed
// Instead, use typeof checks and window object guards at runtime if needed

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

/** Directive names that MDXEditor recognizes (admonitions). Unknown directives cause parse errors. */
const ALLOWED_DIRECTIVES = ["note", "tip", "danger", "info", "caution"];

/**
 * Escapes markdown sequences that look like MDX directives but use unknown names.
 * E.g. :latest or :latest[foo] from pasted HTML (class names, etc.) would fail to parse.
 */
function escapeUnknownDirectives(markdown: string): string {
  return markdown.replace(
    /:([a-zA-Z][a-zA-Z0-9]*)(\[|\s|$)/g,
    (match, name, after) => {
      if (ALLOWED_DIRECTIVES.includes(name.toLowerCase())) {
        return match;
      }
      return "\\:" + name + after;
    },
  );
}

/**
 * Plugin that converts pasted HTML (e.g. from web pages, Word, rich text)
 * into markdown so it matches the editor's styling and format.
 * When pasting plain text, default behavior is preserved.
 */
export const pasteHtmlAsMarkdownPlugin = realmPlugin({
  init(realm) {
    realm.pub(createRootEditorSubscription$, (editor) => {
      return editor.registerCommand(
        PASTE_COMMAND,
        (event: unknown) => {
          // Only handle if event is a ClipboardEvent (not InputEvent or KeyboardEvent)
          const ClipboardEventConstructor: any =
            typeof window !== "undefined" ? window.ClipboardEvent : undefined;

          if (
            !ClipboardEventConstructor ||
            !(event instanceof ClipboardEventConstructor)
          ) {
            return false; // Let default handler deal with non-clipboard paste
          }

          const clipboardData = event.clipboardData;
          if (!clipboardData) {
            return false;
          }

          const html = clipboardData.getData("text/html");
          if (!html || html.trim() === "") {
            return false; // Plain text paste - use default
          }

          try {
            let markdown = turndownService.turndown(html);
            if (markdown && markdown.trim() !== "") {
              markdown = escapeUnknownDirectives(markdown);
              event.preventDefault();
              realm.pub(insertMarkdown$, markdown);
              return true; // Handled - prevent default
            }
          } catch {
            // Fallback to default paste on conversion error
          }

          return false;
        },
        COMMAND_PRIORITY_HIGH,
      );
    });
  },
});
