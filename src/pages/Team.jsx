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

import { useState, useRef, useEffect } from "react";
import st from "./Team.module.css";
import Board from "../components/Team/Board";
import CardM from "../components/Team/CardM";
import Massage from "../components/Team/Massage";
import Promise from "../components/Team/Promise";
import PromiseCheck from "../components/Team/PromiseCheck";
import PromiseCheck2 from "../components/Team/PromiseCheck2";
import Teamlist from "../components/Team/Teamlist";
import PromiseDialog from "../components/Dialog/PromiseDialog";
import LinkSnackbar from "../components/Snackbar/LinkSnackbar";
import { teams as teams, links, cards } from "../util/teams";
import { useAuth } from "../context/AuthContext";

const Team = () => {
  const { token, login, logout, isLoggedIn } = useAuth();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showPromiseCheck, setShowPromiseCheck] = useState(false);

  const [fadeState, setFadeState] = useState("hidden"); // 'visible', 'hiding', 'hidden'

  // 👉 여기서 선택 데이터 상태 관리
  const [mySelections, setMySelections] = useState(fakeMyVotes);
  const [savedSelections, setSavedSelections] = useState(fakeMyVotes);

  const [isPromiseDialogOpen, setIsPromiseDialogOpen] = useState(false);
  const [isLinkSnackbarOpen, setIsLinkSnackbarOpen] = useState(false);
  const [Teams, setTeams] = useState(teams);
  const [Links, setLinks] = useState(links);
  const [Cards, setCards] = useState(cards);
  // const [selectedTeam, setSelectedTeam] = useState(Teams[0]); // 레거시 - check가 js에 함께 포함된 경우
  const [selectedTeamId, setSelectedTeamId] = useState(Number(Teams[0].teamId));
  const [targetTeam, setTargetTeam] = useState(null);
  const [pendingTeamId, setPendingTeamId] = useState(null);

  const timeoutRef = useRef(null);
  const selectedTeam = Teams.find((team) => team.teamId === selectedTeamId);

  // 팀 클릭 시: Promise 줄이고 -> 이후에 팀 변경
  const handleTeamSelect = (teamId) => {
    if (fadeState === "visible") {
      // Promise 패널이 열려있으면 먼저 닫는다
      setFadeState("hiding");
      setPendingTeamId(teamId); // 이후 팀 교체를 예약
    } else {
      setSelectedTeamId(teamId); // 바로 교체
    }
  };

  // 링크 버튼 클릭 -> 링크 팝업창 open
  const handleLinkSnackbar = (teamId) => {
    const targetTeam = Teams.find((team) => team.teamId === teamId);
    if (!targetTeam) return;

    // team id에 맞는 링크 가지고 오기
    const linkObj = Links.find((link) => link.teamId === teamId);
    const teamWithLink = { ...targetTeam, link: linkObj?.link || "" };

    // 기존 타이머 제거
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setTargetTeam(teamWithLink);
    setIsLinkSnackbarOpen(true);

    // 새 타이머 설정
    timeoutRef.current = setTimeout(() => {
      setIsLinkSnackbarOpen(false);
      timeoutRef.current = null; // 정리
    }, 3000);
  };

  const handleTeamAdd = (teamname) => {
    // 1. 현재 Teams 상태에서 id 계산
    const newId = Teams.length > 0 ? Teams[Teams.length - 1].teamId + 1 : 1;

    // 2. 새로운 팀 객체 생성
    const newTeam = {
      teamId: newId,
      teamName: teamname,
      memberCount: 1,
      currentDate: "2025-07-03",
      role: "LEADER",
      dday: "D-29",
      hasSchedule: false,
      confirmedDate: null,
    };

    const newLink = {
      teamId: newId,
      name: teamname,
      link: `https://www.when2meet.com/team${newId}`,
    };

    const newCard = {
      teamId: newId,
      card: {
        name: "새로운카드",
        mbti: "INTP",
        hobby: "코딩",
        secret: "비밀 없음",
        tmi: "생각 많음",
      },
    };

    // 3. 상태 동기적으로 업데이트
    setTeams((prev) => [...prev, newTeam]);
    setLinks((prev) => [...prev, newLink]);
    setCards((prev) => [...prev, newCard]);
  };

  // 팀 상태가 변경되면, 바로바로 console 알림
  useEffect(() => {
    console.log("Teams 상태 변경됨:", Teams);
  }, [Teams]);

  // 약속 확정 클릭 -> 약속 확정 팝업창 open
  const openPromiseDialog = () => {
    setIsPromiseDialogOpen(true);
  };
  const closePromiseDialog = () => {
    setIsPromiseDialogOpen(false);
  };

  // Promise 클릭 시 (확장 + PromiseCheck 표시)
  const handlePromiseClick = () => {
    if (fadeState === "visible") return;
    if (selectedTeam.confirmedDate !== null) return;
    setIsExpanded(true); // 박스 확장 먼저
    setShowPromiseCheck(true);
    setFadeState("visible");
  };

  // List 클릭 시 (fade out 시작)
  const handleListClick = () => {
    if (fadeState !== "visible") return;
    if (selectedTeam.confirmedDate !== null) return;

    setFadeState("hiding"); // PromiseCheck fade out 시작
  };

  // 트랜지션 끝나고 팀을 변경
  const onFadeTransitionEnd = (e) => {
    if (e.propertyName !== "opacity") return;

    if (fadeState === "hiding") {
      setIsExpanded(false);
      setFadeState("hidden");

      // ⭐️ fade 닫힘이 끝났을 때 팀 변경
      if (pendingTeamId !== null) {
        setSelectedTeamId(pendingTeamId);
        setPendingTeamId(null);
      }
    }
  };

  return (
    <>
      <div className={st.Team_container}>
        <section className={st.Team_section1}>
          <div className={`${st.box} ${st.team_borad_box}`}>
            <Board team={selectedTeam} />
          </div>
          <div>
            <div className={`${st.box} ${st.team_card_box}`}>
              <CardM
                card={
                  Cards.find((c) => c.teamId === selectedTeam.teamId).card || {}
                }
                team={selectedTeam}
              />
            </div>
            <div className={`${st.box} ${st.team_message_box}`}>
              <Massage team={selectedTeam} />
            </div>
          </div>
        </section>

        <section className={st.Team_section2}>
          <div
            className={`${st.box} ${st.team_promise_box} ${isExpanded && selectedTeam.confirmedDate === null ? st.promExpanded : ""}`}
            onClick={handlePromiseClick}
          >
            <Promise
              teamCreateDate={selectedTeam.currentDate}
              goalDate={selectedTeam.confirmedDate}
            />

            <div
              className={`${st.fadeWrap} ${
                fadeState === "visible" ? st.show : st.hide
              }`}
              style={{ display: fadeState === "hidden" ? "none" : "block" }}
              onTransitionEnd={onFadeTransitionEnd}
            >
              <PromiseCheck2
                team={selectedTeam}
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
            <Teamlist
              teams={Teams}
              onTeamAdd={handleTeamAdd}
              onLinkClick={handleLinkSnackbar}
              onTeamCheckClick={handleTeamSelect}
              selectedTeamId={selectedTeamId}
            />
          </div>
        </section>
      </div>

      {isLinkSnackbarOpen && <LinkSnackbar link={targetTeam.link} />}

      {isPromiseDialogOpen && (
        <PromiseDialog
          onConfirm={() => {
            // 확인 버튼 눌렀을 때 실행할 로직
            closePromiseDialog();
          }}
          onCancel={closePromiseDialog}
        />
      )}
    </>
  );
};

export default Team;
