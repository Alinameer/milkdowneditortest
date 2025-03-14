// app/components/autoDirectionPlugin.ts
import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

// Simple check if a character is in the Arabic range.
const isArabic = (char: string) => /[\u0600-\u06FF]/.test(char);

export const autoDirectionPlugin = new Plugin({
  props: {
    decorations(state) {
      const decos: Decoration[] = [];

      state.doc.descendants((node, pos) => {
        // isTextblock catches paragraphs, headings, list items, etc.
        if (node.isTextblock) {
          const text = node.textContent.trim();
          if (text.length > 0) {
            const firstChar = text[0];
            // If first char is Arabic, set RTL. Otherwise LTR.
            const dir = isArabic(firstChar) ? "rtl" : "ltr";
            const align = isArabic(firstChar) ? "right" : "left";

            // Decorate the entire block with dir & text-align
            decos.push(
              Decoration.node(pos, pos + node.nodeSize, {
                dir,
                style: `text-align: ${align};`,
              })
            );

            // Check if this text block is part of a list item
            const $pos = state.doc.resolve(pos);
            let depth = $pos.depth;
            let isInList = false;

            // Walk up the document tree to find if we're in a list
            while (depth > 0) {
              const parent = $pos.node(depth);
              if (
                parent.type.name === "bullet_list" ||
                parent.type.name === "ordered_list"
              ) {
                // Found a list parent, add decoration to it
                const listPos = $pos.before(depth);
                const listEnd = listPos + parent.nodeSize;

                decos.push(
                  Decoration.node(listPos, listEnd, {
                    dir,
                    class: dir === "rtl" ? "rtl-list" : "",
                  })
                );
                isInList = true;
                break;
              }
              depth--;
            }
          }
        }
      });

      return DecorationSet.create(state.doc, decos);
    },
  },
});
