import st from "./Header.module.css";
import line from "../assets/line.svg";
import menu from "../assets/menu.svg";

const Header = () => {
  return (
    <header className={st.Header}>
      <div className={st.Header_body}>
        <div className={st.Header_title}>
          <div className={st.icey}>ICEY</div>
        </div>
        <div className={st.Header_menu}>
          <img className={st.Menu_logo} src={menu} alt="menu" />
        </div>
      </div>
      <img className={st.Line} src={line} alt="line" />
    </header>
  );
};

export default Header;
