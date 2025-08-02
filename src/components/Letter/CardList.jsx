import Card from "./Card";
import add_card from "../../assets/add_card.svg";
import st from "./CardList.module.css";

// Props
// cards: 카드 데이터
// teamsData: 각 카드가 속한 팀 데이터
// onSendClick: "쪽지 보내기" 버튼 클릭 핸들러
// onAddClick: "명함 추가하기" 버튼 클릭 시 모달 오픈
// showSendButton: "쪽지 보내기" 버튼 표시 여부
// showAddButton: "명함 추가하기" 버튼 표시 여부
// selectable: 카드 선택 가능 여부
// selectedCardIndex: 현재 선택된 카드 인덱스
// onCardClick: 카드 클릭 시 콜백 함수

const CardList = ({
  cards,
  onSendClick,
  onAddClick,
  showSendButton = true,
  showAddButton = false,
  selectable = false,
  selectedCardId,
  onCardClick = () => {},
  currentTeamName,
  onSelectTeam,
  currentCardId,
}) => {
  return (
    <div className={st.List}>
      {cards.map((card) => {
        return (
          <Card
            key={card.cardId}
            data={card}
            teams={card.teams || []}
            showSendButton={showSendButton}
            onLetterModal={showSendButton ? () => onSendClick(card) : null}
            selectable={selectable}
            isSelected={selectedCardId === card.cardId}
            onClick={() => onCardClick?.(card.cardId)}
            currentTeamName={currentTeamName}
            onSelectTeam={(teamName) => onSelectTeam(card.cardId, teamName)}
            isCurrentCard={card.cardId === currentCardId}
          />
        );
      })}

      {/* 명함 추가 버튼 */}
      {showAddButton && (
        <button className={st.Add_card_button} onClick={onAddClick}>
          <img className={st.Add_card_img} src={add_card} alt="add_card" />
        </button>
      )}
    </div>
  );
};

export default CardList;
