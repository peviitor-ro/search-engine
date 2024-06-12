=======

# Current designs

https://www.figma.com/file/ZnxmiUT0MBUvGFv2D3vaZz/Website-designs?node-id=0%3A1

! The logo is not supposed to have a different background than the landing page photo/ header background, but the used Font (Just Mandrown) was not available when putting together the new designs, so a picture was used instead as an easy fix.

BETA.PEVIITOR.RO
version: v03

https://www.figma.com/file/gY6yYTFjC0fuZ4bTRlUaH6/Pe-viitor?type=design&node-id=804-141&mode=design

<h3 align="center">Search Engine: https://peviitor.ro/</h3>

<div align="center">
   
  [![Status](https://img.shields.io/badge/status-active-success.svg)]() 
  [![GitHub Issues](https://img.shields.io/github/issues/peviitor-ro/search-engine.svg)](https://github.com/peviitor-ro/search-engine/issues)
  [![GitHub Pull Requests](https://img.shields.io/github/issues-pr/peviitor-ro/search-engine.svg)](https://github.com/peviitor-ro/search-engine/pulls)
  
</div>

## 🌍 Documentație Search Engine

## 📄 Descriere Proiect

Bine ai venit la Motorul nostru de Căutare de Joburi! Platforma noastră îți oferă posibilitatea să găsești eficient jobul visurilor tale, prin furnizarea unei funcționalități de căutare cuprinzătoare, bazată pe o colecție vastă de joburi. Cu ajutorul nostru, poți accesa și explora rapid peste 15.000 de oferte de muncă, colectate de la diverse companii online. Indiferent dacă cauți un post de lucru remote, hibrid sau în cadrul unei locații fizice, în orice oraș sau pentru o anumită companie, motorul nostru de căutare simplifică procesul de căutare a unui job.

## 🛠️ Tehnologii folosite

Tehnologiile principale utilizate în acest proiect sunt:

- [Next.js](https://nextjs.org/) - <img align="center" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" alt="nextjs" width="20"/>
  - Am ales Next.js pentru construirea aplicației datorită vitezei sale de dezvoltare, funcționalităților native de server-side rendering și generării de pagini statice, care ne-au permis să obținem o performanță excelentă în încărcarea paginilor. De asemenea, Next.js este prietenos cu SEO-ul, oferind opțiuni pentru optimizarea motoarelor de căutare și indexarea paginilor în mod eficient.
- [TypeScript](https://www.typescriptlang.org/) - <img align="center" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" alt="typescript" width="20"/>
  - Am adoptat TypeScript pentru a ne oferi tipizarea statică și pentru a reduce numărul de erori comune în codul nostru. Acest lucru ne-a ajutat să dezvoltăm aplicația sa fie mai ușor de întreținut.
- [Tailwind CSS](https://tailwindcss.com/) - <img align="center" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" alt="tailwind" width="20"/>
  - Am ales Tailwind CSS pentru a ne ajuta să dezvoltăm interfețe de utilizator flexibile și ușor de personalizat. Am apreciat abordarea sa atomică și posibilitatea de a defini rapid stiluri complexe direct în fișierele noastre TSX.
- Zod (o librarie TypeScript pentru validarea schemelor de date)
  - Am utilizat Zod pentru a defini și valida schemele de date care vin din baza de date. Aceasta ne-a ajutat să ne asigurăm că datele sunt corecte și complete înainte de a le afișa utilizatorilor.

## 📚 Referințe API

### API de Joburi

- **Endpoint**: https://api.peviitor.ro/v3/search/
- **Descriere**: Acest endpoint furnizează detaliile despre joburile disponibile și numărul total de joburi.
- **Metodă HTTP**: GET
- **Parametri de Interogare**:
  - `job_title` (opțional): Titlul jobului căutat
  - `job_link` (opțional): Link-ul jobului căutat
  - `city` (opțional): Orașul sau locația pentru care se caută jobul
  - `company` (opțional): Numele companiei pentru care se caută jobul
  - `remote` (opțional): Tipul de job (remote, hibrid, on-site)
- **Exemplu de Răspuns**:

  ```json
  {
    "numFound": "numarul total de joburi",
    "docs": [
      {
        "id": 1,
        "job_title": ["Titlul"],
        "job_link": ["link-ul catre job"],
        "company": ["compania"],
        "city": ["orasul"],
        "country": ["România"],
        "remote": ["Remote"]
      }
      // Alte joburi...
    ]
  }
  ```

  ### API de Logo-uri

- **Endpoint**: https://api.peviitor.ro/v1/logo/
- **Descriere**: Acest endpoint furnizează logo-urile companiilor.
- **Metodă HTTP**: GET
- **Exemplu de Răspuns**:

  ```json
  {
    "total": "numarul total de companii",
    "companies": [
      {
        "id": 1,
        "name": ["Titlul companiei"],
        "logo": ["link-ul logo-ului"]
      }
      // Alte companii...
    ]
  }
  ```

## 🎛️ Funcționalități

Motorul nostru de căutare de joburi vine cu următoarele funcționalități principale:

### Pagina Principală

- **Navbar cu Logo**

- **Căutare Rapida**: În partea principală a paginii, găsești un câmp de căutare simplu și eficient unde poți căuta rapid joburi după titlu. Numărul total de joburi disponibile este afișat pentru a-ți oferi o perspectivă asupra volumului de oportunități.

- **Redirecționare Rapidă**: După ce efectuezi o căutare, ești redirecționat automat către pagina de rezultate, unde poți explora detaliile joburilor căutate.

### Pagina de Rezultate

- **Navbar cu Logo și Căutare**: Logo-ul te redirectionează înapoi la pagina principală, iar câmpul de căutare te ajută să cauți rapid joburi după titlu.

- **Filtre pentru Căutare Avansată**: Utilizează filtrele disponibile în partea de sus a paginii pentru a rafina rezultatele căutării după orase, companii și tipul de lucru (remote, hibrid, on-site).

- **Carduri cu Joburi**: Sub filtrele de căutare, vei găsi numărul total de joburi și carduri care afișează detalii despre fiecare job disponibil. Fiecare card conține informații despre titlu, companie și locație sau tipul de lucru, împreună cu un buton care te va redirecționa către site-ul respectivului job.

- **Paginare**: La sfârșitul paginii, vei găsi un sistem de paginare pentru a naviga printre multiplele pagini de rezultate.

### Footer

- **Link-uri Utile**: În partea de jos a paginii, găsești un footer care conține link-uri utile către paginile noastre de [Instagram](https://www.instagram.com/peviitor.ro/?igsh=MTUzZzkxbTZnMjJyOQ%3D%3D), [LinkedIn](https://www.linkedin.com/company/asociatia-oportunitati-si-cariere/mycompany/), [Github](https://github.com/peviitor-ro/search-engine/issues), [DEV Community](https://dev.to/t/peviitor), [Jitsi](https://meet.jit.si/PEVIITOR.RO) și serverul nostru de [Discord](https://discord.com/invite/t2aEdmR52a).

Aceste funcționalități îți oferă o experiență optimizată în căutarea și aplicarea pentru joburi, facilitând găsirea rapidă a oportunităților potrivite pentru tine.

## Cum Să Folosești

1. **Căutare**: Introdu titlul jobului dorit în bara de căutare.
2. **Filtrare**: Folosește opțiunile de filtrare pentru a rafina rezultatele căutării pe baza criteriilor specifice.
3. **Navigare**: Explorează ofertele de muncă care se potrivesc preferințelor și calificărilor tale.
4. **Aplicare**: Odată ce găsești un job care te interesează, poți aplica accesând linkul furnizat către site-ul de joburi respectiv. Urmărește instrucțiunile de aplicare furnizate de angajator pe pagina de job.

## Cum să începi

Pentru a începe cu Motorul nostru de Căutare de Joburi, vizitează pur și simplu site-ul nostru și începe-ți căutarea de joburi astăzi!

## Cum să Instalezi

Pentru a instala și rula acest proiect local, urmează pașii de mai jos:

1. **Clonează repository-ul**:

   ```bash
   git clone https://github.com/username/repo-name.git
   cd repo-name

   ```

2. **Instalează dependențele**:
   `npm install `

3. **Rulează aplicația**:
   `npm run dev `

4. **Accesează aplicația**:
   `` Deschide browser-ul și mergi la `http://localhost:3000`  ``

Acum ai totul configurat și poți începe să utilizezi și să contribui la motorul nostru de căutare de joburi!
