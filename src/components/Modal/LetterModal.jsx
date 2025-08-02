import { useState } from "react";

import Button from "../Button";
import st from "./LetterModal.module.css";

import modal_line from "../../assets/modal_line.svg";
import modal_line_vertical from "../../assets/modal_line_vertical.svg";
import { getAnimalImage } from "../../util/get-animal-image";
import exPig from "../../assets/animal/animal_pig9.svg";

import { sendLetter } from "../../util/LetterDataAPI";

// Props
// card: 선택된 명함 정보
// onClose: 모달 닫기 함수
// onSend: 쪽지 내용 저장 함수

const LetterModal = ({ card, teamId, onClose, sender, onSendSuccess }) => {
  // state: 쪽지 본문 저장
  const [message, setMessage] = useState("");
  // state: 전송 중 상태 처리
  const [sending, setSending] = useState(false);
  // state: 에러 상태 처리
  const [error, setError] = useState(null);

  // 동물 이미지 매핑
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

  const animalKey = animalMap[card.animal] || "pig";
  const colorKey = colorMap[card.profileColor] || "9";
  const accessoryKey = accessoryMap[card.accessory] || "animal";

  const animalImageSrc = getAnimalImage(animalKey, colorKey, accessoryKey);

  const handleSendClick = async () => {
    if (!message.trim()) return;
    setSending(true);
    setError(null);

    try {
      await sendLetter(teamId, card.cardId, message);
      onSendSuccess();
      onClose();
    } catch (e) {
      console.error("쪽지 전송 실패", e);
      setError("쪽지 전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={st.Overlay}>
      <div className={st.LetterModal}>
        <div className={st.Title_wrapper}>
          <div className={st.Title}>
            <div className={st.Main_title}>쪽지 작성하기</div>
            <div className={st.Sub_title}>Write letter</div>
          </div>
          <img className={st.Line} src={modal_line} alt="modal_line" />
        </div>

        <div className={st.Letter_wrapper}>
          <div className={st.Card}>
            <div className={st.Card_Name}>{card.nickname}</div>
            <div className={st.Card_Wrapper}>
              <div className={st.Card_image}>
                <img
                  src={animalImageSrc}
                  alt={`${card.animal} image`}
                  onError={(e) => {
                    e.currentTarget.src = exPig;
                  }}
                />
              </div>
              <div className={st.Card_info}>
                <div className={st.InfoLabel}>MBTI: {card.mbti}</div>
                <div className={st.InfoLabel}>취미: {card.hobby}</div>
                <div className={st.InfoLabel}>
                  친해지는 비법: {card.secretTip}
                </div>
                <div className={st.InfoLabel}>TMI: {card.tmi}</div>
              </div>
            </div>
          </div>

          <div className={st.Write_body}>
            <div className={st.Info}>
              <div className={st.Send_wrapper}>
                <div className={st.Info_text_title}>보내는 사람</div>
                <img
                  className={st.Line_vertical}
                  src={modal_line_vertical}
                  alt="modal_line_vertical"
                />
                <div className={st.Info_text}>{sender}</div>
              </div>
              <div className={st.Receive_wrapper}>
                <div className={st.Info_text_title}>받는 사람</div>
                <img
                  className={st.Line_vertical}
                  src={modal_line_vertical}
                  alt="modal_line_vertical"
                />
                <div className={st.Info_text}>{card.nickname}</div>
              </div>
            </div>

            <div className={st.Write_letter}>
              <textarea
                className={st.Write_text}
                value={message}
                placeholder="쪽지 작성.."
                onChange={(e) => setMessage(e.target.value)}
                disabled={sending}
              />
            </div>
            {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
          </div>
        </div>

        <div className={st.Confirm_buttons}>
          <Button
            text={sending ? "전송 중..." : "보내기"}
            type={"midBlue"}
            onClick={handleSendClick}
            disabled={sending}
          />
          <Button text={"취소"} type={"midStroke"} onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default LetterModal;
