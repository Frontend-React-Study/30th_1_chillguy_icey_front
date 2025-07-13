import "./Header.css";
import line from "../assets/line.svg";
import menu from "../assets/menu.svg";

const Header = () => {
  return (
    <header className="Header">
      <div className="Header-body">
        <div className="Header-title">
          <div className="icey">ICEY</div>
        </div>
        <div className="Header-menu">
          <img className="Menu-logo" src={menu} alt="menu" />
        </div>
      </div>
      <img className="Line" src={line} alt="line" />
    </header>
  );
};

export default Header;
