"use client";

import { useSearchParams, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import xIcon from "../assets/svg/remove.svg";

const DisplayFilters = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const remote = searchParams.getAll("tipJob");
  const city = searchParams.getAll("oras");
  const company = searchParams.getAll("companie");

  const filtersArray = remote.concat(city, company);

  const handleDeleteAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("oras");
    params.delete("tipJob");
    params.delete("companie");

    router.push(`${pathname}?${params.toString()}`);
  };

  function renderFilter(type: string[]) {
    const handleFilterDelete = (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const currentValues = params.getAll(name);
      console.log(currentValues);

      if (currentValues.includes(value)) {
        params.delete(name);
        currentValues
          .filter((val) => val !== value)
          .forEach((val) => {
            params.append(name, val);
          });

        router.push(`${pathname}?${params.toString()}`);
      }
    };

    const typeToDelete =
      type === remote ? "tipJob" : type === city ? "oras" : "companie";
    return (
      type.length > 0 &&
      type.map((item) => (
        <li
          key={item}
          className="py-2 px-4 bg-background_green_light rounded-3xl flex items-center"
        >
          {item}
          <Image
            src={xIcon}
            className="cursor-pointer ml-2"
            alt="X icon delete"
            onClick={() => handleFilterDelete(typeToDelete, item)}
          />
        </li>
      ))
    );
  }

  return (
    <ul className="pb-9 flex gap-2 flex-wrap justify-center lg:justify-start">
      {renderFilter(city)}
      {renderFilter(remote)}
      {renderFilter(company)}
      {filtersArray.length > 0 && (
        <div className="flex gap-2 ml-4">
          <hr className="h-auto w-[1px] bg-background_dark_blue" />
          <span
            className="self-center cursor-pointer"
            onClick={handleDeleteAll}
          >
            Șterge Filtre
          </span>
        </div>
      )}
    </ul>
  );
};

export default DisplayFilters;
