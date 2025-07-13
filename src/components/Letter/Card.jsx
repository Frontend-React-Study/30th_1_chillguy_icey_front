import st from "./Card.module.css";

const Card = ({
  data,
  onOpenModal,
  showSendButton,
  teams = [],
  selectable = false,
  isSelected = false,
  onClick,
}) => {
  // 해당 명함을 사용 중인 팀 목록
  const renderTeams = () => {
    if (teams.length === 0) return null; // 혹은 "사용 중인 팀 없음"
    if (teams.length === 1) return teams[0];
    return `${teams[0]} 외 ${teams.length - 1}`;
  };

  return (
    <div className={st.Card} onClick={selectable ? onClick : undefined}>
      <div className={st.Card_Name}>{data.name}</div>
      <div className={st.Card_Wrapper}>
        <div className={st.Card_image}></div>
        <div className={st.Card_info}>
          <div className={st.InfoLabel}>MBTI: {data.mbti}</div>
          <div className={st.InfoLabel}>취미: {data.hobby}</div>
          <div className={st.InfoLabel}>친해지는 비법: {data.secret}</div>
          <div className={st.InfoLabel}>TMI: {data.tmi}</div>
        </div>
      </div>

      <div>
        {showSendButton ? (
          <button
            className={st.Send_button}
            onClick={(e) => {
              e.stopPropagation(); // 선택 이벤트와 충돌 방지
              onOpenModal();
            }}
          >
            쪽지 보내기 →
          </button>
        ) : (
          <div className={st.TeamName}>{renderTeams()}</div>
        )}
      </div>
    </div>
  );
};

export default Card;
