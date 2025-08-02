import st from "./Login_Info.module.css";
import person from "../../assets/person.svg";
import bell from "../../assets/notifications.svg";
import symbol from "../../assets/google.svg";
import pi from "../../assets/loginperson.svg";
import lg from "../../assets/logout.svg";
import kakao from "../../assets/kakao.svg";

import { useEffect, useState } from "react";
import { getUserInfo } from "../../util/SmallTalkAPI";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login_Info = ({ onBellClick }) => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await getUserInfo(token);
        setUserInfo(res.data);
      } catch (err) {
        console.error("유저 정보 불러오기 실패:", err);
      }
    };

    if (token) fetchInfo();
  }, [token]);

  const handleLogout = () => {
    logout(); // 토큰 제거
    navigate("/");
  };
  return (
    <div className={st.loginInfoWrapper}>
      <div className={st.loginInfoHeader}>
        <div className={st.bellIconWrapper}>
          <div
            className={st.bellIconButton}
            onClick={onBellClick}
            style={{ cursor: "pointer" }} // 마우스 포인터 변경
          >
            <img src={bell} alt="bell" />
          </div>
        </div>

        <button className={st.loginButton} onClick={() => {}}>
          <div className={st.loginButtonInner}>
            <div className={st.loginButtonIcon}>
              <img src={person} alt="person" />
            </div>

            <span className={st.loginButtonLabel}>로그인 정보</span>
          </div>
        </button>
      </div>

      <div className={st.userInfoSection}>
        <div className={st.userInfoWrapper}>
          <div className={st.userInfoContent}>
            <div className={st.userInfoDetails}>
              <div className={st.profileImgWrapper}>
                <img className={st.profileImg} src={pi} />
              </div>
              <div className={st.userName}>
                {userInfo?.name || "익명 사용자"}
              </div>
              <div className={st.userEmail}>
                {userInfo?.email || "이메일 없음"}
              </div>
              <div className={st.linkedAccountWrapper}>
                <div
                  className={`${st.linkedAccountInner} ${
                    userInfo?.provider === "KAKAO" ? st.kakaoLinked : ""
                  }`}
                >
                  <div className={st.linkedAccountContent}>
                    <img
                      className={st.linkedIcon}
                      src={userInfo?.provider === "KAKAO" ? kakao : symbol}
                      alt={userInfo?.provider === "KAKAO" ? "kakao" : "symbol"}
                    />
                    <div className={st.linkedStatusText}>연동됨</div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={st.logoutSection}
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              <img className={st.logoutIcon} src={lg} alt="logout" />
              <div className={st.logoutLabel}>로그아웃</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login_Info;
