import Joburi from "@/app/components/Joburi";
import Footer from "../components/Footer";
import Search from "../components/Search";
import FiltreCheckbox from "../components/FiltreCheckbox";
import { Suspense } from "react";
import Pagination from "../components/Pagination";
import { createSearchString } from "@/lib/createSearchString";
import fetchData from "@/lib/fetchData";
import { JobsResults } from "@/models/Jobs";
import { Metadata } from "next";

export async function generateMetadata({
  searchParams
}: {
  searchParams: {
    job: string | undefined;
    companie: string | undefined;
    tipJob: string | undefined;
    pagina: string | undefined;
  };
}): Promise<Metadata> {
  // Extract values from searchParams and if the value is undefined sets to "
  const query = searchParams?.job || "";
  const company = searchParams?.companie || "";
  const remote = searchParams?.tipJob || "";
  const page = searchParams?.pagina || "1";

  const paramsSearch = createSearchString(
    query,
    "",
    "",
    "România",
    company,
    remote,
    page
  );

  const data: JobsResults | undefined = await fetchData(paramsSearch);
  const numFound: number | undefined = data?.numFound;
  return {
    title: `🔍 ${numFound} de locuri de muncă pentru postul de ${query} te așteaptă!`,
    description: `Descoperă peste ${numFound} de oportunități de carieră pentru postul de ${query}${
      company ? ` la compania ${company}` : ""
    }. Începe-ți călătoria profesională acum!`,
    keywords: `${query}, locuri de muncă, joburi, oportunități, carieră`
  };
}

export default async function SearchResults({
  searchParams
}: {
  searchParams: {
    job: string | undefined;
    companie: string | undefined;
    oras: string | undefined;
    tipJob: string | undefined;
    pagina: string | undefined;
  };
}) {
  // Extract values from searchParams and if the value is undefined sets to ""
  const query = searchParams?.job || "";
  const companie = searchParams?.companie || "";
  const oras = searchParams?.oras || "";
  const tipJob = searchParams?.tipJob || "";
  const pagina = searchParams?.pagina || "1";

  const paramsSearch = createSearchString(
    query,
    oras,
    "",
    "România",
    companie,
    tipJob,
    pagina
  );

  const data: JobsResults | undefined = await fetchData(paramsSearch);

  const numFound: number | undefined = data?.numFound;

  return (
    <div className="rezultate-pagina flex flex-col justify-between items-center min-h-[100vh]">
      <Search />
      <FiltreCheckbox />

      <Suspense key={query} fallback={<div>Loading Jobs........</div>}>
        <Joburi data={data} />
      </Suspense>

      <Pagination numFound={numFound} />

      <Footer />
    </div>
  );
}
