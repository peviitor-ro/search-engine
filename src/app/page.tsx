import Image from "next/image";
import Search from "./components/Search";
import peViitorLogo from "@/app/assets/svg/logo.svg";
import racheta from "@/app/assets/svg/racheta.svg";
import dungi from "@/app/assets/svg/dungi.svg";
import Footer from "./components/Footer";
import { getNumberOfJobs } from "@/lib/fetchData";
import { Suspense } from "react";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const numFound = await getNumberOfJobs();

  const numFoundText = numFound && numFound > 1 ? `pentru ${numFound}` : "";
  return {
    title: `peviitor | Motor de căutare ${numFoundText} locuri de muncă`,
    description: `peviitor.ro - Motor de căutare  ${numFoundText} locuri de muncă disponibile`,
    keywords: `locuri de muncă, joburi, oportunități, carieră`
  };
}

export default async function Home() {
  const numFound = await getNumberOfJobs();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="landing-page flex flex-col justify-between items-center py-5 min-h-[100vh]">
        <nav className="w-[70%] md:w-[70%] border-b border-border_grey">
          <Image src={peViitorLogo} alt="peviitor-logo" />
        </nav>
        <main className="w-[70%] flex flex-wrap justify-center md:gap-2 lg:gap-0 items-center sm:items-start mt-[2em] mb-[10em] font-PoppinsRegular text-left">
          <div className="order-1">
            <div className="relative w-[300px] md:w-[486px] lg:w-[340px] xl:w-[486px]">
              <h1 className="text-text_orange text-[40px] md:text-[44px] xl:text-6xl font-semibold  mb-2 leading-[110%]">
                Locul de muncă visat,
                <Image
                  src={dungi}
                  alt="dungi"
                  className="absolute top-[128px] left-[-30px] scale-[0.7] md:scale-[0.9] md:top-[90px] md:left-[-30px] lg:top-[140px] lg:left-[-50px] lg:scale-[0.7] xl:top-[115px] xl:left-[180px] xl:scale-110"
                />{" "}
                la un clic distanță
              </h1>
              <h4 className="text-lg leading-6 text-text_grey">
                Peste <strong className="text-black">{numFound}</strong> de
                locuri de muncă din România actualizate zilnic
              </h4>
            </div>
          </div>
          <div className="order-3 lg:order-1">
            <Image src={racheta} alt="racheta" />
          </div>
          <div className="order-2 lg:order-2  2xl:shrink-0 2xl:grow-0 2xl:basis-[80%]">
            <Search />
          </div>
        </main>
        <Footer />
      </div>
    </Suspense>
  );
}
