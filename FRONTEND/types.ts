
export interface PyodideInterface {
  runPython: (code: string) => any;
  runPythonAsync: (code: string) => Promise<any>;
  loadPackage: (packages: string[]) => Promise<void>;
  globals: any;
  setStdout: (options: { batched: (msg: string) => void }) => void;
  setStderr: (options: { batched: (msg: string) => void }) => void;
}

declare global {
  interface Window {
    loadPyodide: (config: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

export interface LogEntry {
  id: string;
  type: 'info' | 'error' | 'success' | 'system';
  message: string;
  timestamp: number;
}
