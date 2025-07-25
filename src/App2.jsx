import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Header from "./components/Header";
import Team from "./pages/Team";
import MyCard from "./pages/MyCard";
import Letter from "./pages/Letter";
import Invite from "./pages/Invite";
import Login from "./pages/IceyLogin";
import Layout from "./components/PageLayout/Layout";
import Layout_Login from "./components/PageLayout/Layout_login";
import NotFound from "./pages/NotFound";
import Callback from "./pages/Callback";
import Home from "./pages/Home";

function App2() {
  return (
    <Router>
      {/* 공통 레이아웃이 있는 페이지들 */}
      <Routes>
        <Route element={<Layout />}>
          <Route path="/team" element={<Team />} />
          <Route path="/mycard" element={<MyCard />} />
          <Route path="/invite" element={<Invite />} />
          <Route path="/letter" element={<Letter />} />
          <Route path="/oauth/callback" element={<Callback />} />
        </Route>

        {/* 공통 레이아웃이 없는 페이지들 */}
        <Route element={<Layout_Login />}>
          <Route path="/login" element={<Login />} />
          {/* 오류 뜰시에 해당 페이지로 가도록 -> 페이지 오류 page 만드나요? */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* 소현이가 Home.jsx 추가하면 시작 */}
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App2;
