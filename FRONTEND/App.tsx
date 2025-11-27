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
  const [rightPanelCode, setRightPanelCode] = useState<string>(""); // RightPanel shows AI output

  const addLog = useCallback((message: string, type: LogEntry["type"] = "info") => {
    setLogs((prev) => [
      ...prev,
      { id: Math.random().toString(36).substring(7), type, message, timestamp: Date.now() },
    ]);
  }, []);

  const handleRunCode = async () => {
    setIsRunning(true);
    setLogs([]); // clear terminal for new run

    addLog("Initializing Python runtime...", "system");

    try {
      addLog("Running code execution...", "info");

      let capturedOutput = "";

      await pyodideManager.runCode(
        inputCode,
        (text) => {
          capturedOutput += text + "\n";
        },
        (err) => {
          addLog(`Runtime Error:\n${err}`, "error");
          throw new Error(err);
        }
      );

      if (capturedOutput.trim()) addLog(`Output:\n${capturedOutput}`, "info");

      addLog("Execution completed successfully.", "success");
    } catch {
      // error already logged
    } finally {
      setIsRunning(false);
    }
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
            onRun={handleRunCode}
            code={inputCode}
            setRightPanelCode={setRightPanelCode}
            // Optional: uncomment if you want to replace editor with fixed code
            // setInputCode={setInputCode}
          />

          <OutputTerminal logs={logs} />
        </div>

        {/* Right Panel */}
        <RightPanel code={rightPanelCode} />
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
