// icons
import linkedin from "../assets/svg/linkedin_icon.svg";
import discord from "../assets/svg/discord_icon.svg";
import github from "../assets/svg/github_icon.svg";
import jitsi from "../assets/svg/jitsi_icon.svg";
import instagram from "../assets/svg/instagram_icon.svg";
import dev from "../assets/svg/dev_icon.svg";
import api from "../assets/svg/api-svgrepo-com.svg";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="w-[80%] flex flex-col gap-2 border-t border-border_grey pt-[20px] mb-5">
      <section className="flex justify-between flex-wrap">
        <div className="flex gap-[10px] justify-between flex-wrap items-center mx-auto md:mx-0">
          <a
            href="https://www.linkedin.com/company/asociatia-oportunitati-si-cariere/"
            target="_blank"
            rel="noreferrer"
            className="mx-2"
          >
            <img src={linkedin} alt="linkedin icon" className="max-w-[100px]" />
          </a>
          <a
            href="https://www.instagram.com/peviitor.ro"
            target="_blank"
            rel="noreferrer"
            className="mx-2"
          >
            <img
              src={instagram}
              alt="instagram icon"
              className="max-w-[100px]"
            />
          </a>
          <a
            href="https://discord.gg/t2aEdmR52a"
            target="_blank"
            rel="noreferrer"
            className="mx-2"
          >
            <img src={discord} alt="discord icon" className="max-w-[100px]" />
          </a>
          <a
            href="https://github.com/peviitor-ro"
            target="_blank"
            rel="noreferrer"
            className="mx-2"
          >
            <img src={github} alt="github icon" className="max-w-[100px]" />
          </a>
          <a
            href="https://meet.jit.si/PEVIITOR.RO"
            target="_blank"
            rel="noreferrer"
            className="mx-2"
          >
            <img src={jitsi} alt="jitsi icon" className="max-w-[100px]" />
          </a>
          <a
            href="https://dev.to/t/peviitor/latest"
            target="_blank"
            rel="noreferrer"
            className="mx-2"
          >
            <img src={dev} alt="dev icon" className="max-w-[100px]" />
          </a>
          <a
            href="https://api.peviitor.ro/"
            target="_blank"
            rel="noreferrer"
            className="mx-2"
          >
            <img src={api} alt="API icon" className="max-w-[100px]" />
          </a>
        </div>
      </section>
      <section className="flex flex-col items-center lg:flex-row mt-[20px] lg:gap-4 text-text_grey_darker">
        <p> © {year} - Toate drepturile rezervate</p>
        <a
          href="https://www.oportunitatisicariere.ro"
          target="_blank"
          rel="noreferrer"
          className="font-bold"
        >
          ASOCIATIA OPORTUNITATI SI CARIERE
        </a>
      </section>
    </footer>
  );
};
export default Footer;
