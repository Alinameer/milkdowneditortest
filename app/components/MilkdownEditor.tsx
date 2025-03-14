"use client";

import { useEffect, useRef } from "react";
import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import { autoDirectionPlugin } from "./autoDirectionPlugin";

const MilkdownEditor = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const crepeInstance = useRef<Crepe | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      // Initial content for testing
      const defaultText = `شو بتسوي؟ 
1. اهلا
2. هذا نص تجريبي
Hello from the other side`;

      // Create the Crepe instance with your custom plugin
      crepeInstance.current = new Crepe({
        root: editorRef.current,
        defaultValue: defaultText,
        config: {
          // "auto" won't forcibly set the entire editor container,
          // but we'll rely on the plugin for block-level direction.
          dir: "auto",
          locale: "ar",
        },
        extraPlugins: [autoDirectionPlugin],
      });

      crepeInstance.current.create().then(() => {
        console.log("Editor created with RTL auto-detection.");
      });
    }

    return () => {
      if (crepeInstance.current) {
        crepeInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="h-screen w-screen">
      <div ref={editorRef} className="h-full w-full" />
    </div>
  );
};

export default MilkdownEditor;
