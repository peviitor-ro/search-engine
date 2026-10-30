import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search } from "lucide-react";

const QuickSearchTooltip = ({ children, onSearch }) => {
  const [tooltip, setTooltip] = useState({ visible: false, text: "", x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const hideTooltip = () => {
      setTooltip((prev) => ({ ...prev, visible: false }));
    };

    const handleMouseUp = (e) => {
      const selection = window.getSelection();
      const selectedText = selection ? selection.toString().trim() : "";
      const target = e.target instanceof Element ? e.target : null;

      // Ensure selection is inside this specific component and meets length constraints (2 - 50 chars)
      if (
        containerRef.current &&
        selection &&
        selection.rangeCount > 0 &&
        selection.focusNode &&
        containerRef.current.contains(selection.focusNode) &&
        selectedText.length >= 2 &&
        selectedText.length <= 50
      ) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        setTooltip({
          visible: true,
          text: selectedText,
          x: rect.left + rect.width / 2 + scrollLeft,
          y: rect.top + scrollTop - 12
        });
      } else if (!target?.closest(".quick-search-tooltip")) {
        hideTooltip();
      }
    };

    const handleClickOutside = (e) => {
      const target = e.target instanceof Element ? e.target : null;

      if (
        !target?.closest(".quick-search-tooltip") &&
        containerRef.current &&
        !containerRef.current.contains(target)
      ) {
        hideTooltip();
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchClick = () => {
    if (tooltip.text) {
      onSearch(tooltip.text);
      setTooltip({ visible: false, text: "", x: 0, y: 0 });
      window.getSelection().removeAllRanges();
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block w-full">
      {children}
      {tooltip.visible &&
        createPortal(
          <button
            type="button"
            className="quick-search-tooltip group absolute z-[1000] flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white shadow-lg shadow-slate-900/25 transition-all duration-200 ease-out hover:-translate-y-[calc(100%+3px)] hover:border-custom_teal hover:bg-background_green hover:shadow-lg hover:shadow-custom_teal/30 focus:outline-none focus:ring-2 focus:ring-custom_teal focus:ring-offset-2"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
              transform: "translate(-50%, -100%)",
              animation: "quick-search-tooltip-in 180ms ease-out"
            }}
            onClick={handleSearchClick}
            aria-label={`Caută ${tooltip.text}`}
            title={`Caută ${tooltip.text}`}
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 transition-all duration-200 group-hover:scale-110 group-hover:bg-white/20 group-hover:rotate-[-8deg]">
              <Search className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
            </span>
            <span className="max-w-[240px] overflow-hidden text-ellipsis whitespace-nowrap transition-colors duration-200 group-hover:text-white">
              Caută <span className="font-semibold">«{tooltip.text}»</span>
            </span>
          </button>,
          document.body
        )}
    </div>
  );
};

export default QuickSearchTooltip;