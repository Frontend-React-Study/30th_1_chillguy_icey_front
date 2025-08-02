import st from "./CardM.module.css";
import { useNavigate } from "react-router-dom";

const CardM = ({ card, team }) => {
  const navigate = useNavigate();

  const handleCardMClick = () => {
    const teamId = team.teamId;
    const teamName = team.teamName;
    navigate(
      `/mycard?teamId=${teamId}&teamName=${encodeURIComponent(teamName)}`,
    );
  };

  const colorMap = {
    빨강: 1,
    주황: 2,
    노랑: 3,
    초록: 4,
    파랑: 5,
    남색: 6,
    보라: 7,
    검정: 8,
    하양: 9,
    회색: 10,
  };

  const animalMap = {
    강아지: "dog",
    고양이: "cat",
    곰: "bear",
    개구리: "frog",
    돼지: "pig",
    토끼: "rabbit",
  };
  const accessoryMap = { BASIC: "animal", RIBBON: "ribbon", STAR: "star" };
  const images = import.meta.glob("/src/assets/animal/*.svg", { eager: true });

  const pickAnimalImg = () => {
    if (!card || !card.animal || !card.profileColor) return null;

    const fileName = `${accessoryMap[card.accessory]}_${animalMap[card.animal]}${colorMap[card.profileColor]}.svg`;
    const imagePath = images[`/src/assets/animal/${fileName}`];

    return (
      <div className={st.cardM_img_background}>
        <img
          className={st.cardM_img}
          src={imagePath?.default || imagePath}
          alt=""
        />
      </div>
    );
  };

  if (!team) return null;

  return (
    <div className={st.CardM_all_content}>
      <div className={st.CardM_content} onClick={handleCardMClick}>
        {/* <div className={st.cardM_img_background}>
        <img className={st.cardM_img} src={pickAnimalImg()} alt="" />
      </div> */}
        {pickAnimalImg()}
        <div className={st.cardM_vline}></div>
        <div className={st.cardM_board}>
          <div className={st.cardM_text}>{card.nickname}</div>
          <div className={st.cardM_text}>{card.mbti}</div>
          <div className={st.cardM_text}>{card.hobby}</div>
          <div className={st.cardM_text}>{card.secretTip}</div>
          <div className={st.cardM_text}>{card.tmi}</div>
        </div>
      </div>
    </div>
  );
};

export default CardM;
