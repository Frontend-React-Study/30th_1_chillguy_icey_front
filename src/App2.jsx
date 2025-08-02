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
import TeamsTest from "./util/TeamsTest";
import SmallTalk from "./pages/SmallTalk";
import NewSmallTalk from "./pages/NewSmallTalk";
import EditSmall from "./pages/EditSmall";

import React, { useEffect } from "react";

function App2() {
  useEffect(() => {
    function adjustFontSize() {
      const designWidth = 1440;
      const designHeight = 1024;
      const minFontSize = 12; // 최소 12px
      const maxFontSize = 16; // 최대 16px

      const vw = window.innerWidth; // 현재 브라우저의 가로 길이
      const vh = window.innerHeight; // 현재 브라우저의 세로 길이

      // 세로 기준 축소 비율
      let scale = vh / designHeight;

      // 만약 세로 기준으로 계산된 가로 길이가 실제 화면보다 크면,
      // 가로가 실제 화면보다 커지면 가로 기준으로 다시 조절
      if (vw < scale * designWidth) {
        scale = vw / designWidth;
      }

      // 최소 최대 제한
      scale = Math.min(Math.max(scale, minFontSize / 16), maxFontSize / 16);

      // 최종적으로 루트(html) 요소의 font-size를 설정
      // rem 단위가 이 크기를 기준으로 계산됨
      document.documentElement.style.fontSize = `${scale * 16}px`;
    }

    adjustFontSize();
    window.addEventListener("resize", adjustFontSize);
    return () => window.removeEventListener("resize", adjustFontSize);
  }, []);

  return (
    <div className="App-background">
      <div className="App-contanier">
        <Router>
          {/* 공통 레이아웃이 있는 페이지들 */}
          <Routes>
            <Route element={<Layout />}>
              <Route path="/team" element={<Team />} />
              <Route path="/smalltalk" element={<SmallTalk />} />
              <Route path="/newsmalltalk" element={<NewSmallTalk />} />
              <Route path="/editsmall" element={<EditSmall />} />
              <Route path="/mycard" element={<MyCard />} />
              <Route path="/invitation/:invitationToken" element={<Invite />} />
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
            <Route path="/test" element={<TeamsTest />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App2;
