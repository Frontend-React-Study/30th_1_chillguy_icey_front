import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  // 로컬스토리지에서 초기화
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) setToken(storedToken);
  }, []);

  // 로그인 처리 함수
  const login = (newToken) => {
    localStorage.setItem("accessToken", newToken);
    setToken(newToken);
  };

  // 로그아웃 처리 함수
  const logout = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        "https://icey-backend-1027532113913.asia-northeast3.run.app/api/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log("로그아웃 성공");
    } catch (error) {
      console.error("로그아웃 실패", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("loginType");
      setToken(null);
    }
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
