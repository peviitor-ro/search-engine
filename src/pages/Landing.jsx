import { useState, useEffect } from "react";
import { getNumberOfJobs } from "../utils/fetchData";
// images
import logo from "../assets/svg/logo.svg";
import dungi from "../assets/svg/dungi.svg";
//scss
import "../scss/landing.scss";
// racheta
import racheta from "../assets/svg/racheta.svg";
// components
import Search from "../components/Search";
import Footer from "../components/Footer";

const Landing = () => {
  const [totalJobs, setTotalJobs] = useState(0);

  useEffect(() => {
    async function fetchTotalJobs() {
      const jobsNumber = await getNumberOfJobs();
      setTotalJobs(jobsNumber);
    }
    fetchTotalJobs();
  }, []);

  return (
    <div className="background-img">
      <div className="landing">
        <nav className="navbar">
          <a href="/" className="logo">
            <img src={logo} alt="peviitor" />
          </a>
        </nav>
        <main>
          <div className="content">
            <div className="text">
              <h1>
                Locul de muncă visat,
                <img className="dungi" src={dungi} alt="dungi" /> la un clic
                distanță
              </h1>
              <h4>
                Peste <span>{totalJobs}</span> de locuri de muncă din România
                actualizate zilnic
              </h4>
            </div>
            <img src={racheta} alt="Racheta" className="racheta" />
          </div>
          <Search />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Landing;
