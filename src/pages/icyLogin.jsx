import "./icyLogin.css";
import kakao from "../assets/kakaoLogo.svg";
import google from "../assets/goolgeLogo.svg";
import back from "../assets/back.svg";

const icyLogin = () => {
  return (
    <div className="login-body">
      <div className="login-content">
        <button className="backButton">
          <img className="backButton" src={back} alt="홈페이지 돌아가기" />
        </button>
        <button className="logo-box">
          <div className="logo">ICEY</div>
        </button>
        <div className="hello-text-box">
          <div className="text1">환영합니다!</div>
          <div className="text2">
            별도 회원 가입 없이 소셜 계정으로 간편하게 시작할 수 있어요.
          </div>
        </div>
        <div className="login-box">
          <button className="kakao-login">
            <img className="kakao-img" src={kakao} alt="카카오톡 로그인" />
            <div className="kakao-text">카카오톡으로 시작하기</div>
          </button>
          <button className="google-login">
            <img className="google-img" src={google} alt="구글 로그인" />
            <div className="google-text">구글로 시작하기</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default icyLogin;
// export default Login;
