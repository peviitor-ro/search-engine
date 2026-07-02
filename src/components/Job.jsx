import { MapPin, Building2, ExternalLink, Wallet } from "lucide-react";
import { capitalizeJobTitle, formatSalary } from "../utils/textFormat.js";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, CalendarClock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "./ui/tooltip.jsx";
import TruncatedText from "./ui/truncated-text.jsx";
import { useMediaQuery } from "@uidotdev/usehooks";

const exceptions = ["de", "lui"];

const Job = ({
  location,
  company,
  url,
  title,
  workmode,
  salary,
  tags: tagsProp,
  cif,
  vdate,
  date
}) => {

  const isMobile = useMediaQuery("(max-width: 767px)")

  function displayLocation() {
    const citiesName = location
      ?.filter((el) => el)
      .map((el) => {
        return String(el)
          .toLowerCase()
          .split(/([ -])/g)
          .map((word) => {
            return exceptions.includes(word)
              ? word
              : word.charAt(0).toUpperCase() + word.slice(1);
          })
          .join("");
      });

    if (!citiesName || citiesName.length === 0) {
      if (Array.isArray(workmode) && workmode.length > 0)
        return workmode.join(", ");
      if (typeof workmode === "string" && workmode.trim().length > 0)
        return workmode;
      return "România";
    }
    if (citiesName[0].toLowerCase() === "all") return "Toate orasele";
    if (citiesName.length > 5) return citiesName.slice(0, 5).join(", ");
    return citiesName.join(", ");
  }

  const routerLocation = useLocation();
  const isProfilePage = routerLocation.pathname.includes("/company");

  const handleApply = () => {
    window.open(url, "_blank");
  };

  const getWorkTypeDisplay = () => {
    if (!workmode) {
      return { label: "Fizic", color: "bg-[#fef3c7] text-[#92400e]" };
    }

    const typeString = Array.isArray(workmode)
      ? workmode.join(" ").toLowerCase()
      : String(workmode).toLowerCase();

    if (typeString.includes("remote") || typeString.includes("remore")) {
      return { label: "La distanță", color: "bg-[#dcfce7] text-[#166534]" };
    }

    if (typeString.includes("hybrid") || typeString.includes("hibrid")) {
      return { label: "Hibrid", color: "bg-[#dbeafe] text-[#1e40af]" };
    }

    return { label: "Fizic", color: "bg-[#fef3c7] text-[#92400e]" };
  };

  const { label: workTypeLabel, color: workTypeColor } = getWorkTypeDisplay();

  const formattedSalaryString = formatSalary(salary);
  const displaySalary = formattedSalaryString
    ? formattedSalaryString
    : "Nespecificat";

  const processedTags = (
    Array.isArray(tagsProp)
      ? tagsProp
      : typeof tagsProp === "string"
        ? tagsProp.split(",")
        : []
  )
    .flatMap((tag) => (typeof tag === "string" ? tag.split(",") : tag))
    .map((tag) => (tag ? String(tag).trim() : ""))
    .filter((tag) => tag.length > 0);

  const tags = processedTags.length > 0 ? processedTags : ["Fără tag-uri"];
  const maxTags = 7;
  const displayTags = tags.slice(0, maxTags);
  const hasMoreTags = tags.length > maxTags;

  const rawDate = vdate || date;
  const dateUI = rawDate
    ? new Date(rawDate)
        .toLocaleDateString("ro-RO", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        })
        .replace(".", "")
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" • ")
    : "Lipsă";

  return (
    <div
      className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden transition-all duration-300 flex flex-col md:flex-row md:items-stretch group 
  hover:border-custom_teal hover:ring-1 hover:ring-custom_teal/20 hover:ring-offset-1 hover:ring-offset-custom_teal/40
  w-full"
    >
      <div className="flex-1 p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <TruncatedText
            text={capitalizeJobTitle(title)}
            lines={isMobile ? 2 : 1}
            disableTruncation={isMobile}
            as="h3"
            className="text-[18px] font-semibold text-[#111827] flex-1"
          />
          <span
            className={`px-2 py-1 rounded-full text-[12px] font-medium whitespace-nowrap mt-0.5 ${workTypeColor}`}
          >
            {workTypeLabel}
          </span>
        </div>
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2 text-[#6b7280]">
            <Building2 className="w-4 h-4 flex-shrink-0" />
            {cif && !isProfilePage ? (
              <Link
                to={`/company/${cif}`}
                className="group inline-flex items-center gap-1 text-[13px] font-medium text-background_green hover:underline cursor-pointer transition-colors min-w-0"
                title={`Vezi profilul companiei ${company}`}
              >
                <TruncatedText
                  text={company}
                  lines={isMobile ? 2 : 1}
                  disableTruncation={isMobile}
                  className="text-[13px] font-medium text-background_green"
                />
                <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </Link>
            ) : (
              <TruncatedText
                text={company}
                lines={isMobile ? 2 : 1}
                disableTruncation={isMobile}
                className="text-[13px] font-medium text-[#6b7280]"
              />
            )}
          </div>

          <div className="flex items-start gap-2 text-[#6b7280]">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <TruncatedText
              text={displayLocation()}
              lines={isMobile ? 2 : 1}
              disableTruncation={isMobile}
              className="text-[13px] leading-tight text-[#6b7280]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap w-full mb-3">
          <div className="flex items-center gap-2">
            <Wallet
              className={`w-4 h-4 flex-shrink-0 ${salary ? "text-background_green" : "text-[#6b7280]"}`}
            />
            <span
              className={`text-[14px] font-semibold ${salary ? "text-background_green" : "text-[#6b7280]"}`}
            >
              {displaySalary}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[#6b7280]">
            <CalendarClock className="w-4 h-4 flex-shrink-0" />
            <span className="text-[14px] font-medium">{dateUI}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {displayTags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-[#f3f4f6] text-[#374151] rounded-md text-[12px]"
            >
              {tag}
            </span>
          ))}
          {hasMoreTags && (
            <span className="px-2 py-1 text-[#6b7280] text-[12px] flex items-center">
              ...
            </span>
          )}
        </div>
      </div>

      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleApply}
              className="bg-[#f9fafb] text-[#6b7280] transition-all duration-300 md:px-6 py-3 md:py-0 flex items-center justify-center gap-2 group-hover:bg-custom_teal group-hover:text-white"
            >
              <ExternalLink className="w-5 h-5" />
              <span className="md:hidden text-[14px] font-medium">
                Către site
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            align="center"
            className="bg-text_grey text-white px-3 py-1.5 rounded-md text-sm"
          >
            <p>Aplicați pe site-ul companiei</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default Job;