import { MapPin, Building2, ExternalLink, Wallet } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "./ui/tooltip.jsx";

const exceptions = ["de", "lui"];

const Job = ({
  city,
  company,
  county,
  job_link,
  job_title,
  remote,
  salary,
  tags
}) => {
  function displayLocation() {
    const citiesName = city
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
      if (Array.isArray(remote)) return remote.join(", ");
      return remote ? String(remote) : "";
    }
    if (citiesName[0].toLowerCase() === "all") return "Toate orasele";
    if (citiesName.length > 5) return citiesName.slice(0, 5).join(", ");
    return citiesName.join(", ");
  }

  const handleApply = () => {
    window.open(job_link, "_blank");
  };

  const getWorkTypeDisplay = () => {
    const typeString = Array.isArray(remote)
      ? remote.join(" ").toLowerCase()
      : String(remote || "").toLowerCase();

    if (typeString.includes("remote") || typeString.includes("remore")) {
      return { label: "Remote", color: "bg-[#dcfce7] text-[#166534]" };
    }
    if (typeString.includes("hybrid")) {
      return { label: "Hybrid", color: "bg-[#dbeafe] text-[#1e40af]" };
    }
    return { label: "On-site", color: "bg-[#fef3c7] text-[#92400e]" };
  };

  const { label: workTypeLabel, color: workTypeColor } = getWorkTypeDisplay();

  const displaySalary = salary ? salary : "Nespecificat";

  const safeTags =
    tags && Array.isArray(tags) && tags.length > 0 ? tags : ["Fără tag-uri"];
  const maxTags = 7;
  const displayTags = safeTags.slice(0, maxTags);
  const hasMoreTags = safeTags.length > maxTags;

  return (
    // În Job.jsx
    <div
      className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden transition-all duration-300 flex flex-col md:flex-row md:items-stretch group 
  hover:border-custom_teal hover:ring-1 hover:ring-custom_teal/20 hover:ring-offset-1 hover:ring-offset-custom_teal/40
  w-full"
    >
      {/* Content Section */}
      <div className="flex-1 p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* 1. UPDATED TITLE: Removed line-clamp-2, added break-words */}
          <h3
            className="text-[18px] font-semibold text-[#111827] flex-1 break-words"
            title={job_title}
          >
            {job_title}
          </h3>
          {/* Work Type Badge */}
          <span
            className={`px-2 py-1 rounded-full text-[12px] font-medium whitespace-nowrap mt-0.5 ${workTypeColor}`}
          >
            {workTypeLabel}
          </span>
        </div>

        {/* 2. UPDATED COMPANY & LOCATION: Changed to flex-col to stack them vertically */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2 text-[#6b7280]">
            <Building2 className="w-4 h-4 flex-shrink-0" />
            <span className="text-[13px] font-medium" title={company}>
              {company}
            </span>
          </div>

          <div className="flex items-start gap-2 text-[#6b7280]">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="text-[13px] leading-tight">
              {displayLocation()}
            </span>
          </div>
        </div>

        {/* Salary */}
        <div className="flex items-center gap-2 mb-3">
          <Wallet
            className={`w-4 h-4 flex-shrink-0 ${salary ? "text-salary_green" : "text-[#6b7280]"}`}
          />
          <span
            className={`text-[14px] font-semibold ${salary ? "text-salary_green" : "text-[#6b7280]"}`}
          >
            {displaySalary}
          </span>
        </div>

        {/* Tags */}
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

      {/* Button Section with Shadcn Tooltip */}
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
