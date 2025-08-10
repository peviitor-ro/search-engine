// svg
import noLogo from "../assets/svg/no-logo.svg";
import mapPin from "../assets/svg/map_pin.svg";
// react
import Button from "./Button";
const exceptions = ["de", "lui"];

const Job = ({ city, company, county, job_link, job_title, remote }) => {
  function displayLocation(cities, remote) {
    const citiesName = cities?.map((el) => {
      return el
        .toLowerCase() // normalize the string first
        .split(/([ -])/g) // split by space or hyphen but **keep the separators**
        .map((word) => {
          return exceptions.includes(word)
            ? word
            : word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join("");
    });

    if (!citiesName) return remote?.join(", ");
    if (citiesName[0].toLowerCase() === "all") return "Toate orasele";
    if (citiesName.length > 5) return `${cities.slice(0, 5)}`;
    return citiesName.join(", ");
  }

  function handleJobSeach() {
    window.open(job_link, "_blank");
    console.log("Către site");
  }

  return (
    <div className="w-[300px] lg:w-[384px] min-h-[357px] bg-background_cards text-center flex flex-col justify-between items-center flex-wrap gap-3 px-4 py-[18px] rounded-2xl shadow-card_shadow hover:shadow-hover_card_shadow">
      <div className="flex items-center justify-center w-[200px] min-h-[100px]">
        <img
          src={noLogo}
          alt={company}
          onError={(e) => (e.target.src = noLogo)}
          className="max-w-[200px] max-h-[100px]"
        />
      </div>

      <div className="flex flex-col justify-between gap-5 max-w-[280px] lg:max-w-[364px]">
        <p className="leading-5" title={company}>
          {company}
        </p>
        <h2 className="text-lg font-bold truncate" title={job_title}>
          {job_title}
        </h2>
        <div className="flex items-center justify-center gap-1">
          <img src={mapPin} alt="map pin" className="w-auto h-[16px]" />
          <p>{city || remote ? displayLocation(city) : ""}</p>
        </div>

        <Button onClick={handleJobSeach} buttonType="searchJob">
          Către site
        </Button>
      </div>
    </div>
  );
};
export default Job;
