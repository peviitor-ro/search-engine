import Results from "../components/Results";
import Search from "../components/Search";
import Footer from "../components/Footer";

const Rezultate = () => {
  return (
    <div className="rezultate-pagina flex flex-col  items-center min-h-[100vh]">
      <Search />
      <Results />
      <Footer />
    </div>
  );
};
export default Rezultate;
