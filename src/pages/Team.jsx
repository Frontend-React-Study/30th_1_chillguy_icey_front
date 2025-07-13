import { useState } from "react";
import st from "./Team.module.css";
import Board from "../components/Team/Board";
import CardM from "../components/Team/CardM";
import Massage from "../components/Team/Massage";
import Promise from "../components/Team/Promise";
import PromiseCheck from "../components/Team/PromiseCheck";
import Teamlist from "../components/Team/Teamlist";

const Team = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPromiseCheck, setShowPromiseCheck] = useState(false);
  const [fadeState, setFadeState] = useState("hidden"); // 'visible', 'hiding', 'hidden'

  // Promise 클릭 시 (확장 + PromiseCheck 표시)
  const handlePromiseClick = () => {
    if (fadeState === "visible") return;
    setIsExpanded(true); // 박스 확장 먼저
    setShowPromiseCheck(true);
    setFadeState("visible");
  };

  // List 클릭 시 (fade out 시작)
  const handleListClick = () => {
    if (fadeState !== "visible") return;
    setFadeState("hiding"); // PromiseCheck fade out 시작
  };

  // fadeWrap의 opacity transition 끝나면 호출
  const onFadeTransitionEnd = (e) => {
    if (e.propertyName !== "opacity") return;

    if (fadeState === "hiding") {
      setIsExpanded(false); // fade out 완료 후 박스 축소
      setShowPromiseCheck(false); // DOM에서 제거
      setFadeState("hidden");
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
          {showPromiseCheck && (
            <div
              className={`${st.fadeWrap} ${fadeState === "visible" ? st.show : st.hide}`}
              onTransitionEnd={onFadeTransitionEnd}
            >
              {/* 리더가 아니면, 시간과 완료만 띄어줌. -> 리더면, 날짜/시간, 약속 확정,완료가 뜸 */}
              <PromiseCheck userType="Leader" />
            </div>
          )}
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
