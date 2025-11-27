import { Terminal } from './Terminal';
import { LogEntry } from '../types';

type Props = { logs: LogEntry[] };



export function OutputTerminal({ logs }: Props) {
  return (
    <div className="h-1/3 min-h-[200px] border-t border-slate-800 bg-slate-950 shrink-0">
      <Terminal
        logs={logs}
        className="h-full border-0 rounded-none bg-slate-950"
        title="Execution Output"
      />
    </div>
  );
}
