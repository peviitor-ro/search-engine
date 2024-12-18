import { Link } from "react-router-dom";
import linkedin from "../assets/svg/linkedin_icon.svg";
import discord from "../assets/svg/discord_icon.svg";
import github from "../assets/svg/github_icon.svg";
import jitsi from "../assets/svg/jitsi_icon.svg";
import instagram from "../assets/svg/instagram_icon.svg";
import dev from "../assets/svg/dev_icon.svg";
// import api from "../assets/svg/api-svgrepo-com.svg";


const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="w-[80%] flex flex-col gap-2 border-t border-border_grey pt-[20px] mb-5">
      <section className="flex justify-between flex-wrap items-start md:!gap-1">
        <div className="flex gap-4 mx-auto justify-between items-center px-2 xs:mb-5 md:mx-0">
          <Link to="https://www.linkedin.com/company/asociatia-oportunitati-si-cariere/"
            target="_blank" rel="noopener noreferrer" className="mx-1"
          >
            <img src={linkedin} alt="linkedin icon" className="max-w-[100px]" />
          </Link>
          <Link to="https://www.instagram.com/peviitor.ro"
            target="_blank" rel="noopener noreferrer" className="mx-1"
          >
            <img
              src={instagram}
              alt="instagram icon"
              className="max-w-[100px]"
            />
          </Link>
          <Link to="https://discord.gg/t2aEdmR52a"
            target="_blank" rel="noopener noreferrer" className="mx-1"
          >
            <img src={discord} alt="discord icon" className="max-w-[100px]" />
          </Link>
          <Link to="https://github.com/peviitor-ro"
            target="_blank" rel="noopener noreferrer" className="mx-1"
          >
            <img src={github} alt="github icon" className="max-w-[100px]" />
          </Link>
          <Link to="https://meet.jit.si/PEVIITOR.RO"
            target="_blank" rel="noopener noreferrer" className="mx-1"
          >
            <img src={jitsi} alt="jitsi icon" className="max-w-[100px]" />
          </Link>
          <Link to="https://dev.to/t/peviitor/latest"
            target="_blank" rel="noopener noreferrer" className="mx-1"
          >
            <img src={dev} alt="dev icon" className="max-w-[100px]" />
          </Link>
          {/* <Link to="https://api.peviitor.ro/"
            target="_blank" rel="noopener noreferrer" className="mx-2"
          >
            <img src={api} alt="API icon" className="max-w-[100px]" />
          </Link> */}
        </div>
        <div className="flex justify-between items-start gap-20 px-2 mx-auto md:mx-0">
        {/* <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-20 mx-auto md:mx-0"> */}

          <div className="flex flex-col gap-1">
            <Link to="https://oportunitatisicariere.ro/#how-contribute"
              target="_blank" rel="noopener noreferrer"
            >
              <strong>Implică-te!</strong>
            </Link>

            <Link to="https://oportunitatisicariere.ro/#schedule"
              target="_blank" rel="noopener noreferrer"
            >Alătură-te cauzei noastre
            </Link>
          </div>

          <div className="flex flex-col gap-1">
            <Link to="https://oportunitatisicariere.ro/#" target="_blank" rel="noopener noreferrer">
              <strong>Organizație</strong>
            </Link>
            <Link to="https://oportunitatisicariere.ro/#team" target="_blank" rel="noopener noreferrer">
              Despre noi
            </Link>
            <Link to="https://oportunitatisicariere.ro/#our-mission" target="_blank" rel="noopener noreferrer">
              Misiune
            </Link>
            {/* will be added */}
            {/* <Link to="" target="_blank" rel="noopener noreferrer">
              Viziune
            </Link> */}
            {/* <Link to="conditii-de-utilizare" aria-label="peviitor">Condiții de utilizare</Link> */}
          </div>

          {/* will be added */}
          <div className="flex flex-col gap-1">
            {/* <Link to=""><strong>Informații suplimentare</strong></Link>
            <Link to="conditii-de-utilizare">Condiții de utilizare</Link>
            <Link to="confidentialitate">Politica de confidențialitate</Link> */}
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center lg:flex-row mt-[20px] lg:gap-4 text-text_grey_darker">
        <p> © {year} - Toate drepturile rezervate</p>
        <Link to="https://www.oportunitatisicariere.ro" target="_blank" rel="noopener noreferrer">
          <strong>ASOCIAȚIA OPORTUNITĂȚI ȘI CARIERE</strong>
        </Link>
      </section>
    </footer>
  );
};
export default Footer;
