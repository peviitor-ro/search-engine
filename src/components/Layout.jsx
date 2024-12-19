import React from "react";
import Footer from "./Footer";

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col items-center min-h-screen landing-page" 
            //  style={{backgroundImage: "url(http://localhost:3000/static/media/landing-cover.4a6d579d3b9b5ae49d06.png)"}}
        >
            <main className="flex-1 flex flex-col items-center justify-center mb-8">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
