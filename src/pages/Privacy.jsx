import React,  { useEffect } from "react";
import Layout from "../components/Layout";

const Privacy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Layout>
            <header
                role="banner"
                className="font-PoppinsRegular w-full flex items-center justify-center flex-wrap flex-col py-16 md:py-24 lg:py-32 leading-[110%] bg-[radial-gradient(circle,_rgba(4,138,129,1)_19%,_rgba(40,83,107,1)_100%)]">
                <h1 className="leading-[62px] text-white text-[40px] md:text-[44px] xl:text-[60px] font-semibold mb-2 text-center">
                    Confidențialitate
                </h1>
            </header>
    
            <article className="font-PoppinsRegular flex flex-col w-full">
                <section className="pt-12 bg-white/20 w-full flex flex-col items-center" aria-labelledby="terms-intro-heading">
                    <h2 className="text-lg leading-6 text-left mb-4 w-3/4"><strong>SOLICITARE ACORD ȘI INFORMARE GENERALĂ CU PRIVIRE LA POLITICA DE PRELUCRARE A DATELOR CU CARACTER PERSONAL</strong></h2>
                    <p className="mb-4 w-3/4">
                        Vă mulțumim pentru interesul acordat <strong>ASOCIAȚIEI OPORTUNTĂȚI ȘI CARIERE</strong>, Pentru noi este deosebit de important să asigurăm protecția datelor cu caracter personal pe care ni le furnizați:
                    </p>
                    <p className="mb-4 w-3/4">ASOCIAȚIA OPORTUNTĂȚI ȘI CARIERE cu sediul social în Zimbor nr 215 , județul Salaj, în calitate de operator de date cu caracter personal 
                        (denumită în continuare „Societatea” sau „Operatorul”), respectă întocmai prevederile legale în vigoare privind protecția persoanelor cu privire la prelucrarea datelor 
                        cu caracter personal și libera circulație a acestor date.
                    </p>
                    <p className="mb-4 w-3/4">Ne angajăm să prelucrăm datele dumneavoastră cu caracter personal în concordanță cu Regulamentul (UE) 679/2016 (GDPR), precum și cu orice altă legislație 
                        aplicabilă pe teritoriul României. ASOCIAȚIA OPORTUNTĂȚI ȘI CARIERE operează platforma www.peviitor.ro, astfel încât toate informațiile cuprinse în acest material au legătură 
                        și sunt valabile în raport cu activitatea pe platforma www.peviitor.ro . Pentru a înțelege mai bine politica noastră de protecție a datelor, vă invităm să citiți acest material. 
                        Ne rezervăm dreptul de a actualiza și modifica periodic această Politică de protecție a datelor cu caracter personal („Politica”) fără a vă cere acordul prealabil și fără a fi 
                        supuși unei proceduri de notificare individuală ori specială a modificărilor aduse. În cazul oricărei astfel de modificări, vom afișa pe site versiunea actualizată a Politicii  
                        de protecție a datelor cu caracter personal, rămânând în sarcina dumneavoastră să verificați conținutul acestei Politici ori de câte ori accesați site-ul, pentru a vă asigura 
                        că sunteți la curent cu ultima versiune.
                    </p>
                    <p className="mb-4 w-3/4">Vă stăm la dispoziție pentru informații și pe email asocpeviitor@gmail.com.</p>
                </section>
                   
                <section  className="pt-12 w-full flex flex-col items-center" aria-labelledby="general-terms-heading">
                    <h2 className="text-lg leading-6 text-left mb-4 w-3/4">
                        <strong>1. Cine suntem?</strong>
                    </h2>
                    <ol className="mb-8 w-3/4 list-inside">
                        <li className="mb-4">
                            Calitatea de Operator de Date cu caracter personal o are ASOCIAȚIA OPORTUNTĂȚI ȘI CARIERE, cu sediul social în Zimbor nr 215 jud Salaj.
                        </li>
                    </ol>
                </section>

                <section className="pt-12 bg-white/20 w-full flex flex-col items-center" aria-labelledby="content-heading">
                    <h2 className="text-lg leading-6 text-left mb-4 w-3/4"><strong>2. Ce fel de date prelucrăm</strong></h2>
                    <ol className="mb-8 w-3/4 [list-style-type:lower-alpha] list-inside">
                        <li className="mb-4">
                            Analizam informatiile folosite pentru cautare dar nu prelucram date personale .
                        </li>
                        <li className="mb-4">Folosim rețeaua Cloudflare - o rețea de tip CDN (Content Delivery Network), o rețea distribuită 
                            de servere care creează caching de resurse front end (css, js, html, jpg, etc) prin care ajută la îmbunătățirea 
                            vitezei de încărcare a paginii, reducerea utilizării lățimii de bandă și reducerea utilizării procesorului pe server. 
                            Cloudflare ajută la îmbunătățirea securității prin blocarea amenințărilor înainte de a afecta site-ul sau serverul de 
                            pe care se încarcă site-ul. Cloudflare blocheaza traficul robotilor sau accesarile abusive
                        </li>
                        <li className="mb-4">Când vizitați site-ul, se colectează automat anumite informații despre dispozitivul dumneavoastră, cum 
                            ar fi informații despre browser, adresa IP, fus orar și unele cookie-uri instalate pe dispozitiv.
                        </li>
                        <li className="mb-4">Vă rugăm să consultați și secțiunea privind Politica de cookie-uri afișată pe pagina dedicate www.peviitor.ro. 
                            Nu colectăm și nu prelucrăm date sensibile, definite ca atare de GDPR.
                        </li>
                    </ol>
                </section>

                <section className="pt-12 w-full flex flex-col items-center" aria-labelledby="copyright-rights">
                    <h2 className="text-lg leading-6 text-left mb-4 w-3/4"><strong>3. Scopul pentru care se pot prelucra date personale poate fi pentru</strong></h2>
                    <ul className="mb-8 w-3/4 [list-style-type:lower-alpha] list-inside">
                        <li className="mb-4">
                            a face posibilă funcționarea site-ului
                        </li>
                        <li className="mb-4">
                            oferirea de răspunsuri la reclamațiile plasate
                        </li>
                        <li className="mb-4">
                            evaluarea serviciilor oferite pe site
                        </li>
                        <li className="mb-4">
                            monitorizarea vânzărilor și comportamentul clienților, scopuri administrative, de media și altele asemenea - dacă vă oferiți consimțământul în acest sens
                        </li>
                        <li className="mb-4">
                            comunicarea de oferte de servicii - dacă vă oferiți consimțământul în acest sens
                        </li>
                    </ul>
                </section>

                <section className="pt-12 bg-white/20 w-full flex flex-col items-center" aria-labelledby="responsibilities">
                    <h2 className="text-lg leading-6 text-left mb-4 w-3/4"><strong>4. Temeiurile prelucrării</strong></h2>
                    <p className="mb-4 w-3/4">Operatorul are dreptul de a prelucra date personale pentru scopurile prezentate mai sus:</p>
                    <ul className="mb-8 w-3/4 [list-style-type:lower-alpha] list-inside">
                        <li className="mb-4">
                            pentru că prelucrarea datelor este necesară pentru a face posibilă funcționarea site-ului și accesul la serviciile oferite pe site,
                        </li>
                        <li className="mb-4">
                            oferirea de răspunsuri la reclamațiile plasate, dacă este cazul,  
                        </li>
                        <li className="mb-4">
                            pentru că v-ați dat consimțământul expres în acest sens prin bifarea căsuțelor aferente În cazul în care prelucrarea datelor nu este necesară 
                            pentru încheierea și executarea raporturilor noastre juridice, nu vom prelucra date personale pentru niciunul dintre scopurile de mai sus dacă 
                            nu avem consimțământul dumneavoastră în acest sens.
                        </li>
                    </ul>
                </section>

                <section className="pt-12 w-full flex flex-col items-center" aria-labelledby="information-submission">
                    <h2 className="text-lg leading-6 text-left mb-4 w-3/4"><strong>5. Durata de stocare și prelucrare a datelor</strong></h2>
                    <ol className="mb-8 w-3/4 [list-style-type:lower-alpha] list-inside">
                        <li className="mb-4">
                            Datele se prelucrează pe durata necesară îndeplinirii scopurilor și pe perioada impusă de reglementările legale aplicabile.
                        </li>
                    </ol>
                </section>

                <section className="pt-12 bg-white/20 w-full flex flex-col items-center" aria-labelledby="user-obligations">
                    <h2 className="text-lg leading-6 text-left mb-4 w-3/4"><strong>6. Măsuri de securitate a datelor</strong></h2>
                    <ol className="mb-8 w-3/4 [list-style-type:lower-alpha] list-inside">
                        <li className="mb-4">Societatea asigură măsurile tehnice și juridice adecvate pentru a asigura o protecție efectivă a datelor cu caracter personal. 
                            Ne angajăm să păstrăm datele în siguranță și luăm măsurile rezonabile în acest sens, inclusiv împotriva accesului neautorizat, al utilizării neautorizate a datelor, distrugerii, pierderii sau alterării acestora.
                        </li>
                        <li className="mb-4">
                            Vă rugăm să consultați și secțiunea privind Politica de cookie-uri afișată pe pagina principală a site-ului nostru.
                        </li>
                    </ol>
                </section>

                <section className="pt-12 w-full flex flex-col items-center" aria-labelledby="liabilities-indemnities">
                    <h2 className="text-lg leading-6 text-left mb-4 w-3/4"><strong>7. Ce drepturi aveți în legătură cu datele personale pe care ni le furnizați</strong></h2>
                    <ol className="mb-4 w-3/4 [list-style-type:lower-alpha] list-inside">
                        <li className="mb-4">Conţinutul acestui site, inclusiv datele şi alte informaţii, este furnizat gratuit de ASOCIAȚIA OPORTUNITĂȚI ȘI CARIERE şi 
                            de către furnizorii săi de informații. Acest site furnizează instrumente de informare, însă nu oferă niciun fel de sfat şi nici nu face vreo
                            recomandare referitoare la anumite locuri de muncă, angajatori sau alte  produse.
                        </li>
                        <li className="mb-4">ASOCIAȚIA OPORTUNITĂȚI ȘI CARIERE nu cere clienţilor săi informaţii personale prin intermediul unei corespondenţe nesolicitate 
                            de aceştia. Orice tip de corespondenţă care cere divulgarea de informaţii personale trebuie considerat un fals şi raportat către asociație 
                            prin intermediul adresei de e-mail asocpeviitor@gmail.com
                        </li>
                        <li>ASOCIAȚIA OPORTUNITĂȚI ȘI CARIERE  şi furnizorii săi de conţinut nu răspund pentru erorile, impreciziile sau întârzierile în furnizarea 
                            conţinutului oferit de site şi nici pentru orice acţiune care se bazează pe acest conţinut. ASOCIAȚIA OPORTUNITĂȚI ȘI CARIERE  îşi declină orice
                            responsabilitate privind garantarea, explicită sau implicită, a acurateţii conţinutului furnizat de terţi sau a felului în care informaţia serveşte anumitor scopuri. 
                            Deşi ASOCIAȚIA OPORTUNITĂȚI ȘI CARIERE face toate eforturile pentru a obţine informaţii de încredere de la furnizorii săi externi, nu garantează acurateţea informaţiilor furnizate de aceştia.
                        </li>     
                    </ol>    
                                  
                    <p className="w-3/4 flex flex-col items-center mb-4">Pentru cazul fortuit, ASOCIAȚIA OPORTUNITĂȚI ȘI CARIERE și/sau reprezentantii săi, este exonerata total de răspundere. 
                        Cazurile fortuite includ, dar nu se limiteaza la, erori de functionare ale echipamentului tehnic, lipsa functionarii conexiunii la internet, lipsa 
                        functionarii conexiunilor de telefon, virusii informatici, accesul neautorizat in sistemele Site-ului, erorile de operare, etc.
                    </p>

                    <ol start="4" className="mb-8 w-3/4 [list-style-type:lower-alpha] list-inside"> 
                        <li className="mb-4">Fiecare utilizator al site-ului 
                            este de acord ca, la cererea  ASOCIAȚIEI OPORTUNITĂȚI ȘI CARIERE să exonereze de răspundere ASOCIAȚIA OPORTUNITĂȚI ȘI CARIERE pentru orice acţiuni judiciare sau extrajudiciare, 
                            şi să acopere cheltuielile de judecată şi orice alte cheltuieli care ar putea să apară ca urmare a încălcării de către utilizatorul respectiv a clauzelor din prezentul document.
                            Persoanele fizice sau juridice responsabile de încălcarea prevederilor din prezentul document vor suporta prevederile legislaţiei în vigoare în România.
                            </li>
                        <li className="mb-4">ASOCIAȚIA OPORTUNITĂȚI ȘI CARIERE îşi rezervă dreptul de a modifica şi actualiza aceste condiţii în orice moment. Modificările devin 
                            efective de la momentul publicării lor pe site.
                        </li>
                    </ol>
                </section>

                <section className="pt-12 bg-white/20 w-full flex flex-col items-center" aria-labelledby="updates">
                    <h2 className="text-lg leading-6 text-left mb-4 w-3/4"><strong>7. ACTUALIZARE</strong></h2>
                    <ol className="mb-8 w-3/4 [list-style-type:lower-alpha] list-inside">
                        <li className="mb-4">Aceşti TERMENI ŞI CONDIŢII se actualizeaza de câte ori este nevoie. Modificările se vor reflecta în tipul de informaţii publicate sau transmite de către ASOCIATIE. 
                            Vă rugăm să citiţi periodic aceste condiţii, pentru a fi la curent cu ce informaţii colectează, foloseşte şi transmite ASOCIATIA OPORTUNITATI SI CARIERE
                        </li>
                    </ol>
                </section>

                <section className="pt-12 w-full flex flex-col items-center" aria-labelledby="applicable-legislation">
                    <h2 className="text-lg leading-6 text-left mb-4 w-3/4"><strong>8. LEGISLAȚIE APLICABILĂ</strong></h2>
                    <ol className="mb-8 w-3/4 [list-style-type:lower-alpha] list-inside">
                        <li className="mb-4">Prezentului acord, precum și oricărei utilizări a site-ului li se vor aplica legea română. Orice litigiu va fi supus spre soluționare instanțelor române.</li>
                    </ol>
                </section>           
            </article>
        </Layout>
    );
};

export default Privacy;