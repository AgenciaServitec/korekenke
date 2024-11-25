import { useEffect, useState } from "react";

export const useCountdown = () => {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timeout = setTimeout(() => {
      setSecondsLeft(secondsLeft - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [secondsLeft]);

  const start = (seconds) => {
    setSecondsLeft(seconds);
  };

  return { secondsLeft, start };
};
