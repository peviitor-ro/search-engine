import { useState, useEffect, useRef } from "react";

const QuickSearchTooltip = ({ children, onSearch }) => {
  const [tooltip, setTooltip] = useState({ visible: false, text: "", x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseUp = (e) => {
      const selection = window.getSelection();
      const selectedText = selection ? selection.toString().trim() : "";

      // Ensure selection is inside this specific job title container and meets length constraints (2 - 50 chars)
      if (
        containerRef.current &&
        containerRef.current.contains(selection.anchorNode) &&
        selectedText.length >= 2 &&
        selectedText.length <= 50
      ) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setTooltip({
          visible: true,
          text: selectedText,
          x: rect.left + rect.width / 2,
          y: rect.top - 10 + window.scrollY,
        });
      } else {
        // Dismiss if clicking outside the tooltip
        if (!e.target.closest(".quick-search-tooltip")) {
          setTooltip((prev) => ({ ...prev, visible: false }));
        }
      }
    };

    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".quick-search-tooltip") &&
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setTooltip((prev) => ({ ...prev, visible: false }));
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
      {tooltip.visible && (
        <div
          className="quick-search-tooltip fixed z-50 transform -translate-x-1/2 -translate-y-full bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl cursor-pointer flex items-center gap-1.5 transition-all duration-150"
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
          onClick={handleSearchClick}
        >
          <span className="font-medium">Caută «{tooltip.text}»</span>
        </div>
      )}
    </div>
  );
};

export default QuickSearchTooltip;