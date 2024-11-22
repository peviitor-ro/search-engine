import React from "react";
import Footer from "./Footer";

const Layout = ({ children }) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                // justifyContent: "center",
                minHeight: "100vh",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundImage:
                    "url(http://localhost:3000/static/media/landing-cover.4a6d579d3b9b5ae49d06.png)",
            }}
        >
            <main style={{ flex: 1, 
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "2rem"
                }}>{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;
