import ReceivedLetter from "../components/ReceivedLetter";
import CardList from "../components/CardList";
import Card from "../components/Card";
import "./Letter.css";

const Letter = () => {
  return (
    <div className="Letter-body">
      <div className="Letter-list">
        <ReceivedLetter />
        <ReceivedLetter />
        <ReceivedLetter />
        <ReceivedLetter />
        <ReceivedLetter />
        <ReceivedLetter />
        <ReceivedLetter />
        <ReceivedLetter />
        <ReceivedLetter />
        <ReceivedLetter />
        <ReceivedLetter />
      </div>
      <CardList>
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

export default Letter;
