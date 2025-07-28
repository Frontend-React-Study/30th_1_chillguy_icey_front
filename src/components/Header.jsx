import st from "./Header.module.css";
import line from "../assets/line.svg";
import menu from "../assets/menu.svg";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/team"); // 소현이 추가하면 home으로 바꾸기
  };
  return (
    <header className={st.Header}>
      <div className={st.Header_body}>
        <div className={st.Header_title}>
          <div className={st.icey} onClick={handleLogoClick}>
            ICEY
          </div>
        </div>
        <div className={st.Header_menu}>
          <img className={st.Menu_logo} src={menu} alt="menu" />
        </div>
      </div>
      {/* <img className={st.Line} src={line} alt="line" /> */}
      <hr className={st.headerLine} />
    </header>
  );
};

export default Header;
