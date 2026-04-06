import { Link } from "react-router-dom";

const HomeLink = () => {
  return (
    <Link to="https://www.peviitor.ro" aria-label="Accesează www.peviitor.ro">
      <span className="text-background_green hover:text-[#28536B]">
        {" "}
        www.peviitor.ro
      </span>
    </Link>
  );
};

export default HomeLink;
