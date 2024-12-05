import React from "react";

const BUTTON_TYPE_CLASSES = {
  search: "ml-3 bg-background_green text-white w-[122px] h-[54px]  text-base rounded-full transition duration-300 ease-out hover:shadow-button_shadow focus:outline-none",
  searchJob: "bg-background_green px-[40px] py-[14px] text-white rounded-full mx-auto hover:shadow-button_shadow transition duration-300 ease-out",
  loadMore: "flex justify-center items-center px-8 py-3 rounded-full bg-background_green text-white font-medium text-lg leading-6 hover:shadow-button_shadow cursor-pointer mx-auto mb-12",
  deleteFilters: "bg-transparent text-center px-2 py-2 text-black border-black border-l",
  addFilters: "py-2 px-4 bg-background_green_light rounded-full flex items-center",
  scrollToTop: "fixed bottom-12 right-[-40px] md:right-2.5 transition-opacity ease-in-out duration-300 pointer-events-none opacity-0",
}

const Button = ({ children, className, buttonType, ...otherProps}) => {
  return (
    <button className={`${className} ${BUTTON_TYPE_CLASSES[buttonType]}`} { ...otherProps } >
      { children }
    </button>
  );
};

export default Button;
