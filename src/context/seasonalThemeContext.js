import { createContext, useContext } from "react";

export const SeasonalThemeContext = createContext({
  season: null,
  isWinter: false
});

export function useSeasonalTheme() {
  return useContext(SeasonalThemeContext);
}
