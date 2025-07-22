import { createContext, useState, useContext } from "react";

// context 만들기 : 앱 전체에 로그인 상태를 공유
const AuthContext = createContext();

// provider 만들기
export const AuthProvider = ({ children }) => {
  const [user, SetUser] = useState(null);

  const login = async () => {
    const fakeUser = { id: 1, name: "송하은 " };
    SetUser(fakeUser);
  };

  const logout = () => {
    SetUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 로그인 정보를 쉽게 꺼내서 쓸 수 있음
export const useAuth = () => {
  return useContext(AuthContext);
};
