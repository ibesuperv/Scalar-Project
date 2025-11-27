import { Play, Wrench } from "lucide-react";
import { Button } from "./Button";
import { useState, useEffect } from "react";

type Props = {
  isRunning: boolean;
  onRun: () => void;
  code: string;
  setRightPanelCode: (code: string) => void;
  setInputCode?: (code: string) => void;
};

async function sendCodeToBackend(code: string) {
  try {
    const response = await fetch("http://localhost:5000/api/fix-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const result = await response.json();
    return result;
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
  setInputCode,
}: Props) {
  const [isFixing, setIsFixing] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (isFixing) {
      setTimer(0); // reset
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isFixing]);

  const handleFixClick = async () => {
    setIsFixing(true);
    const result = await sendCodeToBackend(code);

    if (result.error) {
      console.log("❌ Failed to send code to backend");
    } else if (result.fixed_code) {
      setRightPanelCode(result.fixed_code);
      // Optional: update editor
      // if (setInputCode) setInputCode(result.fixed_code);
    }

    setIsFixing(false);
  };

  // Format timer as mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="relative">
      {/* Toolbar Buttons */}
      <div className="px-4 py-2 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3 shrink-0">
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

      {/* Overlay while fixing */}
      {isFixing && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10 rounded-lg">
          <div className="animate-pulse text-white text-lg font-semibold flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Fixing code...</span>
            </div>
            <span className="text-sm font-normal">
              Elapsed: {formatTime(timer)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
