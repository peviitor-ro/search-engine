import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("", {
  variants: {
    buttonType: {
      default: "",
      search:
        "ml-3 bg-background_green text-white w-[122px] h-[54px] text-base rounded-full transition duration-300 ease-out hover:shadow-button_shadow focus:outline-none",
      searchJob:
        "bg-background_green px-[40px] py-[14px] text-white rounded-full mx-auto hover:shadow-button_shadow transition duration-300 ease-out",
      loadMore:
        "flex justify-center items-center px-8 py-3 rounded-full bg-background_green text-white font-medium text-lg leading-6 hover:shadow-button_shadow cursor-pointer mx-auto mb-12",
      deleteFilters:
        "bg-transparent px-2 py-1 text-sm text-text_grey_darker underline-offset-4 hover:text-background_green hover:underline cursor-pointer",
      addFilters:
        "group py-1 pl-3 pr-2 text-sm text-text_grey bg-background_green_light/40 border-background_green border hover:bg-background_green_light transition-colors duration-200 rounded-full flex items-center gap-1.5 cursor-pointer",
      scrollToTop:
        "fixed bottom-12 right-[-40px] md:right-2.5 transition-opacity ease-in-out duration-300 pointer-events-none opacity-0"
    }
  },
  defaultVariants: {
    buttonType: "default"
  }
});

const Button = React.forwardRef(({ className, buttonType, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ buttonType }), className)}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };
export default Button;
