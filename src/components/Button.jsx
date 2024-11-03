import React from "react";

const BUTTON_TYPE_CLASSES = {
    // searchDemo: "bg-background_green text-white transition duration-300 ease-out hover:shadow-button_shadow",
 
 
    //results
    //search site - Card btn
    search: "bg-background_green px-[40px] py-[14px] text-white rounded-3xl mx-auto hover:shadow-button_shadow transition duration-300 ease-out",
    //Search Results card
    searchLanding: "m-auto bg-background_green text-white w-[122px] h-[54px]  text-base px-10 py-3 rounded-full transition duration-300 ease-out hover:shadow-button_shadow focus:outline-none",
    loadMore: "flex justify-center items-center px-8 py-3 rounded-full bg-background_green text-white font-medium text-lg leading-6 hover:shadow-button_shadow cursor-pointer mx-auto my-12",
    //results: sterge filtre
    deleteFilters: "bg-transparent text-center px-2 py-2 text-black border-black border-l",
    // scrollToTop: "fixed bottom-12 right-[-40px] md:right-2.5 transition-opacity ease-in-out duration-300 pointer-events-none opacity-0",
    // scrollToTop: 'fixed bottom-12 right-[-40px] md:right-2.5 transition-opacity ease-in-out duration-300 pointer-events-none opacity-0',

}

const Button = ({ children, buttonType, ...otherProps}) => {
  return (
    <button className={`${BUTTON_TYPE_CLASSES[buttonType]}`} { ...otherProps } >
        { children }
    </button>
  );
};

export default Button;
