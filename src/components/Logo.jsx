import LogoSvg from "../assets/svg/logo.svg?react";
import santaHat from "../assets/svg/santa-hat.svg";
import { cn } from "@/lib/utils";

const Logo = ({ alt = "peviitor", className }) => {
  return (
    <span className={cn("winter-logo-wrapper relative inline-block", className)}>
      <LogoSvg role="img" aria-label={alt} className="winter-logo-svg block" />
      <img
        src={santaHat}
        alt=""
        aria-hidden="true"
        className="winter-santa-hat"
      />
    </span>
  );
};

export default Logo;
