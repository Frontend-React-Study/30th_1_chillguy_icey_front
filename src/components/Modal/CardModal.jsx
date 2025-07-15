import { useState, useEffect } from "react";
import modal_line from "../../assets/modal_line.svg";
import cardmodal_left from "../../assets/cardmodal_left.svg";
import cardmodal_right from "../../assets/cardmodal_right.svg";
import exPig from "../../assets/exPig.png";

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
  const [nickname, setNickname] = useState("");
  const [mbti, setMbti] = useState("");
  const [animal, setAnimal] = useState("");
  const [hobby, setHobby] = useState("");
  const [secret, setSecret] = useState("");
  const [tmi, setTmi] = useState("");

  useEffect(() => {
    if (defaultValue && typeof defaultValue.name === "string") {
      // 동물 목록
      const animals = ["강아지", "고양이", "곰", "개구리", "돼지", "토끼"];

      let foundAnimal = "";
      let foundNickname = defaultValue.name;

      for (const a of animals) {
        if (defaultValue.name.includes(a)) {
          foundAnimal = a;
          foundNickname = defaultValue.name.replace(a, "").trim();
          break;
        }
      }

      setNickname(foundNickname);
      setAnimal(foundAnimal);
    } else {
      setNickname("");
      setAnimal("");
    }

    setMbti(defaultValue?.mbti || "");
    setHobby(defaultValue?.hobby || "");
    setSecret(defaultValue?.secret || "");
    setTmi(defaultValue?.tmi || "");
  }, [defaultValue]);

  const handleSave = () => {
    const cardData = {
      nickname,
      animal,
      mbti,
      hobby,
      secret,
      tmi,
    };
    if (onSave) onSave(cardData);
  };

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
                {nickname} {animal}
              </div>
              <div className={st.Image_wrapper}>
                <button className={st.Arrow_button}>
                  <img
                    className={st.left_right}
                    src={cardmodal_left}
                    alt="cardmodal_left"
                  />
                </button>
                <img className={st.Card_image} src={exPig} alt="exPig" />
                <button className={st.Arrow_button}>
                  <img
                    className={st.left_right}
                    src={cardmodal_right}
                    alt="cardmodal_right"
                  />
                </button>
              </div>
              <div className={st.Info_text}>Team</div>
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
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>
              <div className={st.Col}>
                <div className={st.Card_Name}>MBTI</div>
                <input
                  className={st.InputUnderline}
                  type="text"
                  placeholder="직접 작성.."
                  value={mbti}
                  onChange={(e) => setMbti(e.target.value)}
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
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
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
        <div className={st.Confirm_buttons}>
          <Button text={"저장"} type={"midBlue"} onClick={handleSave} />
          <Button text={"취소"} type={"midStroke"} onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default CardModal;
