import { PyodideInterface } from '../types';

class PyodideManager {
  private pyodide: PyodideInterface | null = null;
  private loadPromise: Promise<PyodideInterface> | null = null;

  async getInstance(): Promise<PyodideInterface> {
    if (this.pyodide) {
      return this.pyodide;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = (async () => {
      if (!window.loadPyodide) {
        throw new Error('Pyodide script not loaded.');
      }
      
      const pyodide = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
      });
      
      this.pyodide = pyodide;
      return pyodide;
    })();

    return this.loadPromise;
  }

  async runCode(code: string, onOutput: (text: string) => void, onError: (text: string) => void): Promise<void> {
    const pyodide = await this.getInstance();
    
    // Capture stdout and stderr
    pyodide.setStdout({ batched: (msg) => onOutput(msg) });
    pyodide.setStderr({ batched: (msg) => onError(msg) });

    try {
      // We wrap the user code to ensure we catch everything
      await pyodide.runPythonAsync(code);
    } catch (err: any) {
      onError(err.toString());
      throw err;
    }
  }
}

export const pyodideManager = new PyodideManager();
