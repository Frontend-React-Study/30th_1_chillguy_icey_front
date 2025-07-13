import "./Card.css";

const Card = () => {
  return (
    <div className="Card">
      <div className="Card-Name">발랄한 고양이</div>
      <div className="Card-image"></div>
      <div>
        <button className="Send-button">쪽지 보내기 → </button>
      </div>
    </div>
  );
};

export default Card;
