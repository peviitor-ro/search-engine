import React from 'react';
import './footer.style.scss';

import logoBlack from '../../assets/svgs/peviitor_logo_black.svg';
import linkedin from '../../assets/svgs/linkedin_icon.svg';
import discord from '../../assets/svgs/discord_icon.svg';
import github from '../../assets/svgs/github_icon.svg';

export const Footer = () => {
  return (
    <footer className="footer">
      <section className="links">
        <img src={logoBlack} className="logo" alt="peviitor logo" />
        <section className="social-media">
          <h3 className="title hide-title">Social Media</h3>
          <a
            className="icon"
            href="https://www.linkedin.com/company/asociatia-oportunitati-si-cariere/"
            target="_blank"
            rel="noreferrer"
          >
            <img src={linkedin} alt="linkedin icon" />
          </a>
          <a
            className="icon"
            href="https://discord.gg/t2aEdmR52a"
            target="_blank"
            rel="noreferrer"
          >
            <img src={discord} alt="linkedin icon" />
          </a>
          <a
            className="icon"
            href="https://github.com/peviitor-ro/ui-js/issues"
            target="_blank"
            rel="noreferrer"
          >
            <img src={github} alt="github icon" />
          </a>
        </section>
        <section className="company">
          <h3 className="title">Organizație</h3>
          <nav>
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
                  href="https://www.oportunitatisicariere.ro/voluntari"
                  target="_blank"
                  rel="noreferrer"
                >
                  Alătură-te cauzei noastre
                </a>
              </li>
            </ul>
          </nav>
        </section>
        <section className="info">
          <h3 className="title">Informații suplimentare</h3>
          <nav>
            <ul>
              <li>
                <a href="https://firme.peviitor.ro/">Firme</a>
              </li>
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
          </nav>
        </section>
      </section>
      <section className="all-rights-reserved">
        © 2023 - Toate drepturile rezervate PE VIITOR.
      </section>
    </footer>
  );
};
