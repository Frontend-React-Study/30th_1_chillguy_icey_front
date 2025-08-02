import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const backLink = "https://icey-backend-1027532113913.asia-northeast3.run.app";

  useEffect(() => {
    console.log("isLoggedIn:", !!token); // ✅ 항상 최신값
  }, [token]);

  // 로컬스토리지에서 초기화
  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    const checkInitialToken = async () => {
      if (!storedAccessToken || !storedRefreshToken) {
        setLoading(false);
        return;
      }

      try {
        // ❗ axios가 아닌 raw fetch 또는 axios 인스턴스를 새로 만들어서 interceptors 안 타게
        await axios.get(`${backLink}/api/teams`, {
          headers: { Authorization: `Bearer ${storedAccessToken}` },
        });

        // 유효한 경우
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
      } catch (error) {
        if (error.response?.status === 401) {
          // ✅ 초기 진입 시 accessToken 만료 → 로그아웃
          console.warn("🚫 초기 진입: accessToken 만료 → logout()");
          logout();
        } else {
          console.error("🚨 초기 진입 에러", error);
        }
      } finally {
        setLoading(false);
      }
    };

    checkInitialToken();
  }, []);

  // 로그인 처리 함수
  const login = (newToken, newRefreshToken) => {
    localStorage.setItem("accessToken", newToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    setAccessToken(newToken);
    setRefreshToken(newRefreshToken);
  };

  // 로그아웃 처리 함수
  const logout = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        `${backLink}/api/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log("로그아웃 성공");
    } catch (error) {
      console.error("로그아웃 실패", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("loginType");
      setAccessToken(null);
      setRefreshToken(null);
      console.log("isLoggedIn :", isLoggedIn);
    }
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{ token, login, logout, isLoggedIn, loading, backLink }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
