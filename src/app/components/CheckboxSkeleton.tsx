"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import magnifyGlass from "@/app/assets/svg/magniy_glass_icon.svg";

type checkboxProps = {
  items: string[] | undefined;
  filterKey: string;
  searchFor: string;
  checked?: string[];
  dropDown: boolean[];
};
// Regular expressions for replacing special characters
const aREG = new RegExp("ș", "g");
const bREG = new RegExp("ț", "g");
const cREG = new RegExp("â", "g");
const dREG = new RegExp("ă", "g");
const eREG = new RegExp("î", "g");

// CheckboxFilter component for filtering items
const CheckboxFilter = ({
  items,
  filterKey,
  searchFor,
  checked,
  dropDown,
}: checkboxProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Empty the search value when dropdown its closed
  useEffect(() => {
    if (dropDown[0] || dropDown[1]) {
      setSearchQuery("");
    }
  }, [dropDown]);

  // Filtering items based on search query
  const filteredItems = items?.filter(
    (item) =>
      (searchQuery.length >= 3 &&
        item
          .toLowerCase()
          .replace(aREG, "s")
          .replace(bREG, "t")
          .replace(cREG, "a")
          .replace(dREG, "a")
          .replace(eREG, "i")
          .includes(searchQuery.toLowerCase())) ||
      (searchQuery.length >= 3 &&
        item.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Effect to handle error when no results are found
  useEffect(() => {
    setError(filteredItems?.length === 0 && searchQuery.length > 3);
  }, [filteredItems, searchQuery]);

  // Displaying filtered items with exact matches first
  const displayItems =
    searchQuery.length >= 3
      ? [
          // Items that exactly match the search query
          ...(filteredItems?.filter(
            (item) => item.toLowerCase() === searchQuery.toLowerCase()
          ) || []),
          // Items that start with the search query
          ...(filteredItems?.filter(
            (item) =>
              item.toLowerCase() !== searchQuery.toLowerCase() &&
              item.toLowerCase().startsWith(searchQuery.toLowerCase())
          ) || []),
          // Items that contain the searc2h query but do not match exactly or start with it
          ...(filteredItems?.filter(
            (item) => !item.toLowerCase().startsWith(searchQuery.toLowerCase())
          ) || []),
        ]
      : items?.slice(0, 25);

  // If displayItems is undefined, default to an empty array to avoid errors
  const itemsToDisplay = displayItems || [];

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const currentValues = params.getAll(name);

      if (currentValues.includes(value)) {
        // Remove the value if it exists
        params.delete(name);
        currentValues
          .filter((val) => val !== value)
          .forEach((val) => {
            params.append(name, val);
            // Set the page parameter to 1 when applying filters
            params.set("pagina", "1");
          });
      } else {
        // Add the value if it doesn't exist
        params.append(name, value);
        // Set the page parameter to 1 when applying filters
        params.set("pagina", "1");
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  return (
    <div>
      <div className="flex items-center gap-1 px-[2px] border-b-[1px] border-border_grey">
        <Image
          src={magnifyGlass}
          alt="magnify-glass"
          className="relative left-0 w-[20px] ml-1"
        />
        <input
          type="search"
          value={searchQuery}
          placeholder={`Cauta ${searchFor}`}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-0 outline-none py-[10px] text-sm w-[190px] rounded-full"
        />
      </div>

      <div className="flex flex-col gap-2 py-[1px] px-1 max-w-[230px] h-[220px] overflow-y-auto scrollbar-class overflow-x-hidden">
        {searchQuery.length >= 1 && searchQuery.length < 3 ? (
          <div>Tasteaza mai mult de 3 caractere</div>
        ) : error ? (
          <div>No results found for {searchQuery}</div>
        ) : (
          itemsToDisplay?.map((item, index) => (
            <div key={index}>
              <input
                type="checkbox"
                id={item}
                name={filterKey}
                value={item}
                checked={checked?.includes(item)}
                onChange={(e) => createQueryString(filterKey, e.target.value)}
                className="accent-background_green"
              />
              <label htmlFor={item} className="pl-1 cursor-pointer">
                {item}
              </label>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CheckboxFilter;
