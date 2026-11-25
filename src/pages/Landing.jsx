import { useState, useEffect, useRef } from "react";
import { getNumberOfJobs } from "../utils/fetchData";
// images
import dungi from "../assets/svg/dungi.svg";
// racheta
import racheta from "../assets/svg/racheta.svg";
// audio
import sleighBells from "../assets/audio/sleigh-bells.mp3";
// components
import Logo from "../components/Logo";
import Search from "../components/Search";
import Footer from "../components/Footer";
import SantaSleigh from "../components/SantaSleigh";
// context
import { useSeasonalTheme } from "../context/seasonalThemeContext";

const Landing = () => {
  const { isWinter } = useSeasonalTheme();
  const navRef = useRef(null);
  const heroTextRef = useRef(null);
  const audioRef = useRef(null);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [inputWidth, setInputWidth] = useState(300);

  useEffect(() => {
    const fetchJobsData = async () => {
      try {
        setLoading(true);
        const numFound = await getNumberOfJobs();

        if (numFound) {
          setData(numFound);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobsData();
  }, []);

  const calculateInputWidth = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth < 768) {
      setInputWidth(300);
    } else if (screenWidth >= 768 && screenWidth < 1024) {
      setInputWidth(360);
    } else if (screenWidth >= 1024 && screenWidth < 1280) {
      setInputWidth(590);
    } else if (screenWidth >= 1280) {
      setInputWidth(735);
    }
  };

  useEffect(() => {
    calculateInputWidth();
    window.addEventListener("resize", calculateInputWidth);
    return () => {
      window.removeEventListener("resize", calculateInputWidth);
    };
  }, []);

  useEffect(() => {
    if (!isWinter) return undefined;
    const audio = audioRef.current;
    if (!audio) return undefined;

    audio.volume = 0.85;
    audio.currentTime = 0;

    let unlockHandler = null;
    const cleanupUnlock = () => {
      if (!unlockHandler) return;
      window.removeEventListener("pointerdown", unlockHandler);
      window.removeEventListener("keydown", unlockHandler);
      window.removeEventListener("touchstart", unlockHandler);
      unlockHandler = null;
    };

    try {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          unlockHandler = () => {
            audio.currentTime = 0;
            audio.play().catch(() => {});
            cleanupUnlock();
          };
          window.addEventListener("pointerdown", unlockHandler, { once: true });
          window.addEventListener("keydown", unlockHandler, { once: true });
          window.addEventListener("touchstart", unlockHandler, { once: true });
        });
      }
    } catch {
      // Ignore audio errors in non-browser test environments
    }

    return () => {
      cleanupUnlock();
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {
        // Ignore pause errors in jsdom
      }
    };
  }, [isWinter]);

  return (
    <div className="landing-page flex flex-col justify-between items-center py-5 min-h-[100vh] overflow-x-clip">
      {isWinter && (
        <audio
          ref={audioRef}
          src={sleighBells}
          autoPlay
          preload="auto"
        />
      )}
      <nav
        ref={navRef}
        className="relative z-20 w-[80%] md:w-[80%] max-w-[1500px] border-b border-border_grey"
      >
        <Logo alt="peviitor-logo" />
      </nav>

      <main className="w-[70%] max-w-[1350px] gap-y-10 flex flex-wrap justify-center xs:gap-0 sm:gap-0 md:gap-2 lg:gap-0 items-center sm:items-start mt-[8em] mb-[10em] font-PoppinsRegular text-left">
        <div className="order-1">
          <div
            ref={heroTextRef}
            className="relative w-[300px] md:w-[486px] lg:w-[340px] xl:w-[486px]"
          >
            <h1 className="text-text_orange text-[40px] md:text-[44px] xl:text-6xl font-semibold  mb-2 leading-[110%]">
              Locul de muncă visat,
              <img
                src={dungi}
                alt="dungi"
                className="absolute top-[125px] left-[-3px] scale-[0.7] md:scale-[0.9] md:top-[90px] md:left-[-5px] lg:top-[138px] lg:left-[-30px] lg:scale-[0.7] xl:top-[113px] xl:left-[220px] xl:scale-110"
              />{" "}
              la un click distanță
            </h1>
            <h2 className="winter-contrast-text text-lg leading-6 text-text_grey">
              {loading ? (
                <>
                  Peste{" "}
                  <div className="animate-pulse inline-block h-3 bg-gray-300 rounded w-16" />
                  {" "}de locuri de muncă din România actualizate zilnic
                </>
              ) : data?.total.jobs > 0 ? (
                <>
                  Peste{" "}
                  <strong className="text-black">
                    {data.total.jobs}
                  </strong>{" "}
                  de locuri de muncă din România actualizate zilnic
                </>
              ) : (
                "Descoperă locuri de muncă din România, actualizate zilnic."
              )}
            </h2>
          </div>
        </div>
        <div className="order-3 lg:order-1 relative z-10">
          {isWinter ? (
            <SantaSleigh logoRef={navRef} heroTextRef={heroTextRef} />
          ) : (
            <img
              src={racheta}
              alt="racheta"
              className="min-w-[250px] mt-6 lg:mt-0 md:min-w-full"
            />
          )}
        </div>
        <div className="flex justify-center items-center order-2 2xl:shrink-0 2xl:grow-0 ">
          <Search inputWidth={inputWidth} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
