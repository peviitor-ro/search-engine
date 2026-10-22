import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { MapPin, X } from "lucide-react";
import TagsContext from "../context/TagsContext";
import { processLocations, removeDiacritics } from "../utils/locationUtils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "./ui/tooltip.jsx";

const JobLocation = ({ location, onModalToggle }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState("center");

  const modalRef = useRef(null);
  const tagButtonRef = useRef(null);

  const routerLocation = useLocation();
  const isProfilePage = routerLocation.pathname.includes("/company");

  const tagsContext = useContext(TagsContext);
  const filterCities =
    !isProfilePage && tagsContext?.city ? tagsContext.city : [];

  const allLocations = processLocations(location);

  const isFilterMatch = (cityName) => {
    if (!filterCities || filterCities.length === 0) return false;
    const normCity = removeDiacritics(cityName.toLowerCase().trim());
    return filterCities.some(
      (f) => removeDiacritics(String(f).toLowerCase().trim()) === normCity
    );
  };

  const matchedLocations = allLocations.filter(isFilterMatch);
  const otherLocations = allLocations.filter((loc) => !isFilterMatch(loc));

  const handleOpenModal = (e) => {
    e.stopPropagation();

    if (tagButtonRef.current) {
      const cardEl =
        tagButtonRef.current.closest(".relative") ||
        tagButtonRef.current.parentElement;
      if (cardEl) {
        const tagRect = tagButtonRef.current.getBoundingClientRect();
        const cardRect = cardEl.getBoundingClientRect();
        const originX = tagRect.left - cardRect.left + tagRect.width / 2;
        const originY = tagRect.top - cardRect.top + tagRect.height / 2;
        setTransformOrigin(`${originX}px ${originY}px`);
      }
    }

    setIsClosing(false);
    setIsAnimatingIn(true);
    setIsModalOpen(true);
    onModalToggle?.(true);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsAnimatingIn(false);
      });
    });
  };

  const handleCloseModal = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      setIsClosing(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setIsClosing(false);
        onModalToggle?.(false);
      }, 500);
    },
    [onModalToggle]
  );

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, handleCloseModal]);

  let displayedItems = [];
  let remainingCount = 0;

  if (allLocations.length === 0) {
    displayedItems = ["România"];
    remainingCount = 0;
  } else if (matchedLocations.length > 0) {
    if (matchedLocations.length <= 3) {
      displayedItems = matchedLocations;
      remainingCount = otherLocations.length;
    } else {
      displayedItems = matchedLocations.slice(0, 3);
      remainingCount = allLocations.length - 3;
    }
  } else {
    if (allLocations.length <= 3) {
      displayedItems = allLocations;
      remainingCount = 0;
    } else {
      displayedItems = allLocations.slice(0, 3);
      remainingCount = allLocations.length - 3;
    }
  }

  const primaryText = displayedItems.join(", ");

  return (
    <>
      <div className="flex items-start gap-2 text-[#6b7280]">
        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div className="flex items-center gap-1.5 flex-wrap text-[13px] leading-tight text-[#6b7280] min-w-0">
          <span className="truncate max-w-full">{primaryText}</span>
          {remainingCount > 0 && (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    ref={tagButtonRef}
                    type="button"
                    onClick={handleOpenModal}
                    className="px-2 py-0.5 bg-[#f3f4f6] text-background_green font-medium rounded-md text-[12px] hover:bg-[#e5e7eb] transition-colors cursor-pointer inline-flex items-center gap-1 shrink-0"
                    aria-label={`Vezi încă ${remainingCount} locații`}
                  >
                    +{remainingCount} altele
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="center"
                  className="bg-text_grey text-white px-3 py-1.5 rounded-md text-sm"
                >
                  <p>Vezi toate locațiile</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={(e) => e.stopPropagation()}
          onMouseOver={(e) => e.stopPropagation()}
          style={{ transformOrigin }}
          className={`absolute inset-0 bg-white z-30 p-4 rounded-xl flex flex-col border border-custom_teal/40 shadow-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isClosing || isAnimatingIn
              ? "scale-0 opacity-0 pointer-events-none"
              : "scale-100 opacity-100 pointer-events-auto"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Toate locațiile disponibile"
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2 shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-background_green/10 text-background_green rounded-lg">
                <MapPin className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                Toate locațiile ({allLocations.length})
              </h4>
            </div>
            <button
              type="button"
              onClick={handleCloseModal}
              className="p-1 rounded-lg text-background_green hover:text-[#235c57] hover:bg-transparent transition-colors cursor-pointer"
              aria-label="Închide lista de locații"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-1 location-modal-scrollbar">
            {allLocations.map((loc, idx) => {
              const isMatched = isFilterMatch(loc);
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-[13px] ${
                    isMatched
                      ? "bg-background_green/10 text-background_green"
                      : "text-gray-900"
                  }`}
                >
                  <span className="flex items-center gap-2 font-semibold text-gray-900">
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isMatched ? "bg-background_green" : "bg-gray-400"
                      }`}
                    />
                    {loc}
                  </span>
                  {isMatched && (
                    <span className="text-[11px] bg-background_green text-white px-1.5 py-0.5 rounded font-medium">
                      Filtru activ
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default JobLocation;
