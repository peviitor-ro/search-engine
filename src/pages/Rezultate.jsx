import Rezults from "../components/Rezults";
import Search from "../components/Search";
import Footer from "../components/Footer";
import "../scss/rezults.scss";
const Rezultate = () => {
  return (
    <div className="rezult-page">
      <Search />
      <Rezults />
      <Footer />
    </div>
  );
};
export default Rezultate;
