import { Job } from "@/models/Jobs";
import imagesPlaceholder from "@/app/assets/svg/no-logo.svg";
import mapPin from "@/app/assets/svg/map_pin.svg";
import Image from "next/image";
import Link from "next/link";

type Props = {
  item: Job;
};

export default function JobCard({ item }: Props) {
  const { job_title, company, job_link, city, remote } = item;

  function displayLocation(cities: string[] | undefined) {
    return cities
      ? cities[0].toLowerCase() === "all"
        ? "Toate orasele"
        : cities.length > 4
        ? `${cities.slice(0, 4).join(", ")} + ${cities.length - 4}`
        : cities.join(", ")
      : remote?.join(", ");
  }

  return (
    <div className="w-[300px] lg:w-[384px] min-h-[357px] bg-background_cards text-center flex flex-col justify-around items-center flex-wrap gap-3 px-4 py-[6px] rounded-2xl shadow-card_shadow hover:shadow-hover_card_shadow">
      <div className="flex items-center justify-center w-[200px] min-h-[100px]">
        <Image
          src={imagesPlaceholder}
          alt="no logo"
          className="max-w-[200px] max-h-[100px]"
        />
      </div>
      <div className="flex flex-col justify-between gap-5 max-w-[280px] lg:max-w-[364px]">
        <p className="leading-5" title={company?.join("")}>
          {company}
        </p>
        <p
          className="text-lg font-bold truncate cursor-help"
          title={job_title?.join("")}
        >
          {job_title}
        </p>
        <div className="flex items-center justify-center gap-1">
          <Image src={mapPin} alt="map_pin" className="w-auto h-[16px]" />
          <p>{city || remote ? displayLocation(city) : ""}</p>
        </div>
        <Link
          href={job_link[0]}
          target="_blank"
          className="bg-background_green px-[40px] py-[14px] text-white rounded-3xl mx-auto hover:shadow-button_shadow transition duration-300 ease-out"
        >
          Catre Site
        </Link>
      </div>
    </div>
  );
}
