import logo from "../assets/svg/logo.svg";

const LOGO_TYPE_CLASSES = {
    primary: '',
    secondary: ''
}

const Logo = ({className, logoType}) => {
    return (
        <img src={logo} alt="logo" className={`${className} ${LOGO_TYPE_CLASSES[logoType]}`}/>
    );
};

export default Logo;