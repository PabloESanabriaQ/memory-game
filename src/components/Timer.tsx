import { useState, useEffect } from 'react';

type TimerProps = {
  startTime: number | null;
  endTime: number | null;
}

export default function Timer({ startTime, endTime }: TimerProps) {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    let interval: number | null = null;
    if (startTime && !endTime) {
      interval = window.setInterval(() => {
        setCurrentTime(Date.now() - startTime);
      }, 100);
    } else if (endTime && startTime) {
      setCurrentTime(endTime - startTime);
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [startTime, endTime]);

  return <div>Time: {(currentTime / 1000).toFixed(2)} seconds</div>;
}