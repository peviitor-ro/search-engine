import Logo from "./Logo";

const Navigation = () => {
    return (
        <div className="w-[80%] md:w-[80%] border-b border-border_grey">
            <Logo className="custom-class" logoType="secondary" />
        </div>
    );
};

export default Navigation;