import { useEffect, useState } from "react";

export const useResizeObserver = () => {
  const [currentScreenWidth, setCurrentScreenWidth] = useState(
    window.innerWidth
  );
  const [currentScreenHeight, setCurrentScreenHeight] = useState(
    window.innerHeight
  );

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const bodyWidth = entries[0].target.clientWidth;
      const bodyHeight = entries[0].target.clientHeight;

      setCurrentScreenWidth(bodyWidth);
      setCurrentScreenHeight(bodyHeight);
    });

    resizeObserver.observe(document.body);
  }, []);

  return { currentScreenWidth, currentScreenHeight };
};
