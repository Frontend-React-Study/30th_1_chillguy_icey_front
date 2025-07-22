import "./IcyLogin.css";
import kakao from "../assets/kakaoLogo.svg";
import google from "../assets/goolgeLogo.svg";
import back from "../assets/back.svg";

import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const IcyLogin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    await login();

    const redirectPath = location.state?.from || "/";
    console.log("Redirecting to:", redirectPath);
    navigate(redirectPath, { replace: true });
  };

  const kakao_REST_API_KEY = "벡엔드에서 받아오기";
  const kakao_REDIRECT_URI = "벡엔드에서 받아오기";
  const kakaolink = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao_REST_API_KEY}&redirect_uri=${kakao_REDIRECT_URI}&response_type=code`;

  const google_REST_API_KEY = "벡엔드에서 받아오기";
  const google_REDIRECT_URI = "벡엔드에서 받아오기";
  const googlelink = `https://kauth.kakao.com/oauth/authorize?client_id=${google_REST_API_KEY}&redirect_uri=${google_REDIRECT_URI}&response_type=code`;

  const handleKakaoLogin = () => {
    window.location.href = kakaolink;
  };

  const handleGoogleLogin = () => {
    window.location.href = googlelink;
  };

  const goToHome = () => {
    navigate("/Team"); // 나중에는 홈으로 바꾸기
  };

  return (
    <div className="login-body">
      <div className="login-content">
        <button className="backButton" onClick={goToHome}>
          <img className="backButton" src={back} alt="홈페이지 돌아가기" />
        </button>
        <button className="logo-box">
          <div className="logo" onClick={goToHome}>
            ICEY
          </div>
        </button>
        <div className="hello-text-box">
          <div className="text1">환영합니다!</div>
          <div className="text2">
            별도 회원 가입 없이 소셜 계정으로 간편하게 시작할 수 있어요.
          </div>
        </div>
        <div className="login-box">
          <button className="kakao-login" onClick={handleKakaoLogin}>
            <img className="kakao-img" src={kakao} alt="카카오톡 로그인" />
            <div className="kakao-text">카카오톡으로 시작하기</div>
          </button>
          <button className="google-login" onClick={handleGoogleLogin}>
            <img className="google-img" src={google} alt="구글 로그인" />
            <div className="google-text">구글로 시작하기</div>
          </button>
          <button onClick={handleLogin}>테스트</button>
        </div>
      </div>
    </div>
  );
};

export default IcyLogin;
// export default Login;
