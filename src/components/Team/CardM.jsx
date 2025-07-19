import st from "./CardM.module.css";
import Img from "../../assets/exPig.png";
import { useNavigate } from "react-router-dom";

const CardM = ({ team }) => {
  const navigate = useNavigate();

  const handleCardMClick = () => {
    navigate("/mycard");
  };

  if (!team || !team.card) return null;

  return (
    <div className={st.CardM_content} onClick={handleCardMClick}>
      <div className={st.cardM_img_background}>
        <img className={st.cardM_img} src={Img} alt="" />
      </div>
      <div className={st.cardM_board}>
        <div className={st.cardM_text}>{team.card.name}</div>
        <div className={st.cardM_text}>{team.card.mbti}</div>
        <div className={st.cardM_text}>{team.card.hobby}</div>
        <div className={st.cardM_text}>{team.card.secret}</div>
        <div className={st.cardM_text}>{team.card.tmi}</div>
      </div>
    </div>
  );
};

export default CardM;
