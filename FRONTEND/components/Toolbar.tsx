import { Play, Wrench } from "lucide-react";
import { Button } from "./Button";
import { useState, useEffect } from "react";

type Props = {
  isRunning: boolean;
  onRun: () => void;
  code: string;
  setRightPanelCode: (code: string) => void;
  onAIComparison: (beforeCode: string, afterCode: string) => void;
};

async function sendCodeToBackend(code: string) {
  try {
    const response = await fetch("http://localhost:5000/api/fix-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    return await response.json();
  } catch (err) {
    console.error("Error sending code:", err);
    return { error: err };
  }
}

export function Toolbar({
  isRunning,
  onRun,
  code,
  setRightPanelCode,
  onAIComparison
}: Props) {
  const [isFixing, setIsFixing] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (isFixing) {
      setTimer(0);
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isFixing]);

  const handleFixClick = async () => {
    setIsFixing(true);

    const result = await sendCodeToBackend(code);
setIsFixing(false);
    if (result.fixed_code) {
      setRightPanelCode(result.fixed_code);

      // 🔥 Trigger BEFORE & AFTER execution logs
      await onAIComparison(code, result.fixed_code);
    }

    setIsFixing(false);
  };

  const formatTime = (sec: number) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

  return (
    <div className="relative">
      <div className="px-4 py-2 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
        <Button
          variant="secondary"
          icon={<Wrench className="w-4 h-4" />}
          onClick={handleFixClick}
          disabled={isFixing}
        >
          Fix
        </Button>

        <Button
          onClick={onRun}
          disabled={isRunning || isFixing}
          variant="primary"
          icon={<Play className="w-4 h-4" />}
        >
          {isRunning ? "Running..." : "Run Code"}
        </Button>
      </div>

      {isFixing && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
          <div className="animate-pulse text-white text-lg font-semibold">
            Fixing code…  
            <div className="text-sm mt-2">Elapsed: {formatTime(timer)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
