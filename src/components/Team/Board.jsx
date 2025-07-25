import { useState, useEffect } from "react";
import axios from "axios";
import st from "./Board.module.css";
import MemoEdit from "../Memo/MemoEdit";
import Memo from "../Memo/Memo";
import Balance from "../Memo/Balance";

import board_menu from "../../assets/board_menu.svg";
import wide from "../../assets/board_wide.svg";
import memo_add from "../../assets/board_memo_add.svg";
import balance_add from "../../assets/board_balance_add.svg";

const Board = ({ team }) => {
  // state: 메모 삭제 함수에 사용됨
  const [memos, setMemos] = useState([]);
  // state: 수정할 메모 저장
  const [editingMemo, setEditingMemo] = useState(null);
  // state: 메모 작성 열 때 사용됨
  const [isMemoEditOpen, setIsMemoEditOpen] = useState(false);
  // state: 밸런스 게임 상태
  const [balanceGames, setBalanceGames] = useState([]);
  // state: 메뉴 토글에 사용됨
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // 전체 메모 목록 불러오기
    const fetchMemos = async () => {
      try {
        const res = await axios.get(`/api/teams/${team.id}/memos`);
        console.log("res.data =", res.data);

        const memoList = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
            ? res.data.data
            : [];
        setMemos(memoList); // 서버에서 받은 메모 배열로 설정
      } catch (err) {
        console.error("메모 목록 불러오기 실패", err);
      }
    };

    // 전체 밸런스 게임 목록 불러오기
    const fetchBalanceGames = async () => {
      try {
        const res = await axios.get(`/api/teams/${team.id}/balance-game`);
        const balanceList = res.data?.data ?? [];
        setBalanceGames(balanceList);
      } catch (error) {
        console.error("밸런스 게임 목록 불러오기 실패", error);
      }
    };

    fetchMemos();
    fetchBalanceGames();
  }, [team.id]);

  // MemoEdit 여는 함수 (memo가 있으면 수정, 없으면 새로 추가)
  const openMemoEdit = (memo = null) => {
    setEditingMemo(memo);
    setIsMemoEditOpen(true);
  };

  // MemoEdit 닫는 함수
  const closeMemoEdit = () => {
    setIsMemoEditOpen(false);
    setEditingMemo(null);
  };

  // 메모 저장 성공 시 호출되는 함수
  const handleMemoSave = (savedMemo) => {
    setMemos((prev) => {
      const exists = prev.some((m) => m.memoId === savedMemo.memoId);
      if (exists) {
        return prev.map((m) => (m.memoId === savedMemo.memoId ? savedMemo : m));
      } else {
        return [savedMemo, ...prev];
      }
    });
    closeMemoEdit();
  };

  // 메모 삭제 함수
  const handleDeleteMemo = async (teamId, memoId) => {
    try {
      await axios.delete(`/api/teams/${teamId}/memos/${memoId}`);
      setMemos((prev) => prev.filter((memo) => memo.memoId !== memoId));
    } catch (error) {
      console.error("메모 삭제 실패", error);
      alert("삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 밸런스 게임 생성
  const handleAddBalance = async () => {
    try {
      const res = await axios.post(
        `/api/teams/${team.id}/balance-game/generate`,
      );
      const newGame = res.data?.data;
      if (newGame) {
        setBalanceGames((prev) => [...prev, newGame]);
      }
    } catch (error) {
      console.error("밸런스 게임 생성 실패", error);
      alert("밸런스 게임 생성에 실패했습니다.");
    }
  };

  // 밸런스 게임 삭제
  const handleBalanceDelete = async (gameId) => {
    try {
      await axios.delete(`/api/teams/${team.id}/balance-game/${gameId}/delete`);
      // 삭제 후 상태 업데이트
      setBalanceGames((prev) => prev.filter((game) => game.id !== gameId));
    } catch (error) {
      console.error("밸런스 게임 삭제 실패", error);
      alert("밸런스 게임 삭제에 실패했습니다.");
    }
  };

  // 밸런스 게임 투표
  const handleBalanceVote = async (gameId, option) => {
    try {
      await axios.post(`/api/teams/${team.id}/balance-game/${gameId}/vote`, {
        option,
      });
      // 투표 후 최신 목록 다시 불러오기
      const res = await axios.get(`/api/teams/${team.id}/balance-game`);
      const data = res.data?.data || [];
      setBalanceGames(data);
    } catch (error) {
      console.error("밸런스 게임 투표 실패", error);

      // 중복 투표 에러 메시지 분기
      if (
        error.response?.status === 400 &&
        error.response.data?.message === "투표는 1회만 가능합니다."
      ) {
        // 중복 투표인 경우
        throw new Error("이미 투표하셨습니다!");
      } else {
        // 그 외 에러는 alert
        alert("투표에 실패했습니다.");
        throw error;
      }
    }
  };

  // 게시판 메뉴 토글 버튼
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className={st.Board_content}>
      <div className={st.board_team_box}>
        <div className={st.board_team_name}>{team.teamName}</div>
        <div className={st.board_team_number}>
          |&nbsp;&nbsp;&nbsp;총 {team.memberCount}명
        </div>
      </div>

      <div className={st.board_team_notice}>
        <div className={st.board_wrapper}>
          {memos.map((memo) => (
            <Memo
              key={memo.memoId}
              teamId={team.id}
              memoId={memo.memoId}
              onDelete={handleDeleteMemo}
              onEdit={() =>
                openMemoEdit({ memoId: memo.memoId, teamId: team.id })
              }
            />
          ))}
          {balanceGames.map((game) => (
            <Balance
              key={game.id}
              gameId={game.id}
              option1={game.option1}
              option1Count={game.option1Count}
              option2={game.option2}
              option2Count={game.option2Count}
              totalVotes={game.totalVotes}
              onDelete={() => handleBalanceDelete(game.id)}
              onVote={(option) => handleBalanceVote(game.id, option)}
            />
          ))}
        </div>

        <div className={st.Menu_container}>
          {menuOpen && (
            <div className={st.Menu_buttons}>
              <button
                className={st.Menu_item}
                onClick={() => openMemoEdit(null)}
              >
                <img src={memo_add} alt="메모" />
              </button>
              <button className={st.Menu_item} onClick={handleAddBalance}>
                <img src={balance_add} alt="밸런스 게임" />
              </button>
              <button className={st.Menu_item}>
                <img src={wide} alt="확대" />
              </button>
            </div>
          )}
          {/* 메뉴 토글 버튼 */}
          <button
            className={`${st.Menu_toggle} ${menuOpen ? st.rotate : ""}`}
            onClick={toggleMenu}
          >
            <img src={board_menu} alt="게시판 메뉴" />
          </button>
        </div>

        {isMemoEditOpen && (
          <MemoEdit
            teamId={team.id}
            editingMemo={editingMemo} // 수정 시 내용 전달, 새로 추가 시 null
            onSave={handleMemoSave}
            onClose={closeMemoEdit} // 닫기 함수 전달
          />
        )}
      </div>
    </div>
  );
};

export default Board;
