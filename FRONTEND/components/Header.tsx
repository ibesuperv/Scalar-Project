import { Cpu } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center shrink-0">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-600/10 rounded-lg">
          <Cpu className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Sandbox</h1>
          <p className="text-xs text-slate-400">Offline Python Runtime</p>
        </div>
      </div>
    </header>
  );
}
