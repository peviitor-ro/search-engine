// assets
import strut from "../assets/svg/strut.svg";
import ren from "../assets/images/ren.webp";
// context
import { useSeasonalTheme } from "../context/seasonalThemeContext";

const NoResults = () => {
  const { isWinter } = useSeasonalTheme();

  return (
    <div className="flex flex-col items-center justify-center text-text_grey_darker gap-20 md:flex-row px-4 pt-8">
      <div>
        <h2 className="winter-contrast-heading lg:text-5xl md:text-4xl text-3xl font-semibold leading-none md:leading-16 text-left mb-4 md:mb-3">
          Ups! <br />
          Căutarea nu are <br /> rezultat
        </h2>
        <h3 className="winter-contrast-text md:text-2xl text-1xl text-base font-normal leading-5 md:leading-6 text-left">
          Elimină din filtre sau începe o căutare nouă
        </h3>
      </div>
      <img
        className={isWinter ? "w-[321px] max-w-full h-auto" : "w-250px"}
        src={isWinter ? ren : strut}
        alt="not-found"
      />
    </div>
  );
};
export default NoResults;
