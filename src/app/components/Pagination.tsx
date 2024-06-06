"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import doubleArrowLeft from "@/app/assets/svg/double_arrow_left.svg";
import doubleArrowRight from "@/app/assets/svg/double_arrow_right.svg";
import arrowLeft from "@/app/assets/svg/arrow_left_pag.svg";
import arrowRight from "@/app/assets/svg/arrow_right_pag.svg";

type Props = {
  numFound: number | undefined;
};

export default function Pagination({ numFound }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const currentPage = Number(searchParams.get("pagina")) || 1;
  const perPage = 12;

  const totalPages = Math.ceil((numFound ?? 0) / perPage);

  const prevPage = () => {
    params.set("pagina", (currentPage - 1).toString());
    router.push(`${pathname}?${params}`);
  };

  const nextPage = () => {
    params.set("pagina", (currentPage + 1).toString());
    router.push(`${pathname}?${params}`);
  };

  const firstPage = () => {
    params.set("pagina", "1");
    router.push(`${pathname}?${params}`);
  };

  const lastPage = () => {
    params.set("pagina", totalPages.toString());
    router.push(`${pathname}?${params}`);
  };

  // Function to navigate to a specific page
  const goToPage = (pageNumber: number) => {
    params.set("pagina", pageNumber.toString());
    router.push(`${pathname}?${params}`);
  };

  // Function to generate an array of page numbers for rendering
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages: (number | string)[] = [];

    // Check if total pages are less than or equal to maxPagesToShow + 2
    if (totalPages <= maxPagesToShow + 2) {
      // If yes, simply push all page numbers from 1 to totalPages into the pages array
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // If total pages exceed maxPagesToShow + 2, handle pagination logic for showing a subset of page numbers

      // Always show page 1
      pages.push(1);

      // If current page is greater than 3, add ellipsis to indicate there are more pages before the current subset
      if (currentPage > 3) {
        pages.push("...");
      }

      // Calculate the start and end page numbers for the current subset based on the current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // If current page is within the first three pages, limit endPage to 5
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 5);
      }
      // If current page is within the last three pages, adjust startPage accordingly
      else if (currentPage > totalPages - 3) {
        startPage = Math.max(2, totalPages - 4);
      }

      // Add page numbers within the calculated range to the pages array
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // If there are more pages after the current subset, add ellipsis to indicate there are more pages
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show the last page
      pages.push(totalPages);
    }

    // Return the array of page numbers
    return pages;
  };

  return (
    <>
      {numFound !== 0 ? (
        <div className="flex gap-3 text-xl my-5 items-center">
          <button
            disabled={currentPage === 1}
            onClick={() => {
              firstPage();
            }}
          >
            <Image src={doubleArrowLeft} alt="double_arrow_left" />
          </button>
          <button
            disabled={currentPage === 1}
            onClick={() => {
              prevPage();
            }}
          >
            <Image src={arrowLeft} alt="arrow_left" />
          </button>

          <div className="flex gap-2">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                disabled={typeof page === "number" && page === currentPage}
                onClick={() => {
                  if (typeof page === "number") {
                    goToPage(page);
                  }
                }}
                className={`${
                  typeof page === "number" && page === currentPage
                    ? "bg-background_green text-white rounded-full px-3 py-1"
                    : ""
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => {
              nextPage();
            }}
          >
            <Image src={arrowRight} alt="arrow_right" />
          </button>

          <button
            disabled={currentPage === totalPages}
            onClick={() => {
              lastPage();
            }}
          >
            <Image src={doubleArrowRight} alt="double_arrow_right" />
          </button>
        </div>
      ) : null}
    </>
  );
}
