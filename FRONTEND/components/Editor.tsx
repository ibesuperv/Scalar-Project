import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function Editor({ value, onChange }: Props) {
  return (
    <div className="flex-1 min-h-0">  {/* KEY FIX: min-h-0 keeps it from overflowing */}
      <CodeMirror
        value={value}
        theme={oneDark}
        extensions={[python()]}
        height="100%"                       // stays inside container
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: true,
        }}
        onChange={(v) => onChange(v)}
        className="h-full overflow-auto"     // scroll internally, not expand
      />
    </div>
  );
}
