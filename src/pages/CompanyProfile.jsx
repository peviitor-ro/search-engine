import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Building2,
  Tag,
  Users,
  FileText,
  ArrowLeft,
  ArrowUpRight,
  Globe,
  Briefcase
} from "lucide-react";
import Layout from "../components/Layout";
import Job from "../components/Job";
import JobSkeleton from "@/components/ui/job-skeleton";
import loadingIcon from "../assets/svg/loading.svg";
import { getData } from "../utils/fetchData";
import { createSearchString } from "../utils/createSearchString";
import { updateSEO, resetSEO } from "../utils/seo";

const CompanyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [companyDetails, setCompanyDetails] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const observerTarget = useRef(null);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore) return;
    setLoadingMore(true);

    const nextPage = currentPage + 1;
    const searchString = createSearchString(
      null,
      null,
      null,
      [companyDetails.company],
      null,
      nextPage
    );

    try {
      const jobsData = await getData(searchString);
      const newJobs = jobsData.jobs || [];

      setJobs((prevJobs) => {
        const uniqueJobs = newJobs.filter(
          (job) => !prevJobs.some((existingJob) => existingJob.url === job.url)
        );

        return [...prevJobs, ...uniqueJobs];
      });

      setCurrentPage(nextPage);
    } catch (err) {
      console.error("Error loading more jobs:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [currentPage, loadingMore, companyDetails]);

  useEffect(() => {
    const fetchCompanyAndJobs = async () => {
      setLoading(true);
      setError(false);

      try {
        const profileRes = await fetch(
          `https://api.peviitor.ro/v1/company/?cif=${id}`
        );

        if (!profileRes.ok) {
          throw new Error("Eroare la preluarea datelor companiei");
        }

        const profileData = await profileRes.json();
        const details = profileData.company;
        setCompanyDetails(details);

        if (details && details.company) {
          const searchString = createSearchString(
            null,
            null,
            null,
            [details.company],
            null,
            1 // Încarcă doar pagina 1 la început
          );
          const jobsData = await getData(searchString);

          setJobs(jobsData.jobs || []);
          setTotalJobs(jobsData.total || 0);
          setCurrentPage(1);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching company profile:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCompanyAndJobs();
    }
  }, [id]);

  useEffect(() => {
    if (!loading && !error && companyDetails) {
      const jobCount = jobs.length;
      const jobText =
        jobCount === 1 ? "1 job activ" : `${jobCount} joburi active`;
      const descJobText =
        jobCount === 1
          ? "1 loc de muncă disponibil"
          : `${jobCount} locuri de muncă disponibile`;

      updateSEO({
        title: `Profil Companie: ${companyDetails.company} - ${jobText} | peviitor.ro`,
        description: `Vezi cele ${descJobText} la compania ${companyDetails.company} în România pe peviitor.ro, motorul tău de căutare pentru joburi.`,
        ogTitle: `Profil Companie: ${companyDetails.company} - ${jobText} | peviitor.ro`,
        ogDescription: `Vezi cele ${descJobText} la compania ${companyDetails.company} în România pe peviitor.ro, motorul tău de căutare pentru joburi.`,
        ogUrl: window.location.href,
        ogImage: "https://peviitor.ro/peviitor.jpg"
      });
    }

    return () => {
      resetSEO();
    };
  }, [loading, error, companyDetails, jobs]);

  useEffect(() => {
    if (jobs.length >= totalJobs || totalJobs === 0) return;

    const currentTarget = observerTarget.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [jobs, totalJobs, loadingMore, handleLoadMore]);

  const renderWebsite = (websiteData) => {
    let siteUrl = Array.isArray(websiteData) ? websiteData[0] : websiteData;

    if (!siteUrl || typeof siteUrl !== "string" || siteUrl.trim() === "") {
      return (
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-gray-500" />
          <span>
            Website: <strong>Indisponibil</strong>
          </span>
        </div>
      );
    }

    const href = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;

    return (
      <div className="flex items-center gap-2">
        <Globe className="w-5 h-5 text-blue-600" />
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 font-medium group relative w-max"
        >
          Website
          <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-blue-600 transition-all duration-300 ease-out group-hover:w-full"></span>
        </a>
      </div>
    );
  };

  const renderCareer = (careerData) => {
    const careerUrl = Array.isArray(careerData) ? careerData[0] : careerData;

    if (
      !careerUrl ||
      typeof careerUrl !== "string" ||
      careerUrl.trim() === ""
    ) {
      return null;
    }

    const href = careerUrl.startsWith("http")
      ? careerUrl
      : `https://${careerUrl}`;

    return (
      <>
        <div className="hidden md:block w-px h-5 bg-gray-300"></div>
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-medium group relative w-max"
          >
            Cariere
            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-blue-600 transition-all duration-300 ease-out group-hover:w-full"></span>
          </a>
        </div>
      </>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-10">
          <div className="mb-6 h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
          <ul className="flex flex-col gap-6">
            <li>
              <JobSkeleton />
            </li>
            <li>
              <JobSkeleton />
            </li>
          </ul>
        </div>
      </Layout>
    );
  }

  if (error || !companyDetails) {
    return (
      <Layout>
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-20 text-center font-sans flex flex-col items-center justify-center">
          <Building2 className="w-16 h-16 text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold text-gray-700 mb-2">
            Compania nu a putut fi găsită
          </h1>
          <p className="text-gray-500 mb-6">
            Ne pare rău, dar datele pentru această companie lipsesc sau adresa
            URL este greșită.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-2 bg-[#4a8990] text-white font-medium rounded-lg hover:bg-opacity-90 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Înapoi la rezultate
          </button>
        </div>
      </Layout>
    );
  }

  const displayBrand =
    companyDetails.brand && companyDetails.brand.trim() !== ""
      ? companyDetails.brand
      : "Indisponibil";

  const displayGroup =
    companyDetails.group && companyDetails.group.trim() !== ""
      ? companyDetails.group
      : "Indisponibil";

  return (
    <Layout>
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen text-gray-800 ">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-base text-gray-500 hover:text-gray-800 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Inapoi la rezultate
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-6 mb-8">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="flex items-center justify-center p-3 bg-[#f0f6f7] border border-[#d2e2e4] rounded-xl text-[#4a8990]">
              <Building2 className="w-12 h-12" strokeWidth={1.5} />
            </div>

            <h1 className="text-3xl font-bold text-[#4a8990]">
              {companyDetails.company}
            </h1>
          </div>

          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(`firma cui ${companyDetails.id || id}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#4a8990] text-sm font-medium flex items-center gap-1 group relative w-max"
          >
            Detalii pe Google
            <ArrowUpRight className="w-4 h-4" />
            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#4a8990] transition-all duration-300 ease-out group-hover:w-full"></span>
          </a>
        </div>

        <div className="w-full bg-[#f3f5f7] rounded-xl flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap items-start md:items-center justify-start md:justify-start lg:justify-between py-5 md:py-4 px-6 md:px-8 gap-4 md:gap-y-4 md:gap-x-6 lg:gap-8 text-sm text-gray-600 mb-10">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-gray-500" />
            <span>
              <span className="font-bold text-gray-900">{totalJobs}</span>{" "}
              {totalJobs === 1 ? "Pozitie disponibila" : "Pozitii disponibile"}
            </span>
          </div>

          <div className="hidden md:block w-px h-5 bg-gray-300"></div>

          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-500" />
            <span>
              CUI:{" "}
              <span className="font-bold text-gray-900">
                {companyDetails.id || id || "N/A"}
              </span>
            </span>
          </div>

          <div className="hidden md:block w-px h-5 bg-gray-300"></div>

          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-gray-500" />
            <span>
              Brand:{" "}
              <span className="font-bold text-gray-900">{displayBrand}</span>
            </span>
          </div>

          <div className="hidden md:block w-px h-5 bg-gray-300"></div>

          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" />
            <span>
              Grup:{" "}
              <span className="font-bold text-gray-900">{displayGroup}</span>
            </span>
          </div>

          <div className="hidden md:block w-px h-5 bg-gray-300"></div>

          {renderWebsite(companyDetails.website)}
          {renderCareer(companyDetails.career)}
        </div>

        <h2 className="text-xl font-bold mb-6 text-gray-900">
          Pozitii disponibile:
        </h2>

        {jobs.length > 0 ? (
          <>
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
              {jobs.map((job, idx) => (
                <li key={job.id || idx}>
                  <Job {...job} cif={id} />
                </li>
              ))}
            </ul>

            {jobs.length < totalJobs && (
              <div
                ref={observerTarget}
                className="flex justify-center items-center mx-auto my-12 w-fit p-3.5 rounded-full bg-background_green cursor-wait"
              >
                <img
                  src={loadingIcon}
                  alt="loading icon"
                  className="w-6 m-auto animate-spin"
                />
              </div>
            )}
          </>
        ) : (
          <div className="w-full flex items-center justify-center py-12 px-4 rounded-xl border border-gray-100 bg-white">
            <p className="text-gray-500 text-center">
              Momentan nu există joburi active listate pentru această companie.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CompanyProfile;
