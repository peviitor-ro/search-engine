import { useEffect, useState } from "react";
import { SeasonalThemeContext } from "./seasonalThemeContext";
import SeasonalBackground from "../components/SeasonalBackground";
import {
  SEASONS,
  SEASON_THEME_CLASSES,
  getActiveSeason,
  getNextSeasonTransitionMs
} from "../utils/seasonalTheme";

// Max 32-bit signed int delay for setTimeout (~24.8 days)
const MAX_TIMEOUT_MS = 2147483647;

export const SeasonalThemeProvider = ({ children }) => {
  const [season, setSeason] = useState(() => getActiveSeason());

  useEffect(() => {
    const root = document.documentElement;
    const allThemeClasses = Object.values(SEASON_THEME_CLASSES);

    root.classList.remove(...allThemeClasses);
    if (season && SEASON_THEME_CLASSES[season]) {
      root.classList.add(SEASON_THEME_CLASSES[season]);
    }

    return () => {
      root.classList.remove(...allThemeClasses);
    };
  }, [season]);

  useEffect(() => {
    let timeoutId;

    const scheduleCheck = () => {
      const now = new Date();
      setSeason(getActiveSeason(now));

      const msUntilNextTransition = getNextSeasonTransitionMs(now);
      const delay = Math.min(
        Math.max(msUntilNextTransition, 1000),
        MAX_TIMEOUT_MS
      );

      timeoutId = window.setTimeout(scheduleCheck, delay);
    };

    scheduleCheck();

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  const isWinter = season === SEASONS.WINTER;

  return (
    <SeasonalThemeContext.Provider value={{ season, isWinter }}>
      <SeasonalBackground />
      {children}
    </SeasonalThemeContext.Provider>
  );
};
