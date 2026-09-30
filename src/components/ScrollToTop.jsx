import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import Button from "./ui/button";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScrollPosition = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener("scroll", checkScrollPosition);
    checkScrollPosition();

    return () => window.removeEventListener("scroll", checkScrollPosition);
  }, []);

  return (
    <Button
      type="button"
      buttonType="scrollToTop"
      className={isVisible ? "opacity-100 pointer-events-auto" : ""}
      aria-label="Derulează în sus"
      title="Derulează în sus"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ArrowUp aria-hidden="true" />
    </Button>
  );
};

export default ScrollToTop;