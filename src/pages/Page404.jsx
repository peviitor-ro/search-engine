import React from "react";
import { useNavigate } from "react-router-dom";


// Import components
import Layout from "../components/Layout";
import Button from "../components/Button";

// Import 404 image
import image404 from "../assets/svg/404image.svg";


const Page404 = () => {
    const navigate = useNavigate();

    const handleBackBtn = () => {
        navigate("/");
    }

    return (
        <Layout>
            {/* Page Content */}
            <div className="flex flex-col items-center justify-center w-[80%] max-w-[750px] gap-6 mt-8 text-center">
                <img
                    className="w-full h-auto object-cover"
                    src={image404}
                    alt="Imagine pagină 404"
                />
                <p className="font-semibold text-base md:text-xl leading-7 text-text_grey_darker md:leading-8 tracking-[1.2px]">Se pare că ai ajuns într-un loc unde job-urile se ascund. Dar nu te lăsa descurajat, te ajutăm să le găsești!</p>
                <Button
                    type="button"
                    buttonType={"search"}
                    onClick={handleBackBtn}
                    className={"font-medium"}
                >
                    Înapoi
                </Button>
            </div>
        </Layout>
    );
};

export default Page404;