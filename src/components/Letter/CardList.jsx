import Card from "./Card";
import add_card from "../../assets/add_card.svg";
import st from "./CardList.module.css";

const CardList = ({
  cards,
  onSendClick,
  showAddButton = false,
  onAddClick,
  showSendButton = true,
  teamsData = [],
  selectable = false,
  selectedCardIndex,
  onCardClick = () => {},
}) => {
  return (
    <div className={st.List}>
      {cards.map((card, index) => (
        <Card
          key={index}
          data={card}
          onOpenModal={showSendButton ? () => onSendClick(card) : null}
          teams={teamsData?.[index] || []}
          selectable={selectable}
          isSelected={selectedCardIndex === index}
          onClick={() => onCardClick?.(index)}
        />
      ))}
      {showAddButton && (
        <button className={st.Add_card_button} onClick={onAddClick}>
          <img className={st.Add_card_img} src={add_card} alt="add_card" />
        </button>
      )}
    </div>
  );
};

export default CardList;
