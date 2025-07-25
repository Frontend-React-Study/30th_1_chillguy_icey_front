import st from "./MemoLike.module.css";
import { getAnimalImage } from "../../util/get-animal-image";
import exPig from "../../assets/exPig.png";

const MemoLike = ({ users = [] }) => {
  // 동물 이름 매핑
  const animalMap = {
    강아지: "dog",
    고양이: "cat",
    곰: "bear",
    개구리: "frog",
    돼지: "pig",
    토끼: "rabbit",
  };

  return (
    <div className={st.MemoLike}>
      {users.map((data, idx) => {
        const animalKey = animalMap[data.animal] || "pig";
        const animalImageSrc = getAnimalImage(animalKey, data.profileColor);

        return (
          <img
            key={idx}
            className={st.Animal_image}
            src={animalImageSrc}
            alt={`${data.animal} image`}
            onError={(e) => {
              e.currentTarget.src = exPig; // 기본 이미지 경로로 변경
            }}
            style={{ zIndex: idx, marginLeft: idx === 0 ? 0 : -6 }}
          />
        );
      })}
    </div>
  );
};

export default MemoLike;
