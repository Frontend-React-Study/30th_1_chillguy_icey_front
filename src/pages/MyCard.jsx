import CardList from "../components/CardList";
import Card from "../components/Card";
import "./MyCard.css";

const MyCard = () => {
  return (
    <div className="Card-body">
      <div className="TitleSection">
        <div className="Title">나의 명함 보기</div>
        <div className="SubTitle">Card Category</div>
      </div>
      <CardList>
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </CardList>
    </div>
  );
};

export default MyCard;
