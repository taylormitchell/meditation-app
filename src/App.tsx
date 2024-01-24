import { useState } from "react";

// One big button that takes up the whole screen
// When you tap it, it temporarily changes colour
// Tapping it records the time of the tap
// Tapping it again records the time of the second tap, etc
// There's a start/stop button at the bottom which starts/stops the timer
// when you press stop, the app switches to a screen that shows the time and number of taps
function App() {
  const [activeTab, setActiveTab] = useState("counter");
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div className="flex border-b">
        <button
          className={`p-4 ${activeTab === "counter" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => setActiveTab("counter")}
        >
          Timer
        </button>
        <button
          className={`p-4 ${activeTab === "table" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => setActiveTab("table")}
        >
          Results
        </button>
      </div>
      <div style={{ flex: 1, width: "100%" }}>
        {activeTab === "counter" && <TimerPage />}
        {activeTab === "table" && <ResultsPage />}
      </div>
    </div>
  );
}

function TimerPage() {
  const [timerRunning, setTimerRunning] = useState(false);
  const [taps, setTaps] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timerValue, setTimerValue] = useState<number | null>(null);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      <button
        style={{
          flex: 1,
          backgroundColor: timerRunning ? "green" : "red",
        }}
        onClick={() => {
          setTaps([...taps, Date.now()]);
        }}
      >
        {timerRunning && taps.length}
      </button>
      <button
        onClick={() => {
          setTimerRunning(!timerRunning);
          if (!timerRunning) {
            setStartTime(Date.now());
          } else {
            setTimerValue(Date.now() - startTime!);
          }
        }}
      >
        {timerRunning ? "Stop" : "Start"}
      </button>
    </div>
  );
}

function ResultsPage() {}

export default App;
