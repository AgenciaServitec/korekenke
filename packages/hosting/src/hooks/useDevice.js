import { useMemo, useState } from "react";
import { breakPoints } from "../styles";

export const useDevice = () => {
  const [currentScreenWidth, setCurrentScreenWidth] = useState(
    window.innerWidth
  );

  useMemo(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const bodyWidth = entries[0].target.clientWidth;

      setCurrentScreenWidth(bodyWidth);
    });

    resizeObserver.observe(document.body);
  }, []);

  return {
    currentScreenWidth,
    isMobile: currentScreenWidth < breakPoints.tablet,
    isTablet: currentScreenWidth < breakPoints.desktop,
  };
};
