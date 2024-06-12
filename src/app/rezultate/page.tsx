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

  const queryText = query ? ` pentru postul de ${query}` : "";
  const companyText = company ? ` la compania ${company}` : "";
  const keywords = `${query}, locuri de muncă, joburi, oportunități, carieră, ${
    company ? company : ""
  }`;

  let title = `🔍 Locuri de muncă te așteaptă!`;
  let description = `Descoperă oportunități de carieră${queryText}${companyText}. Începe-ți călătoria profesională acum!`;

  if (numFound !== undefined) {
    if (numFound === 0) {
      title = `🔍 Niciun loc de muncă${queryText} nu a fost găsit`;
      description = `Nu am găsit oportunități de carieră${queryText}${companyText}. Verifică mai târziu pentru noi oferte.`;
    } else if (numFound === 1) {
      title = `🔍 Un loc de muncă ${queryText} te așteaptă!`;
      description = `Descoperă o oportunitate de carieră${queryText}${companyText}. Începe-ți călătoria profesională acum!`;
    } else {
      title = `🔍 ${numFound} locuri de muncă${queryText} te așteaptă!`;
      description = `Descoperă peste ${numFound} oportunități de carieră${queryText}${companyText}. Începe-ți călătoria profesională acum!`;
    }
  }

  return {
    title,
    description,
    keywords
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
