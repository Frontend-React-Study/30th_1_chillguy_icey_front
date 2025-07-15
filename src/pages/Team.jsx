import { useState, useRef } from "react";
import st from "./Team.module.css";
import Board from "../components/Team/Board";
import CardM from "../components/Team/CardM";
import Massage from "../components/Team/Massage";
import Promise from "../components/Team/Promise";
import PromiseCheck2 from "../components/Team/PromiseCheck2";
import Teamlist from "../components/Team/Teamlist";

// 날짜 및 시간 슬롯 설정
const allDates = [
  { date: "2025-06-15" },
  { date: "2025-06-16" },
  { date: "2025-06-17" },
  { date: "2025-06-18" },
  { date: "2025-06-19" },
  { date: "2025-06-20" },
];

const fakeVotes = {
  "2025-06-15": {
    "22:00": ["user1"],
    "23:00": ["user1", "user2"],
  },
  "2025-06-16": {
    "10:00": ["user3"],
  },
  "2025-06-18": {
    "14:00": ["user2", "user3"],
    "15:00": ["user1"],
  },
};

const fakeMyVotes = {
  "2025-06-15": ["22:00", "23:00"],
  "2025-06-18": ["10:00", "11:00", "12:00", "13:00"],
};

const Team = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPromiseCheck, setShowPromiseCheck] = useState(false);
  const [fadeState, setFadeState] = useState("hidden");

  // 👉 여기서 선택 데이터 상태 관리
  const [mySelections, setMySelections] = useState(fakeMyVotes);
  const [savedSelections, setSavedSelections] = useState(fakeMyVotes);

  const handlePromiseClick = () => {
    if (fadeState === "visible") return;
    setIsExpanded(true);
    setShowPromiseCheck(true);
    setFadeState("visible");
  };

  const handleListClick = () => {
    if (fadeState !== "visible") return;
    setFadeState("hiding");
  };

  const onFadeTransitionEnd = (e) => {
    if (e.propertyName !== "opacity") return;

    if (fadeState === "hiding") {
      setIsExpanded(false);
      setFadeState("hidden");

      // ✅ 이제 이걸 제거하지 않아야 상태 유지됨
      // setShowPromiseCheck(false);  ❌ 제거하지 마세요!
    }
  };

  return (
    <div className={st.Team_container}>
      <section className={st.Team_section1}>
        <div className={`${st.box} ${st.team_borad_box}`}>
          <Board />
        </div>
        <div>
          <div className={`${st.box} ${st.team_card_box}`}>
            <CardM />
          </div>
          <div className={`${st.box} ${st.team_message_box}`}>
            <Massage />
          </div>
        </div>
      </section>

      <section className={st.Team_section2}>
        <div
          className={`${st.box} ${st.team_promise_box} ${isExpanded ? st.promExpanded : ""}`}
          onClick={handlePromiseClick}
        >
          <Promise />

          <div
            className={`${st.fadeWrap} ${
              fadeState === "visible" ? st.show : st.hide
            }`}
            style={{ display: fadeState === "hidden" ? "none" : "block" }}
            onTransitionEnd={onFadeTransitionEnd}
          >
            <PromiseCheck2
              userType="Leader"
              allDates={allDates}
              othersVotes={fakeVotes}
              mySelections={mySelections}
              setMySelections={setMySelections}
              savedSelections={savedSelections}
              setSavedSelections={setSavedSelections}
            />
          </div>
        </div>

        <div
          className={`${st.box} ${st.team_list_box} ${isExpanded ? st.listShrinked : ""}`}
          onClick={handleListClick}
        >
          <Teamlist />
        </div>
      </section>
    </div>
  );
};

export default Team;
