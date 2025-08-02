import { useState, useEffect } from "react";
import st from "./Board.module.css";
import MemoEdit from "../Memo/MemoEdit";
import Memo from "../Memo/Memo";
import Balance from "../Memo/Balance";

import board_menu from "../../assets/board_menu.svg";
import wide from "../../assets/board_wide.svg";
import memo_add from "../../assets/board_memo_add.svg";
import balance_add from "../../assets/board_balance_add.svg";
import memo_add_disable from "../../assets/memo_add_disable.svg";
import balance_add_disable from "../../assets/balance_add_disable.svg";
import board_narrow from "../../assets/board_narrow.svg";

import {
  fetchMemos,
  deleteMemo,
  fetchBalanceGames,
  createBalanceGame,
  deleteBalanceGame,
  voteBalanceGame,
  fetchBalanceGameResult,
} from "../../util/BoardDataAPI";

const Board = ({ team, isBoardExpanded, onToggleExpand }) => {
  const [memos, setMemos] = useState([]);
  const [editingMemo, setEditingMemo] = useState(null);
  const [isMemoEditOpen, setIsMemoEditOpen] = useState(false);
  const [balanceGames, setBalanceGames] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const isLimitReached = memos.length + balanceGames.length >= 18;

  useEffect(() => {
    if (!team?.teamId) return;

    const loadData = async () => {
      try {
        const [memoList, balanceList] = await Promise.all([
          fetchMemos(team.teamId),
          fetchBalanceGames(team.teamId),
        ]);
        setMemos(memoList);
        setBalanceGames(balanceList);
      } catch (err) {
        console.error("게시판 데이터 로딩 실패", err);
      }
    };

    loadData();
  }, [team?.teamId]);

  const openMemoEdit = (memo = null) => {
    if (!memo && isLimitReached) {
      alert(
        "게시판에는 메모와 밸런스 게임을 합쳐 최대 18개까지만 생성할 수 있습니다.",
      );
      return;
    }
    setEditingMemo(memo);
    setIsMemoEditOpen(true);
  };

  const closeMemoEdit = () => {
    setIsMemoEditOpen(false);
    setEditingMemo(null);
  };

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

  const handleDeleteMemo = async (teamId, memoId) => {
    try {
      await deleteMemo(teamId, memoId);
      setMemos((prev) => prev.filter((memo) => memo.memoId !== memoId));
    } catch (error) {
      console.error("메모 삭제 실패", error);
      alert("삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleAddBalance = async () => {
    if (isLimitReached) {
      alert(
        "게시판에는 메모와 밸런스 게임을 합쳐 최대 18개까지만 생성할 수 있습니다.",
      );
      return;
    }
    if (balanceGames.length >= 2) {
      alert("밸런스 게임은 최대 2개까지만 생성할 수 있습니다.");
      return;
    }
    try {
      const newGame = await createBalanceGame(team.teamId);
      if (newGame) setBalanceGames((prev) => [...prev, newGame]);
      // 최신 목록 재조회
      const balanceList = await fetchBalanceGames(team.teamId);
      setBalanceGames(balanceList);
    } catch (error) {
      console.error("밸런스 게임 생성 실패", error);
      alert("밸런스 게임 생성에 실패했습니다.");
    }
  };

  const handleBalanceDelete = async (gameId) => {
    try {
      await deleteBalanceGame(team.teamId, gameId);
      setBalanceGames((prev) => prev.filter((game) => game.id !== gameId));
    } catch (error) {
      console.error("밸런스 게임 삭제 실패", error);
      alert("밸런스 게임 삭제에 실패했습니다.");
    }
  };

  const handleBalanceVote = async (gameId, selectedOption) => {
    try {
      await voteBalanceGame(team.teamId, gameId, selectedOption);
      const data = await fetchBalanceGames(team.teamId);
      setBalanceGames(data);
    } catch (error) {
      console.error("밸런스 게임 투표 실패", error);

      if (
        error.response?.status === 400 &&
        error.response.data?.message === "투표는 1회만 가능합니다."
      ) {
        throw new Error("이미 투표하셨습니다!");
      } else {
        alert("투표에 실패했습니다.");
        throw error;
      }
    }
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const toggleExpand = () => {
    if (onToggleExpand) onToggleExpand();
  };

  if (!team?.teamId) return <div>로딩 중...</div>;

  const combinedItems = [...memos, ...balanceGames].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const getVoteResult = (gameId) => {
    return fetchBalanceGameResult(team.teamId, gameId);
  };

  return (
    <div className={st.Board_content}>
      <div
        className={`${st.board_team_box} ${isBoardExpanded ? st.expanded : ""}`}
      >
        <div className={st.board_team_name}>{team.teamName}</div>
        <div className={st.board_team_number}>
          |&nbsp;&nbsp;&nbsp;총 {team.memberCount}명
        </div>
      </div>

      <div className={st.board_team_notice}>
        <div
          className={`${st.board_wrapper} ${isBoardExpanded ? st.expanded : ""}`}
        >
          {combinedItems.map((item) => {
            if (item.memoId !== undefined) {
              return (
                <Memo
                  key={`memo-${item.memoId}`}
                  teamId={team.teamId}
                  memoId={item.memoId}
                  memo={item}
                  onDelete={handleDeleteMemo}
                  onEdit={() => openMemoEdit(item)}
                />
              );
            } else if (item.id !== undefined) {
              return (
                <Balance
                  key={`balance-${item.id}`}
                  gameId={item.id}
                  option1={item.option1}
                  option1Count={item.option1Count}
                  option2={item.option2}
                  option2Count={item.option2Count}
                  totalVotes={item.totalVotes}
                  onDelete={() => handleBalanceDelete(item.id)}
                  onVote={(gameId, selectedOption) =>
                    handleBalanceVote(gameId, selectedOption)
                  }
                  teamMemberCount={team.memberCount}
                  getVoteResult={getVoteResult}
                  userSelectedOption={item.userSelectedOption}
                />
              );
            }
            return null;
          })}
        </div>

        <div className={st.Menu_container}>
          {menuOpen && (
            <div className={st.Menu_buttons}>
              <button
                className={st.Menu_item}
                onClick={() => {
                  if (!isLimitReached) openMemoEdit(null);
                }}
                disabled={isLimitReached}
              >
                <img
                  src={isLimitReached ? memo_add_disable : memo_add}
                  alt="메모"
                />
              </button>
              <button
                className={st.Menu_item}
                onClick={() => {
                  if (!isLimitReached) handleAddBalance();
                }}
                disabled={isLimitReached}
              >
                <img
                  src={isLimitReached ? balance_add_disable : balance_add}
                  alt="밸런스 게임"
                />
              </button>
              <button className={st.Menu_item} onClick={toggleExpand}>
                <img
                  src={isBoardExpanded ? board_narrow : wide}
                  alt={isBoardExpanded ? "축소" : "확대"}
                />
              </button>
            </div>
          )}
          <button
            className={`${st.Menu_toggle} ${menuOpen ? st.rotate : ""}`}
            onClick={toggleMenu}
          >
            <img src={board_menu} alt="게시판 메뉴" />
          </button>
        </div>

        {isMemoEditOpen && (
          <MemoEdit
            teamId={team.teamId}
            editingMemo={editingMemo}
            onSave={handleMemoSave}
            onClose={closeMemoEdit}
          />
        )}
      </div>
    </div>
  );
};

export default Board;
