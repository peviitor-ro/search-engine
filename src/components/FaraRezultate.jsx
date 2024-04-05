// svg
import strut from "../assets/svg/strut.svg";
// scss
import "../scss/not-found.scss";
const FaraRezultate = () => {
  return (
    <div className="fara-rezultate">
      <div className="text">
        <h1>
          Ups! <br />
          Căutarea nu are <br /> rezultat
        </h1>
        <h4>Elimină din filtre sau începe o căutare nouă</h4>
      </div>
      <img src={strut} alt="not-found" />
    </div>
  );
};
export default FaraRezultate;
