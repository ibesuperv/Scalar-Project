import React, { useState, useCallback } from "react";
import { Cpu } from "lucide-react";

import { Editor } from "./components/Editor";
import { Header } from "./components/Header";
import { Toolbar } from "./components/Toolbar";
import { OutputTerminal } from "./components/OutputTerminal";
import { RightPanel } from "./components/RightPanel";

import { pyodideManager } from "./utils/pyodideManager";
import { INITIAL_PYTHON_CODE } from "./constants";
import { LogEntry } from "./types";

function App() {
  const [inputCode, setInputCode] = useState(INITIAL_PYTHON_CODE);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [rightPanelCode, setRightPanelCode] = useState<string>("");

  const addLog = useCallback((message: string, type: LogEntry["type"] = "info") => {
    setLogs((prev) => [
      ...prev,
      { id: Math.random().toString(36).slice(2), type, message, timestamp: Date.now() },
    ]);
  }, []);

  // 🔥 Runs Python code AND returns the captured output
  const executePython = async (code: string) => {
    let captured = "";
    await pyodideManager.runCode(
      code,
      text => { captured += text + "\n"; },
      err => { captured += "\nERROR: " + err; }
    );
    return captured.trim();
  };

  const handleRunCode = async (override?: string) => {
    const codeToRun = override ?? inputCode;
    setIsRunning(true);
    addLog("Running code...", "system");

    const output = await executePython(codeToRun);

    addLog(output || "(no output)", "info");
    addLog("Execution finished", "success");

    setIsRunning(false);
  };

  // 🔥 Called by RightPanel → user clicks "Use Code"
 const handleUseFixedCode = async (fixedCode: string) => {
  setInputCode(fixedCode);

  // Append AFTER AI logs without clearing previous logs
  addLog("=== AFTER AI FIX (Execution Output) ===", "system");

  const afterOutput = await executePython(fixedCode);

  addLog(afterOutput || "(no output)", "info");
};


  // 🔥 Toolbar calls this AFTER backend returns AI fixed code
  const handleAIComparison = async (beforeCode: string, afterCode: string) => {
    setLogs([]); // clear logs

    setIsRunning(true);

    addLog("=== BEFORE AI FIX (Execution Output) ===", "system");
    const beforeOutput = await executePython(beforeCode);
    addLog(beforeOutput || "(no output)", "info");

    addLog("=== AFTER AI FIX (Execution Output) ===", "system");
    const afterOutput = await executePython(afterCode);
    addLog(afterOutput || "(no output)", "success");

    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col h-screen">
      <Header />
      <main className="flex-1 flex overflow-hidden">

        {/* Left Panel */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-slate-800 bg-slate-950">
          <Editor value={inputCode} onChange={setInputCode} />

          <Toolbar
            isRunning={isRunning}
            onRun={() => handleRunCode()}
            code={inputCode}
            setRightPanelCode={setRightPanelCode}
            onAIComparison={handleAIComparison}
          />

          <OutputTerminal logs={logs} />
        </div>

        {/* Right Panel */}
        <RightPanel 
          code={rightPanelCode}
          onUseCode={handleUseFixedCode}
        />

      </main>

      <footer className="bg-slate-950 border-t border-slate-800 px-4 py-1 flex justify-between items-center text-[10px] text-slate-500 shrink-0">
        <div className="flex items-center gap-2">
          <Cpu className="w-3 h-3" />
          <span>Local Execution</span>
        </div>
        <div>v2.0.0 • Pyodide 0.25</div>
      </footer>
    </div>
  );
}

export default App;
