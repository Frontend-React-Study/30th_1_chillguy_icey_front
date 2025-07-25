import st from "./CardM.module.css";
import Img from "../../assets/exPig.png";
import { useNavigate } from "react-router-dom";

const CardM = ({ card, team }) => {
  const navigate = useNavigate();

  const handleCardMClick = () => {
    navigate("/mycard", { state: team });
  };

  if (!team) return null;
  // console.log("team.card 확인", card);

  return (
    <div className={st.CardM_content} onClick={handleCardMClick}>
      <div className={st.cardM_img_background}>
        <img className={st.cardM_img} src={Img} alt="" />
      </div>
      <div className={st.cardM_board}>
        <div className={st.cardM_text}>{card.name}</div>
        <div className={st.cardM_text}>{card.mbti}</div>
        <div className={st.cardM_text}>{card.hobby}</div>
        <div className={st.cardM_text}>{card.secret}</div>
        <div className={st.cardM_text}>{card.tmi}</div>
      </div>
    </div>
  );
};

export default CardM;
