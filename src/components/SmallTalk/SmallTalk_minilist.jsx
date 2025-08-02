import st from "./SmallTalk_minilist.module.css";
// useNavigate는 Minilist에서 직접 사용되지 않고, SmallTalk에서 전달받은 onViewAllClick을 통해 사용됩니다.
// import { useNavigate } from "react-router-dom";

// Minilist 컴포넌트: 스몰톡의 간략한 질문 목록을 표시하고, '전체 보기' 버튼을 제공합니다.
const Minilist = ({ smallTalks, onViewAllClick }) => {
  // smallTalks prop 이름은 유지하되, 필터링된 데이터가 들어옴
  // '전체 보기' 버튼 클릭 핸들러
  const onClickButton = () => {
    if (onViewAllClick) {
      onViewAllClick(); // 전달받은 onViewAllClick 함수 호출 (EditSmall로 이동)
    }
    console.log("전체 보기 버튼 클릭됨");
  };

  // smallTalks prop이 유효한 배열인지 확인합니다.
  if (!smallTalks || !Array.isArray(smallTalks) || smallTalks.length === 0) {
    return (
      <div className={st.div}>
        <div className={st.content}>
          <div className={st.emptyMessage}>
            선택된 스몰톡의 내용이 없습니다.
          </div>
        </div>
        <button className={st.button} onClick={onClickButton}>
          <div className={st.viewall}>전체 보기</div>
        </button>
      </div>
    );
  }

  return (
    <div className={st.div}>
      <div className={st.content}>
        {/* smallTalks 배열을 순회하며 각 항목의 question을 렌더링합니다. */}
        {smallTalks.map((talk, index) => (
          <div key={talk.id || index} className={st.text}>
            {" "}
            {/* 고유한 key prop 사용 */}
            <div className={st.textarea}>{talk.question}</div>
          </div>
        ))}
      </div>
      <button className={st.button} onClick={onClickButton}>
        <div className={st.viewall}>전체 보기</div>
      </button>
    </div>
  );
};

export default Minilist;
