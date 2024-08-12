import React from "react";

const JobSkeleton = () => {
  return (
    <div className="relative w-[300px] lg:w-[384px] min-h-[357px] bg-background_cards text-center flex flex-col justify-around items-center flex-wrap gap-3 px-4 py-[6px] rounded-2xl shadow-card_shadow z-0">
      <div className="flex items-center justify-center  bg-gray-300 animate-pulse z-0 rounded-3xl">
        <div className="w-[100px] h-[100px]"></div>
      </div>
      <div className="flex flex-col justify-between gap-5 max-w-[280px] lg:max-w-[364px] z-0">
        <p className="leading-5 bg-gray-300 h-5 w-[160px] mx-auto rounded-md animate-pulse"></p>
        <p className="text-lg font-bold bg-gray-300 h-[20px] w-[80%] mx-auto rounded-md animate-pulse"></p>
        <p className="bg-gray-300 h-[16px] w-[50%] rounded-md animate-pulse mx-auto"></p>
        <div className="bg-background_green w-[160px] h-[50px] text-white rounded-3xl mx-auto animate-pulse"></div>
      </div>
    </div>
  );
};

export default JobSkeleton;
