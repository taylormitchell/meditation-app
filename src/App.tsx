import { useState } from "react";

// One big button that takes up the whole screen
// When you tap it, it temporarily changes colour
// Tapping it records the time of the tap
// Tapping it again records the time of the second tap, etc
// There's a start/stop button at the bottom which starts/stops the timer
// when you press stop, the app switches to a screen that shows the time and number of taps
function App() {
  const [timerRunning, setTimerRunning] = useState(false);
  const [breaths, setBreaths] = useState<number[]>([]);
  const [lapses, setLapses] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timerValue, setTimerValue] = useState<number | null>(null);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {timerRunning ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* count lapses */}
          <button
            style={{
              flex: 1,
              height: "100%",
              backgroundColor: "red",
            }}
            onClick={() => {
              setLapses([...lapses, Date.now()]);
            }}
          >
            {lapses.length}
          </button>
          {/* count breaths */}
          <button
            style={{
              flex: 1,
              height: "100%",
              backgroundColor: "green",
            }}
            onClick={() => {
              setBreaths([...breaths, Date.now()]);
            }}
          >
            {breaths.length}
          </button>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* show count of breaths and lapses  separately */}
          <div style={{ fontSize: "1.5rem" }}>
            {breaths.length} breaths / {lapses.length} lapses
          </div>

          {/* show each tap time */}
          <div style={{ fontSize: 16 }}>
            {[
              ...breaths.map((tap) => ({
                type: "breath",
                time: tap - startTime!,
              })),
              ...lapses.map((tap) => ({
                type: "lapse",
                time: tap - startTime!,
              })),
            ]
              .sort((a, b) => a.time - b.time)
              .map((tap, index) => (
                <div key={index}>
                  {new Date(tap.time).toISOString().substr(14, 5)} {tap.type}
                </div>
              ))}
          </div>
        </div>
      )}
      <button
        onClick={() => {
          setTimerRunning(!timerRunning);
          if (!timerRunning) {
            setStartTime(Date.now());
            setBreaths([]);
            setTimerValue(null);
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

export default App;
