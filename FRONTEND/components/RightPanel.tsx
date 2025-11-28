import React, { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import "prismjs/themes/prism-tomorrow.css";

type Props = { 
  code?: string;
  onUseCode: (code: string) => void;
};

export function RightPanel({ code = "", onUseCode }: Props) {
  const preRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadPrismAndHighlight() {
      if (typeof window === "undefined") return;

      const PrismModule = await import("prismjs");
      const Prism = PrismModule.default ?? PrismModule;

      await import("prismjs/components/prism-python");

      if (!mounted || !preRef.current || !Prism) return;

      preRef.current.innerHTML = "";

      const codeElement = document.createElement("code");
      codeElement.className = "language-python";
      codeElement.textContent = code;
      preRef.current.appendChild(codeElement);

      Prism.highlightElement(codeElement);
    }

    loadPrismAndHighlight().catch(console.error);
    return () => { mounted = false; };
  }, [code]);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-900/20 overflow-auto relative p-4">

      {/* Header row with Use Code button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl">AI Fixed Code</h1>

        {code.trim() && (
          <button
            onClick={() => onUseCode(code)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
          >
            Use Code
          </button>
        )}
      </div>

      <pre
        ref={preRef}
        className="min-h-[95%] language-python text-sm p-4 rounded-lg bg-slate-950 border border-slate-800 overflow-auto"
      />

      {!code.trim() && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 select-none pointer-events-none">
          <Sparkles className="w-16 h-16 mb-4 opacity-10" />
          <p className="text-sm font-medium uppercase tracking-widest opacity-30">
            AI Comparison Workspace
          </p>
        </div>
      )}
    </div>
  );
}
