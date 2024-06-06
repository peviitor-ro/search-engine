import strut from "../assets/svg/strut.svg";
import Image from "next/image";

export default function FaraRezultate() {
  return (
    <div className="flex flex-col items-center justify-center text-text_grey_darker gap-20 md:flex-row px-4">
      <div>
        <h1 className="lg:text-5xl md:text-4xl text-3xl font-semibold leading-none md:leading-16 text-left mb-4 md:mb-3">
          Ups! <br />
          Căutarea nu are <br /> rezultat
        </h1>
        <h4 className="md:text-2xl text-1xl text-base font-normal leading-5 md:leading-6 text-left">
          Elimină din filtre sau începe o căutare nouă
        </h4>
      </div>
      <Image className="w-250px" src={strut} alt="not-found" />
    </div>
  );
}
