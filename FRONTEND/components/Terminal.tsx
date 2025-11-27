import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal as TerminalIcon, XCircle, CheckCircle, Info, Activity } from 'lucide-react';

interface TerminalProps {
  logs: LogEntry[];
  title?: string;
  className?: string;
}

export const Terminal: React.FC<TerminalProps> = ({ logs, title = "Output / Logs", className = "" }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'error': return <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />;
      case 'system': return <Activity className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />;
      default: return <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />;
    }
  };

  const getColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'error': return 'text-red-300 bg-red-500/5 border-l-2 border-red-500/20';
      case 'success': return 'text-emerald-300 bg-emerald-500/5 border-l-2 border-emerald-500/20';
      case 'system': return 'text-purple-300 bg-purple-500/5 border-l-2 border-purple-500/20';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className={`flex flex-col h-full bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl ${className}`}>
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border-b border-slate-700">
        <TerminalIcon className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{title}</span>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-2 font-mono text-sm scroll-smooth"
      >
        {logs.length === 0 ? (
          <div className="text-slate-600 italic text-center mt-10">Waiting for actions...</div>
        ) : (
          logs.map((log) => (
            <div 
              key={log.id} 
              className={`flex gap-3 p-2 rounded-sm ${getColor(log.type)}`}
            >
              {getIcon(log.type)}
              <div className="whitespace-pre-wrap break-words leading-relaxed">{log.message}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
