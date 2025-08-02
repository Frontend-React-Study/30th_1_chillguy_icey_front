import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Callback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("loginProcessed");
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken =
      params.get("accessToken") || localStorage.getItem("accessToken");
    const refreshToken =
      params.get("refreshToken") || localStorage.getItem("refreshToken");

    const redirectPath = sessionStorage.getItem("loginRedirectPath") || "/";

    // 이미 로그인 처리된 경우라면 중복 처리 방지
    if (!accessToken || sessionStorage.getItem("loginProcessed") === "true")
      return;

    sessionStorage.setItem("loginProcessed", "true"); // ✅ 중복 방지용 플래그

    if (accessToken && refreshToken) {
      login(accessToken, refreshToken);
      console.log("✅ 로그인 성공. 이동 경로:", redirectPath);

      sessionStorage.removeItem("loginRedirectPath");
      navigate(redirectPath, { replace: true });
    } else {
      console.error("❌ 로그인 실패: 토큰 없음");
      navigate("/login");
    }
  }, [login, navigate]);

  return <div>로그인 처리 중입니다...</div>;
};

export default Callback;
