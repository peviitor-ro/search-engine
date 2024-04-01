import img from '../../../../assets/svgs/strut.svg';
import './notFound.scss';

export default function NotFound() {
  //aici punem strutul, nu la pagina aia de 404:
  return (
    <section className="error-container">
      <div className="error-content">
        <div className="error-headings">
          <h1 className="error-title">Fără rezultat</h1>
          <h4 className="error-suggestion">
            Elimiă din filtre sau incepe o căutare nouă
          </h4>
        </div>
        <div className="error-image">
          <img src={img} alt="Error cover" />
        </div>
      </div>
    </section>
  );
}
