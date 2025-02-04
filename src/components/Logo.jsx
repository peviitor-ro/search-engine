import logo from "../assets/svg/logo.svg";

const LOGO_TYPE_CLASSES = {
    primary: '',
    secondary: ''
}

const Logo = ({children, className, logoType, ...otherProps}) => {
    return (
        <img src={logo} alt="logo" className={`${className} ${LOGO_TYPE_CLASSES[logoType]}`}/>
    );
};

export default Logo;