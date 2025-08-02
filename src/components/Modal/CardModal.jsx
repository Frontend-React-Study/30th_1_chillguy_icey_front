import { useState, useEffect } from "react";
import modal_line from "../../assets/modal_line.svg";
import cardmodal_left from "../../assets/cardmodal_left.svg";
import cardmodal_right from "../../assets/cardmodal_right.svg";
import { getAnimalImage } from "../../util/get-animal-image";
import exPig from "../../assets/animal/animal_pig9.svg";

import Button from "../Button";
import Dropdown from "../Dropdown";

import st from "./CardModal.module.css";

// Props
// onClose: 모달 닫기 함수
// onSave: 카드 정보 저장 함수
// mainTitle: 메인 제목(큰 글자)
// subTitle: 서브 제목(작은 글자)
// defaultValue: 수정 시 기본 값으로 들어갈 카드 정보

const CardModal = ({
  onClose,
  onSave,
  mainTitle,
  subTitle,
  defaultValue = {},
}) => {
  // state: 명함 추가 시 작성한 내용(CardModal)
  const [adjective, setAdjective] = useState("");
  const [animal, setAnimal] = useState("");
  const [profileColor, setProfileColor] = useState("");
  const [accessory, setAccessory] = useState("");
  const [mbti, setMbti] = useState("");
  const [hobby, setHobby] = useState("");
  const [secretTip, setSecretTip] = useState("");
  const [tmi, setTmi] = useState("");

  // state: 입력이 모두 채워지지 않았을 경우 에러창
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setAdjective(defaultValue?.adjective || "");
    setAnimal(defaultValue?.animal || "");
    setMbti(defaultValue?.mbti || "");
    setProfileColor(defaultValue?.profileColor || "9");
    setAccessory(defaultValue?.accessory || "animal");
    setHobby(defaultValue?.hobby || "");
    setSecretTip(defaultValue?.secretTip || "");
    setTmi(defaultValue?.tmi || "");

    // nickname에서 adjective 추출
    if (defaultValue?.nickname) {
      const nickname = defaultValue.nickname.trim();
      const knownAnimals = ["강아지", "고양이", "곰", "개구리", "돼지", "토끼"];
      const matchedAnimal = knownAnimals.find((animal) =>
        nickname.endsWith(animal),
      );

      if (matchedAnimal) {
        setAnimal(matchedAnimal);
        setAdjective(nickname.replace(matchedAnimal, "").trim());
      } else {
        // fallback: nickname 전체를 adjective로 간주
        setAdjective(nickname);
      }
    } else {
      setAdjective(defaultValue?.adjective || "");
    }

    setAccessory(reverseAccessoryMap[defaultValue?.accessory] || "BASIC");
  }, [defaultValue]);

  const handleSave = () => {
    // 필수 항목 체크
    if (
      !adjective.trim() ||
      !animal.trim() ||
      !accessory.trim() ||
      !mbti.trim() ||
      !hobby.trim() ||
      !secretTip.trim() ||
      !tmi.trim()
    ) {
      setErrorMsg("모든 항목을 반드시 입력해주세요.");
      return; // 저장 중단
    }

    // 에러 메시지 초기화
    setErrorMsg("");

    const cardData = {
      adjective,
      animal,
      accessory,
      mbti,
      hobby,
      secretTip,
      tmi,
    };
    if (onSave) onSave(cardData);
  };

  // 3초 후 에러 메시지 사라지기
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => {
        setErrorMsg("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

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

  // animal, color 키 변환
  const animalKey = animalMap[animal] || "pig";
  const colorKey = colorMap[profileColor] || "9";

  // accessory 상태는 한글 키(동물, 리본, 별)를 저장함
  // 여기서 실제 사용할 accessoryKey는 영어값으로 변환
  const accessoryKey = accessoryMap[accessory] || "animal";

  const accessories = ["BASIC", "RIBBON", "STAR"];

  const reverseAccessoryMap = {
    animal: "BASIC",
    ribbon: "RIBBON",
    star: "STAR",
  };

  const handleAccessoryChange = (direction) => {
    const currentIndex = accessories.indexOf(accessory);
    if (currentIndex === -1) {
      setAccessory("BASIC");
      return;
    }

    let nextIndex;
    if (direction === "left") {
      nextIndex = (currentIndex - 1 + accessories.length) % accessories.length;
    } else if (direction === "right") {
      nextIndex = (currentIndex + 1) % accessories.length;
    }
    setAccessory(accessories[nextIndex]);
  };

  // getAnimalImage 호출 시에는 accessoryKey (영어 값) 사용
  const animalImageSrc = getAnimalImage(animalKey, colorKey, accessoryKey);

  return (
    <div className={st.Overlay}>
      <div className={st.CardModal}>
        <div className={st.Title_wrapper}>
          <div className={st.Title}>
            <div className={st.Main_title}>{mainTitle}</div>
            <div className={st.Sub_title}>{subTitle}</div>
          </div>
          <img className={st.Line} src={modal_line} alt="modal_line" />
        </div>

        <div className={st.Card_body}>
          <div className={st.Card_wrapper}>
            <div className={st.Card}>
              <div className={st.Card_Name}>
                {adjective} {animal}
              </div>
              <div className={st.Image_wrapper}>
                <button
                  className={st.Arrow_button}
                  onClick={() => handleAccessoryChange("left")}
                >
                  <img
                    className={st.left_right}
                    src={cardmodal_left}
                    alt="cardmodal_left"
                  />
                </button>
                <img
                  className={st.Card_image}
                  src={animalImageSrc}
                  alt={`${animal} image`}
                  onError={(e) => {
                    e.currentTarget.src = exPig;
                  }}
                />
                <button
                  className={st.Arrow_button}
                  onClick={() => handleAccessoryChange("right")}
                >
                  <img
                    className={st.left_right}
                    src={cardmodal_right}
                    alt="cardmodal_right"
                  />
                </button>
              </div>
              <div className={st.Info_text}></div>
            </div>
          </div>

          <div className={st.Write_body}>
            <div className={st.Row1}>
              <div className={st.Col}>
                <div className={st.Card_Name}>나를 설명하는 수식어</div>
                <input
                  className={st.InputUnderline}
                  type="text"
                  placeholder="직접 작성.."
                  value={adjective}
                  onChange={(e) => setAdjective(e.target.value)}
                />
              </div>
              <div className={st.Col}>
                <div className={st.Card_Name}>MBTI</div>
                <input
                  className={st.InputUnderline}
                  type="text"
                  placeholder="직접 작성.."
                  value={mbti}
                  onChange={(e) => {
                    const input = e.target.value;
                    // 영문자만 필터링하고 대문자로 변환
                    const onlyAlphabets = input
                      .replace(/[^a-zA-Z]/g, "")
                      .toUpperCase();
                    setMbti(onlyAlphabets);
                  }}
                />
              </div>
            </div>
            <div className={st.Col}>
              <div className={st.Card_Name}>나와 가장 닮은 동물</div>
              <Dropdown
                type={"long"}
                selected={animal}
                onChange={(value) => setAnimal(value)}
              >
                <div>강아지</div>
                <div>고양이</div>
                <div>곰</div>
                <div>개구리</div>
                <div>돼지</div>
                <div>토끼</div>
              </Dropdown>
            </div>
            <div className={st.Row2}>
              <div className={st.Card_Name}>취미</div>
              <input
                className={st.InputUnderline}
                type="text"
                placeholder="직접 작성.."
                value={hobby}
                onChange={(e) => setHobby(e.target.value)}
              />
            </div>
            <div className={st.Row2}>
              <div className={st.Card_Name}>나와 친해지는 방법</div>
              <input
                className={st.InputUnderline}
                type="text"
                placeholder="직접 작성.."
                value={secretTip}
                onChange={(e) => setSecretTip(e.target.value)}
              />
            </div>
            <div className={st.Row2}>
              <div className={st.Card_Name}>TMI</div>
              <input
                className={st.InputUnderline}
                type="text"
                placeholder="직접 작성.."
                value={tmi}
                onChange={(e) => setTmi(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className={st.ErrorMessageWrapper}>
          {/* 에러 메시지 보여주기 */}
          {errorMsg && <div className={st.ErrorMessage}>{errorMsg}</div>}
          <div className={st.Confirm_buttons}>
            <Button text={"저장"} type={"midBlue"} onClick={handleSave} />
            <Button text={"취소"} type={"midStroke"} onClick={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
