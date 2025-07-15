import "./ReceivedLetter.css";
import envelope from "../assets/envelope.svg";

const ReceivedLetter = () => {
  return (
    <div className="Receiced-letter">
      <div className="Envelop-wrapper">
        <img className="Envelope-logo" src={envelope} alt="envelope" />
        <div className="Unread"></div>
      </div>
      <div className="From">FROM. 멋진 여우</div>
    </div>
  );
};

export default ReceivedLetter;
