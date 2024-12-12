import Results from "../components/Results";
import Search from "../components/Search";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";

const Rezultate = () => {
  const [inputWidth, setInputWidth] = useState(300);
  const calculateTotalCardsWidth = () => {
    const screenWidth = window.innerWidth;
    const gap = 28;
    let cardWidth;
    const breakpoint = 1024;

    cardWidth = screenWidth > breakpoint ? 384 : 300;

    setInputWidth(
      screenWidth < 768
        ? 300
        : (Math.floor((screenWidth - gap * 4 - cardWidth) / (cardWidth + gap)) +
            1) *
            cardWidth +
            (Math.floor(
              (screenWidth - gap * 4 - cardWidth) / (cardWidth + gap)
            ) +
              1 -
              1) *
              gap -
            235
    );
  };

  useEffect(() => {
    calculateTotalCardsWidth();
    window.addEventListener("resize", calculateTotalCardsWidth);
    window.scrollTo(0, 0);
    return () => {
      window.removeEventListener("resize", calculateTotalCardsWidth);
    };
  }, []);

  return (
    <div className="rezultate-pagina flex flex-col  items-center min-h-[100vh]">
      <Search inputWidth={inputWidth} />
      <Results />
      <Footer />
    </div>
  );
};

export default Rezultate;
