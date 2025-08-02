import st from "./MemoLike.module.css";
import { getAnimalImage } from "../../util/get-animal-image";
import exPig from "../../assets/animal/animal_pig9.svg";

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

  // 색상 매핑
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

  const accessoryMap = { BASIC: "animal", RIBBON: "ribbon", STAR: "star" };

  return (
    <div className={st.MemoLike}>
      {users.map((data, idx) => {
        const animalKey = animalMap[data.animal] || "pig";
        const colorKey = colorMap[data.profileColor] || "9";
        const accessoryKey = accessoryMap[data.accessory] || "animal";
        const animalImageSrc = getAnimalImage(
          animalKey,
          colorKey,
          accessoryKey,
        );

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
