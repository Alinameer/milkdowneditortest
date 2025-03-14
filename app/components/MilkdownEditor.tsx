"use client";
import { useEffect, useRef } from "react";
import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";

const MilkdownEditor = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const crepeInstance = useRef<Crepe | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      const defaultText = "Hello, Milkdown!";

      // Try to configure RTL support on editor initialization
      crepeInstance.current = new Crepe({
        root: editorRef.current,
        defaultValue: defaultText,
        config: {
          // Attempt to set editor-level locale and direction
          locale: "ar",
          dir: "auto",
        },
      });

      crepeInstance.current.create().then(() => {
        console.log("Editor created");
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
