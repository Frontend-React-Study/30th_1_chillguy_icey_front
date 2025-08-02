import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 임포트
import hd from "./Header.module.css";
// import line from "../assets/line.svg"; // 더 이상 사용하지 않으므로 주석 처리 또는 제거
import menu from "../assets/menu.svg";
import Notification_box from "./Alert/Notification_box";

const Header = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const sideMenuRef = useRef(null); // 사이드 메뉴를 위한 ref
  const menuIconRef = useRef(null); // 메뉴 아이콘을 위한 ref
  const navigate = useNavigate(); // useNavigate 훅 사용

  // ICEY 로고 클릭 시 홈으로 이동
  const handleLogoClick = () => {
    navigate("/");
  };

  const toggleSideMenu = () => {
    setIsSideMenuOpen((prev) => !prev);
  };

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 메뉴 아이콘 클릭은 제외
      if (menuIconRef.current && menuIconRef.current.contains(event.target)) {
        return;
      }

      // 사이드 메뉴가 열려 있고, 클릭한 대상이 사이드 메뉴 영역 밖이라면
      if (
        isSideMenuOpen &&
        sideMenuRef.current &&
        !sideMenuRef.current.contains(event.target)
      ) {
        setIsSideMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSideMenuOpen]);

  return (
    <>
      <header className={hd.Header}>
        <div className={hd.Header_body}>
          <div className={hd.Header_title}>
            {/* ICEY 로고 클릭 시 handleLogoClick 호출 */}
            <div className={hd.icey} onClick={handleLogoClick}>
              ICEY
            </div>
          </div>
          <div className={hd.Header_menu}>
            <img
              ref={menuIconRef} // 메뉴 아이콘에 ref 추가
              className={hd.Menu_logo}
              onClick={toggleSideMenu}
              src={menu}
              alt="menu"
            />
          </div>
        </div>

        <hr className={hd.headerLine} />
        {/* 사이드 메뉴 */}
        {isSideMenuOpen && (
          <div ref={sideMenuRef} className={hd.sideMenuWrapper}>
            <Notification_box />
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
