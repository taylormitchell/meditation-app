import { useEffect, useState } from "react";

const playSound = () => {
  new Audio("/gong.mp3").play();
};

const colors = {
  columbiaBlue: "#C5D5EA",
  airSuperiorityBlue: "#759EB8",
  silverLakeBlue: "#7392B7",
  powderBlue: "#B3C5D7",
  aliceBlue: "#D8E1E9",
};

const useTimer = (timerRunning: boolean) => {
  const [timerValue, setTimerValue] = useState<number | null>(null);
  useEffect(() => {
    if (timerRunning) {
      const interval = setInterval(() => {
        setTimerValue((timerValue) => (timerValue === null ? 0 : timerValue + 1000));
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    } else {
      setTimerValue(null);
    }
  }, [timerRunning]);

  return timerValue;
};

const useCountdown = (duration: number | null, active: boolean) => {
  const [timerValue, setTimerValue] = useState<number | null>(null);
  useEffect(() => {
    if (duration && active) {
      const interval = setInterval(() => {
        setTimerValue((timerValue) => (timerValue === null ? duration : timerValue - 1000));
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    } else {
      setTimerValue(null);
    }
  }, [duration, active]);

  return timerValue;
};

// shows the timer as mm:ss
const Clock = ({ timerValue }: { timerValue: number | null }) => {
  const minutes = Math.floor((timerValue || 0) / 1000 / 60);
  const seconds = Math.floor(((timerValue || 0) / 1000) % 60);
  return (
    <div>
      {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  );
};

function App() {
  const [meditating, setMeditating] = useState(false);
  const [breaths, setBreaths] = useState<number[]>([]);
  const [lapses, setLapses] = useState<number[]>([]);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const [duration, setDuration] = useState<number | null>(null);
  const [playedEndSound, setPlayedEndSound] = useState(false);

  const timerValue = useTimer(meditating);
  const countdownValue = useCountdown(duration, meditating);

  console.log({
    timerValue,
    duration,
    playedEndSound,
    breaths,
    lapses,
    startTime,
    endTime,
  });

  // when we hit the user set duration, play a sound
  useEffect(() => {
    if (!playedEndSound && duration && timerValue && timerValue >= duration) {
      playSound();
      setPlayedEndSound(true);
    }
  }, [duration, timerValue, playedEndSound]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "center",
        }}
      >
        {meditating ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              width: "100%",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Clock timerValue={countdownValue} />
            </div>
            <div
              style={{
                flex: 1,
                width: "100%",
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
                  backgroundColor: colors.airSuperiorityBlue,
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
                  backgroundColor: colors.powderBlue,
                }}
                onClick={() => {
                  setBreaths([...breaths, Date.now()]);
                }}
              >
                {breaths.length}
              </button>
            </div>
            <button
              style={{
                width: "100%",
                backgroundColor: colors.aliceBlue,
              }}
              onClick={() => {
                setEndTime(Date.now());
                setMeditating(false);
              }}
            >
              Stop
            </button>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "5px 0 20px" }}>
            <div
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}
            >
              {/* show count of breaths and lapses  separately */}
              <div>Results from last session</div>
              <div>
                {breaths.length} breaths / {lapses.length} lapses
              </div>
              {/* time meditated */}
              <div>
                <span>Meditation time: </span>
                {startTime && endTime && new Date(endTime - startTime).toISOString().substr(14, 5)}
              </div>

              {/* show each tap time in a scrollable container */}
              <div
                style={{
                  fontSize: 16,
                  overflow: "scroll",
                  minHeight: 50,
                  maxHeight: 100,
                  width: "80%",
                  border: "1px solid black",
                }}
              >
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
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div>Start new session</div>
              <div>
                {/* select 5min, 10min, or 20min session */}

                <button
                  style={{
                    backgroundColor:
                      duration === 1000 * 60 * 5 ? colors.airSuperiorityBlue : colors.aliceBlue,
                  }}
                  onClick={() => setDuration(1000 * 60 * 5)}
                >
                  5 min
                </button>
                <button
                  style={{
                    backgroundColor:
                      duration === 1000 * 60 * 10 ? colors.airSuperiorityBlue : colors.aliceBlue,
                  }}
                  onClick={() => setDuration(1000 * 60 * 10)}
                >
                  10 min
                </button>
                <button
                  style={{
                    backgroundColor:
                      duration === 1000 * 60 * 20 ? colors.airSuperiorityBlue : colors.aliceBlue,
                  }}
                  onClick={() => setDuration(1000 * 60 * 20)}
                >
                  20 min
                </button>
              </div>
              <button
                style={{ backgroundColor: colors.aliceBlue }}
                onClick={() => {
                  playSound();
                  setMeditating(true);
                  setStartTime(Date.now());
                  setBreaths([]);
                  setLapses([]);
                }}
              >
                Start
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
