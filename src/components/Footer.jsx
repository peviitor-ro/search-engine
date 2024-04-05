// icons
import linkedin from "../assets/svg/linkedin_icon.svg";
import discord from "../assets/svg/discord_icon.svg";
import github from "../assets/svg/github_icon.svg";
import jitsi from "../assets/svg/jitsi_icon.svg";
//scss
import "../scss/footer.scss";
const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <section className="links">
        <section className="company">
          <h3 className="title">Organizație</h3>

          <ul>
            <li>
              <a
                href="https://www.oportunitatisicariere.ro/"
                target="_blank"
                rel="noreferrer"
              >
                Despre noi
              </a>
            </li>
            <li>
              <a
                href="https://www.oportunitatisicariere.ro/viziune"
                target="_blank"
                rel="noreferrer"
              >
                Viziune
              </a>
            </li>
          </ul>
        </section>
        <section className="info">
          <h3 className="title">Informații suplimentare</h3>

          <ul>
            <li>
              <a
                href="https://legal.peviitor.ro/"
                target="_blank"
                rel="noreferrer"
              >
                Condiții de utilizare
              </a>
            </li>
            <li>
              <a
                href="https://legal.peviitor.ro/confidentialitate"
                target="_blank"
                rel="noreferrer"
              >
                Politica de confidențialitate
              </a>
            </li>
          </ul>
        </section>
        <section className="company">
          <h3 className="title">Implica-te!</h3>

          <ul>
            <li>
              <a
                href="https://www.oportunitatisicariere.ro/voluntari"
                target="_blank"
                rel="noreferrer"
              >
                Alătură-te cauzei noastre
              </a>
            </li>
          </ul>
        </section>
        <section className="social-media">
          <h3 className="title hide-title">Social Media</h3>
          <div className="social-links">
            <a
              className="icon"
              href="https://www.linkedin.com/company/asociatia-oportunitati-si-cariere/"
              target="_blank"
              rel="noreferrer"
              title="LinkedIn"
            >
              <img src={linkedin} alt="linkedin icon" />
            </a>
            <a
              className="icon"
              href="https://discord.gg/t2aEdmR52a"
              target="_blank"
              rel="noreferrer"
              title="Discord"
            >
              <img src={discord} alt="linkedin icon" />
            </a>
            <a
              className="icon"
              href="https://github.com/peviitor-ro/ui-js/issues"
              target="_blank"
              rel="noreferrer"
              title="GitHub"
            >
              <img src={github} alt="github icon" />
            </a>
            <a
              className="icon"
              href="https://meet.jit.si/PEVIITOR.RO"
              target="_blank"
              rel="noreferrer"
              title="Jitsi"
            >
              <img src={jitsi} alt="jitsi icon" />
            </a>
          </div>
        </section>
      </section>
      <section className="all-rights-reserved">
        © {year} - Toate drepturile rezervate{" "}
        <a
          href="https://www.oportunitatisicariere.ro"
          target="_blank"
          rel="noreferrer"
        >
          ASOCIATIA OPORTUNITATI SI CARIERE
        </a>
      </section>
    </footer>
  );
};
export default Footer;
