import React from "react";

// Import Footer component
import Footer from "./Footer";

// Import logo peviitor
import logo from "../assets/svg/logo.svg";

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col items-center min-h-screen landing-page"
        //  style={{backgroundImage: "url(http://localhost:3000/static/media/landing-cover.4a6d579d3b9b5ae49d06.png)"}}
        >
            <nav className="w-[80%] md:w-[80%] border-b pt-5 border-border_grey">
                <img src={logo} alt="Pe Viitor Logo" />
            </nav>
            <main className="flex-1 flex flex-col items-center justify-center mb-8">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
