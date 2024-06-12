"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import CheckboxFilter from "./CheckboxSkeleton";
import { CompaniesName } from "@/models/dataSchema";
import { getNameOfCompanies } from "@/lib/fetchData";
import { orase } from "@/lib/getCityName";
import Image from "next/image";
import sageata from "@/app/assets/svg/arrow_bottom.svg";

function FiltreCheckbox() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const remote = searchParams.getAll("tipJob");
  const city = searchParams.getAll("oras");
  const company = searchParams.getAll("companie");
  const [data, setData] = useState<CompaniesName | undefined>();

  // use it for closing dropdown on click
  const refDropdown = useRef<HTMLDivElement>(null);

  // State for dropdown visibility
  const [dropDown, setDropDown] = useState([false, false, false]);

  // Function to handle dropdown toggle
  function handleDropDown(index: number) {
    // Toggle the dropdown at the specified index
    const updatedDropDown = dropDown.map((item, i) =>
      i === index ? !item : false
    );
    setDropDown(updatedDropDown);
  }

  // Get a new searchParams string by merging the current
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const currentParams = new URLSearchParams(searchParams.toString());

      if (remote.includes(value)) {
        // If the radio button is already checked, uncheck it
        currentParams.delete(name);
      } else {
        // Otherwise, set the radio button value
        currentParams.set(name, value);
        // Set the page parameter to 1 when applying filters
        currentParams.set("pagina", "1");
      }
      router.push(`${pathname}?${currentParams.toString()}`);
    },
    [searchParams, pathname, router, remote]
  );

  // Fetching company data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: CompaniesName | undefined = await getNameOfCompanies();
        setData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // For closing dropDown on click
  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      // when its clicked outside the dropdown, then will close the dropdown
      if (
        dropDown &&
        refDropdown.current &&
        !refDropdown.current.contains(e.target as Node)
      ) {
        setDropDown([false, false, false]);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [dropDown]);

  // Function to get button label based on index and fields
  const getButtonLabel = (index: number) => {
    if (index === 0) {
      return `Oraș ${city.length >= 1 ? `(${city.length})` : ""}`;
    } else if (index === 1) {
      return `Companie ${company.length >= 1 ? `(${company.length})` : ""}`;
    } else {
      return `Mod de lucru ${remote.length >= 1 ? `(${remote.length})` : ""}`;
    }
  };

  // Function to get button style based on index and fields
  const getButtonStyle = (index: number) => {
    if (index === 0 && city.length >= 1) {
      return "text-background_green";
    } else if (index === 1 && company.length >= 1) {
      return "text-background_green";
    } else if (index === 2 && remote.length >= 1) {
      return "text-background_green";
    } else {
      return {};
    }
  };

  return (
    <div
      ref={refDropdown}
      className="flex items-center justify-center flex-wrap mt-2 mx-auto w-fit gap-4 relative font-PoppinsRegular"
    >
      {/* Mapping through each dropdown */}
      {dropDown.map((isOpen, index) => (
        <div key={index}>
          <button
            className={`${
              isOpen ? "text-background_green" : ""
            } ${getButtonStyle(
              index
            )} flex items-baseline bg-none border-none px-4 py-2 cursor-pointer hover:text-background_green`}
            onClick={() => handleDropDown(index)}
            // style={getButtonStyle(index)}
          >
            {/* Dynamically set button label based on index */}
            {getButtonLabel(index)}
            {/* Arrow icon for indicating dropdown state */}
            <Image
              src={sageata}
              alt="sageata-dropdown"
              className={`${isOpen ? "rotate-180" : ""} ml-2`}
            />
          </button>
          {/* Dropdown container */}
          <div
            className={`${
              isOpen ? "block" : "hidden"
            }  text-lg py-1 gap-[1px] border border-background_green rounded-3xl shadow-checbox_shadow absolute bg-white`}
          >
            {/* Dynamically rendering checkbox based on index */}
            {/* Cities Drop-down */}
            {index === 0 && (
              <React.Fragment>
                <CheckboxFilter
                  items={orase}
                  filterKey="oras"
                  searchFor="oras"
                  checked={city}
                  dropDown={dropDown}
                />
              </React.Fragment>
            )}
            {/* Companies Drop-down */}
            {index === 1 && (
              <React.Fragment>
                <CheckboxFilter
                  items={data}
                  filterKey="companie"
                  searchFor="companie"
                  checked={company}
                  dropDown={dropDown}
                />
              </React.Fragment>
            )}
            {index === 2 && (
              <React.Fragment>
                <div className="w-[190px] h-[190px] flex justify-evenly flex-col gap-[5px] py-4 px-2">
                  <div>
                    <input
                      type="checkbox"
                      id="on-site"
                      name="on-site"
                      value="on-site"
                      checked={remote?.includes("on-site")}
                      onChange={(e) =>
                        createQueryString("tipJob", e.target.value)
                      }
                      className="accent-background_green"
                    />
                    <label htmlFor="on-site" className="pl-1 cursor-pointer">
                      La fata locului
                    </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="hibrid"
                      name="hibrid"
                      value="hibrid"
                      checked={remote?.includes("hibrid")}
                      onChange={(e) =>
                        createQueryString("tipJob", e.target.value)
                      }
                      className="accent-background_green"
                    />
                    <label htmlFor="hibrid" className="pl-1 cursor-pointer">
                      Hibrid
                    </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="Remote"
                      name="remote"
                      value="Remote"
                      checked={remote?.includes("Remote")}
                      onChange={(e) =>
                        createQueryString("tipJob", e.target.value)
                      }
                      className="accent-background_green"
                    />
                    <label htmlFor="Remote" className="pl-1 cursor-pointer">
                      La distanță
                    </label>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default FiltreCheckbox;
