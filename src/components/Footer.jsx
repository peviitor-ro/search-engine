// icons
import linkedin from "../assets/svg/linkedin_icon.svg";
import discord from "../assets/svg/discord_icon.svg";
import github from "../assets/svg/github_icon.svg";
import jitsi from "../assets/svg/jitsi_icon.svg";
import instagram from "../assets/svg/instagram_icon.svg";
import dev from "../assets/svg/dev_icon.svg";
//scss
import "../scss/footer.scss";
const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <section className="links">
        <section className="social-media">
          {/* <h3 className="title hide-title">Social Media</h3> */}
          <nav className="social-links">
            <a
              className="icon"
              href="https://www.linkedin.com/company/asociatia-oportunitati-si-cariere/"
              target="_blank"
              rel="noreferrer"
              title="LinkedIn"
            >
              <img src={linkedin} alt="LinkedIn icon" />
            </a>
            <a
              className="icon"
              href="https://www.instagram.com/peviitor.ro/?igsh=MTUzZzkxbTZnMjJyOQ%3D%3D"
              target="_blank"
              rel="noreferrer"
              title="Instagram"
            >
              <img src={instagram} alt="Instagram icon" />
            </a>
            <a
              className="icon"
              href="https://discord.gg/t2aEdmR52a"
              target="_blank"
              rel="noreferrer"
              title="Discord"
            >
              <img src={discord} alt="Discord icon" />
            </a>
            <a
              className="icon"
              href="https://github.com/peviitor-ro/search-engine/issues"
              target="_blank"
              rel="noreferrer"
              title="GitHub"
            >
              <img src={github} alt="GitHub icon" />
            </a>
            <a
              className="icon"
              href="https://meet.jit.si/PEVIITOR.RO"
              target="_blank"
              rel="noreferrer"
              title="Jitsi"
            >
              <img src={jitsi} alt="Jitsi icon" />
            </a>
            <a
              className="icon"
              href="https://dev.to/t/peviitor/latest"
              target="_blank"
              rel="noreferrer"
              title="Dev"
            >
              <img src={dev} alt="Dev icon" />
            </a>
          </nav>
        </section>
      </section>
      <section className="all-rights-reserved">
        <p> © {year} - Toate drepturile rezervate</p>
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
