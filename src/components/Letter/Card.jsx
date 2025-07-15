import st from "./Card.module.css";

// Props
// data: 명함 정보
// teams: 해당 명함 팀 정보
// onLetterModal: 쪽지 보내기 클릭 핸들러
// showSendButton: "쪽지 보내기" 버튼 표시 여부
// selectable: 명함 선택 가능 여부
// isSelected: 현재 명함이 선택된 명함인지 여부
// onClick: 명함 클릭 시 콜백 함수

const Card = ({
  data,
  teams = [],
  onLetterModal,
  showSendButton,
  selectable = false,
  isSelected = false,
  onClick,
}) => {
  // 해당 명함을 사용 중인 팀 목록
  // "칠가이 외 3" 형식으로 표시
  const renderTeams = () => {
    if (teams.length === 0) return null;
    if (teams.length === 1) return teams[0];
    return `${teams[0]} 외 ${teams.length - 1}`;
  };

  return (
    <div
      className={`${st.Card} ${isSelected ? st.SelectedCard : ""}`}
      onClick={selectable ? onClick : undefined}
    >
      {/* 명함 이름 */}
      <div className={st.Card_Name}>{data.name}</div>
      <div className={st.Card_Wrapper}>
        {/* 명함 이미지 */}
        <div className={st.Card_image}></div>
        {/* 명함 상세 정보 */}
        <div className={st.Card_info}>
          <div className={st.InfoLabel}>MBTI: {data.mbti}</div>
          <div className={st.InfoLabel}>취미: {data.hobby}</div>
          <div className={st.InfoLabel}>친해지는 비법: {data.secret}</div>
          <div className={st.InfoLabel}>TMI: {data.tmi}</div>
        </div>
      </div>

      <div>
        {showSendButton ? (
          // 쪽지 보내기 버튼
          <button
            className={st.Send_button}
            onClick={(e) => {
              e.stopPropagation(); // 선택 이벤트와 충돌 방지
              onLetterModal(); // 쪽지 작성 모달 LetterModal 열기
            }}
          >
            쪽지 보내기 →
          </button>
        ) : (
          // 팀명 표시
          <div className={st.TeamName}>{renderTeams()}</div>
        )}
      </div>
    </div>
  );
};

export default Card;
