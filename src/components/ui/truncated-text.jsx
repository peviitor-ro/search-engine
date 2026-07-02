import { useRef, useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "./tooltip";
import { cn } from "@/lib/utils";

const TruncatedText = ({
  text,
  lines = 1,
  className = "",
  as: Tag = "span",
  delayDuration = 300,
  disableTruncation = false
}) => {
  const ref = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      setIsTruncated(el.scrollHeight > el.clientHeight + 1);
    };

    const timer = setTimeout(check, 50);
    const observer = new ResizeObserver(check);
    observer.observe(el);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [text, lines]);

  if (disableTruncation) {
    return <Tag className={cn("break-words", className)}>{text}</Tag>;
  }

  const inlineStyle = {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: lines,
    overflow: "hidden",
  };

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip open={isTruncated ? open : false} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <Tag
            ref={ref}
            className={cn("break-words", className)}
            style={inlineStyle}
            onMouseEnter={() => isTruncated && setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            {text}
          </Tag>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="start"
          className="bg-text_grey text-white px-3 py-2 rounded-md text-sm max-w-[320px] break-words"
        >
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TruncatedText;