import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import st from "./Team.module.css";
import Board from "../components/Team/Board";
import CardM from "../components/Team/CardM";
import Massage from "../components/Team/Massage";
import Promise from "../components/Team/Promise";
import PromiseCheck2 from "../components/Team/PromiseCheck2";
import Teamlist from "../components/Team/Teamlist";
import PromiseDialog from "../components/Dialog/PromiseDialog";
import LinkSnackbar from "../components/Snackbar/LinkSnackbar";
import Snackbar from "../components/Snackbar/Snackbar";
import { useAuth } from "../context/AuthContext";
import {
  fetchTeamList,
  fetchTeamDetail,
  createTeam,
  fetchTeamLink,
  fetchTeamCardM,
} from "../util/TeamDataAPI";

import {
  fetchTeamVoteCreate,
  fetchTeamVoteOnlySummery,
  fetchTeamVotesSummary,
  fetchTeamMyVotes,
  fetchTeamVoteSave,
  fetchMaxCandidates,
  fetchScheduleConfirm,
} from "../util/TeamVoteAPI";

const Team = () => {
  const { token, logout } = useAuth();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showPromiseCheck, setShowPromiseCheck] = useState(false);
  const [fadeState, setFadeState] = useState("hidden");

  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [invitationLink, setInvitationLink] = useState("");

  const [isLinkSnackbarOpen, setIsLinkSnackbarOpen] = useState(false);
  const [isPromiseDialogOpen, setIsPromiseDialogOpen] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const [pendingTeamId, setPendingTeamId] = useState(null);
  const linkTimeoutRef = useRef(null); // 초대 링크 스낵바 전용
  const messageTimeoutRef = useRef(null); // 메시지 (linkMessage) 스낵바 전용

  // 팀 투표를 위한 추가 변수 코드
  const [myVotes, setMyVotes] = useState([]);
  const [hasDateVotes, setHasDateVotes] = useState(false);
  const [savedVotes, setSavedVotes] = useState([]);
  const [summary, setSummary] = useState([]);
  // const [maxVoteCount, setMaxVoteCount] = useState(0);
  const [bestCandidates, setBestCandidates] = useState([]);

  // 팀 날짜 생성을 위한 추가 변수 코드
  const [selectedDates, setSelectedDates] = useState([]); // 날짜 선택
  const [isDateSaved, setIsDateSaved] = useState(false); // 저장 여부

  // 팀 투표 확정을 위한 추가 변수 코드
  const [confirmVoteData, setConfirmVoteData] = useState([]);

  // state: 게시판 확장 상태
  const [isBoardExpanded, setIsBoardExpanded] = useState(false);

  // 팀 링크 초대 확정을 위한 추가 변수 코드
  const location = useLocation();
  const navigate = useNavigate();
  const { linkMessage, linkStatus, linkTeamId } = location.state || {};
  // 쿼리스트링으로 초기화
  const queryParms = new URLSearchParams(location.search);
  const queryTeamId = queryParms.get("teamId");

  // 팀 카드 미리보기를 위한 추가 변수 코드
  const [selectedCardM, setSelectedCardM] = useState([]);

  // 🔁 팀 리스트 로드
  useEffect(() => {
    const loadTeams = async () => {
      try {
        const res = await fetchTeamList(token);
        const teamList = res.data;
        setTeams(teamList);
        // console.log(teamList[3].id);
        if (teamList.length > 0) {
          const validTeam =
            queryTeamId && teamList.some((t) => t.id === parseInt(queryTeamId));
          if (validTeam) {
            setSelectedTeamId(parseInt(queryTeamId));
          } else if (linkTeamId) {
            setSelectedTeamId(linkTeamId);
          } else {
            setSelectedTeamId(teamList[0].id);
          }
        }
      } catch (error) {
        if (error.response) {
          const status = error.response.status;
          console.error("에러 상태 코드:", status);

          if (status === 401) {
            // 🔐 인증 실패 처리 (예: 로그아웃 또는 로그인 페이지로 리다이렉트)
            console.warn("토큰 만료 또는 인증 실패. 로그인 필요.");
            logout();

            setTeams(status);
            setSelectedTeam(status);
          }
        } else {
          console.error("네트워크 에러 또는 서버 응답 없음:", error.message);
        }
      }
    };
    if (token) loadTeams();
  }, [token]);

  // 새 팀 선택 시 데이터 초기화
  useEffect(() => {
    setSummary([]);
    setMyVotes([]);
    setSavedVotes([]);
  }, [selectedTeamId]);

  useEffect(() => {
    // 하나라도 선택된 항목이 있으면 true
    const result = selectedDates.some((d) => d.length > 0);
    console.log("선택되었는가? : ", result);
    setHasDateVotes(result);
  }, [selectedDates]);

  // 🔁 팀 상세 정보 로드
  useEffect(() => {
    if (teams === 401) return;
    if (selectedTeam === 401) return;

    const loadTeamDetail = async () => {
      if (!selectedTeamId) return;
      try {
        const res = await fetchTeamDetail(selectedTeamId);
        const res_card = await fetchTeamCardM(selectedTeamId);

        setSelectedTeam(res.data);
        console.log(res.data);
        setSelectedCardM(res_card);
        console.log(
          `🐳${selectedTeamId} 팀 카드 미리보기 조회 성공 :`,
          res_card,
        );
      } catch (error) {
        console.error("팀 상세 정보 불러오기 실패", error);
      }
    };
    loadTeamDetail();
  }, [selectedTeamId, token]);

  useEffect(() => {
    const loadVoteData = async () => {
      if (!selectedTeamId || !selectedTeam) return;
      if (!selectedTeam.hasSchedule) return;
      if (selectedTeam === 401) return;
      if (teams === 401) return;

      try {
        const resSum = await fetchTeamVotesSummary(selectedTeamId);
        const resVotes = await fetchTeamMyVotes(selectedTeamId);
        setSummary(resSum.data.summary);
        setMyVotes(resVotes.data.myVotes);
        setSavedVotes(resVotes.data.myVotes); // 저장용도도 초기화
      } catch (err) {
        console.error("투표 정보 불러오기 실패", err);
      }
    };
    loadVoteData();
  }, [selectedTeamId, selectedTeam, token]);

  // ✅ 팀 선택 핸들링
  const handleTeamSelect = (teamId) => {
    if (fadeState === "visible") {
      setFadeState("hiding");
      setPendingTeamId(teamId);
    } else {
      setSelectedTeamId(teamId);
      navigate(`/team?teamId=${teamId}`); // 🔥 쿼리스트링 반영
    }
  };

  // ✅ 초대 링크 클릭 시
  const handleLinkSnackbar = async (teamId) => {
    try {
      const res = await fetchTeamLink(teamId);
      setInvitationLink(res.data.invitationLink || "");
      setIsLinkSnackbarOpen(true);

      if (linkTimeoutRef.current) clearTimeout(linkTimeoutRef.current);
      linkTimeoutRef.current = setTimeout(() => {
        setIsLinkSnackbarOpen(false);
        linkTimeoutRef.current = null;
      }, 3000);
    } catch (error) {
      console.error("초대 링크 가져오기 실패", error);
    }
  };

  // ✅ 팀 생성
  const handleTeamAdd = async (teamName) => {
    try {
      const res = await createTeam(teamName);
      const newTeamId = res.data.id;
      const newTeamres = await fetchTeamList(token);
      const newres = await fetchTeamDetail(newTeamId);
      const newTeamDetail = newres.data;
      console.log(newTeamDetail);
      setTeams(newTeamres.data);
      setSelectedTeamId(newTeamDetail.teamId);
    } catch (error) {
      console.error("팀 생성 실패", error);
    }
  };

  const handlePromiseClick = () => {
    if (fadeState === "visible") return;
    if (selectedTeam?.confirmedDate !== null) return;
    if (selectedTeam.role === "MEMBER" && !selectedTeam.hasSchedule) return;
    console.log(`handlePromiseClick 이거 작동했음`);

    setIsExpanded(true);
    setShowPromiseCheck(true);
    setFadeState("visible");
  };

  const handleListClick = () => {
    if (fadeState !== "visible") return;
    if (selectedTeam?.confirmedDate !== null) return;
    if (selectedTeam.role === "MEMBER" && !selectedTeam.hasSchedule) return;

    setFadeState("hiding");
  };

  const onFadeTransitionEnd = (e) => {
    if (e.propertyName !== "opacity") return;
    if (fadeState === "hiding") {
      setIsExpanded(false);
      setFadeState("hidden");
      if (pendingTeamId !== null) {
        setSelectedTeamId(pendingTeamId);
        setPendingTeamId(null);
      }
    }
  };

  const openPromiseDialog = async () => {
    const bestCandidates = await fetchMaxCandidates(selectedTeamId);
    setBestCandidates(bestCandidates.data.results);
    setIsPromiseDialogOpen(true);
  };
  const closePromiseDialog = () => setIsPromiseDialogOpen(false);

  // 확정했을 때의 코드
  const confirmPromiseDialog = async (data) => {
    console.log(data);
    await fetchScheduleConfirm(selectedTeamId, data);
    // 🔁 확정 후 팀 상세 정보 다시 불러오기
    const res = await fetchTeamDetail(selectedTeamId);
    setSelectedTeam(res.data);

    setFadeState("hidden");
    setIsExpanded(false);

    setIsPromiseDialogOpen(false);
  };

  const handleSaveDate = async () => {
    const res = await fetchTeamVoteCreate(selectedTeamId, selectedDates);

    setSummary(res.data.summary);
    setMyVotes(res.data.myVotes);

    setIsDateSaved(false);
  };

  const handleSaveTime = () => {
    setFadeState("hidden");
    setIsExpanded(false);
  };

  // 토글 함수
  const toggleBoardExpand = () => {
    setIsBoardExpanded((prev) => !prev);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isBoardExpanded) {
          setIsBoardExpanded(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isBoardExpanded]);

  // ✅ 메시지 (linkMessage) 스낵바
  const handleSnackbar = () => {
    setIsSnackbarOpen(true);

    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    messageTimeoutRef.current = setTimeout(() => {
      setIsSnackbarOpen(false);
      clearLocationState();
      messageTimeoutRef.current = null;
    }, 3000);
  };

  // ✅ 확인 버튼 눌러서 닫기
  const handleCloseSnackbar = () => {
    console.log("아니 버튼 누르는중.");
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = null;
    }
    setIsSnackbarOpen(false);
    clearLocationState();
  };

  const clearLocationState = () => {
    navigate(location.pathname, { replace: true, state: null });
  };

  useEffect(() => {
    if (linkMessage) {
      handleSnackbar();
    }
  }, [linkMessage]);

  return (
    <>
      {console.log("✅ [Team.js] isBoardExpanded:", isBoardExpanded)}
      {console.log("✅ [Team.js] selectedTeam:", selectedTeam)}
      {console.log(
        "✅ selectedTeam.confirmedDate:",
        selectedTeam?.confirmedDate,
      )}
      <div className={st.Team_container}>
        <section className={st.Team_section1}>
          <div
            className={`${st.box} ${st.team_board_box} ${
              isBoardExpanded ? st.promExpandedBoard : ""
            }`}
          >
            {selectedTeam && teams !== 401 ? (
              <Board
                team={selectedTeam}
                isBoardExpanded={isBoardExpanded}
                onToggleExpand={toggleBoardExpand}
                onCloseExpand={() => setIsBoardExpanded(false)}
              />
            ) : (
              <div></div>
            )}
          </div>
          <div className={st.card_message_wrapper}>
            <div className={`${st.box} ${st.team_card_box}`}>
              {selectedTeam && teams !== 401 ? (
                <CardM card={selectedCardM} team={selectedTeam} />
              ) : (
                // TODO: card 데이터 별도 조회 필요 시 fetchTeamCard 추가 필요
                <div></div>
              )}
            </div>
            <div className={`${st.box} ${st.team_message_box}`}>
              {selectedTeam && teams !== 401 ? (
                <Massage team={selectedTeam} />
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </section>

        <section className={st.Team_section2}>
          <div
            className={`${st.box} ${st.team_promise_box} ${isExpanded && selectedTeam?.confirmedDate === null ? (selectedTeam.role === "MEMBER" && !selectedTeam.hasSchedule ? "" : selectedTeam.confirmedDate ? "" : st.promExpanded) : ""}`}
            onClick={handlePromiseClick}
          >
            {selectedTeam && teams !== 401 ? (
              <Promise
                team={selectedTeam}
                teamCreateDate={selectedTeam.createdAt}
                goalDate={selectedTeam.confirmedDate}
              />
            ) : (
              <div></div>
            )}

            <div
              className={`${st.fadeWrap} ${fadeState === "visible" ? (selectedTeam.role === "MEMBER" && !selectedTeam.hasSchedule ? st.hide : selectedTeam.confirmedDate ? st.hide : st.show) : st.hide}`}
              style={{
                display:
                  fadeState === "hidden"
                    ? "none"
                    : selectedTeam.role === "MEMBER" &&
                        !selectedTeam.hasSchedule
                      ? "none"
                      : selectedTeam?.confirmedDate
                        ? "none"
                        : "block",
              }}
              onTransitionEnd={onFadeTransitionEnd}
            >
              {selectedTeam && teams !== 401 ? (
                <PromiseCheck2
                  team={selectedTeam}
                  setSelectedTeam={setSelectedTeam}
                  handleSaveTime={handleSaveTime}
                  summary={summary}
                  myVotes={myVotes}
                  setMyVotes={setMyVotes}
                  hasDateVotes={hasDateVotes}
                  savedVotes={savedVotes}
                  setSavedVotes={setSavedVotes}
                  setSummary={setSummary}
                  openPromiseDialog={openPromiseDialog}
                  selectedDates={selectedDates}
                  setSelectedDates={setSelectedDates}
                  isDateSaved={isDateSaved}
                  onSaveDate={handleSaveDate}
                />
              ) : (
                <div></div>
              )}
            </div>
          </div>

          <div
            className={`${st.box} ${st.team_list_box} ${isExpanded && selectedTeam?.confirmedDate === null ? (selectedTeam.role === "MEMBER" && !selectedTeam.hasSchedule ? "" : selectedTeam?.confirmedDate ? "" : st.listShrinked) : ""}`}
            onClick={handleListClick}
          >
            <Teamlist
              teams={teams}
              onTeamAdd={handleTeamAdd}
              onLinkClick={handleLinkSnackbar}
              onTeamCheckClick={handleTeamSelect}
              selectedTeamId={selectedTeamId}
            />
          </div>
        </section>
      </div>
      {isLinkSnackbarOpen && <LinkSnackbar link={invitationLink} />}
      {isPromiseDialogOpen && (
        <PromiseDialog
          bestCandidates={bestCandidates}
          onConfirm={confirmPromiseDialog}
          onCancel={closePromiseDialog}
          setConfirmVoteData={setConfirmVoteData}
        />
      )}
      {isSnackbarOpen && linkMessage && (
        <Snackbar
          text={linkMessage}
          buttontext="확인"
          buttonOnclick={handleCloseSnackbar} // ✅ 오타 수정 및 핸들러 연결
        />
      )}
    </>
  );
};

export default Team;
