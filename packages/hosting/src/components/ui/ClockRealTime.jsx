import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

export const ClockRealTime = () => {
  const [currentDateTime, setCurrentDateTime] = useState(
    dayjs().format("DD/MM/YYYY HH:mm:ss A"),
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(dayjs().format("DD/MM/YYYY HH:mm:ss A"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <strong>{currentDateTime}</strong>
    </div>
  );
};
