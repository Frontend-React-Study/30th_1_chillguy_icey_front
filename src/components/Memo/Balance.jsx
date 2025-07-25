import { useState } from "react";
import st from "./Balance.module.css";

import balance_line from "../../assets/memo_line.svg";
import balance_delete from "../../assets/memo_delete.svg";
import balance_vs from "../../assets/balance_vs.svg";
import balance_button from "../../assets/balance_button.svg";

// Props
// onDelete: 삭제 버튼 클릭 시 호출 함수 (팀페이지에 작성)

const Balance = ({
  gameId,
  option1,
  option1Count,
  option2,
  option2Count,
  onDelete,
  onVote,
}) => {
  // state: 투표 여부 상태
  const [hasVoted, setHasVoted] = useState(false);

  // 투표 버튼 클릭 시 호출
  const handleVote = async (option) => {
    if (hasVoted) return;

    try {
      if (onVote) {
        await onVote(gameId, option);
        setHasVoted(true);
      }
    } catch (err) {
      alert(err.message || "투표 중 오류가 발생했습니다.");
    }
  };

  // 삭제 클릭 시 이벤트 버블링 방지
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(gameId);
    }
  };

  return (
    <div className={st.Balance}>
      {/* 도구 영역 (삭제 버튼) */}
      <div className={st.Balance_tools}>
        <img
          className={st.Balance_delete_img}
          src={balance_delete}
          alt="밸런스 게임 삭제 버튼"
          onClick={handleDeleteClick}
        />
      </div>
      <img className={st.Balance_line_img} src={balance_line} alt="구분선" />

      {/* 밸런스 게임 버튼 영역 */}
      <div className={st.Button_wrapper}>
        {/* 첫 번째 선택지 */}
        <button
          className={st.Balance_button}
          onClick={() => handleVote("option1")}
          disabled={hasVoted}
        >
          <img
            className={st.Balance_button_img}
            src={balance_button}
            alt="투표 버튼 이미지"
          />
          <span className={`${st.Balance_count} ${st.one}`}>
            {option1Count}
          </span>
          <span className={st.Balance_text}>{option1}</span>
        </button>

        {/* vs 이미지 */}
        <img className={st.Balance_vs_img} src={balance_vs} alt="balance_vs" />

        {/* 두 번째 선택지 */}
        <button
          className={st.Blance_button}
          onClick={() => handleVote("option2")}
          disabled={hasVoted}
        >
          <img
            className={st.Balance_button_img}
            src={balance_button}
            alt="투표 버튼 이미지"
          />
          <span className={`${st.Balance_count} ${st.two}`}>
            {option2Count}
          </span>
          <span className={st.Balance_text}>{option2}</span>
        </button>
      </div>
    </div>
  );
};

export default Balance;
