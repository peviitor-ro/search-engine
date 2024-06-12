import Results from "../components/Results";
import Search from "../components/Search";
import Footer from "../components/Footer";
import "../scss/rezults.scss";
const Rezultate = () => {
  return (
    <div className="rezult-page">
      <Search />
      <Results />
      <Footer />
    </div>
  );
};
export default Rezultate;
